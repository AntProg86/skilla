import React, { useEffect, useContext, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
//import './styles.scss';
import { ICall, TableSections } from '../../types';
import { postRecordFetch } from '#api/actions';
import { AppContext } from '#src/app/context';
import MusicPlayer from '../music-player';
import { tr } from 'date-fns/locale';
import { getDate } from '#src/functions/date';
import './styles.scss';

type Props = {
  children: any;
  observableList?:Array<ICall>;
  tableSections?:Array<TableSections>;
};

const CellDuration: React.FunctionComponent<{record_id:string, partnership_id:string}> = ({record_id, partnership_id}) => {

  //const [ObservableObject, setObsOb] = useState<React.ReactNode>(<></>);
  const [track, setTrack] = useState();
  const _appContext = useContext(AppContext);

  useEffect(()=>{
    _appContext.doFetch(postRecordFetch,
      {
        // record: 'MToxMDA2NzYxNToxOTQ0MDE2NjI1Mzow', 
        // partnership_id: '578',
        record: record_id, 
        partnership_id: partnership_id,
     }).then((data:any) => {   
      const {payload, error} = data;
      // console.log('*-*-*--*-*-*data');
      // console.log(data);
      
      if (payload){
        
        // console.log('*-*-*-*-*payload');
        // console.log(payload);
        setTrack(payload)
      }
      
      // Очищаем сообщение
      //dispatch(ActionMainLoadPanelMessage(''));
      // Скрываем индикацию загрузки на весь экран
      //dispatch(ActionMainLoadPanelShow(false));
    });

    // let url = `https://api.skilla.ru/mango/getRecord?record=MToxMDA2NzYxNToxOTQ0MDE2NjI1Mzow&partnership_id=578`;
    // let requestOptions = {
    //   headers: {
    //     'Authorization': 'Bearer testtoken',
    //     'Content-type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
    //     'Content-Transfer-Encoding': 'binary',
    //     'Content-Disposition': 'filename="record.mp3"'
    //   },
    // } as any;
    // // Определяем метод запроса
    // requestOptions["method"] = 'POST';
 
    // fetch(url, requestOptions)
    // .then(response => response.blob())
    // .then(blob => {
    //   console.log('*-*-*-*blod');
    //   console.log(blob);
    //   //setTrack(URL.createObjectURL(blob))
    //   // changeState((state) => ({ 
    //   // ...state, 
    //   //  track: track_1//URL.createObjectURL(blob) 
    //   // }))
    // })
  },[]);
  
  return(
    <MusicPlayer track={track}/>
  )
};

const CallTable: React.FunctionComponent<Props> = ({observableList, tableSections, children}) => {
  //console.log('*-*--*render Table');
  
  return(
    <div className='call_list__table_container'>
      <table className='call_list__table'>
        <thead>
          <tr>
            {children}
          </tr>
        </thead>

        <tbody>
          {tableSections &&
            tableSections.map((sect, index)=>(
              <React.Fragment key={getDate(sect.date)}>
                <tr  className='call_list__table__section_separator'>
                  <td colSpan={7}>
                    <div className='call_list__table__date_and_count_row'>
                      <var>
                        {getDate(sect.date)}
                        <sup>
                          {sect.totalRows}
                        </sup>
                      </var>
                    </div>
                  </td>
                </tr>
                {sect.observableList &&
                  sect.observableList.map((call)=>(
                    <tr key={call.id}>
                      <td>
                        <img src={call.type.toString()} alt="" />
                      </td>
                      <td>{call.time}</td>
                      <td>
                        <img className='person_avatar_img' src={call.person_avatar} alt="" />
                      </td>
                      <td>{call.call}</td>
                      <td className='text-color-1'>{call.source}</td>
                      <td>{call.assessment()}</td>
                      <td>
                        {call.record !== "" ? (
                          <div>
                            <CellDuration record_id={call.record} partnership_id={call.partnership_id}/>
                          </div>
                        ) : (
                          <>{call.duration}</>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </React.Fragment>
            ))

          }
          {/* 16.01.2024 */}
          {/* {observableList &&
            observableList.map((call)=>(
              <tr key={call.id}>
                <td>
                  <img src={call.type.toString()} alt="" />
                </td>
                <td>{call.time}</td>
                <td>
                  <img className='person_avatar_img' src={call.person_avatar} alt="" />
                </td>
                <td>{call.call}</td>
                <td className='text-color-1'>{call.source}</td>
                <td>{call.assessment()}</td>
                <td>
                  {call.record !== "" ? (
                    <div>
                      <CellDuration record_id={call.record} partnership_id={call.partnership_id}/>
                    </div>
                  ) : (
                    <>{call.duration}</>
                  )}
                </td>
              </tr>
            ))
          } */}
        </tbody>
      </table>
    </div>
  );
};
    
export default React.memo(CallTable);