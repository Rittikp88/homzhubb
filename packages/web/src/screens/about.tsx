import React from 'react';
import { Label, ImageRound, ImageSquare } from '@homzhub/common/src/components';

class About extends React.PureComponent<{}, {}> {
  public render(): React.ReactNode {
    return (
      <div>
        <Label type="small" textType="bold">
          Label - Small - Bold
        </Label>
        <ImageRound size={50} source={require('@homzhub/common/src/assets/images/download.jpeg')} />
        <ImageSquare size={100} source={require('@homzhub/common/src/assets/images/download.jpeg')} />
      </div>
    );
  }
}

export default About;
