import React, { useState, useCallback, useMemo } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { TagEntry, db } from '../../database/db';
import { Tag } from './Tag';
import Color, { colors } from '../../types/color.types';

interface TagFormProps {
  item: TagEntry;
  add?: boolean;
}

export const TagForm: React.FC<TagFormProps> = ({ item, add }) => {
  const [formData, setFormData] = useState<TagEntry>(item);
  const [edited, setEdited] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Memoize the selected color ID to avoid recalculating on every render
  const selectedColorId = useMemo(
    () => colors.find((col) => col.name === formData.color)?.id || colors[0].id,
    [formData.color],
  );

  // Handle name change with proper typing
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEdited(true);
      setFormData((prev) => ({ ...prev, name: e.target.value }));
    },
    [],
  );

  // Handle color change with proper typing
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

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        await db.setTag(formData);
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, add, isSubmitting],
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
