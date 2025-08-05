import React from 'react';
import { useAtom } from 'jotai';
import { createComponentAtom } from '../atoms';

interface Props {
  id: string;
}

const CalendarComponent: React.FC<Props> = ({ id }) => {
  const [value, setValue] = useAtom(createComponentAtom(id));
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => setValue(e.target.value)}
      style={{ margin: '0.5rem' }}
    />
  );
};

export default CalendarComponent;
