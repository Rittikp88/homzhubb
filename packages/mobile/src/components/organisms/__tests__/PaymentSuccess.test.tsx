import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { I18nextProvider } from 'react-i18next';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { PaymentSuccess } from '@homzhub/mobile/src/components/organisms/PaymentSuccess';

const mock = jest.fn();

describe('Payment Success Component', () => {
  let component: ShallowWrapper;

  beforeEach(async () => {
    const props = {
      onClickLink: mock,
    };
    await I18nService.init();
    component = shallow(
      <I18nextProvider i18n={I18nService.instance}>
        <PaymentSuccess {...props} />
      </I18nextProvider>
    );
  });

  it('should render payment success component', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call handle link', () => {
    // @ts-ignore
    component.dive().dive().find('[testID="txtPress"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
