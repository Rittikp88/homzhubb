import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { theme } from '@homzhub/common/src/styles/theme';
import { seriesDonut } from '@homzhub/web/src/components/atoms/mockChartsData';

const initConfig = {
  // Initial Config of Graph
  options: {
    chart: {
      type: 'donut',
    },
    colors: [theme.colors.rental, theme.colors.sell, theme.colors.expense],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {},
          dataLabels: {
            enabled: false,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
    ],
  },
};
interface IProps {
  data?: {};
}
class DonutChart extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { options } = initConfig;
    return <ReactApexCharts options={options} series={seriesDonut} type="donut" height={200} />;
  }
}

export default DonutChart;
