/**
 * App component
 * - Reads pageConfig.json (typed as PageConfig)
 * - Maps declared component types to concrete React components
 * - Renders each component with its id and props from config
 */
import React from 'react';
import CalendarComponent from './components/CalendarComponent';
import ButtonComponent from './components/ButtonComponent';
import ChartComponent from './components/ChartComponent';
import DropdownComponent from './components/DropdownComponent';
import TextboxComponent from './components/TextboxComponent';
import pageConfig from './config/pageConfig.json';
import { ComponentConfig, ComponentType, PageConfig } from './config/types';
import ConfigEditor from './ConfigEditor';

// Cast the imported JSON to the PageConfig TS type for better type safety
const cfg = pageConfig as PageConfig;

// Integration seam: map logical types from config to actual React components
const componentMap: Record<ComponentType, React.FC<any>> = {
  calendar: CalendarComponent,
  button: ButtonComponent,
  chart: ChartComponent,
  dropdown: DropdownComponent,
  textbox: TextboxComponent,
};

const App: React.FC = () => {
  if (typeof window !== 'undefined' && window.location.pathname === '/editor') {
    return <ConfigEditor />;
  }
  return (
    <div>
      {/* Render all components declared in the configuration */}
      {cfg.components.map((c: ComponentConfig) => {
        const Comp = componentMap[c.type];
        // Spread any additional props defined in the config to the component
        return <Comp key={c.id} id={c.id} {...c.props} />;
      })}
    </div>
  );
};

export default App;
