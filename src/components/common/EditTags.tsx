import React, { JSX, useEffect, useState } from 'react';
import { TagList } from '../../database/db';
import { TagForm } from './TagForm';
import { Select } from './Select';

interface Props {
  tags: TagList;
}

type TagListItem = TagList[number];

export const EditTags: React.FC<Props> = ({ tags }) => {
  const tagsWithoutDefault = tags.filter((i) => i[0] !== 'No Project');

  // Move useState to the top level for proper Hook ordering
  const [selectedTagName, setSelectedTagName] = useState<string>(
    tagsWithoutDefault.length > 0 ? tagsWithoutDefault[0][0] : '',
  );

  useEffect(() => {
    console.info(tags);
  }, [tags]);

  if (tagsWithoutDefault.length === 0) {
    return <div>No Tags to edit</div>;
  }

  // Find the selected tag
  const selectedTag =
    tagsWithoutDefault.find((tag) => tag[0] === selectedTagName) ||
    tagsWithoutDefault[0];

  return (
    <div className="space-y-4">
      <Select
        label="Select Tag to Edit"
        id="select-tag"
        value={selectedTagName}
        onChange={(e) => setSelectedTagName(e.target.value)}
        options={tagsWithoutDefault.map((tag) => tag[0])}
      />

      {/* Show only the selected tag form */}
      <TagForm
        key={selectedTag[2]}
        item={selectedTag}
      />
    </div>
  );
};
