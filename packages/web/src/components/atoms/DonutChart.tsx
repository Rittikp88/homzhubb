import React from 'react';
import ReactApexCharts from 'react-apexcharts';
// import { theme } from '@homzhub/common/src/styles/theme'; TODOS LAKSHIT

interface IProps {
  data?: {};
}
interface IState {
  series: number[];
  options: {};
}
class DonutChart extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      series: [44, 55, 41, 17, 15],
      options: {
        chart: {
          type: 'donut',
        },
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
  }

  public render(): React.ReactNode {
    const { series, options } = this.state;
    return <ReactApexCharts options={options} series={series} type="donut" height={200} />;
  }
}

export default DonutChart;
