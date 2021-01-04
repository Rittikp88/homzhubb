import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { WithTranslation, withTranslation } from 'react-i18next';
import { sum } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { BarGraphLegends } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IGraphProps } from '@homzhub/common/src/utils/FinanceUtil';

interface IOwnProps {
  data: IGraphProps;
}

type IProps = WithTranslation & IOwnProps;

class ColumnChart extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { data } = this.props;
    const { data1: debit, data2: credit, label, type } = data;
    const { options } = this.initConfig(label, type, sum(debit), sum(credit));
    return <ReactApexCharts options={options} series={this.seriesData(debit, credit)} type="bar" height="250" />;
  }

  public initConfig = (label: string[], type: string, totalDebit: number, totalCredit: number): any => ({
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
        categories: label,
      },
      yaxis: {
        labels: {
          formatter(value: number): string {
            return `$ ${value > 1000 ? value / 1000 : value}${value > 1000 ? 'k' : ''}`;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        formatter(seriesName: string): string[] {
          return [seriesName, ' - ', seriesName === 'Expense' ? `$ ${totalDebit}` : `$ ${totalCredit}`];
        },
      },
      tooltip: {
        y: {
          formatter(val: number): string {
            return `$ ${val}`;
          },
        },
      },
    },
  });

  public seriesData = (debit: number[], credit: number[]): { data: number[]; name: string }[] => {
    return [
      {
        name: BarGraphLegends.expense,
        data: debit,
      },
      {
        name: BarGraphLegends.income,
        data: credit,
      },
    ];
  };
}

export default withTranslation()(ColumnChart);
