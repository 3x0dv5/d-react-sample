import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { componentStateFamily } from '../atoms';
import { executeTrigger, registerActionHandler } from '../engine/actionEngine';
import { interactionConfig } from '../config/interactionConfig';

interface Props {
  id: string;
}

const CalendarComponent: React.FC<Props> = ({ id }) => {
  const [value, setValue] = useRecoilState(componentStateFamily(id));

  useEffect(() => {
    registerActionHandler(id, 'setValue', ({ value }) => setValue(value));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    executeTrigger(`${id}.onChange`, interactionConfig);
  };

  return (
    <input
      type='date'
      value={value || ''}
      onChange={handleChange}
      style={{ margin: '0.5rem' }}
    />
  );
};

export default CalendarComponent;
