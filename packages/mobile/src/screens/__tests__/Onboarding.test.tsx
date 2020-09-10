import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { OnboardingData } from '@homzhub/common/src/mocks/Onboarding';
import { OnBoardingScreen, mapDispatchToProps } from '@homzhub/mobile/src/screens/OnBoardingScreen';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';

const mock = jest.fn();

describe('Onboarding Screen', () => {
  let component: any;
  let props: any;
  let instance: any;

  beforeEach(() => {
    props = {
      navigation: { navigate: mock },
      updateOnBoarding: mock,
    };
    component = shallow(<OnBoardingScreen {...props} t={(key: string): string => key} />);
    instance = component.instance();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render with data in state', () => {
    instance.setState({ data: OnboardingData, activeSlide: 0 });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render without data in state', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render got it button for active slide', () => {
    instance.setState({ data: OnboardingData, activeSlide: 2 });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call render next frame on button press with navigation to Getting started', () => {
    instance.setState({ data: OnboardingData, activeSlide: 0 });
    component.find('[testID="btnNextFrame"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call render next frame on button press', () => {
    instance.setState({
      data: OnboardingData,
      activeSlide: 0,
      ref: {
        snapToNext: mock,
      },
    });
    component.find('[testID="btnNextFrame"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should call the update on boarding', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).updateOnBoarding(true);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: UserActionTypes.UPDATE_ONBOARDING,
      payload: true,
    });
  });

  it('should call change slide', () => {
    instance.setState({ data: OnboardingData, activeSlide: 0 });
    component.find('[testID="carsl"]').prop('onSnapToItem')(1);
    expect(component.state('activeSlide')).toBe(1);
  });

  it('should call update ref', () => {
    instance.setState({ data: OnboardingData, activeSlide: 0 });
    component.find('[testID="carsl"]').prop('bubbleRef')(null);
    expect(component.state('ref')).toBe(null);
  });

  it('should call get onboarding data', async () => {
    const deserializedData = ObjectMapper.deserializeArray(OnBoarding, OnboardingData);
    jest.spyOn(CommonRepository, 'getOnBoarding').mockImplementation(async () => Promise.resolve(deserializedData));
    await instance.componentDidMount();
    const response = await CommonRepository.getOnBoarding();
    instance.setState({ data: response });
    expect(component.state('data')).toBe(deserializedData);
  });
});
