import React, { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useRecoilState } from 'recoil';
import { componentStateFamily } from '../atoms';
import { registerActionHandler } from '../engine/actionEngine';
import { useTheme } from '../themeContext';

interface Props {
  id: string;
}

interface DataItem {
  name: string;
  value: number;
}

const ChartComponent: React.FC<Props> = ({ id }) => {
  const [date, setDate] = useRecoilState(componentStateFamily(id));
  const [data, setData] = useState<DataItem[]>([]);
  const { theme } = useTheme();
  const [colors, setColors] = useState({
    text: '#111827',
    axis: '#52606d',
    grid: '#d8dee4',
    bar: '#2563eb',
    background: '#ffffff',
  });

  useEffect(() => {
    registerActionHandler(id, 'setValue', ({ value }) => setDate(value));
  }, [id]);

  useEffect(() => {
    const getCssVariable = (name: string, fallback: string) => {
      if (typeof document === 'undefined') return fallback;
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        name,
      );
      return (value && value.trim()) || fallback;
    };

    setColors({
      text: getCssVariable('--text-color', '#111827'),
      axis: getCssVariable('--muted-text-color', '#52606d'),
      grid: getCssVariable('--border-color', '#d8dee4'),
      bar: getCssVariable('--accent-color', '#2563eb'),
      background: getCssVariable('--surface-elevated-color', '#ffffff'),
    });
  }, [theme]);

  useEffect(() => {
    if (date) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newData = [
          { name: 'A', value: Math.random() * 100 },
          { name: 'B', value: Math.random() * 100 },
          { name: 'C', value: Math.random() * 100 },
        ];
        setData(newData);
      })();
    }
  }, [date]);

  const option = useMemo(
    () => ({
      backgroundColor: colors.background,
      textStyle: { color: colors.text },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLabel: { color: colors.axis },
        axisLine: { lineStyle: { color: colors.grid } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colors.axis },
        splitLine: { lineStyle: { color: colors.grid } },
      },
      series: [
        {
          data: data.map((d) => d.value),
          type: 'bar',
          itemStyle: { color: colors.bar },
        },
      ],
    }),
    [colors, data],
  );

  return <ReactECharts option={option} className='chart' />;
};

export default ChartComponent;
