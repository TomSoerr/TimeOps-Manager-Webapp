import React, { useEffect, useState } from 'react';
import { Input } from '../../ui/inputs/Input';
import { Button } from '../../ui/buttons/Button';
import { Select } from '../../ui/inputs/Select';
import { TagEntry } from '../../database';
import { FormData } from './types';
/**
 * Props for the EntryForm component
 */
interface EntryFormProps {
  /** Current form data */
  formData: FormData;
  /** Handler for form submission */
  onSubmit: (e: React.FormEvent, updatedData: FormData) => void;
  /** Available tags for selection in the form */
  tags: TagEntry[];
}

/**
 * EntryForm component for entering time entry details
 *
 * Features:
 * - Local state management for improved performance
 * - Fields for time entry name, dates, times, and tag selection
 * - Conditional rendering based on entry type
 * - Only updates parent state on submission
 */
export const EntryForm: React.FC<EntryFormProps> = ({
  formData,
  onSubmit,
  tags,
}) => {
  // Local state to track form inputs
  const [localFormData, setLocalFormData] = useState<FormData>(formData);

  // Update local form state when parent form data changes
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  // Determine if it's a running entry (no end date/time)
  const isRunningEntry = !localFormData.endDate;

  /**
   * Updates local form state without updating parent state
   */
  const handleLocalChange = (field: keyof FormData, value: string | number) => {
    setLocalFormData({
      ...localFormData,
      [field]: value,
    });
  };

  /**
   * Submits the form with the local form data
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('localFormData', localFormData);
    onSubmit(e, localFormData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        id="name"
        label="Task Name"
        value={localFormData.name || ''}
        type="text"
        onChange={(e) => handleLocalChange('name', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 ">
        <Input
          id="startTime"
          label="Start Time"
          type="time"
          value={localFormData.startTime || ''}
          onChange={(e) => handleLocalChange('startTime', e.target.value)}
        />

        <Input
          id="startDate"
          label="Date"
          type="date"
          min="2000-01-01"
          value={localFormData.startDate || ''}
          onChange={(e) => handleLocalChange('startDate', e.target.value)}
        />
      </div>

      {!isRunningEntry && (
        <div className="grid grid-cols-2 gap-4 ">
          <Input
            id="endTime"
            label="End Time"
            type="time"
            value={localFormData.endTime || ''}
            onChange={(e) => handleLocalChange('endTime', e.target.value)}
          />

          <Input
            id="endDate"
            label="Date"
            type="date"
            min="2000-01-01"
            value={localFormData.endDate || ''}
            onChange={(e) => handleLocalChange('endDate', e.target.value)}
          />
        </div>
      )}

      <Select
        id="tag"
        label="Tag"
        value={localFormData.tagId || 0}
        options={tags}
        onChange={(e) => handleLocalChange('tagId', +e.target.value)}
      />
      <div className="w-fit ml-auto">
        <Button
          type="submit"
          text="Save Entry"
          uiType="primary"
        />
      </div>
    </form>
  );
};
