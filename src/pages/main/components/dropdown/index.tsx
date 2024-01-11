import React, { useEffect, useContext, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { useClickOutside } from '../../../../functions/hooks';
import { ArrowDown, ArrowUP } from '../../pictures/svg';

type Props = {
  selected:any;
  setSelected:any;
  options: React.ReactNode[],
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
      <div className="dropdow-btn" >
        <div onClick={(e)=>setIsActive(!isActive)}>
          {defaultValue !== undefined ? (
            <>{defaultValue}</>
          ) : (
            <>{selected}</>
          )}
        
        {isActive === false ? (
          <ArrowDown/>
        ) : (
          <ArrowUP/>
        )}
        </div>
      </div>
      {isActive &&
        <div className="dropdow-content">
          {options.map((option, index) => (
            <div key={index} 
                 className={option === selected ? 'dropdow-item current-option-color' : 'dropdow-item'}
                 onClick={
                  (e)=>{
                    setSelected(option)
                    setIsActive(false)
                  }}>
              <>{option}</>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
    
export default React.memo(Dropdown);