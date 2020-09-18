import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { Button, WithShadowView } from '@homzhub/common/src/components';

interface IProps {
  handleNextStep: () => void;
}

export class DummyView extends PureComponent<IProps> {
  public render(): React.ReactNode {
    const { handleNextStep } = this.props;
    return (
      <WithShadowView outerViewStyle={styles.shadowView}>
        <Button type="primary" title="Continue" containerStyle={styles.buttonStyle} onPress={handleNextStep} />
      </WithShadowView>
    );
  }
}

const styles = StyleSheet.create({
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
