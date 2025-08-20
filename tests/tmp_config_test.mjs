import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const jsonPath = resolve(__dirname, '../src/config/pageConfig.json');
  const text = await readFile(jsonPath, 'utf8');
  const cfg = JSON.parse(text);

  // Basic structure checks
  assert.ok(cfg && typeof cfg === 'object', 'Config must be an object');
  assert.ok(Array.isArray(cfg.components), 'components must be an array');
  assert.ok(Array.isArray(cfg.bindings), 'bindings must be an array');

  // Components
  assert.equal(cfg.components.length, 9, 'Expected 9 components');
  const byId = Object.fromEntries(cfg.components.map((c) => [c.id, c]));
  assert.equal(byId['calendar-1']?.type, 'calendar');
  assert.equal(byId['button-1']?.type, 'button');
  assert.equal(byId['chart-1']?.type, 'chart');
  assert.equal(byId['chart-2']?.type, 'chart');
  assert.equal(byId['dropdown-1']?.type, 'dropdown');
  assert.equal(byId['textbox-1']?.type, 'textbox');
  assert.equal(byId['dropdown-2']?.type, 'dropdown');
  assert.equal(byId['textbox-2']?.type, 'textbox');
  assert.equal(byId['button-2']?.type, 'button');

  // Bindings
  const hasDirect = cfg.bindings.some(
    (b) => b.source === 'calendar-1' && b.target === 'chart-1' && b.mode === 'direct',
  );
  assert.ok(hasDirect, 'Missing direct binding from calendar-1 to chart-1');

  const hasIndirect = cfg.bindings.some(
    (b) =>
      b.source === 'calendar-1' &&
      b.target === 'chart-2' &&
      b.mode === 'indirect' &&
      b.via === 'button-1',
  );
  assert.ok(hasIndirect, 'Missing indirect binding via button-1 to chart-2');

  const dropdownToTextbox = cfg.bindings.find(
    (b) => b.source === 'dropdown-1' && b.target === 'textbox-1' && b.mode === 'direct',
  );
  assert.ok(dropdownToTextbox, 'Missing direct binding from dropdown-1 to textbox-1');
  assert.equal(dropdownToTextbox['source-property'], 'selected_value', 'Expected source-property to be selected_value');
  assert.equal(dropdownToTextbox['target-property'], 'text', 'Expected target-property to be text');

  const dropdown2ToTextbox2 = cfg.bindings.find(
    (b) => b.source === 'dropdown-2' && b.target === 'textbox-2' && b.mode === 'indirect' && b.via === 'button-2',
  );
  assert.ok(dropdown2ToTextbox2, 'Missing indirect binding from dropdown-2 to textbox-2 via button-2');
  assert.equal(dropdown2ToTextbox2['source-property'], 'selected_value', 'Expected source-property to be selected_value');
  assert.equal(dropdown2ToTextbox2['target-property'], 'text', 'Expected target-property to be text');

  console.log('OK: pageConfig.json validated with all dropdown and textbox components and bindings');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
