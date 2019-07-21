import React from 'react';
import Login from './Login';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('lets the user log in', ()=>{
  const p = mount(<Login />);

  const inputs = p.find('input');
  const usernameInput = inputs.at(0);
  const passwordInput = inputs.at(1);

  expect( p.state('username') ).toEqual( '' );
  expect( p.state('password') ).toEqual( '' );

  usernameInput.simulate('change', {
    target: { value: 'monkey' },
  });

  passwordInput.simulate('change', {
    target: { value: 'business' },
  });

  expect( p.state('username') ).toEqual( 'monkey' );
  expect( p.state('password') ).toEqual( 'business' );

  const fakeFetch = jest.fn().mockReturnValue(Promise.reject());
  const oldFetch = global.fetch;
  global.fetch = fakeFetch;

  const buttons = p.find('button');
  const loginButton = buttons.at(0);
  const signupButton = buttons.at(1);

  expect( fakeFetch.mock.calls ).toHaveLength( 0 );

  loginButton.simulate('click');

  expect( fakeFetch.mock.calls ).toHaveLength( 1 );

  const loginPath = fakeFetch.mock.calls[0][0];
  const loginRequest = fakeFetch.mock.calls[0][1];

  expect( loginPath ).toEqual( '/login' );
  expect( JSON.parse(loginRequest.body).username ).toEqual('monkey');
  expect( JSON.parse(loginRequest.body).password ).toEqual('business');

  signupButton.simulate('click');

  expect( fakeFetch.mock.calls ).toHaveLength( 2 );

  const signupPath = fakeFetch.mock.calls[1][0];
  const signupRequest = fakeFetch.mock.calls[1][1];

  expect( signupPath ).toEqual( '/user' );
  expect( JSON.parse(signupRequest.body).username ).toEqual('monkey');
  expect( JSON.parse(signupRequest.body).password ).toEqual('business');

});





//
