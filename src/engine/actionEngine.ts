import { snapshot_UNSTABLE } from 'recoil';
import { componentValuesState } from '../atoms';

// Helper function to get property value with fallback logic (matching atoms.ts)
const getPropertyValue = (componentData: any, property?: string): any => {
  if (!property) return componentData;
  
  // If componentData is an object and has the property, return it
  if (componentData && typeof componentData === 'object' && property in componentData) {
    return componentData[property];
  }
  
  // Fallback: if property is 'value', 'selected_value', or 'text', return the base value
  if (property === 'value' || property === 'selected_value' || property === 'text') {
    return componentData;
  }
  
  return undefined;
};

export type Action = {
  type: string;
  target: string;
  args?: Record<string, any>;
};

export type Rule = {
  trigger: string;
  actions: Action[];
};

const handlers: Record<string, Record<string, (args: any) => void>> = {};

// Simple gated debug logger
const shouldDebug = () => {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const flag = window.localStorage.getItem('DEBUG_ENGINE');
      if (flag != null) {
        const f = String(flag).toLowerCase();
        return f !== '0' && f !== 'false' && f !== '';
      }
    }
    // Default to true in development builds
    // @ts-ignore - import.meta.env is provided by Vite
    return !!(import.meta as any).env?.DEV;
  } catch {
    return false;
  }
};

const dbg = (...args: any[]) => {
  if (shouldDebug()) console.debug('[engine]', ...args);
};

export const registerActionHandler = (
  id: string,
  actionType: string,
  handler: (args: any) => void,
) => {
  if (!handlers[id]) handlers[id] = {};
  handlers[id][actionType] = handler;
  dbg('registerActionHandler', { id, actionType });
};

export const executeTrigger = (
  trigger: string, 
  rules: Rule[], 
  triggerContext?: Record<string, any>
) => {
  const matched = rules.filter((r) => r.trigger === trigger);
  dbg('executeTrigger', { trigger, matchedCount: matched.length, triggerContext });
  matched.forEach((rule, idx) => {
    dbg('rule', idx, rule);
    rule.actions.forEach((action) => {
      const args = evaluateArgs(action.args || {}, triggerContext);
      const targetHandlers = handlers[action.target];
      const fn = targetHandlers && targetHandlers[action.type];
      dbg('action', { trigger, action, resolvedArgs: args, hasHandler: !!fn });
      if (fn) {
        try {
          fn(args);
        } catch (e) {
          console.error('[engine] handler error', { target: action.target, type: action.type, error: e });
        }
      } else {
        console.warn('[engine] no handler for action', action);
      }
    });
  });
};

const evaluateArgs = (args: Record<string, any>, triggerContext?: Record<string, any>) => {
  const result: Record<string, any> = {};
  Object.entries(args).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = value.replace(/\$\{([^}]+)\}/g, (_match, exp) => {
        const [id, prop] = exp.split('.');
        
        // First, try to get the value from triggerContext if available
        if (triggerContext && triggerContext[id] !== undefined) {
          const contextData = triggerContext[id];
          const resolved = getPropertyValue(contextData, prop);
          if (resolved !== undefined) {
            return String(resolved);
          }
        }
        
        // Fallback to snapshot for backward compatibility
        const values =
          snapshot_UNSTABLE().getLoadable(componentValuesState).valueMaybe() ||
          {};
        const componentData = values[id];
        const resolved = getPropertyValue(componentData, prop);
        return String(resolved ?? '');
      });
    } else {
      result[key] = value;
    }
  });
  dbg('evaluateArgs', { input: args, triggerContext, output: result });
  return result;
};
