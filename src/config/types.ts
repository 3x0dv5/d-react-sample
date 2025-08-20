export type ComponentType = 'calendar' | 'button' | 'chart' | 'dropdown' | 'textbox';

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
}

export interface BindingConfig {
  source: string;
  target: string;
  mode: 'direct' | 'indirect';
  via?: string;
  /** Optional: specify which property of the source value to use (e.g., 'selected_value'). */
  'source-property'?: string;
  /** Optional: specify which property of the target to set (e.g., 'text'). */
  'target-property'?: string;
}

export interface PageConfig {
  components: ComponentConfig[];
  bindings: BindingConfig[];
}
