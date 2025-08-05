import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAtom } from 'jotai';
import { createComponentAtom } from '../atoms';
import { registerActionHandler } from '../engine/actionEngine';

interface Props {
  id: string;
}

interface DataItem {
  name: string;
  value: number;
}

const ChartComponent: React.FC<Props> = ({ id }) => {
  const [, setValue] = useAtom(createComponentAtom(id));
  const [data, setData] = useState<DataItem[]>([]);

  const updateChartData = async ({ date }: { date: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newData = [
      { name: 'A', value: Math.random() * 100 },
      { name: 'B', value: Math.random() * 100 },
      { name: 'C', value: Math.random() * 100 },
    ];
    setData(newData);
    setValue(newData);
  };

  useEffect(() => {
    registerActionHandler(id, 'updateChartData', updateChartData);
  }, [id]);

  const option = {
    xAxis: { type: 'category', data: data.map((d) => d.name) },
    yAxis: { type: 'value' },
    series: [{ data: data.map((d) => d.value), type: 'bar' }],
  };

  return <ReactECharts option={option} style={{ height: 300, margin: '0.5rem' }} />;
};

export default ChartComponent;
