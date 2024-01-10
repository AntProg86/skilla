import React, { useEffect, useContext, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
//import './styles.scss';
import { ICall } from '../types';

type Props = {
  children: any;
  observableList?:Array<ICall>;
}

const CallTable: React.FunctionComponent<Props> = ({observableList, children}) => {
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
          {observableList &&
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
                <td>{call.duration}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
    
export default React.memo(CallTable);