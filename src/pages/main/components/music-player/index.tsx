import React, { useEffect, useContext, useState, useCallback, useRef} from 'react';
import useSound from "use-sound"; //для работы со звуком
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import ReactPlayer from 'react-player'

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

type State = {
  track?:any;
  start:number,
  end:number,
  loadedSeconds:number,
  playedSeconds:number,
  currTime: {
    min: number | string;
    sec:number | string;
  }
};

const initState = {
  start:0,
  end:0,
  loadedSeconds: 1,
  playedSeconds: 1,
  currTime: {
    min: 0,
    sec: 0
  }
};

type Props = {
  track?:any;
};

const MusicPlayer: React.FunctionComponent<Props> = ({track}) => {
  //console.log('*-*-*-**MusicPlayer Render');

  useEffect(()=>{
    if(track === undefined) return
      changeState((state) => ({ 
      ...state, 
      track:URL.createObjectURL(track) 
    }));
  },[track]);

  //const [track1, setTrack] = useState<any>();
  const [state, changeState] = useState<State>(initState);
  
  const [isPlaying, setIsPlaying] = useState(false);
  //const [play, { pause, duration, sound }] = useSound(track1);
  
  const refPlayer = useRef();

  // текущая позиция звука в секундах
  const [seconds, setSeconds] = useState();

  // useEffect(()=>{
  //   let url = `https://api.skilla.ru/mango/getRecord?record=MToxMDA2NzYxNToxOTQ0MDE2NjI1Mzow&partnership_id=578`;
  //   let requestOptions = {
  //     headers: {
  //       'Authorization': 'Bearer testtoken',
  //       'Content-type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
  //       'Content-Transfer-Encoding': 'binary',
  //       'Content-Disposition': 'filename="record.mp3"'
  //     },
  //   } as any;
  //   // Определяем метод запроса
  //   requestOptions["method"] = 'POST';
 
  //   fetch(url, requestOptions)
  //   .then(response => response.blob())
  //   .then(blob => {
  //     console.log('*-*-*-*blod');
  //     console.log(blob);
  //     //setTrack(URL.createObjectURL(blob))
  //     changeState((state) => ({ 
  //     ...state, 
  //      track: URL.createObjectURL(blob) 
  //     }))
  //   })
  // },[])
  
  const playingButton = () => {
    //console.log('*-*-*-*-*playingButton');
    //console.log(track);
    if (isPlaying) {
      //pause(); // приостанавливаем воспроизведение звука
      setIsPlaying(false);
    } else {
      //play(); // воспроизводим аудиозапись
      setIsPlaying(true);
    }
  };
  
  //Получает время воспроизведения
  const handleProgress = (e:any) => {

    let sec = (e.loadedSeconds - e.playedSeconds).toFixed(0)
    const min = Math.floor(Number(sec) / 60);
    const secRemain = Math.floor(Number(sec) % 60);
    
    changeState((state) => ({ 
    ...state, 
      ...e,
      currTime: {
        min: min < 10 ? '0' + min : min,
        sec: secRemain < 10 ? '0' + secRemain : secRemain
      }
    }))
  };

  //Скачать запись
  const downloadRecord = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(track);
    link.download = 'call record.mp3';
    link.click();
  };

  const test = () => {
    // console.log('*-**-*-*-test');
    // console.log(track_1);
  };
  
  return (
    <div className='music_player__container'>
      {state.track === undefined ? (
        <>{LocalizedStrings.loading_recording}</>
      ) : (
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
            <ReactPlayer 
              url={state.track}
              playing={isPlaying}
              // playIcon={ArrowDown()}
              width='0'
              height='0'
              ref={refPlayer}
              onProgress={handleProgress}
              // width='100%'
              // height='100%'
              //controls={true}
            />
            <p>{state.currTime.min}:{state.currTime.sec}</p>
          </div>

          {/* полоса воспроизведения */}
          <div className='music_player__range'>
            <input
              type="range"
              min={0}
              //max={state.loadedSeconds / 1000}
              max={state.loadedSeconds}
              step={1}
              //default="0"
              value={state.playedSeconds}
              className="music_player__timeline"
              
              onChange={(e) => {
                //sound.seek([e.target.value]);
                if(refPlayer !== undefined){
                  refPlayer.current.seekTo(e.target.value)
                }
              }}
            />
          </div>

          <div onClick={downloadRecord} className='music_player__icon_download'>
            <IconDownload/>
          </div>
          {/* <IconClose/> */}
          
        </div>
      </section>
      )}
      
    </div>
  );
};
    
export default React.memo(MusicPlayer);