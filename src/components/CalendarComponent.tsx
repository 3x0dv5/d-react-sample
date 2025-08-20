/**
 * CalendarComponent
 * - Controlled <input type="date"> whose value is stored in Recoil under its id
 * - Registers a `setValue` action handler so other components can set its date
 * - Emits the `${id}.onChange` trigger whenever the date changes
 */
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

  // Register an imperative handler so the action engine can set this component's value
  useEffect(() => {
    registerActionHandler(id, 'setValue', ({ value }) => setValue(value));
  }, [id]);

  // Update local state and fire a trigger so bound targets can react
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    
    // Pass the new value directly to avoid race conditions with state updates
    const triggerContext = {
      [id]: {
        value: newVal
      }
    };
    executeTrigger(`${id}.onChange`, interactionConfig, triggerContext);
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
