/**
 * Test to simulate the action engine behavior with property resolution
 * This will help determine if the current ButtonComponent implementation actually works
 */

// Simulate the getPropertyValue function from actionEngine.ts
const getPropertyValue = (componentData, property) => {
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

// Simulate the evaluateArgs function from actionEngine.ts
const evaluateArgs = (args, triggerContext, componentValues) => {
  const result = {};
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
        
        // Fallback to global state
        const componentData = componentValues[id];
        const resolved = getPropertyValue(componentData, prop);
        return String(resolved ?? '');
      });
    } else {
      result[key] = value;
    }
  });
  return result;
};

function testScenario() {
  console.log('=== Testing Action Engine Resolution ===');
  
  // Simulate component values state (what would be in componentValuesState)
  const mockComponentValues = {
    'dropdown-2': {
      value: 'grape',           // Main value for backward compatibility
      selected_value: 'grape'   // Property-specific value
    },
    'textbox-2': {
      value: '',                // Main value
      text: ''                  // Property-specific value
    },
    'button-2': {
      value: '2025-08-21T00:05:00.000Z'  // Timestamp from current ButtonComponent
    }
  };

  // Simulate the rule that should be generated for button-2.onClick
  const rule = {
    trigger: 'button-2.onClick',
    actions: [
      {
        type: 'setText',
        target: 'textbox-2',
        args: { text: '${dropdown-2.selected_value}' }
      }
    ]
  };

  console.log('Mock component values:');
  console.log(JSON.stringify(mockComponentValues, null, 2));
  
  console.log('\nRule to execute:');
  console.log(JSON.stringify(rule, null, 2));

  // Test 1: Current ButtonComponent behavior (no triggerContext)
  console.log('\n--- Test 1: Current ButtonComponent (no triggerContext) ---');
  const action = rule.actions[0];
  const resolvedArgs1 = evaluateArgs(action.args, undefined, mockComponentValues);
  console.log('Resolved args:', resolvedArgs1);
  
  // Test 2: ButtonComponent with triggerContext (if we were to modify it)
  console.log('\n--- Test 2: ButtonComponent with triggerContext ---');
  const triggerContext = {
    'button-2': { value: '2025-08-21T00:05:00.000Z' }
    // Note: triggerContext doesn't include dropdown-2 info in current implementation
  };
  const resolvedArgs2 = evaluateArgs(action.args, triggerContext, mockComponentValues);
  console.log('Resolved args:', resolvedArgs2);

  console.log('\n=== Conclusion ===');
  if (resolvedArgs1.text === 'grape') {
    console.log('✅ Current ButtonComponent should work correctly!');
    console.log('The action engine can resolve ${dropdown-2.selected_value} from global state.');
  } else {
    console.log('❌ Current ButtonComponent has an issue.');
    console.log('The action engine cannot resolve ${dropdown-2.selected_value} properly.');
  }
}

testScenario();