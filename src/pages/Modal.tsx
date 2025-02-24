import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/common/Icon';
import { Input } from '../components/common/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 7200000);

  const [formData, setFormData] = useState({
    name: '',
    color: 'lime',
    date: now.toISOString().split('T')[0],
    startTime: formatTime(twoHoursAgo),
    endTime: formatTime(now),
    tag: 'No Project',
  });

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    // Use popover API
    if (isOpen) {
      popover.showPopover();
    } else {
      popover.hidePopover();
    }
  }, [isOpen]);

  const close = () => {
    const popover = popoverRef.current;
    // prevent further errors
    if (!popover) return;
    const modal = popover.children[0];
    if (!modal) return;

    modal.classList.remove('animate-slide-up');
    modal.classList.add('animate-slide-down');
    popover.classList.remove('animate-backdrop-in');
    popover.classList.add('animate-backdrop-out');

    setTimeout(() => {
      onClose();
      if (popover?.hidePopover) {
        popover.hidePopover();
      }

      modal.classList.remove('animate-slide-down');
      modal.classList.add('animate-slide-up');
      popover.classList.remove('animate-backdrop-out');
      popover.classList.add('animate-backdrop-in');
    }, 501);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.table(formData);

    onClose();
  };

  return (
    <div
      ref={popoverRef}
      popover="auto"
      className=" h-1/1 w-1/1 max-h-1/1 max-w-1/1 bg-transparent backdrop:bg-slate-900/30 overflow-hidden animate-backdrop-in"
    >
      <div className="fixed h-170 max-h-1/1 bottom-0 left-0 right-0 bg-slate-50 shadow-xl py-6 px-4 rounded-t-2xl animate-slide-up">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Add New Entry</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            id="name"
            label="Task Name"
            value={formData.name}
            type="text"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            id="date"
            label="Date"
            type="date"
            max="2025-02-24"
            min="2025-02-20"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startTime"
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />

            <Input
              id="endTime"
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
          </div>

          <label
            htmlFor="tag"
            className="block text-sm font-medium text-slate-700"
          >
            <span>Tag</span>
            <select
              id="tag"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="No Project">No Project</option>
              <option value="TimeOps Manager">TimeOps Manager</option>
            </select>
          </label>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <span>Add Entry</span>
          </button>
        </form>

        <div className="absolute top-4 right-4">
          <Icon
            name="close"
            onClick={close}
            className="!text-4xl"
          />
        </div>
      </div>
    </div>
  );
};
