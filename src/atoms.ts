import { atom, selectorFamily } from 'recoil';

export const componentValuesState = atom<Record<string, any>>({
  key: 'componentValuesState',
  default: {},
});

// Helper function to get property value with fallback logic
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

// Helper function to set property value while maintaining structure
const setPropertyValue = (currentData: any, property: string | undefined, newValue: any): any => {
  if (!property) return newValue;
  
  // If setting 'value', 'selected_value', or 'text' on non-object data, 
  // create object structure for multi-property support
  if (property === 'value' || property === 'selected_value' || property === 'text') {
    if (currentData && typeof currentData === 'object' && !Array.isArray(currentData)) {
      // Already an object, update the specific property
      return { ...currentData, [property]: newValue };
    } else {
      // Convert to object structure, preserving the original value as 'value'
      const baseValue = currentData;
      const result: any = {};
      
      // Set the original value as 'value' if it exists and we're not setting 'value'
      if (baseValue !== undefined && property !== 'value') {
        result.value = baseValue;
      }
      
      // Set the requested property
      result[property] = newValue;
      
      return result;
    }
  }
  
  // For other properties, always use object structure
  if (currentData && typeof currentData === 'object' && !Array.isArray(currentData)) {
    return { ...currentData, [property]: newValue };
  } else {
    // Convert to object, preserving original value as 'value'
    const result: any = {};
    if (currentData !== undefined) {
      result.value = currentData;
    }
    result[property] = newValue;
    return result;
  }
};

export const componentStateFamily = selectorFamily<any, string>({
  key: 'componentStateFamily',
  get:
    (id) =>
    ({ get }) => {
      const componentData = get(componentValuesState)[id];
      // For backward compatibility, return the value directly or the 'value' property
      return getPropertyValue(componentData, 'value');
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const values = get(componentValuesState);
      set(componentValuesState, { ...values, [id]: newValue });
    },
});

// New selector family for accessing specific properties
export const componentPropertyFamily = selectorFamily<any, { id: string; property: string }>({
  key: 'componentPropertyFamily',
  get:
    ({ id, property }) =>
    ({ get }) => {
      const componentData = get(componentValuesState)[id];
      return getPropertyValue(componentData, property);
    },
  set:
    ({ id, property }) =>
    ({ get, set }, newValue) => {
      const values = get(componentValuesState);
      const currentData = values[id];
      const updatedData = setPropertyValue(currentData, property, newValue);
      set(componentValuesState, { ...values, [id]: updatedData });
    },
});
