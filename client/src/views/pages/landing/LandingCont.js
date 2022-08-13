import React from 'react';
// import '../App.css';
import { Button } from './Button';
import './LandingCont.css';

function LandingCont() {
  return (
    <div className='hero-container'>
      {/* <video src='/videos/video-1.mp4' autoPlay loop muted /> */}
      <h1>OPPORTUNITY AWAITS</h1>
      <p>Gain from our perspective</p>
      {/* <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          BLOG <i className='far fa-play-circle' />
        </Button>
      </div> */}
    </div>
  );
}

export default LandingCont;