import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../buttons/Button';

/**
 * Props for the InputFile component
 * @interface Props
 * @property {(ref: React.RefObject<HTMLInputElement | null>) => void} onSubmit - Callback function invoked when the user uploads a file
 * @property {string} msg - Message to display (typically error or success feedback)
 */
interface Props {
  onSubmit: (ref: React.RefObject<HTMLInputElement | null>) => void;
  msg: string;
}

/**
 * InputFile component provides a custom file input interface
 * Features:
 * - Hidden native file input with a styled button trigger
 * - Display of selected filename
 * - Upload button that appears only when a file is selected
 * - Support for JSON and CSV file formats
 * - Error message display
 *
 * The component uses the React ref pattern to maintain a reference to the
 * native file input while providing a more attractive UI.
 */
export const InputFile: React.FC<Props> = ({ onSubmit, msg }) => {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers the hidden file input's click event
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Updates the fileName state when a file is selected
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName('');
    }
  };

  /**
   * Resets the file selection when the message prop changes
   * This is useful after a successful upload or when an error occurs
   */
  useEffect(() => {
    if (msg) setFileName('');
  }, [msg]);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={'.json,.csv'}
          className="sr-only"
        />

        <div className="flex items-center space-x-2">
          {fileName && (
            <Button
              uiType="primary"
              text="Upload File"
              type="button"
              onClick={() => {
                onSubmit(fileInputRef);
              }}
            />
          )}
          <Button
            uiType="secondary"
            text="Select File"
            type="button"
            onClick={handleClick}
          />

          {fileName && (
            <span className="text-sm text-slate-600 truncate max-w-xs">
              {fileName}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
