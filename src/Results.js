import React from 'react';
import './Results.scss';

export const sortMemesByWinning = (memes, votes)=>
  memes.map((meme)=> {
    const total = votes.filter(vote => (
      meme.id === vote.winner || meme.id === vote.loser
    )).length;

    const winning = votes.filter(vote => (
      vote.winner === meme.id
    )).length;

    return { percentage: winning / total, imgUrl: meme.imgUrl };
  }).sort((ma, mb)=> ma.percentage < mb.percentage ? 1 : -1);

class Results extends React.Component {
  state = {
    winners: [],
  }

  componentDidMount(){
    Promise.all([
      fetch('/meme').then(response=> response.json()),
      fetch('/vote').then(response=> response.json())
    ]).then(([memes, votes]) => console.log(memes, votes)|| this.setState({
      votes, memes,
      winners: sortMemesByWinning(memes, votes),
    }));
  }

  componentWillUnmount(){
    console.log('Results unmount');
  }

  render(){
    return (
      <div className='Results Page'>
        <div className='lists'>
          <div>
            Winners:
            <ul className='winner'>
              {this.state.winners
                .slice(0,3)
                .map(meme=>(
                <li key={meme.imgUrl}>
                  <img alt='' src={meme.imgUrl}/>
                </li>
              ))}
            </ul>
          </div>
          <div>
            Losers:
            <ul>
              {this.state.winners
                .slice(-3).reverse()
                .map(meme=>(
                <li key={meme.imgUrl}>
                  <img alt='' src={meme.imgUrl}/>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default Results;
