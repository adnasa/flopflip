import React from 'react';
import { mount } from 'enzyme';
import branchOnFeatureToggle from './branch-on-feature-toggle';
import Configure from '../configure';
import memoryAdapter, { updateFlags } from '@flopflip/memory-adapter';

const ToggledComponent = () => <div />;
ToggledComponent.displayName = 'ToggledComponent';
const UntoggledComponent = () => <div />;
UntoggledComponent.displayName = 'UntoggledComponent';

const createTestProps = custom => ({
  adapterArgs: {},

  ...custom,
});

describe('without `untoggledComponent', () => {
  const EnhancedComponent = branchOnFeatureToggle({ flag: 'flag1' })(
    ToggledComponent
  );
  let props;
  let wrapper;

  describe('when feature is disabled', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = mount(
        <Configure {...props} adapter={memoryAdapter}>
          <EnhancedComponent />
        </Configure>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `ToggledComponent', () => {
      expect(wrapper).not.toRender(ToggledComponent);
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        updateFlags({ flag1: true });
        wrapper.update();
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `ToggledComponent', () => {
        expect(wrapper).toRender(ToggledComponent);
      });
    });
  });
});

describe('with `untoggledComponent', () => {
  const EnhancedComponent = branchOnFeatureToggle(
    { flag: 'flag1' },
    UntoggledComponent
  )(ToggledComponent);
  let props;
  let wrapper;

  describe('when feature is disabled', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = mount(
        <Configure {...props} adapter={memoryAdapter}>
          <EnhancedComponent />
        </Configure>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `ToggledComponent', () => {
      expect(wrapper).not.toRender(ToggledComponent);
    });

    it('should render the `UntoggledComponent', () => {
      expect(wrapper).toRender(UntoggledComponent);
    });

    describe('when enabling feature', () => {
      beforeEach(() => {
        updateFlags({ flag1: true });
        wrapper.update();
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render the `ToggledComponent', () => {
        expect(wrapper).toRender(ToggledComponent);
      });

      it('should not render the `UntoggledComponent', () => {
        expect(wrapper).not.toRender(UntoggledComponent);
      });
    });
  });
});
