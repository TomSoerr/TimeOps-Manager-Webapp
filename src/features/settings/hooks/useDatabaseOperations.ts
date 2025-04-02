import { useState, useCallback, useRef } from 'react';
import {
  deleteRemote,
  importFile,
  exportDatabase,
} from '../../../database/index';

/**
 * Status interface for database operations
 */
interface DatabaseOperationStatus {
  /** Message to display to the user */
  message: string;
  /** Whether an operation is currently in progress */
  isLoading: boolean;
  /** Error object if an operation failed */
  error: Error | null;
  /** Whether the operation was successful */
  success: boolean;
}

/**
 * Custom hook for managing database operations
 *
 * Provides functionality for:
 * - Database deletion
 * - Database export to file
 * - Database import from file
 * - Operation status tracking
 *
 * Includes loading states, error handling, and success indicators
 * for better user feedback.
 *
 * @returns Object containing status information and handler functions
 */
export function useDatabaseOperations() {
  // Track operation status for user feedback
  const [status, setStatus] = useState<DatabaseOperationStatus>({
    message: '',
    isLoading: false,
    error: null,
    success: false,
  });

  // Used to prevent state updates after unmount
  const isMounted = useRef(true);

  // Set up cleanup on unmount
  useCallback(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Updates status safely (only if component is still mounted)
   */
  const safeSetStatus = useCallback(
    (newStatus: Partial<DatabaseOperationStatus>) => {
      if (isMounted.current) {
        setStatus((prev) => ({ ...prev, ...newStatus }));
      }
    },
    [],
  );

  /**
   * Handles database deletion with confirmation
   * @returns Promise that resolves when deletion is complete
   */
  const handleDelete = useCallback(async () => {
    try {
      safeSetStatus({
        isLoading: true,
        message: 'Deleting database...',
        error: null,
        success: false,
      });

      await deleteRemote();

      safeSetStatus({
        isLoading: false,
        message: 'Database deleted successfully',
        success: true,
      });
    } catch (error) {
      console.error('Error deleting database:', error);
      safeSetStatus({
        isLoading: false,
        message: 'Failed to delete database',
        error: error instanceof Error ? error : new Error(String(error)),
        success: false,
      });
    }
  }, [safeSetStatus]);

  /**
   * Handles database export operation
   * @returns Promise that resolves when export is complete
   */
  const handleExport = useCallback(async () => {
    try {
      safeSetStatus({
        isLoading: true,
        message: 'Exporting database...',
        error: null,
        success: false,
      });

      await exportDatabase();

      safeSetStatus({
        isLoading: false,
        message: 'Database exported successfully',
        success: true,
      });
    } catch (error) {
      console.error('Error exporting database:', error);
      safeSetStatus({
        isLoading: false,
        message: 'Failed to export database',
        error: error instanceof Error ? error : new Error(String(error)),
        success: false,
      });
    }
  }, [safeSetStatus]);

  /**
   * Handles file import operation
   * @param fileInputRef - Reference to file input element
   * @returns Promise that resolves when import is complete
   */
  const handleImport = useCallback(
    async (fileInputRef: React.RefObject<HTMLInputElement | null>) => {
      const file = fileInputRef.current?.files?.[0];

      if (!file) {
        safeSetStatus({
          message: 'No file selected. Please select a file to import.',
          error: null,
          success: false,
        });
        return;
      }

      try {
        safeSetStatus({
          isLoading: true,
          message: 'Importing database...',
          error: null,
          success: false,
        });

        await importFile(file);

        safeSetStatus({
          isLoading: false,
          message: 'Database imported successfully',
          success: true,
        });
      } catch (error) {
        console.error('Error importing database:', error);
        safeSetStatus({
          isLoading: false,
          message: 'Failed to import database',
          error: error instanceof Error ? error : new Error(String(error)),
          success: false,
        });
      }
    },
    [safeSetStatus],
  );

  /**
   * Clears the current status message
   */
  const clearStatus = useCallback(() => {
    safeSetStatus({
      message: '',
      error: null,
      success: false,
    });
  }, [safeSetStatus]);

  return {
    status,
    handleDelete,
    handleExport,
    handleImport,
    clearStatus,
  };
}
