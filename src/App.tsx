import React, { useState } from 'react';
import CalendarComponent from './components/CalendarComponent';
import ButtonComponent from './components/ButtonComponent';
import ChartComponent from './components/ChartComponent';

type ComponentType = 'calendar' | 'button' | 'chart';

interface ComponentDef {
  type: ComponentType;
  id: string;
}

const App: React.FC = () => {
  const [components, setComponents] = useState<ComponentDef[]>([]);

  const addComponent = (type: ComponentType) => {
    const count = components.filter((c) => c.type === type).length + 1;
    const id = `${type}-${count}`;
    setComponents([...components, { type, id }]);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => addComponent('calendar')} style={{ marginRight: '0.5rem' }}>
          Add Calendar
        </button>
        <button onClick={() => addComponent('button')} style={{ marginRight: '0.5rem' }}>
          Add Button
        </button>
        <button onClick={() => addComponent('chart')}>Add Chart</button>
      </div>
      <div>
        {components.map((c) => {
          if (c.type === 'calendar') return <CalendarComponent key={c.id} id={c.id} />;
          if (c.type === 'button') return <ButtonComponent key={c.id} id={c.id} />;
          if (c.type === 'chart') return <ChartComponent key={c.id} id={c.id} />;
          return null;
        })}
      </div>
    </div>
  );
};

export default App;
