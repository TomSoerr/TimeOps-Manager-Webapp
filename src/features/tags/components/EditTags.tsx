import React, { useEffect, useState, useMemo } from 'react';
import { TagEntry } from '../../../types/tags';
import { TAG_CONSTANTS } from '../../../constants/tags';
import { TagForm } from './TagForm';
import { Select } from '../../../ui/inputs/Select';

/**
 * Props for the EditTags component
 * @interface Props
 * @property {TagEntry[]} tags - Array of tag entries to be managed
 */
interface Props {
  tags: TagEntry[];
}

/**
 * EditTags component that allows users to select and edit existing tags.
 * Filters out the default "No Project" tag from the editable options.
 */
export const EditTags: React.FC<Props> = ({ tags }) => {
  /**
   * State to track any errors that occur during tag editing
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Filtered list of tags excluding the default "No Project" tag
   */
  const tagsWithoutDefault = useMemo(
    () => tags.filter((i) => i.name !== TAG_CONSTANTS.DEFAULT_TAG_NAME),
    [tags],
  );

  /**
   * State for the currently selected tag ID
   */
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  /**
   * Effect to handle initial tag selection and maintain valid selection
   * when tag list changes:
   * - Selects the first tag if none is selected
   * - Maintains current selection if it's still valid
   * - Falls back to first tag if current selection no longer exists
   */
  useEffect(() => {
    try {
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
      // Clear any previous errors when selection is successful
      if (error) setError(null);
    } catch (err) {
      setError('Failed to update tag selection');
      console.error('Error in tag selection:', err);
    }
  }, [tagsWithoutDefault, selectedTagId, error]);

  /**
   * Memoized selected tag object based on the currently selected tag ID
   * Returns null if no tag is selected or available
   */
  const selectedTag = useMemo(() => {
    if (!selectedTagId) return null;
    return (
      tagsWithoutDefault.find((tag) => tag.id === selectedTagId) ||
      (tagsWithoutDefault.length > 0 ? tagsWithoutDefault[0] : null)
    );
  }, [tagsWithoutDefault, selectedTagId]);

  /**
   * Event handler for tag selection dropdown changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Change event
   */
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedTagId(parseInt(e.target.value, 10));
      if (error) setError(null);
    } catch (err) {
      setError('Failed to change selected tag');
      console.error('Error changing tag selection:', err);
    }
  };

  /**
   * Handler for errors that might occur in the TagForm component
   * @param {string} errorMessage - The error message
   */
  const handleFormError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="text-red-600 font-medium"
        >
          {error}
        </div>
      )}

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
              onError={handleFormError}
            />
          )}
        </>
      : <div>No Tags to edit</div>}
    </div>
  );
};
