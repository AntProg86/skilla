import React, { useEffect, useContext, useState, useCallback} from 'react';
import useSound from "use-sound"; //для работы со звуком
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';

const IconDownload = () => {
  return(
    <>
      <svg className='music_player__downloadButton' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 20H19V18.1176H6V20ZM19 9.64706H15.2857V4H9.71429V9.64706H6L12.5 16.2353L19 9.64706Z" fill="#ADBFDF"/>
      </svg>
    </>
  )
}

const IconClose = () => {
  return(
    <>
      <svg className='music_player__closeButton' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_20502_11570)">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#ADBFDF"/>
        </g>
        <defs>
        <clipPath id="clip0_20502_11570">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </>
  )
}

type Props = {
  track?:any;
}

const track_1 = require("./04. Раб страха.mp3");

const MusicPlayer: React.FunctionComponent<Props> = ({track}) => {
  console.log('*-*-*-**Track Render');
  
  // console.log('*-*-*-*track_1');
  // console.log(track_1);
  // console.log('*-*-*-*-*track');
  // console.log(track);
  
  
  //const [track1?, setTrack] = useState(undefined)
  
  const getTrack_1 = () => {
    const track_1 = require("./04. Раб страха.mp3");
    const track_2 = require("./07. Бой продолжается.mp3");
    return track_1
  }
  
  const getTrack = useCallback(()=>{
    console.log('*-*-*-*getTrack');
    console.log(track);

    const track_1 = require("./04. Раб страха.mp3");
    const track_2 = require("./07. Бой продолжается.mp3");
    
    if(track !== undefined){
      return track
      //return track_2
      
    }
    
    return track_1
  },[track]);

  const [track1, setTrack] = useState();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(getTrack());

  //текущее положение звука в минутах и секундах
  const [currTime, setCurrTime] = useState({
    min: 0,
    sec: 0,
  });

  const [Time, setTime] = useState({
    min: 0,
    sec: 0,
  });

  // текущая позиция звука в секундах
  const [seconds, setSeconds] = useState();
  
  useEffect(()=> {
    const sec = duration / 1000;
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    const time = {
      min: min,
      sec: secRemain
    }
    setTime(time);

  },[sound])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (sound) {
  //       setSeconds(sound.seek([])); // устанавливаем состояние с текущим значением в секундах
  //       const min = Math.floor(sound.seek([]) / 60);
  //       const sec = Math.floor(sound.seek([]) % 60);
  //       setCurrTime({
  //         min,
  //         sec,
  //       });
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [sound]);
  
  const playingButton = () => {
    //console.log('*-*-*-*-*playingButton');
    //console.log(track);
    if (isPlaying) {
      pause(); // приостанавливаем воспроизведение звука
      setIsPlaying(false);
    } else {
      play(); // воспроизводим аудиозапись
      setIsPlaying(true);
    }
  };
  
  const test = () => {
    // console.log('*-**-*-*-test');
    // console.log(track_1);
  }
  
  return (
    <div className='music_player__container'>
      <section>
        <div className="music_player__component">

          <div>
            {!isPlaying ? (
              <button className="music_player__playButton" onClick={playingButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="white"/>
                  <path d="M9.28742 7.06938C9.3761 7.02316 9.47535 7 9.57475 7C9.67389 7 9.77311 7.02316 9.86218 7.06938L16.7125 11.5519C16.8901 11.6442 17 11.8152 17 12.0001C17 12.1849 16.8904 12.3559 16.7125 12.4481L9.86218 16.9308C9.68439 17.0231 9.46523 17.0231 9.28757 16.9308C9.10976 16.8382 9 16.6672 9 16.4825V7.51755C9 7.33278 9.10958 7.16182 9.28742 7.06938Z" fill="#002CFB"/>
                </svg>
              </button>
            ) : (
              <button className="music_player__playButton" onClick={playingButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="white"/>
                  <path d="M8 16H10.6667V8H8V16ZM13.3333 8V16H16V8H13.3333Z" fill="#002CFB"/>
                </svg>

              </button>
            )}
          </div>
          <div className="music_player__time">
            {/* <p>
              {currTime.min}:{currTime.sec}
            </p>
            <p>
              {Time.min}:{Time.sec}
            </p> */}
            <p>{currTime.min}:{currTime.sec}/{Time.min}:{Time.sec}</p>
          </div>

          {/* полоса воспроизведения */}
          <div className='music_player__range'>
            <input
              type="range"
              min={0}
              max={duration / 1000}
              //default="0"
              value={seconds}
              className="music_player__timeline"
              onChange={(e) => {
                sound.seek([e.target.value]);
              }}
            />
          </div>

          <IconDownload/>
          <IconClose/>
          
        </div>
      </section>
    </div>
  );
};
    
export default React.memo(MusicPlayer);