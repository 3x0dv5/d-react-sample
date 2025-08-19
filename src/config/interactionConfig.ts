import pageConfig from './pageConfig.json';
import { Rule } from '../engine/actionEngine';
import { PageConfig } from './types';

const cfg = pageConfig as PageConfig;

export const interactionConfig: Rule[] = cfg.bindings.map((b) => ({
  trigger: b.mode === 'direct' ? `${b.source}.onChange` : `${b.via}.onClick`,
  actions: [
    {
      type: 'setValue',
      target: b.target,
      args: { value: `\${${b.source}.value}` },
    },
  ],
}));
