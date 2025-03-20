import React, { useState, useEffect } from 'react';
import { TagList } from '../../database/db';
import { db } from '../../database/db';
import { EditTags } from '../../components/common/EditTags';
import { TagForm } from '../../components/common/TagForm';
import { SettingsSection, SHeadline } from '../layout/SettingsSection';

const TagSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<TagList>([]); // TODO make this dry when backend is working

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const tags = await db.getAllTag();
      setTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <SettingsSection headline="Tags">
      <SHeadline>Edit Tags</SHeadline>
      <EditTags tags={tags} />
      <SHeadline>New Tag</SHeadline>
      <TagForm
        add={true}
        item={['Tagname', 'slate', undefined]}
      />
    </SettingsSection>
  );
};
export default TagSettings;
