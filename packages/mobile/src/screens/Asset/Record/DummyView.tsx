import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Button, WithShadowView } from '@homzhub/common/src/components';

interface IProps {
  handleNextStep: () => void;
}

export class DummyView extends PureComponent<IProps> {
  public render(): React.ReactNode {
    const { handleNextStep } = this.props;
    return (
      <WithShadowView>
        <Button type="primary" title="Continue" containerStyle={styles.buttonStyle} onPress={handleNextStep} />
      </WithShadowView>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
