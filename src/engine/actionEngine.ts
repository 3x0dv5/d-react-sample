import { getDefaultStore } from 'jotai/vanilla';
import { componentValuesAtom } from '../atoms';

export type Action = {
  type: string;
  target: string;
  args?: Record<string, any>;
};

export type Rule = {
  trigger: string;
  actions: Action[];
};

const store = getDefaultStore();

const handlers: Record<string, Record<string, (args: any) => void>> = {};

export const registerActionHandler = (
  id: string,
  actionType: string,
  handler: (args: any) => void
) => {
  if (!handlers[id]) handlers[id] = {};
  handlers[id][actionType] = handler;
};

export const executeTrigger = (trigger: string, rules: Rule[]) => {
  rules
    .filter((r) => r.trigger === trigger)
    .forEach((rule) => {
      rule.actions.forEach((action) => {
        const args = evaluateArgs(action.args || {});
        const targetHandlers = handlers[action.target];
        const fn = targetHandlers && targetHandlers[action.type];
        if (fn) {
          fn(args);
        }
      });
    });
};

const evaluateArgs = (args: Record<string, any>) => {
  const result: Record<string, any> = {};
  Object.entries(args).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = value.replace(/\$\{([^}]+)\}/g, (_match, exp) => {
        const [id] = exp.split('.');
        const values = store.get(componentValuesAtom);
        return values[id];
      });
    } else {
      result[key] = value;
    }
  });
  return result;
};
