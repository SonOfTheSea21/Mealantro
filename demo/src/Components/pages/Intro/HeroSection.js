import React from 'react';
import '../../../App.css';
import { Button } from '../../Button';
import './HeroSection.css';


function HeroSection() {
  return (
    <div className='hhero-container'>
      <video src='videos/video-1.mp4' autoPlay loop muted />
      <img src={'/images/Mealantro_Logo1.png'} alt="Logo" className="hh_logo" />
      {/*<h1>MEALANTRO</h1>*/}
      <p>What's cooking?</p>
      <div className='hhero-btns'>
        <Button
          link = '/Login'
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          LOG IN
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;