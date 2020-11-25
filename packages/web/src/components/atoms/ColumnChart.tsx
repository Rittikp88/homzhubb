import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { theme } from '@homzhub/common/src/styles/theme';
import { seriesColumn } from '@homzhub/web/src/components/atoms/mockChartsData';

interface IProps {
  data?: {};
}
const initConfig = {
  // Initial Config of Graph
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    colors: [theme.colors.expense, theme.colors.income],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val: number): string {
          return `$ ${val} thousands`;
        },
      },
    },
  },
};
class ColumnChart extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { options } = initConfig;
    return <ReactApexCharts options={options} series={seriesColumn} type="bar" height={200} />;
  }
}

export default ColumnChart;
