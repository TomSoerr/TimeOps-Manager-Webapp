type EventCallback = (data?: any) => void;

// Pub/Sub
class EventBus {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  publish(event: string, data?: any): void {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((callback) => callback(data));
    }
  }
}

// Export a singleton instance
export const eventBus = new EventBus();

// Define common event types
export const EventTypes = {
  DATA_UPDATED: 'DATA_UPDATED',
  USER_SETTINGS_CHANGED: 'USER_SETTINGS_CHANGED',
};
