import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { componentStateFamily, componentPropertyFamily } from '../atoms';
import { executeTrigger, registerActionHandler } from '../engine/actionEngine';
import { interactionConfig } from '../config/interactionConfig';

interface Option {
  label: string;
  value: string;
}

interface Props {
  id: string;
  options?: Option[];
  placeholder?: string;
}

const DropdownComponent: React.FC<Props> = ({ id, options = [], placeholder }) => {
  const [value, setValue] = useRecoilState<string>(componentStateFamily(id));
  const [selectedValue, setSelectedValue] = useRecoilState(componentPropertyFamily({ id, property: 'selected_value' }));
  const [selectedText, setSelectedText] = useRecoilState(componentPropertyFamily({ id, property: 'selected_text' }));

  useEffect(() => {
    // Allow other components/rules to set this dropdown's value
    registerActionHandler(id, 'setValue', ({ value }) => {
      console.debug(`[dropdown ${id}] setValue invoked`, value);
      setValue(value);
      setSelectedValue(value); // Keep selected_value in sync
      
      // Find the corresponding label for selected_text
      const selectedOption = options.find(opt => opt.value === value);
      const label = selectedOption ? selectedOption.label : '';
      setSelectedText(label);
    });
    console.debug(`[dropdown ${id}] handler registered: setValue`);
  }, [id, setValue, setSelectedValue, setSelectedText, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    console.debug(`[dropdown ${id}] onChange`, newVal);
    
    // Find the corresponding label for selected_text
    const selectedOption = options.find(opt => opt.value === newVal);
    const newLabel = selectedOption ? selectedOption.label : '';
    
    setValue(newVal); // Update main value for backward compatibility
    setSelectedValue(newVal); // Update selected_value for property-based bindings
    setSelectedText(newLabel); // Update selected_text for property-based bindings
    console.debug(`[dropdown ${id}] firing trigger`, `${id}.onChange`);
    
    // Pass the new values directly to avoid race conditions with state updates
    const triggerContext = {
      [id]: {
        value: newVal,
        selected_value: newVal,
        selected_text: newLabel
      }
    };
    executeTrigger(`${id}.onChange`, interactionConfig, triggerContext);
  };

  return (
    <select value={value || ''} onChange={handleChange} style={{ margin: '0.5rem' }}>
      {placeholder !== undefined && (
        <option value="" disabled={true} hidden={true}>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownComponent;
