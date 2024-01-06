import React, { useEffect, useContext, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { AppContext } from '#src/app/context';
import { getCurrencyRateFetch, getPlanetFetch } from '#src/app/actions';
import { ActionSetErrorMessageAbsolute } from '#src/components/errorAbsolute/reducer';
import { postCallListFetch } from '#api/actions';

import {
  vector_incoming,
  vector_missed_call,
  vector_missed,
  vector_outgoing,
} from './pictures/pictures';

import data from '../../data/data.json'

import { 
  ICall,
  in_out,
  call_status,
  call_type,
  assessment,
 } from './types';

type State = {
  observableList?: Array<ICall>;
};

const initState = {
  //observableList: new Array<ICall>()
};

type Props = {

}

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

//Получить время из даты формата «гггг-мм-дд чч:мм:сс»
const getTime = (date:string) => {
  return  date.slice(date.indexOf(' ') + 0,-3)
};

const getRandomInteger = (min:number, max:number) => {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const getAssessment = () => {

  let _random_num = getRandomInteger(0, 3);
  
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

  return(
    <></>
  )
}

const getObservableListItem = (arr:any[]):ICall => {

  return 
}
const getObservableList = (arr:any[]):ICall[] => {
  const _list = new Array<ICall>();
  
  for(let i=0; i<10; i++){
    _list.push({
      type: getVectorIcon(arr[i]),
      time: getTime(arr[i].date),
      person_avatar: arr[i].person_avatar,
      call: arr[i].in_out === in_out.incoming ? arr[i].from_number : arr[i].to_number,
      source: arr[i].source,
      assessment: assessment.excellent,
      duration: arr[i].time,

    })
  }
  
  return _list;
}

const MainPage: React.FunctionComponent<Props> = () => {

  const _appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const [state, changeState] = useState<State>(initState);

  useEffect(()=>{
    console.log('*-*-*-*-*useEffect');
    console.log(data);
    
    changeState((state) => ({ 
    ...state, 
     observableList: getObservableList(data.results)
    }))
    
  },[]);

  const showError = () => {
    //console.log('*-*-*-*showError');
    dispatch(ActionSetErrorMessageAbsolute('some error'))
    
  };

  const getCallList = () => {
    console.log('*-*-*-**getCallList');
    _appContext.doFetch(postCallListFetch, {})
    .then((data:any) => {   
      const {payload, error} = data;
      console.log('*-*-*--*-*-*data');
      console.log(data);
      
      if (payload){
        
        console.log('*-*-*-*-*payload');
        console.log(payload);
        
      }
      
      // Очищаем сообщение
      //dispatch(ActionMainLoadPanelMessage(''));
      // Скрываем индикацию загрузки на весь экран
      //dispatch(ActionMainLoadPanelShow(false));
    });
  }

  const test = () => {
    console.log('-*-*-*-test');
    console.log(call_type.incoming);
    
  }
  
  return (
    <main className='call_list__main'>
      <div className='call_list__container'>

        <section>
          <div className='call_list__table_container'>
            <table className='call_list__table'>
              <thead>
                <tr>
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
                    {LocalizedStrings.duration}
                  </td>
                </tr>
              </thead>

              <tbody>
                {state.observableList &&
                  state.observableList.map((call)=>(
                    <tr>
                      <td>
                        <img src={call.type.toString()} alt="" />
                      </td>
                      <td>{call.time}</td>
                      <td>
                        <img className='person_avatar' src={call.person_avatar} alt="" />
                      </td>
                      <td>{call.call}</td>
                      <td>{call.source}</td>
                      <td>{getAssessment()}</td>
                      <td>{call.duration}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
         
        </section>
        <div onClick={test}>
          test
        </div>
      </div>
    </main>
  );
};
    
export default React.memo(MainPage);