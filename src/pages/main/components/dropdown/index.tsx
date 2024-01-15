import React, { useEffect, useContext, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalizedStrings from '#src/app/localization';
import './styles.scss';
import { useClickOutside } from '../../../../functions/hooks';
import { ArrowDown, ArrowUP } from '../../pictures/svg';

export type DropdownOption = {
  id: number;
  value: React.ReactNode | string;
}

type Props = {
  selected:DropdownOption;
  setSelected:(option:DropdownOption)=>void;
  options: DropdownOption[],
  defaultValue?: DropdownOption,
}

const Dropdown: React.FunctionComponent<Props> = ({
  selected,
  setSelected,
  options,
  defaultValue

}) => {
  //console.log('*-*-*-*Dropdown*-*-**Render');
  
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
            <>{defaultValue.value}</>
          ) : (
            <>{selected.value}</>
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
            <div key={option.id} 
                 className={option === selected ? 'dropdow-item current-option-color' : 'dropdow-item'}
                 onClick={
                  (e)=>{
                    setSelected(option)
                    setIsActive(false)
                  }}>
              <>{option.value}</>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
    
export default React.memo(Dropdown);