import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StepIndicatorComponent } from '@homzhub/mobile/src/components/molecules/StepIndicator';

const mock = jest.fn();

describe('StepIndicator', () => {
  const mountWrapper = mount(
    <StepIndicatorComponent stepCount={4} currentPosition={1} labels={['a', 'b', 'c']} onPress={mock} />
  );

  it('should render snapshot', () => {
    expect(toJson(mountWrapper)).toMatchSnapshot();
  });

  it('should call mock function on press of step', () => {
    mountWrapper.prop('onPress')(2);
    expect(mock).toHaveBeenCalledWith(2);
  });
});
