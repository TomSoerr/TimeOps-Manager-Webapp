import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';

interface Props {
  onSubmit: (ref: React.RefObject<HTMLInputElement | null>) => void;
  msg: string;
}

export const InputFile: React.FC<Props> = ({ onSubmit, msg }) => {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName('');
    }
  };

  useEffect(() => {
    if (msg) setFileName('');
  }, [msg]);

  return (
    <>
      <p className="text-red-500 text-xs">{msg}</p>
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
