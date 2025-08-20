/**
 * ButtonComponent
 * - Generic button that acts as trigger for actions
 * - Acts as intermediary to trigger bindings between components
 * - Reads source component values and provides them as trigger context
 */
import React from 'react';
import { useRecoilValue } from 'recoil';
import { componentValuesState } from '../atoms';
import { executeTrigger } from '../engine/actionEngine';
import { interactionConfig } from '../config/interactionConfig';

interface Props {
  id: string;
  label?: string;
}

const ButtonComponent: React.FC<Props> = ({ id, label }) => {
  const componentValues = useRecoilValue(componentValuesState);

  // On click, act as trigger for the action engine
  const handleClick = () => {
    // Find rules that this button triggers and collect source component values
    const matchingRules = interactionConfig.filter(rule => rule.trigger === `${id}.onClick`);
    const triggerContext: Record<string, any> = {};
    
    // For each rule, extract source component IDs from the action args
    matchingRules.forEach(rule => {
      rule.actions.forEach(action => {
        if (action.args) {
          Object.values(action.args).forEach(arg => {
            if (typeof arg === 'string' && arg.includes('${')) {
              // Extract component IDs from expressions like ${dropdown-2.selected_value}
              const matches = arg.matchAll(/\$\{([^.}]+)(?:\.([^}]+))?\}/g);
              for (const match of matches) {
                const sourceId = match[1];
                if (sourceId !== id && componentValues[sourceId] !== undefined) {
                  triggerContext[sourceId] = componentValues[sourceId];
                }
              }
            }
          });
        }
      });
    });

    // Emit the onClick trigger with source component context
    executeTrigger(`${id}.onClick`, interactionConfig, triggerContext);
  };

  return (
    <button onClick={handleClick} style={{ margin: '0.5rem' }}>
      {label || id}
    </button>
  );
};

export default ButtonComponent;
