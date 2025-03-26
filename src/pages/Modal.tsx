import React, { useEffect, useRef } from 'react';
import { Icon } from '../components/common/Icon';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { ANIMATION_LENGTH } from '../vars';
import { TagEntry } from '../database/db';

interface Props {
  formData: undefined | FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  tags: TagEntry[];
}

export interface FormData {
  id?: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  tagId: number;
}

export const Modal: React.FC<Props> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  tags,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

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

  const form = (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <Input
        id="name"
        label="Task Name"
        value={formData?.name || ''}
        type="text"
        onChange={(e) =>
          formData && setFormData({ ...formData, name: e.target.value })
        }
      />

      <Input
        id="date"
        label="Date"
        type="date"
        min="2000-01-01"
        value={formData?.date || ''}
        onChange={(e) =>
          formData && setFormData({ ...formData, date: e.target.value })
        }
      />

      <div className="grid grid-cols-2 gap-4 ">
        <Input
          id="startTime"
          label="Start Time"
          type="time"
          value={formData?.startTime || ''}
          onChange={(e) =>
            formData && setFormData({ ...formData, startTime: e.target.value })
          }
        />

        <Input
          id="endTime"
          label="End Time"
          type="time"
          value={formData?.endTime || ''}
          onChange={(e) =>
            formData && setFormData({ ...formData, endTime: e.target.value })
          }
        />
      </div>

      <Select
        id="tag"
        label="Tag"
        value={formData?.tagId || 0}
        options={tags}
        onChange={(e) =>
          formData && setFormData({ ...formData, tagId: +e.target.value })
        }
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

  return (
    <div
      ref={popoverRef}
      popover="auto"
      className=" h-1/1 w-1/1 max-h-1/1 max-w-1/1 bg-transparent backdrop:bg-slate-900/30 overflow-hidden animate-backdrop-in"
    >
      <div className="fixed h-170 max-h-1/1 bottom-0 left-0 right-0 bg-slate-50 shadow-xl py-6 px-4 rounded-t-2xl animate-slide-up">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Add New Entry</h2>
        {form}
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
