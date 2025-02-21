import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/common/Icon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    tag: 'TimeOps Manager',
    color: 'lime',
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const close = () => {
    onClose();
    dialogRef.current?.close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onClose();
  };

  // fix autofocus

  return (
    <dialog
      ref={dialogRef}
      className=" h-1/1 w-1/1 max-h-1/1 max-w-1/1 bg-transparent backdrop:bg-slate-900/30 [&:not([open])]:hidden overflow-hidden"
      onClose={onClose}
      autoFocus={false}
    >
      <div className="fixed block h-170 max-h-1/1 bottom-0 left-0 right-0 bg-slate-50  shadow-xl p-6 rounded-t-2xl animate-slide-up">
        <h2 className="text-xl font-bold mb-4">Add New Entry</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Task Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              autoFocus={false}
            />
          </div>

          <div>
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-slate-700"
            >
              Tag
            </label>
            <input
              type="text"
              id="tag"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700"
            >
              Date
            </label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-slate-700"
              >
                Start Time
              </label>
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
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-slate-700"
              >
                End Time
              </label>
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
            </div>
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-slate-700"
            >
              Color
            </label>
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
          </div>
        </form>

        <div className="absolute top-4 right-4">
          <Icon
            name="close"
            onClick={close}
            className="!text-4 xl"
          />
        </div>
      </div>
    </dialog>
  );
};
