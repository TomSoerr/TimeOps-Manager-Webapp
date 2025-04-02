import React, { useState, useEffect, useCallback } from 'react';
import { TagEntry, getAllTags, updateLocal } from '../../../database/index';
import { EditTags } from '../../tags/EditTags';
import { TagForm } from '../../tags/TagForm';
import { SettingsSection, SHeadline } from '../../../ui/layout/SettingsSection';
import { useConnection } from '../../../context/ConnectionContext';

/**
 * TagSettings component provides UI for managing project/category tags
 *
 * Features:
 * - Editing existing tags (changing name and color)
 * - Creating new tags with default settings
 * - Real-time updates when tag data changes elsewhere
 *
 * This component is only rendered when the application is online
 * since tag management requires API connectivity.
 */
const TagSettings: React.FC = () => {
  const [tags, setTags] = useState<TagEntry[]>([]);
  const { isOnline } = useConnection();

  /**
   * Loads all tags from the database
   * Fetches the current list of tags and updates component state
   */
  const loadTags = useCallback(async () => {
    try {
      const tags = await getAllTags();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  /**
   * Handles data update events
   * Updates local data from API and refreshes tag list
   */
  const handleDataUpdate = useCallback(async () => {
    console.info('Data updated, isOnline:', isOnline);

    try {
      await updateLocal();
      await loadTags();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, [isOnline, loadTags]);

  /**
   * Effect to load initial tag data when component mounts
   * Only runs when online since tag management requires connectivity
   */
  useEffect(() => {
    if (isOnline) handleDataUpdate();
  }, [isOnline, handleDataUpdate]);

  /**
   * Effect to listen for data update events from SSE
   * Ensures the tag list stays in sync when changes occur in other components
   */
  useEffect(() => {
    window.addEventListener('data-update', handleDataUpdate);

    return () => {
      window.removeEventListener('data-update', handleDataUpdate);
    };
  }, [handleDataUpdate]);

  return (
    <SettingsSection headline="Tags">
      <SHeadline>Edit Tags</SHeadline>
      <EditTags tags={tags} />
      <SHeadline>New Tag</SHeadline>
      <TagForm
        add={true}
        item={{ name: 'Tagname', color: 'slate', id: -1 }}
      />
    </SettingsSection>
  );
};

export default TagSettings;
