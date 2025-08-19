import React from 'react';
import { useSetRecoilState } from 'recoil';
import { componentStateFamily } from '../atoms';
import { executeTrigger } from '../engine/actionEngine';
import { interactionConfig } from '../config/interactionConfig';

interface Props {
  id: string;
  label?: string;
}

const ButtonComponent: React.FC<Props> = ({ id, label }) => {
  const setValue = useSetRecoilState(componentStateFamily(id));
  const handleClick = () => {
    setValue(new Date().toISOString());
    executeTrigger(`${id}.onClick`, interactionConfig);
  };
  return (
    <button onClick={handleClick} style={{ margin: '0.5rem' }}>
      {label || id}
    </button>
  );
};

export default ButtonComponent;
