// Приведение Date к строке и форматирование к виду yyyy-mm-dd
export  const getDate = (inputDate:Date|undefined|string|null, format: string = 'yyyy-mm-dd') => {   
  if (!inputDate) return "";
  const date = new Date(inputDate);
  const day = ("0" + date.getDate()).slice(-2); 
  const month = ("0" + (date.getMonth() + 1)).slice(-2); 

  if(format === 'dd-mm-yyyy'){
    return (day + "-" + month + "-" + ("0000" + date.getFullYear()).slice(-4)); 
  }

  return ("0000" + date.getFullYear()).slice(-4)  + "-" + (month) + "-" + (day);
}

//Добавить к дате дни
export const addDays = (date: Date, value: number) => {
  let offset = date.getTimezoneOffset(),
      d2 = new Date(date.valueOf() + value * 86400000),
      diff = (offset - d2.getTimezoneOffset()) * 60000;
  return diff ? new Date(d2.getTime() - diff) : d2;
}

//получить время формата: чч:мм:сс | мм:сс из секунд
//return [ '00:01', '00:01:35' ]
export const getTimeFromSeconds = (sec:number) => {
  let frm = new Intl.DateTimeFormat('ru', {minute: '2-digit', second: '2-digit'});
  let dat = new Date(null);
  dat.setSeconds(sec + dat.getTimezoneOffset() * 60);
  return [frm.format(dat), dat.toLocaleTimeString()];
};