import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyVerification } from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyVerificationTypes } from '@homzhub/common/src/mocks/PropertyVerification';

const mock = jest.fn();

describe('Property Verification', () => {
  let component: ShallowWrapper;
  let props: any;
  let instance: any;

  beforeEach(() => {
    props = {
      navigateToPropertyHelper: mock,
      typeOfFlow: 'RENT',
      updateStep: mock,
      propertyId: 63,
    };
    component = shallow(<PropertyVerification {...props} t={(key: string): string => key} />);
    instance = component.instance();
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fetch the verification document list', async () => {
    jest
      .spyOn(AssetRepository, 'getVerificationDocumentTypes')
      .mockImplementation(() => Promise.resolve(PropertyVerificationTypes));
    const existingDocuments = await AssetRepository.getVerificationDocumentTypes();
    instance.setState({ verificationTypes: existingDocuments });
  });
});
