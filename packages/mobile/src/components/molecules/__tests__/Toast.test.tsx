import React from 'react';
import { TouchableHighlight } from 'react-native';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MessageComponentProps } from 'react-native-flash-message';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { Toast } from '@homzhub/mobile/src/components/molecules/Toast';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const sampleProps: MessageComponentProps = {
  message: {
    message: 'Test Message',
    type: 'danger',
    backgroundColor: 'red',
  },
  icon: 'none',
  style: {},
  textStyle: {},
  titleStyle: {},
};

describe('Toast', () => {
  const wrapper: ShallowWrapper = shallow(<Toast {...sampleProps} />);

  ['success', 'danger'].forEach((type: string) => {
    it(`should match snapshot for type ${type}`, () => {
      sampleProps.message.type = type;
      wrapper.setProps(sampleProps);
      expect(toJson(wrapper.dive())).toMatchSnapshot();
    });
  });

  it('should call dismiss on OK press', () => {
    const spy = jest.spyOn(AlertHelper, 'dismiss').mockImplementation(() => {});
    wrapper.dive().find(TouchableHighlight).simulate('press');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
