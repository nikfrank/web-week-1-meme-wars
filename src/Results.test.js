//const { it, expect } = global;
import React from 'react';
import Results, { sortMemesByWinning } from './Results';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('sorts the memes', ()=>{
  const memes = [
    { id: 0, imgUrl: 'a' },
    { id: 1, imgUrl: 'b' },
    { id: 2, imgUrl: 'c' },
  ];

  const votes = [
    { winner: 0, loser: 1 },
    { winner: 2, loser: 1 },
    { winner: 2, loser: 1 },
    { winner: 0, loser: 2 },
  ];

  const sortedMemes = sortMemesByWinning(memes, votes);

  expect( sortedMemes ).toEqual([
    { imgUrl: 'a', percentage: 1 },
    { imgUrl: 'c', percentage: 2/3 },
    { imgUrl: 'b', percentage: 0 },
  ]);
});

it('loads the data from the server', ()=>{
  const memes = [
    { id: 0, imgUrl: 'a' },
    { id: 1, imgUrl: 'b' },
    { id: 2, imgUrl: 'c' },
  ];

  const votes = [
    { winner: 0, loser: 1 },
    { winner: 2, loser: 1 },
    { winner: 2, loser: 1 },
    { winner: 0, loser: 2 },
  ];

  const fakeFetch = jest.fn()
    .mockReturnValueOnce(
      Promise.resolve({
        json: ()=> Promise.resolve(memes)
      })
    ).mockReturnValueOnce(
      Promise.resolve({
        json: ()=> Promise.resolve(votes)
      })
    );

  const oldFetch = global.fetch;
  global.fetch = fakeFetch;

  const wrapper = mount(<Results />);

  const winners = wrapper.find('ul.winner li');

  expect( winners ).toHaveLength( 0 );

  return new Promise(done => {
    setTimeout(()=>{
      wrapper.update();
      const winners = wrapper.find('ul.winner li');

      expect( winners ).toHaveLength( 3 );
      global.fetch = oldFetch;

      done();
    }, 10);
  });
});






//
