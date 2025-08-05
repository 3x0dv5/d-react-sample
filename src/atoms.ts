import { atom } from 'jotai';

export const componentValuesAtom = atom<Record<string, any>>({});

export const createComponentAtom = (id: string) =>
  atom(
    (get) => get(componentValuesAtom)[id],
    (get, set, update: any) => {
      set(componentValuesAtom, { ...get(componentValuesAtom), [id]: update });
    }
  );
