import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { componentStateFamily, componentPropertyFamily } from '../atoms';
import { executeTrigger, registerActionHandler } from '../engine/actionEngine';
import { interactionConfig } from '../config/interactionConfig';

interface Props {
  id: string;
  placeholder?: string;
}

const TextboxComponent: React.FC<Props> = ({ id, placeholder }) => {
  const [value, setValue] = useRecoilState<string>(componentStateFamily(id));
  const [text, setText] = useRecoilState(componentPropertyFamily({ id, property: 'text' }));

  useEffect(() => {
    // Allow external rules to set this textbox's value
    registerActionHandler(id, 'setValue', ({ value }) => {
      console.debug(`[textbox ${id}] setValue invoked`, value);
      setValue(value);
      setText(value); // Keep text property in sync
    });
    // Also support a dedicated text setter for property-targeted bindings
    registerActionHandler(id, 'setText', ({ text }) => {
      console.debug(`[textbox ${id}] setText invoked`, text);
      setText(text); // Update text property specifically
      setValue(text); // Keep main value in sync for backward compatibility
    });
    console.debug(`[textbox ${id}] handlers registered: setValue, setText`);
  }, [id, setValue, setText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    console.debug(`[textbox ${id}] onChange`, newVal);
    setValue(newVal); // Update main value for backward compatibility
    setText(newVal); // Update text property for property-based bindings
    console.debug(`[textbox ${id}] firing trigger`, `${id}.onChange`);
    
    // Pass the new values directly to avoid race conditions with state updates
    const triggerContext = {
      [id]: {
        value: newVal,
        text: newVal
      }
    };
    executeTrigger(`${id}.onChange`, interactionConfig, triggerContext);
  };

  return (
    <input
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={handleChange}
      style={{ margin: '0.5rem' }}
    />
  );
};

export default TextboxComponent;
