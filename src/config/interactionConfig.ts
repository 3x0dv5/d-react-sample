import { Rule } from '../engine/actionEngine';

export const interactionConfig: Rule[] = [
  {
    trigger: 'button-1.onClick',
    actions: [
      {
        type: 'updateChartData',
        target: 'chart-1',
        args: {
          date: '${calendar-1.value}'
        }
      }
    ]
  }
];
