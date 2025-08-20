import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Load the interaction config generation logic
  const jsonPath = resolve(__dirname, 'src/config/pageConfig.json');
  const text = await readFile(jsonPath, 'utf8');
  const cfg = JSON.parse(text);

  console.log('=== Current Bindings ===');
  cfg.bindings.forEach((b, i) => {
    console.log(`${i + 1}. ${JSON.stringify(b)}`);
  });

  console.log('\n=== Generated Rules (simulated) ===');
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

  rules.forEach((rule, i) => {
    console.log(`${i + 1}. Trigger: ${rule.trigger}`);
    console.log(`   Actions: ${JSON.stringify(rule.actions)}`);
  });

  console.log('\n=== Analysis ===');
  console.log('For the dropdown-2 → button-2 → textbox-2 flow:');
  console.log('- Trigger expected: "button-2.onClick"');
  console.log('- Action should be: setText on textbox-2 with ${dropdown-2.selected_value}');
  console.log('- Current ButtonComponent only sets timestamp and fires onClick trigger');
  console.log('- The action engine should handle the value transfer automatically');
  console.log('- Issue: Button might need to provide proper context or the action engine should read current values');
}

main().catch(console.error);