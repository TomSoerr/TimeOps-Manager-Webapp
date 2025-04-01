import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '../../ui/inputs/Input';
import { Select } from '../../ui/inputs/Select';
import { Button } from '../../ui/buttons/Button';
import { TagEntry, setTag } from '../../database/index';
import { Tag } from '../../ui/Tag';
import Color, { colors } from '../../types/color.types';

/**
 * Props for the TagForm component
 * @interface TagFormProps
 * @property {TagEntry} item - The tag entry to edit or use as a template for adding
 * @property {boolean} [add] - Whether this form is being used to add a new tag
 * @property {(errorMessage: string) => void} [onError] - Optional callback for error handling
 */
interface TagFormProps {
  item: TagEntry;
  add?: boolean;
  onError?: (errorMessage: string) => void;
}

/**
 * TagForm component that provides UI for creating or editing tag entries.
 * Displays a form with name and color inputs, and a preview of the tag.
 */
export const TagForm: React.FC<TagFormProps> = ({ item, add, onError }) => {
  /** State for the form data, initialized with the provided item */
  const [formData, setFormData] = useState<TagEntry>(item);

  /** Tracks whether the form has been edited from its initial state */
  const [edited, setEdited] = useState<boolean>(false);

  /** Tracks submission state to prevent duplicate submissions */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /** Local error message state for form validation errors */
  const [errorMsg, setErrorMsg] = useState<string>('');

  /**
   * Memoized calculation of the selected color ID based on the color name
   * Fallback to first color if the name doesn't match any available colors
   */
  const selectedColorId = useMemo(
    () => colors.find((col) => col.name === formData.color)?.id || colors[0].id,
    [formData.color],
  );

  /**
   * Handles changes to the tag name input
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEdited(true);
      setFormData((prev) => ({ ...prev, name: e.target.value }));
    },
    [],
  );

  /**
   * Handles changes to the color selection dropdown
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEdited(true);
      const colorId = parseInt(e.target.value, 10);

      // Find color by ID with type safety
      const selectedColor = colors.find((col) => col.id === colorId);
      setFormData((prev) => ({
        ...prev,
        color: (selectedColor?.name as Color['color']) || colors[0].name,
      }));
    },
    [],
  );

  /**
   * Handles form submission, saving the tag to the database
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        await setTag(formData);
        setEdited(false);

        if (add) {
          setFormData({ name: 'Tagname', color: 'slate', id: -1 });
        }
      } catch (error) {
        console.error('Failed to submit tag:', error);

        // Get the error message from the error object
        let errorMessage: string;

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else {
          errorMessage = 'Unknown error occurred';
        }

        setErrorMsg(errorMessage);

        // Use the parent's error handler if provided
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, add, isSubmitting, onError],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="border-1 relative rounded-sm border-slate-200 px-2 pb-2 pt-6"
    >
      <div className="absolute -top-1 -left-1">
        <Tag
          name={formData.name}
          color={formData.color}
        />
      </div>
      <div className="space-y-2">
        <p className="text-red-500 text-sm">{errorMsg}</p>
        <Input
          id="name"
          label="Tag Name"
          value={formData.name}
          type="text"
          onChange={handleNameChange}
          disabled={isSubmitting}
        />
        <Select
          id="color"
          label="Tag Color"
          value={selectedColorId}
          options={colors}
          onChange={handleColorChange}
          disabled={isSubmitting}
        />
        <div className="w-fit ml-auto">
          {edited && (
            <Button
              type="submit"
              text={add ? 'Add new tag' : 'Save'}
              uiType="secondary"
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>
    </form>
  );
};
