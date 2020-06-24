import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { I18nextProvider } from 'react-i18next';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';

const mock = jest.fn();
describe('Getting started Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  beforeEach(async () => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <GettingStarted {...props} />
      </I18nextProvider>
    )
      .dive()
      .dive()
      .dive();
  });

  it('should render the getting started screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to Property Search Screen', () => {
    // @ts-ignore
    component.find('[testID="getStarted"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to login Screen', () => {
    // @ts-ignore
    component.find('[testID="login"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to signup Screen', () => {
    // @ts-ignore
    component.find('[testID="sign_up"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
