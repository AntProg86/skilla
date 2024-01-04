import React, { useEffect, useContext, useState} from 'react';
// import { useDispatch, useSelector } from 'react-redux';
//import './styles.css';
import LocalizedStrings from './localization';
import { Link, Route, Routes } from 'react-router-dom';
//import '../../src/re'
import './reset.scss';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { AppContext } from './context';
import MainPage from '#src/pages/main';
import ErrorAbsolutePage from '#src/components/errorAbsolute';

type Props = {

}

const Application: React.FunctionComponent<Props> = () => {

  // useDispatch - получение функции store.dispatch в компоненте. Раньше для вызова action функциональный компонент приходилось оборачивать в вызов connect
  const dispatch = useDispatch();
  
  //Получить токен для авторизации, если нужен
  const getToken = async () => {
    // if (CONSTANTS.authenticationAzureADEasyAuth == 'true'){
    //   return await getTokenAzureADEasyAuth();
    // }
    // if (CONSTANTS.authenticationAzureAD == 'true'){
    //   return await getTokenAzureAD();
    // }
    return Promise.resolve();
  };
  
  const doFetch = async (action:any, agrs:any):Promise<any> => {
    //console.log('*-*-*-*-*-*-*-*-doFetch');

    return await new Promise(
      (resolve)=>{
        getToken().then((accessTokenResponse: any)=>{   

          let args_of_api = {};
        
          Object.assign(args_of_api, agrs, {accessToken: accessTokenResponse?.accessToken})
          
          // console.log('*-*-*-*-*-*-*-*-*-*--*doFetch');
          // console.log(args_of_api);
          
          const a:any = dispatch(action(args_of_api));
          a.then((data:any) => {        
            const {payload, error} = data;
            
            if(error){
              // передаём ошибку в Redux который отобразит ошибку
              //dispatch(ActionSetErrorMessageAbsolute(error.message));
            }
            else if (payload){  
              //console.log('*-*-*-*-*-*-*-*-*-*--*doFetch');
              //console.log(payload);
              
              //return payload
            }
            return resolve(data);
          })
          })
          .catch(function (error:any) {
            console.log('error', error);
            
            //dispatch(ActionSetErrorMessageAbsolute(error.message? error.message : ('Unknown error' + ': doFetch')));   
          })
      }
    );
  };

  return (
    <AppContext.Provider value={
      {
        doFetch: doFetch,
      }} >
    <>
      <header>
        <ul>
          <li>
            {/* <Link to="/">{LocalizedStrings._home}</Link> */}
            <Link to="/">{LocalizedStrings._home}</Link>
          </li>
          &nbsp;||&nbsp;
          <li>
            {/* <Link to="/about">{LocalizedStrings._about}</Link> */}
            <Link to="/about">{LocalizedStrings._about}</Link>
          </li>
          &nbsp;||&nbsp;
          <li>
          </li>
        </ul>
      </header>

      <hr />

      <ErrorAbsolutePage />
      
      {/* Прогресс бар в самом верху страницы. Показывает моменты обращения к API */}
      {/* <ProgressBar id="ProgressBarHeader" animated now={100} className='progress_bar_settings'/> */}
      
      <Routes>
        <Route path={ "/" } element={ <MainPage/> } />
        <Route path={ "/about" } element={ <>AboutPage</> } />

        {/* Перенаправление на главную страницу, если вызванной не существует */}
        <Route path='*' element={ <MainPage/> }/>
      </Routes>
    </>
    </AppContext.Provider>
  );
};
    
export default React.memo(Application);