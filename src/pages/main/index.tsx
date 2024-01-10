import React, { useEffect, useContext, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { AppContext } from '#src/app/context';
import { getCurrencyRateFetch, getPlanetFetch } from '#src/app/actions';
import { ActionSetErrorMessageAbsolute } from '#src/components/errorAbsolute/reducer';
import { postCallListFetch, postRecordFetch } from '#api/actions';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru';
import CallTable from './components/table';

import data from '../../data/data.json'

import { 
  ICall,
  in_out,
  call_status,
  call_type,
  assessment,
  filterInOut,
 } from './types';
import { IconCalendar } from './pictures/svg';
import Dropdown from './components/dropdown';
import { getDate, getTimeFromSeconds } from '#src/functions/date';
import MusicPlayer from './components/music-player';

type State = {
  startDate?: Date;
  endDate?: Date;

  //Список звонков на экране
  observableList?: Array<ICall>;

  //Фильтр по входящим и исходящим звонкам
  filterInOutList: string[],
  //Текущие значение фильтра
  filterInOutSelected: string;

  track?: any;
};

const initState = {
  filterInOutList: [
    LocalizedStrings.all_type,
    LocalizedStrings.incoming,
    LocalizedStrings.outgoing,
  ],
  filterInOutSelected: LocalizedStrings.all_type,
};

type Props = {

}

//#region func
//Получить иконку для столбца «Тип» (Вызов)
const getVectorIcon = (call:ICall) => {
  let _icon;
  switch(call.in_out){
    case in_out.incoming:
      if(call.status === call_status.successful)
        _icon = call_type.incoming //входщий - успешно
      else
        _icon = call_type.missed //входящий - пропущенный
    break;
    case in_out.outgoing:
      if(call.status === call_status.successful)
        _icon = call_type.outgoing //исходящий - успешно
      else
        _icon = call_type.missed_call //исходящий - недозвон
    break;
  }

  return _icon;
};

//Получить время формата "чч:мм" из даты формата «гггг-мм-дд чч:мм:сс»
const getTime = (date:string):string => {
  return  date.slice(date.indexOf(' ') + 0,-3)
};

//Получить случайное число
const getRandomInteger = (min:number, max:number):number => {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

//Получить оценку
const getAssessment = ():React.JSX.Element => {

  let _random_num = getRandomInteger(0, 4);
  
  if(_random_num === 1){
    return(
      <div className='assessment_excellent'>
        {LocalizedStrings.excellent}
      </div>
    )
  }
  if(_random_num === 2){
    return(
      <div className='assessment_good'>
        {LocalizedStrings.good}
      </div>
    )
  }
  if(_random_num === 3){
    return(
      <div className='assessment_bad'>
        {LocalizedStrings.bad}
      </div>
    )
  }

  if(_random_num === 4){
    return(
      <div className='assessment_script_not_used'>
        {LocalizedStrings.script_not_used}
      </div>
    )
  }

  return(
    <></>
  )
};

//Получить список, который видит пользователь
//arr - массив из API
const getObservableList = (arr:any[]):ICall[] => {
  const _list = new Array<ICall>();
  
  for(let i=0; i<arr.length; i++){
    _list.push({
      id:arr[i].id,
      in_out: arr[i].in_out,
      type: getVectorIcon(arr[i]),
      time: getTime(arr[i].date),
      person_avatar: arr[i].person_avatar,
      call: arr[i].to_number,//arr[i].in_out === in_out.incoming ? arr[i].from_number : arr[i].to_number,
      source: arr[i].source,
      assessment: getAssessment,
      duration: getTimeFromSeconds(arr[i].time)[0],

      record: arr[i].record,
      partnership_id: arr[i].partnership_id,
    })
  }
  
  console.log('-*-*-*-*--*_list');
  console.log(_list);
  
  return _list;
};
//#endregion

const track_1 = require("./components/music-player/04. Раб страха.mp3");
const track_2 = require("./components/music-player/07. Бой продолжается.mp3");

const MainPage: React.FunctionComponent<Props> = () => {

  const _appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const [state, changeState] = useState<State>(initState);

  useEffect(()=>{
    // console.log('*-*-*-*-*useEffect');
    // console.log(data);
    
    changeState((state) => ({ 
    ...state, 
      startDate: new Date(),
      endDate: new Date()
     //observableList: getObservableList(data.results)
    }))
    
  },[]);

  //Получить список по датам
  useEffect(()=>{
    if(state.startDate && state.endDate && state.startDate <= state.endDate){
      //console.log('*-*-*-*-Date');
      getCallList()
    }
  },[state.startDate, state.endDate]);

  const showError = () => {
    //console.log('*-*-*-*showError');
    dispatch(ActionSetErrorMessageAbsolute('some error'))
    
  };

  //Получить список звонков с сервера
  const getCallList = () => {
    //console.log('*-*-*-**getCallList');
    _appContext.doFetch(postCallListFetch,
       {
        date_start: getDate(state.startDate), 
        date_end: getDate(state.endDate),
        in_out: 0,
        sort_by: 'duration' // date и duration
      })
    .then((data:any) => {   
      const {payload, error} = data;
      // console.log('*-*-*--*-*-*data');
      // console.log(data);
      
      if (payload){
        
        // console.log('*-*-*-*-*payload');
        // console.log(payload);
        
        changeState((state) => ({ 
        ...state, 
          observableList: getObservableList(payload.results) 
        }));

        // if(payload.total_rows > 0){

        //   changeState((state) => ({ 
        //   ...state, 
        //    observableList: getObservableList(payload.results) 
        //   }));
        // }
      }
      
      // Очищаем сообщение
      //dispatch(ActionMainLoadPanelMessage(''));
      // Скрываем индикацию загрузки на весь экран
      //dispatch(ActionMainLoadPanelShow(false));
    });
  };

  //Пользователь изменил дату «С»
  const changeStartDate = (date:Date) => {
    changeState((state) => ({ 
    ...state, 
     startDate: date 
    }));
  };

  //Пользователь изменил дату «По»
  const changeEndDate = (date:Date) => {
    changeState((state) => ({ 
    ...state, 
      endDate: date 
    }));
  };

  //Пользователь изменил фильтр: Все / Входящие / Исходящие
  const changeFilterInOutSelected = (value:string) => {
    changeState((state) => ({ 
    ...state, 
     filterInOutSelected:value 
    }));
  };

  const resetFilter = () => {
    changeState((state) => ({ 
      ...state, 
      filterInOutSelected: state.filterInOutList[0] 
    }));
  };

  //фильтр: Показать все / Входящие / Исходящие
  const getObservableListByFilter = useCallback(()=>{
    
    let _arr: ICall[] = new Array<ICall>();

    //Показать все
    if(state.filterInOutSelected === state.filterInOutList[0]){
      _arr = state.observableList
    }

    //Входящие
    if(state.filterInOutSelected === state.filterInOutList[1]){
      _arr = state.observableList.filter(call => call.in_out === in_out.incoming)
    }

    //Исходящие
    if(state.filterInOutSelected === state.filterInOutList[2]){
      _arr = state.observableList.filter(call => call.in_out === in_out.outgoing)
    }

    return _arr;

  },[state.filterInOutSelected, state.observableList]);

  const test = () => {
    console.log('-*-*-*-test');
    //console.log(getDate(state.startDate));
    //getCallList()
    //console.log(getObservableListByFilter());
    //console.log(state.observableList);
    
    let url = `https://api.skilla.ru/mango/getRecord?record=MToxMDA2NzYxNToxOTQ0MDE2NjI1Mzow&partnership_id=578`;
    let requestOptions = {
      headers: {
        'Authorization': 'Bearer testtoken',
        'Content-type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
        'Content-Transfer-Encoding': 'binary',
        'Content-Disposition': 'filename="record.mp3"'
      },
    } as any;
    // Определяем метод запроса
    requestOptions["method"] = 'POST';

    fetch(url, requestOptions)
    .then(response => response.blob())
    .then(blob => {
      console.log('*-*-*-*blod');
      console.log(blob);
    })

    return
    _appContext.doFetch(postRecordFetch,
      {
        record: 'MToxMDA2NzYxNToxOTQ0MDE2NjI1Mzow', 
        partnership_id: '578',
     })
   .then((data:any) => {   
     const {payload, error} = data;

    //  console.log('*-*-*--*-*-*data');
    //  console.log(data);
    
      
      // changeState((state) => ({ 
      // ...state, 
      //  track: payload 
      // }))
    
     if (payload){
      // const ctx = new AudioContext()
      // let audio;
      const url = URL.createObjectURL(payload);
      changeState((state) => ({ 
      ...state, 
       track: url 
      }))
      //   //new Audio(url).play();
      
      //   console.log(url + '.mp3');
      //   const link = document.createElement('a');
      // link.href = URL.createObjectURL(payload);
      // link.download = 'zxczxc.mp3';
      // link.click();
        
      // changeState((state) => ({ 
      // ...state, 
      //   track: track_1
      // }));
      // ctx.decodeAudioData(payload).then((decodedAudio)=>{

      //   console.log('*-*-*decodedAudio');
      //   console.log(decodedAudio);
        
        
        
      //   changeState((state) => ({ 
      //     ...state, 
      //       track: decodedAudio
      //     }));
      // })
      
      
      //   console.log('*-*-*-*-*payload');
      //  console.log(qwe.);
       
       

       // if(payload.total_rows > 0){

       //   changeState((state) => ({ 
       //   ...state, 
       //    observableList: getObservableList(payload.results) 
       //   }));
       // }
     }
     
     // Очищаем сообщение
     //dispatch(ActionMainLoadPanelMessage(''));
     // Скрываем индикацию загрузки на весь экран
     //dispatch(ActionMainLoadPanelShow(false));
   });
    
    
  };
  
  //*-*-*-*-*-*-*-*-*-*-*-*-Render 
  return (
    <main className='call_list__main'>
      <div className='call_list__container'>
        <section className='call_list__toolbar'>
          {/* <div onClick={test}>test</div>
          <MusicPlayer track={state.track}/> */}
          <div className='call_list__toolbar__dropdown_container'>
            <Dropdown
              options={state.filterInOutList}
              selected={state.filterInOutSelected}
              setSelected={changeFilterInOutSelected}
            />

            {state.filterInOutSelected !== state.filterInOutList[0] &&

              <div className='call_list__reset_filters_option'>
              <p>
                {LocalizedStrings.reset_filters}
              </p>
              <div onClick={resetFilter}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.75 0.88125L7.86875 0L4.375 3.49375L0.88125 0L0 0.88125L3.49375 4.375L0 7.86875L0.88125 8.75L4.375 5.25625L7.86875 8.75L8.75 7.86875L5.25625 4.375L8.75 0.88125Z" fill="#ADBFDF"/>
                </svg>
              </div>
              </div>
            }
          </div>
          <div className='call_list__toolbar__date_picker_container'>
            <p>{LocalizedStrings.date_from}</p>
            <DatePicker
              selected={state.startDate}
              onChange={(date)=>changeStartDate(date)}
              dateFormat='dd.MM.yyyy'
              //placeholderText='Start Date'
              showIcon
              icon={<IconCalendar/>}
              locale={ru}
            />
            <p>{LocalizedStrings.date_to}</p>
            <DatePicker
              selected={state.endDate}
              onChange={(date)=>changeEndDate(date)}
              dateFormat='dd.MM.yyyy'
              //placeholderText='Start Date'
              showIcon
              icon={<IconCalendar/>}
              locale={ru}
            />
          </div>
        </section>
        
        <section>
          <CallTable 
            observableList={state.observableList ? getObservableListByFilter : undefined}
          />
        </section>
      </div>
    </main>
  );
};
    
export default React.memo(MainPage);