import { db } from '../database/db';
import { EventSource } from 'eventsource';
import { API_BASE_URL } from '../vars';

/**
 * This functions establishes a Server-Sent Events (SSE) to the api in order to
 * get real time updates for the user database. This will ensure that multiple
 * clients have the same data and prevent merge conflicts.
 * This will also be able to create a realtime notification on all devices.
 */
export const setupSSEConnection = (
  setOnlineStatus: (status: boolean) => void,
) => {
  let eventSource: EventSource | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;

  const connectSSE = () => {
    /**
     * Check if api endpoint and token are defined.
     * Retry after 5s to check credentials or online status.
     */
    const TIMEOUT = 5000;

    try {
      if (!db.getUrl() || !db.getToken()) {
        console.log('Missing URL or token, will retry in 5 seconds');
        setOnlineStatus(false);

        // Clear any existing timer
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }

        // Schedule retry
        reconnectTimer = setTimeout(connectSSE, TIMEOUT);
        return; // Exit function without attempting connection
      }

      /**
       * If credentials are set in localStorage try to connect to api
       */
      const apiUrl = `${db.getUrl()}${API_BASE_URL}/events`;

      // Create EventSource with fetch option to include Authorization header
      eventSource = new EventSource(apiUrl, {
        withCredentials: true,
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${db.getToken()}`,
            },
          }),
      });

      /**
       * Set the app to online when the connection is successfully established
       */
      eventSource.onopen = () => {
        console.log('SSE connection established');
        setOnlineStatus(true);
      };

      /**
       * When connection fails retry after TIMEOUT
       */
      eventSource.onerror = (error) => {
        console.error('apiUrl', apiUrl);
        console.error('SSE connection error:', error);
        setOnlineStatus(false);

        // Try to reconnect after a delay
        if (eventSource) {
          eventSource.close();
          eventSource = null;

          // Clear any existing timer
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
          }

          reconnectTimer = setTimeout(connectSSE, TIMEOUT);
        }
      };

      /**
       * Add specific event listeners here
       */
      eventSource.addEventListener('data-update', (event) => {
        console.info('Received SSE message:');

        // trigger update event for entry and tag update
        window.dispatchEvent(new CustomEvent('data-update'));
      });
    } catch (error) {
      /**
       * Catch error that is not due to no credentials or a offline api
       */
      console.error('Error setting up SSE:', error);
      setOnlineStatus(false);

      // Clear any existing timer
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      // Also retry after errors in the setup process
      reconnectTimer = setTimeout(connectSSE, 5000);
    }
  };

  // Initial connection attempt
  connectSSE();

  // Return cleanup function
  return () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // Clear any pending reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };
};
