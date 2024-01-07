import React, { useEffect, useContext, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
//import './styles.scss';
import { ICall } from '../types';

type Props = {
  observableList:Array<ICall>;
  filterInOut: string;
}

const CallTable: React.FunctionComponent<Props> = ({observableList,filterInOut}) => {
  console.log('*-*--*render');
  
  return(
    <div className='call_list__table_container'>
      <table className='call_list__table'>
        <thead>
          <tr>
            <td className='call_list__table__col_1'>
              {LocalizedStrings.type}{filterInOut}
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