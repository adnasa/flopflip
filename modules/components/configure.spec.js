import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialize, listen } from './../utils/ld-wrapper';
import { Configure } from './configure';

jest.mock('./../utils/ld-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

const createTestProps = custom => ({
  client: { __client__: '__internal__' },
  user: { key: '123' },
  clientSideId: '456',

  // HoC
  updateFlags: jest.fn(),
  updateStatus: jest.fn(),

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();

    initialize.mockReturnValue(props.client);

    wrapper = shallow(<Configure {...props} />);
  });

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should `initialize` on the `ld-wrapper` with `clientSideId` and `user`', () => {
    expect(initialize).toHaveBeenCalledWith({
      clientSideId: props.clientSideId,
      user: props.user,
    });
  });

  it('should `listen` on the `ld-wrapper`', () => {
    expect(listen).toHaveBeenCalledWith({
      client: props.client,
      updateFlags: props.updateFlags,
      updateStatus: props.updateStatus,
    });
  });

  describe('with `children`', () => {
    const ChildComponent = () => <div />;
    let props;

    beforeEach(() => {
      props = createTestProps();

      wrapper = shallow(
        <Configure {...props}>
          <ChildComponent />
        </Configure>
      );
    });

    it('should render `children`', () => {
      expect(wrapper).toRender(ChildComponent);
    });
  });
});