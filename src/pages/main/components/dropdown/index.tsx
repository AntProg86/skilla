import React, { useEffect, useContext, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { useClickOutside } from '../../../../utils/hooks';
import { ArrowDown, ArrowUP } from '../../pictures/svg';

type Props = {
  selected:any;
  setSelected:any;
  options: string[],
  defaultValue?: string,
}

const Dropdown: React.FunctionComponent<Props> = ({
  selected,
  setSelected,
  options,
  defaultValue

}) => {
  const [isActive, setIsActive] = useState(false);
  const refDropdow = useRef(null);

  useClickOutside(refDropdow, ()=>{
    if(isActive === true)
      setIsActive(false)
  })

  return(
    <div className="dropdow" ref={refDropdow}>
      <div className="dropdow-btn" onClick={(e)=>setIsActive(!isActive)}>
        <div>
          {defaultValue !== undefined ? (
            <>{defaultValue}</>
          ) : (
            <>{selected}</>
            
          )}
        </div>
        {isActive === false ? (
          <ArrowDown/>
        ) : (
          <ArrowUP/>
        )}
      </div>
      {isActive &&
        <div className="dropdow-content">
          {options.map(option => (
            <div key={option} 
                 className={option === selected ? 'dropdow-item current-option-color' : 'dropdow-item'}
                 onClick={
                  (e)=>{
                    setSelected(option)
                    setIsActive(false)
                  }}>
              {option}
            </div>
          ))}
        </div>
      }
    </div>
  )
}
    
export default React.memo(Dropdown);