import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { theme } from '@homzhub/common/src/styles/theme';
import { series } from '@homzhub/web/src/components/atoms/mockDonutData';

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
    return <ReactApexCharts options={options} series={series} type="donut" height={200} />;
  }
}

export default DonutChart;
