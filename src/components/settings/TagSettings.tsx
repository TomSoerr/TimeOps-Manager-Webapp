import React, { useState, useEffect, useCallback } from 'react';
import { TagEntry, getAllTags, updateLocal } from '../../database/index';
import { EditTags } from '../../components/common/EditTags';
import { TagForm } from '../../components/common/TagForm';
import { SettingsSection, SHeadline } from '../layout/SettingsSection';
import { useConnection } from '../../context/ConnectionContext';

const TagSettings: React.FC = () => {
  const [tags, setTags] = useState<TagEntry[]>([]);
  const { isOnline } = useConnection();

  const loadTags = useCallback(async () => {
    try {
      const tags = await getAllTags();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  }, []);

  const handleDataUpdate = useCallback(async () => {
    console.info('Data updated, isOnline:', isOnline);

    try {
      await updateLocal();
      await loadTags();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, [isOnline, loadTags]);

  // no need for initial data update because component is only mounted online
  useEffect(() => {
    if (isOnline) handleDataUpdate();
  }, [isOnline, handleDataUpdate]);

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
