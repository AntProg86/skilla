import React, { useEffect, useContext, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { AppContext } from '#src/app/context';
import { getCurrencyRateFetch, getPlanetFetch } from '#src/app/actions';
import { ActionSetErrorMessageAbsolute } from '#src/components/errorAbsolute/reducer';

type Props = {

}

const MainPage: React.FunctionComponent<Props> = () => {

  const _appContext = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log('*-*-*-*-*useEffect');
    
  });
  
  const getPlanet = () => {

    console.log('*-*-*-*-*-*-*getPlanet');
    
    
    _appContext.doFetch(getPlanetFetch, {})
    .then((data:any) => {   
      const {payload, error} = data;
      // console.log('*-*-*--*-*-*data');
      // console.log(data);
      
      if (payload){
        
        console.log('*-*-*-*-*payload');
        console.log(payload);
        
      }
      
      // Очищаем сообщение
      //dispatch(ActionMainLoadPanelMessage(''));
      // Скрываем индикацию загрузки на весь экран
      //dispatch(ActionMainLoadPanelShow(false));
    });
  };

  const getCurrencyRate = () => {

    console.log('*-*-*-*-*-*-*getCurrencyRate');
    
    
    _appContext.doFetch(getCurrencyRateFetch, {})
    .then((data:any) => {   
      const {payload, error} = data;
      // console.log('*-*-*--*-*-*data');
      // console.log(data);
      
      if (payload){
        
        console.log('*-*-*-*-*payload');
        console.log(payload);
        
      }
      
      // Очищаем сообщение
      //dispatch(ActionMainLoadPanelMessage(''));
      // Скрываем индикацию загрузки на весь экран
      //dispatch(ActionMainLoadPanelShow(false));
    });
  };

  const showError = () => {
    //console.log('*-*-*-*showError');
    dispatch(ActionSetErrorMessageAbsolute('some error'))
    
  };

  const getCallList = () => {
    console.log('*-*-*-**getCallList');
    
  }
  
  return (
    <main className='call_list__main'>
      <div className='call_list__container'>

      </div>
      <div onClick={getCallList}>
        get call list
      </div>
    </main>
  );
};
    
export default React.memo(MainPage);