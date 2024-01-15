import React, { useEffect, useContext, useState, useCallback, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { AppContext } from '#src/app/context';
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
import { IconCalendar, ArrowLeft, ArrowRight } from './pictures/svg';
import Dropdown, {DropdownOption} from './components/dropdown';
import { getDate, getMonth, getTimeFromSeconds, getWeek, getYear, takeAwayDays } from '#src/functions/date';
import MusicPlayer from './components/music-player';

type State = {
  startDate?: Date;
  endDate?: Date;

  //Список звонков на экране
  observableList?: Array<ICall>;
  
  //Текущие значение фильтра
  filterInOutSelected: string;

  //Сортировка по продолжительности или дате звонка
  filterDurationSelected?: string;

  //Выбранный пользователем период дат
  dateOptionSelected?: DropdownOption//React.ReactNode;
  
  track?: any;

  //Признак входящего или исходящего звонка
  // 1 - входящий звонок
  // 0 - исходящий звонок
  // пусто - все звонки
  in_out?: number;

  //Сортировка, возможные значения: date и duration
  sort_by?: undefined | 'duration' | 'date';
};

const initState = {
  filterInOutSelected: LocalizedStrings.all_type,
};

type Props = {

};

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

//Значения для сортировки по дате или продолжительности
const durationFilterList = [
  {
    id: 1,
    value: LocalizedStrings.sort_by_date
  },
  {
    id: 2,
    value: LocalizedStrings.sort_by_duration
  }
];

//Значения для сортировки входящие/исходящие
const filterInOutList = [
  {
    id: 1,
    value: LocalizedStrings.all_type,
  },
  {
    id: 2,
    value: LocalizedStrings.incoming,
  },
  {
    id: 3,
    value:  LocalizedStrings.outgoing,
  }
];

//#endregion

const track_1 = require("./components/music-player/04. Раб страха.mp3");
const track_2 = require("./components/music-player/07. Бой продолжается.mp3");

const MainPage: React.FunctionComponent<Props> = () => {

  const _appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const [state, changeState] = useState<State>(initState);


  //Значения для выборки по датам
  const dateSelectorList:DropdownOption[] = [
    {
      id : 0,
      value :  
      <>
        <IconCalendar/>
        <p>{LocalizedStrings.three_days}</p>
      </>,
    },
    {
      id : 1,
      value :  
      <>
        <IconCalendar/>
        <p>{LocalizedStrings.week}</p>
      </>,
    },
    {
      id: 2,
      value: 
      <>
        <IconCalendar/>
        <p>{LocalizedStrings.month}</p>
      </>,
    },
    {
      id: 3,
      value:
      <>
        <IconCalendar/>
        <p>{LocalizedStrings.year}</p>
      </>
    },
    {
      id: 4,
      value: 
      <>
        <div className='indicate_dates'>
          <p>{LocalizedStrings.indicate_dates}</p>
          {/* <p>{LocalizedStrings.date_from}</p> */}
          <div onClick={(e)=>{e.stopPropagation()}}>
            <DatePicker
              selected={state.startDate}
              onChange={(date)=>changeStartDate(date)}
              dateFormat='dd.MM.yyyy'
              //placeholderText='Start Date'
              // showIcon
              // icon={<IconCalendar/>}
              locale={ru}
            />
            {/* <p>{LocalizedStrings.date_to}</p> */}
            <DatePicker
              selected={state.endDate}
              onChange={(date)=>changeEndDate(date)}
              dateFormat='dd.MM.yyyy'
              //placeholderText='Start Date'
              // showIcon
              // icon={<IconCalendar/>}
              locale={ru}
            />
          </div>
        </div>
      </>
    }
  ];
  
  useEffect(()=>{
    console.log('*-*-*-*-*useEffect');
    // console.log(data);
    
    changeState((state) => ({ 
    ...state, 
      startDate: new Date(),
      endDate: new Date(),
      dateOptionSelected: dateSelectorList[0],
     //observableList: getObservableList(data.results)
    }))
    
  },[]);

  //Получить список по датам
  useEffect(()=>{
    if(state.startDate && state.endDate && state.startDate <= state.endDate){
      //console.log('*-*-*-*-Date');
      getCallList()
    }
  },[
    state.startDate,
    state.endDate,
    state.in_out,
    state.sort_by,
  ]);

  const showError = () => {
    //console.log('*-*-*-*showError');
    dispatch(ActionSetErrorMessageAbsolute('some error'))
    
  };

  //Получить список звонков с сервера
  const getCallList = () => {
    console.log('*-*-*-**getCallList');
    console.log(state.sort_by);
    
    _appContext.doFetch(postCallListFetch,
       {
        date_start: getDate(state.startDate), 
        date_end: getDate(state.endDate),
        in_out: state.in_out === undefined ? null : state.in_out, 
        sort_by: state.sort_by === undefined ? null : state.sort_by
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
     startDate: date,
    }));
  };

  //Пользователь изменил дату «По»
  const changeEndDate = (date:Date) => {
    changeState((state) => ({ 
    ...state, 
      endDate: date 
    }));
  };

  //Получить значение для переменной «state.in_out»
  const getInOutValue = (filterInOutSelected: string ) => {

    //Показать все
    if(filterInOutSelected === filterInOutList[0].value){
      return undefined;
    }

    //Входящие
    if(filterInOutSelected === filterInOutList[1].value){
      return 1;
    }

    //Исходящие
    if(filterInOutSelected === filterInOutList[2].value){
      return 0;
    }
  };

  //Получить значение для переменной «state.sort_by
  const getFilterDurationValue = (filterDurationSelected: string): undefined | 'duration' | 'date' => {

    //продолжительность
    if(filterDurationSelected === durationFilterList[0].value){
      return 'date';
    }

    //дата
    if(filterDurationSelected === durationFilterList[1].value){
      return 'duration';
    }
    
    return undefined;
  };

  //Пользователь изменил фильтр: Все / Входящие / Исходящие
  const changeFilterInOutSelected = (value:DropdownOption) => {
    changeState((state) => ({ 
    ...state, 
     filterInOutSelected:value.value.toString(),
     in_out: getInOutValue(value.value.toString())
    }));
  };

  //Пользователь выбрал сортировку по дате или продолжительности
  const changeFilterDurationDate = (value:DropdownOption) => {
    changeState((state) => ({ 
    ...state, 
     filterDurationSelected:value.value.toString(),
     sort_by: getFilterDurationValue(value.value.toString())
    }));
  };

  //Сбросить фильтр «Входящие/ исходящие»
  const resetFilter = () => {
    changeState((state) => ({ 
      ...state, 
      filterInOutSelected: filterInOutList[0].value,
      in_out: undefined
    }));
  };

  //Сбросить сортировку по дате или продолжительности
  const resetDurationDateFilter = () => {
    changeState((state) => ({ 
    ...state, 
      filterDurationSelected:undefined, 
      sort_by: undefined
    }));
  };

  //Изменить период дат
  const changeDateOptionSelected = (value:DropdownOption) => {
    changeState((state) => ({ 
    ...state, 
      dateOptionSelected: value
    }));
  };

  //Установить даты в соответствии с выбором пользователя
  useEffect(()=>{
    //return
    if(state.dateOptionSelected === undefined) return;
    
    //3 дня
    if(state.dateOptionSelected.id === 0){
      const _date = takeAwayDays(new Date(), 3);
      
      changeState((state) => ({ 
      ...state, 
       startDate: new Date(),
       endDate: _date
      }));
    }
    
    //Неделя
    if(state.dateOptionSelected.id === 1){
      const _dates = getWeek(new Date());
      
      changeState((state) => ({ 
      ...state, 
       startDate: _dates[0],
       endDate: _dates[1]
      }));
    }

    //Месяц
    if(state.dateOptionSelected.id === 2){
      const _dates = getMonth(new Date());
      
      changeState((state) => ({ 
      ...state, 
       startDate: _dates[0],
       endDate: _dates[1]
      }));
    }

    //Год
    if(state.dateOptionSelected.id === 3){
      const _dates = getYear(new Date());
      
      changeState((state) => ({ 
      ...state, 
       startDate: _dates[0],
       endDate: _dates[1]
      }));
    }
  },[state.dateOptionSelected])
  

  //Заголовок колонки «Длительность»
  const DurationColHeader = () => {
    
    return(
      <>
        {state.filterDurationSelected !== undefined &&
          <div className='reset_duration_date_filter'>
            <p>
              {LocalizedStrings.reset_filters}
            </p>
            <div onClick={resetDurationDateFilter}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 0.88125L7.86875 0L4.375 3.49375L0.88125 0L0 0.88125L3.49375 4.375L0 7.86875L0.88125 8.75L4.375 5.25625L7.86875 8.75L8.75 7.86875L5.25625 4.375L8.75 0.88125Z" fill="#ADBFDF"/>
              </svg>
            </div>
          </div>
        }

        <Dropdown
          options={durationFilterList}
          selected={{id: 0, value:LocalizedStrings.duration}}
          setSelected={changeFilterDurationDate}
        />
      </>
    )
  };
  
  const previousDateOptionSelected = () => {
    let _id = state.dateOptionSelected.id + 1;
    if(_id > dateSelectorList.length - 1) _id = 0;
    changeDateOptionSelected(dateSelectorList[_id]);
  };

  const nextDateOptionSelected = () => {
    let _id = state.dateOptionSelected.id - 1;
    if(_id < 0) _id = dateSelectorList.length - 1;
    changeDateOptionSelected(dateSelectorList[_id]);
  };
  
  const test = () => {
    console.log('-*-*-*-test');
    console.log(state.startDate);
    console.log(state.endDate);
    console.log(state.dateOptionSelected);
    
    
    return;
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
          {/* <div onClick={test}>test
          {/* <MusicPlayer track={state.track}/> */}
          <div className='call_list__toolbar__dropdown_container'>
            <Dropdown
              options={filterInOutList}
              selected={{id:0, value:state.filterInOutSelected}}
              setSelected={changeFilterInOutSelected}
            />

            {state.filterInOutSelected !== filterInOutList[0].value &&

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
            <div className='arrow_left_right' onClick={previousDateOptionSelected}>
              <ArrowLeft/>
            </div>
            <Dropdown
              options={dateSelectorList}
              selected={state.dateOptionSelected === undefined ? {id:0, value:''} : state.dateOptionSelected}
              setSelected={changeDateOptionSelected}
            />
            <div className='arrow_left_right' onClick={nextDateOptionSelected}>
              <ArrowRight/>
            </div>
          </div>
        </section>
        
        <section>
          <CallTable 
            observableList={state.observableList}
          >
            <td className='call_list__table__col_1'>
              {LocalizedStrings.type}
            </td>
            <td className='call_list__table__col_2'>
              {LocalizedStrings.time}
            </td>
            <td className='call_list__table__col_3'>
              {LocalizedStrings.person}
            </td>
            <td className='call_list__table__col_4'>
              {LocalizedStrings.call}
            </td>
            <td className='call_list__table__col_5'>
              {LocalizedStrings.source}
            </td>
            <td className='call_list__table__col_6'>
              {LocalizedStrings.assessment}
            </td>
            <td className='call_list__table__col_7'>
                <DurationColHeader/>
            </td>
          </CallTable>
        </section>
      </div>
    </main>
  );
};
    
export default React.memo(MainPage);