import React from 'react';
import CalendarComponent from './components/CalendarComponent';
import ButtonComponent from './components/ButtonComponent';
import ChartComponent from './components/ChartComponent';
import pageConfig from './config/pageConfig.json';
import { ComponentConfig, ComponentType, PageConfig } from './config/types';

const cfg = pageConfig as PageConfig;

const componentMap: Record<ComponentType, React.FC<any>> = {
  calendar: CalendarComponent,
  button: ButtonComponent,
  chart: ChartComponent,
};

const App: React.FC = () => {
  return (
    <div>
      {cfg.components.map((c: ComponentConfig) => {
        const Comp = componentMap[c.type];
        return <Comp key={c.id} id={c.id} {...c.props} />;
      })}
    </div>
  );
};

export default App;
