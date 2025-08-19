import { atom, selectorFamily } from 'recoil';

export const componentValuesState = atom<Record<string, any>>({
  key: 'componentValuesState',
  default: {},
});

export const componentStateFamily = selectorFamily<any, string>({
  key: 'componentStateFamily',
  get:
    (id) =>
    ({ get }) =>
      get(componentValuesState)[id],
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const values = get(componentValuesState);
      set(componentValuesState, { ...values, [id]: newValue });
    },
});
