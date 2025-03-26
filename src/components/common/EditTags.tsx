import React, { useEffect, useState, useMemo } from 'react';
import { TagEntry } from '../../database/db';
import { TagForm } from './TagForm';
import { Select } from './Select';

interface Props {
  tags: TagEntry[];
}

export const EditTags: React.FC<Props> = ({ tags }) => {
  const tagsWithoutDefault = useMemo(
    () => tags.filter((i) => i.name !== 'No Project'),
    [tags],
  );

  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  useEffect(() => {
    if (tagsWithoutDefault.length > 0) {
      const currentTagExists = tagsWithoutDefault.some(
        (tag) => tag.id === selectedTagId,
      );

      if (!currentTagExists) {
        setSelectedTagId(tagsWithoutDefault[0].id);
      }
    } else {
      setSelectedTagId(null);
    }
  }, [tagsWithoutDefault, selectedTagId]);

  const selectedTag = useMemo(() => {
    if (!selectedTagId) return null;
    return (
      tagsWithoutDefault.find((tag) => tag.id === selectedTagId) ||
      (tagsWithoutDefault.length > 0 ? tagsWithoutDefault[0] : null)
    );
  }, [tagsWithoutDefault, selectedTagId]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTagId(parseInt(e.target.value, 10));
  };

  return (
    <div className="space-y-4">
      {tagsWithoutDefault.length > 0 ?
        <>
          <Select
            label="Select Tag to Edit"
            id="select-tag"
            value={selectedTagId || -1}
            onChange={handleTagChange}
            options={tagsWithoutDefault}
          />

          {selectedTag && (
            <TagForm
              key={selectedTag.id}
              item={selectedTag}
            />
          )}
        </>
      : <div>No Tags to edit</div>}
    </div>
  );
};
