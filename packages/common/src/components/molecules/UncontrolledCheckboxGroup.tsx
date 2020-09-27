import React from 'react';
import { CheckboxGroup, ICheckboxGroupData, ICheckboxGroupProps } from '@homzhub/common/src/components';

interface IState {
  data: ICheckboxGroupData[];
}

// Todo (Sriram: do we need this component?)
export class UncontrolledCheckboxGroup extends React.PureComponent<ICheckboxGroupProps, IState> {
  constructor(props: ICheckboxGroupProps) {
    super(props);
    const { data } = this.props;

    this.state = {
      data,
    };
  }

  public render = (): React.ReactNode => {
    const { containerStyle = {} } = this.props;
    const { data } = this.state;

    return <CheckboxGroup containerStyle={containerStyle} data={data} onToggle={this.handleToggle} />;
  };

  private handleToggle = (id: number, isSelected: boolean): void => {
    const { data } = this.state;
    const { onToggle } = this.props;

    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected };
      }
      return item;
    });

    this.setState({ data: updatedData });

    onToggle(id, isSelected);
  };
}
