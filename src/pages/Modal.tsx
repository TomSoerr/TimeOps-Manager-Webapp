import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/common/Icon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    tag: 'TimeOps Manager',
    color: 'lime',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
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

    // add animate backdrop class to popover
    // fade backdrop in and out

    modal.classList.remove('animate-slide-up');
    modal.classList.add('animate-slide-down');

    setTimeout(() => {
      onClose();
      if (popover?.hidePopover) {
        popover.hidePopover();
      }

      modal.classList.remove('animate-slide-down');
      modal.classList.add('animate-slide-up');
    }, 500);
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
      className=" h-1/1 w-1/1 max-h-1/1 max-w-1/1 bg-transparent backdrop:bg-slate-900/30 overflow-hidden"
    >
      <div className="fixed h-170 max-h-1/1 bottom-0 left-0 right-0 bg-slate-50 shadow-xl p-6 rounded-t-2xl animate-slide-up">
        <h2 className="text-xl font-bold mb-4">Add New Entry</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700"
          >
            <span>Task Name</span>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>

          <label
            htmlFor="tag"
            className="block text-sm font-medium text-slate-700"
          >
            <span>Tag</span>
            <input
              type="text"
              id="tag"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>

          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-700"
          >
            <span>Date</span>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-slate-700"
            >
              <span>Start Time</span>
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>

            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-slate-700"
            >
              <span>End Time</span>
              <input
                type="time"
                id="endTime"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
          </div>

          <label
            htmlFor="color"
            className="block text-sm font-medium text-slate-700"
          >
            <span>Color</span>
            <select
              id="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="lime">Lime</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="emerald">Emerald</option>
              <option value="cyan">Cyan</option>
              <option value="violet">Violet</option>
              <option value="fuchsia">Fuchsia</option>
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
