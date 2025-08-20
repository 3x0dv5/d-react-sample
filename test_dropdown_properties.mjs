#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Test the dropdown component configuration
const configPath = './src/config/pageConfig.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('Testing Dropdown Properties Implementation\n');

// Check if dropdown-2 exists and has the expected options
const dropdown2 = config.components.find(c => c.id === 'dropdown-2');
if (!dropdown2) {
  console.error('❌ dropdown-2 not found in config');
  process.exit(1);
}

console.log('✓ Found dropdown-2 with options:');
dropdown2.props.options.forEach(opt => {
  console.log(`  - value: "${opt.value}", label: "${opt.label}"`);
});

// Check if the binding exists for selected_text
const binding = config.bindings.find(b => 
  b.source === 'dropdown-2' && 
  b['source-property'] === 'selected_text' && 
  b.target === 'textbox-2'
);

if (!binding) {
  console.error('❌ Expected binding not found');
  process.exit(1);
}

console.log('\n✓ Found expected binding:');
console.log(`  Source: ${binding.source} (${binding['source-property']})`);
console.log(`  Target: ${binding.target} (${binding['target-property']})`);
console.log(`  Mode: ${binding.mode} via ${binding.via}`);

console.log('\n✓ Configuration is correct for selected_text property binding');

// Verify the DropdownComponent has been modified
const componentPath = './src/components/DropdownComponent.tsx';
const componentCode = fs.readFileSync(componentPath, 'utf8');

const hasSelectedTextState = componentCode.includes("componentPropertyFamily({ id, property: 'selected_text' })");
const hasSelectedTextInTrigger = componentCode.includes('selected_text: newLabel');
const hasLabelFinding = componentCode.includes('options.find(opt => opt.value === newVal)');

console.log('\nDropdownComponent code analysis:');
console.log(`✓ Has selected_text state: ${hasSelectedTextState}`);
console.log(`✓ Includes selected_text in trigger: ${hasSelectedTextInTrigger}`);
console.log(`✓ Finds label from options: ${hasLabelFinding}`);

if (hasSelectedTextState && hasSelectedTextInTrigger && hasLabelFinding) {
  console.log('\n🎉 All checks passed! The dropdown should now expose both selected_value and selected_text properties.');
  console.log('\nExpected behavior:');
  console.log('- When "Orange" option is selected (value: "orange")');
  console.log('- selected_value should be "orange"');
  console.log('- selected_text should be "Orange"');
  console.log('- After clicking button-2, textbox-2 should show "Orange"');
} else {
  console.error('❌ Some modifications are missing in DropdownComponent');
  process.exit(1);
}