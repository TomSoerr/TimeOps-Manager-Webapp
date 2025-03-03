import React, { JSX, useEffect, useRef, useState } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { TagList, db } from '../../database/db';
import { Tag } from './Tag';
import { colors } from '../../types/color.types';

type TagListItem = TagList[number];

interface Props {
  item: TagListItem;
  add?: true;
}

export const TagForm: React.FC<Props> = ({ item, add }) => {
  const [formData, setFormData] = useState<TagListItem>(item);
  const [edited, setEdited] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await db.setTag(formData);
      setEdited(false);
      if (add) {
        setFormData(['Tagname', 'slate', undefined]);
      }
    } catch (error) {
      console.error('Failed to submit entry:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-1 relative rounded-sm border-slate-200 px-2 pb-2 pt-6"
    >
      <div className="absolute -top-1 -left-1">
        <Tag
          name={formData[0]}
          color={formData[1]}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="name"
          label="Tag Name"
          value={formData[0]}
          type="text"
          onChange={(e) => {
            if (formData) {
              setEdited(true);
              setFormData([e.target.value, formData[1], formData[2]]);
            }
          }}
        />
        <Select
          id="color"
          label="Tag Color"
          value={formData[1]}
          options={colors}
          onChange={(e) => {
            if (formData) {
              setEdited(true);
              setFormData([formData[0], e.target.value, formData[2]]);
            }
          }}
        />
        <div className="w-fit ml-auto">
          {edited ?
            <Button
              type="submit"
              text={'Save'}
              uiType="secondary"
            />
          : ''}
        </div>
      </div>
    </form>
  );
};
