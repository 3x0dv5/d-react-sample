export type ComponentType = 'calendar' | 'button' | 'chart';

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
}

export interface PageConfig {
  components: ComponentConfig[];
  bindings: BindingConfig[];
}
