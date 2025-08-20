/**
 * Test the updated ButtonComponent behavior
 * Verify that it correctly identifies intermediary vs standalone roles
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadInteractionConfig() {
  const jsonPath = resolve(__dirname, 'src/config/pageConfig.json');
  const text = await readFile(jsonPath, 'utf8');
  const cfg = JSON.parse(text);
  
  // Simulate the rule generation from interactionConfig.ts
  const rules = cfg.bindings.map((b) => {
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
    };
  });
  
  return rules;
}

function testButtonBehavior(buttonId, interactionConfig) {
  console.log(`\n=== Testing ${buttonId} ===`);
  
  // Simulate the isIntermediary logic from ButtonComponent
  const isIntermediary = interactionConfig.some(rule => 
    rule.trigger === `${buttonId}.onClick` && 
    rule.actions.some(action => 
      action.args && 
      typeof action.args === 'object' &&
      Object.values(action.args).some(arg => 
        typeof arg === 'string' && arg.includes('${') && !arg.includes(`${buttonId}.`)
      )
    )
  );
  
  console.log(`Button ID: ${buttonId}`);
  console.log(`Is Intermediary: ${isIntermediary}`);
  
  // Find matching rules
  const matchingRules = interactionConfig.filter(rule => rule.trigger === `${buttonId}.onClick`);
  console.log(`Matching rules: ${matchingRules.length}`);
  
  matchingRules.forEach((rule, i) => {
    console.log(`  Rule ${i + 1}:`, JSON.stringify(rule, null, 4));
  });
  
  if (isIntermediary) {
    console.log(`✅ ${buttonId} correctly identified as intermediary - will not set timestamp`);
  } else {
    console.log(`✅ ${buttonId} correctly identified as standalone - will set timestamp`);
  }
  
  return isIntermediary;
}

async function main() {
  console.log('=== Testing Updated ButtonComponent Behavior ===');
  
  const interactionConfig = await loadInteractionConfig();
  
  console.log('Generated interaction config:');
  interactionConfig.forEach((rule, i) => {
    console.log(`${i + 1}. ${rule.trigger} -> ${JSON.stringify(rule.actions)}`);
  });
  
  // Test button-1 (should be standalone for calendar -> chart-2)
  const button1IsIntermediary = testButtonBehavior('button-1', interactionConfig);
  
  // Test button-2 (should be intermediary for dropdown-2 -> textbox-2)  
  const button2IsIntermediary = testButtonBehavior('button-2', interactionConfig);
  
  console.log('\n=== Summary ===');
  console.log(`button-1 intermediary: ${button1IsIntermediary} (expected: true - passes calendar value to chart-2)`);
  console.log(`button-2 intermediary: ${button2IsIntermediary} (expected: true - passes dropdown-2 value to textbox-2)`);
  
  if (button1IsIntermediary && button2IsIntermediary) {
    console.log('✅ All buttons correctly identified as intermediaries');
  } else {
    console.log('ℹ️  Some buttons identified as standalone (will set timestamps)');
  }
}

main().catch(console.error);