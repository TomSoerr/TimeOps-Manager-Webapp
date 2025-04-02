import React, { useEffect, useRef } from 'react';
import { Icon } from '../../ui/Icon';
import { ANIMATION_LENGTH } from '../../constants/global';
import { TagEntry } from '../../database';
import { EntryForm } from './EntryForm';
import { FormData } from './types';

/**
 * Props for the Modal component
 */
interface Props {
  /** Current form data state or undefined when modal is closed */
  formData: undefined | FormData;
  /** Function to update form data state */
  setFormData: (data: FormData) => void;
  /** Handler for form submission */
  onSubmit: (updatedData: FormData) => void;
  /** Handler for closing the modal */
  onClose: () => void;
  /** Available tags for selection in the form */
  tags: TagEntry[];
}

/**
 * Modal component for creating and editing time entries
 *
 * Features:
 * - Popover-based modal with animations
 * - Form for entering time entry details
 * - Dynamic fields based on entry type (completed vs. running)
 * - Tag selection from available tags
 *
 * Uses the HTML Popover API for modern modal behavior with proper
 * animations for opening and closing.
 */
export const EntryModal: React.FC<Props> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  tags,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Determine if the form is for editing (has ID) or creating a new entry
  const isEditing = Boolean(formData?.id);
  const modalTitle = isEditing ? 'Edit Time Entry' : 'Add New Entry';
  const modalTitleId = 'modal-title';

  /**
   * Manages modal visibility and animations based on formData state
   * Shows modal when formData is present and adds closing animations when closed
   */
  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const modal = popover.children[0];
    if (!modal) return;

    // Use popover API
    if (formData) {
      popover.showPopover();
    } else {
      // add closing animation tags
      modal.classList.remove('animate-slide-up');
      modal.classList.add('animate-slide-down');
      popover.classList.remove('animate-backdrop-in');
      popover.classList.add('animate-backdrop-out');

      setTimeout(() => {
        if (popover?.hidePopover) {
          popover.hidePopover();
        }

        modal.classList.remove('animate-slide-down');
        modal.classList.add('animate-slide-up');
        popover.classList.remove('animate-backdrop-out');
        popover.classList.add('animate-backdrop-in');
      }, ANIMATION_LENGTH);
    }
  }, [formData]);

  /**
   * Handles form submission
   * Updates parent formData and triggers onSubmit
   */
  const handleFormSubmit = (e: React.FormEvent, updatedData: FormData) => {
    e.preventDefault();
    onSubmit(updatedData);
  };

  return (
    <div
      ref={popoverRef}
      popover="auto"
      className=" h-1/1 w-1/1 max-h-1/1 max-w-1/1 bg-transparent backdrop:bg-slate-900/30 overflow-hidden animate-backdrop-in"
      role="dialog"
      aria-labelledby={modalTitleId}
      aria-modal="true"
    >
      <div className="max-w-3xl mx-auto fixed h-170 max-h-1/1 bottom-0 left-0 right-0 bg-slate-50 shadow-xl py-6 px-4 rounded-t-2xl animate-slide-up">
        <h2
          id={modalTitleId}
          className="text-xl font-bold mb-4 text-slate-800"
        >
          {modalTitle}
        </h2>
        {formData && (
          <EntryForm
            formData={formData}
            onSubmit={handleFormSubmit}
            tags={tags}
          />
        )}
        <div className="absolute top-4 right-4">
          <Icon
            name="close"
            onClick={onClose}
            className="!text-4xl"
          />
        </div>
      </div>
    </div>
  );
};
