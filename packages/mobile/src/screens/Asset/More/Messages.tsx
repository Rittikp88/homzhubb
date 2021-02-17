import React from 'react';
import { PickerItemProps, StyleSheet, Text } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

export class Messages extends React.PureComponent {
  public render(): React.ReactNode {
    return <Text>this is message screen</Text>;
  }
}
