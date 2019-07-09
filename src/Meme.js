import React from 'react';
import './Meme.css';

class Meme extends React.Component {
  state = {
    imgUrl: '',
  }

  setImgUrl = (event)=>
    this.setState({ imgUrl: event.target.value })

  upload = ()=>{
    fetch('/meme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+localStorage.sessionToken,
      },
      body: JSON.stringify({
        imgUrl: this.state.imgUrl,
      }),
    }).then(response=> {
      if(response.status < 300) this.setState({ imgUrl: '' });
      else response.json().then(err => console.error( response.status, err ) );
    });
  }

  componentDidMount(){
    console.log('Meme mount');
  }

  componentWillUnmount(){
    console.log('Meme unmount');
  }

  render(){
    return (
      <div className='Meme Page'>
        <div className='meme-box'>
          <label>
            <span>Url to Upload</span>
            <input value={this.state.imgUrl}
                   onChange={this.setImgUrl}/>
          </label>
          <button onClick={this.upload}>Upload</button>
          <img alt='' src={this.state.imgUrl}/>
        </div>
      </div>
    );
  }
};

export default Meme;
