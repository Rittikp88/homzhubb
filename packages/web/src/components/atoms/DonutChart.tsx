import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import { sum } from 'lodash';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IProps {
  data: GeneralLedgers[];
}

interface IState {
  series: number[];
  labels: string[];
  colors: string[];
}

class DonutChart extends React.PureComponent<IProps, IState> {
  public state = {
    series: [],
    labels: [],
    colors: [],
  };

  public componentDidMount(): void {
    this.modelData();
  }

  public componentDidUpdate(prevProps: Readonly<IProps>): void {
    const { data } = this.props;
    const hasPropsChanged = JSON.stringify(prevProps.data) !== JSON.stringify(data);
    if (hasPropsChanged) {
      this.modelData();
    }
  }

  public render(): React.ReactNode {
    const { labels, colors, series } = this.state;
    const { options } = this.initConfig(labels, colors);
    return <ReactApexCharts options={options} series={series} type="donut" height={280} />;
  }

  public modelData = (): void => {
    const { data } = this.props;
    const ledgersByCategory = ObjectUtils.groupBy<GeneralLedgers>(data, 'categoryId');
    const series: number[] = [];
    const colors: string[] = [];
    const labels: string[] = [];
    Object.keys(ledgersByCategory).forEach((categoryId) => {
      const ledgers = ledgersByCategory[categoryId];
      const { category } = ledgers[0];
      let { amount } = ledgers[0];

      if (ledgers.length > 1) {
        amount = ledgersByCategory[categoryId].reduce((acc: number, ledger: GeneralLedgers) => acc + ledger.amount, 0);
      }

      series.push(amount);
      labels.push(category);
      colors.push(theme.randomHex());
    });
    this.setState({ series, colors, labels });
  };

  private initConfig = (dataLabels: string[], colors: string[]): any => ({
    // Initial Config of Graph
    options: {
      chart: {
        type: 'donut',
      },
      labels: dataLabels,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        formatter(
          seriesName: string,
          opts: { w: { globals: { series: number[] } }; seriesIndex: string | number }
        ): string[] {
          return [seriesName, ' - ', `$ ${sum(opts.w.globals.series)}`];
        },
      },
      colors,
    },
  });
}

export default DonutChart;
