import pageConfig from './pageConfig.json';
import { Rule } from '../engine/actionEngine';
import { PageConfig } from './types';

const cfg = pageConfig as PageConfig;

// Local debug gate mirroring engine behavior
const shouldDebug = () => {
    return true;
  // try {
  //   if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  //     const flag = window.localStorage.getItem('DEBUG_ENGINE');
  //     if (flag != null) {
  //       const f = String(flag).toLowerCase();
  //       return f !== '0' && f !== 'false' && f !== '';
  //     }
  //   }
  //   // @ts-ignore - import.meta.env present in Vite
  //   return !!(import.meta as any).env?.DEV;
  // } catch {
  //   return false;
  // }
};

const rules: Rule[] = cfg.bindings.map((b) => {
  const trigger = b.mode === 'direct' ? `${b.source}.onChange` : `${b.via}.onClick`;
  const sourceProp = (b['source-property'] || 'value').trim();
  const targetProp = (b['target-property'] || 'value').trim();

  const expression = `\${${b.source}.${sourceProp}}`;
  const actionType = targetProp === 'text' ? 'setText' : 'setValue';
  const args = actionType === 'setText' ? { text: expression } : { value: expression };

  return {
    trigger,
    actions: [
      {
        type: actionType,
        target: b.target,
        args,
      },
    ],
  } as Rule;
});

if (shouldDebug()) {
  console.debug('[interactionConfig] derived rules', rules);
}

export const interactionConfig: Rule[] = rules;
