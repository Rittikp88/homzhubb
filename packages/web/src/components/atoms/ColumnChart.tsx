import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  data?: {};
}
interface IState {
  series: ISeriesData[];
  options: {};
}
interface ISeriesData {
  name: string;
  data: number[];
}
class ColumnChart extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      series: [
        {
          name: 'Expense',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: 'Income',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
      ],
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
  }

  public render(): React.ReactNode {
    const { options, series } = this.state;
    return <ReactApexCharts options={options} series={series} type="bar" height={200} />;
  }
}

export default ColumnChart;
