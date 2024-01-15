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
};

//Добавить к дате дни
export const addDays = (date: Date, value: number) => {
  let offset = date.getTimezoneOffset(),
      d2 = new Date(date.valueOf() + value * 86400000),
      diff = (offset - d2.getTimezoneOffset()) * 60000;
  return diff ? new Date(d2.getTime() - diff) : d2;
};

//Отнять от даты дни
export const takeAwayDays = (date: Date, value:number) => {
  let offset = date.getTimezoneOffset(),
      d2 = new Date(date.valueOf() - value * 86400000),
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

//Получить дату начала и дату окончания текущей недели
//(неделя начинается с понедельника и заканчивается воскресеньем)
export const getWeek = (date:Date) => {
  // If no date object supplied, use current date
  // Copy date so don't modify supplied date
  let now = date? new Date(date) : new Date();

  // set time to some convenient value
  now.setHours(0,0,0,0);

  // Get the previous Monday
  let monday = new Date(now);
  monday.setDate(monday.getDate() - monday.getDay() + 1);

  // Get next Sunday
  let sunday = new Date(now);
  sunday.setDate(sunday.getDate() - sunday.getDay() + 8);

  // Return array of date objects
  return [monday, sunday];
};

//получить начало и конец текущего месяца
export const getMonth = (date: Date) => {
  let firstDay = new Date(date);
  firstDay.setDate(1);
  
  let lastDay = new Date(date);
  lastDay.setMonth(date.getMonth() + 1);
  lastDay.setDate(1);
  return [firstDay, lastDay];
};

//получить начало и конец текущего года
export const getYear = (date: Date) => {
  let firstDay = new Date(date);
  firstDay.setMonth(0);// Месяц отсчитывается от 0
  firstDay.setDate(1);
  
  let lastDay = new Date(date);
  lastDay.setFullYear(date.getFullYear() + 1);
  lastDay.setMonth(0);// Месяц отсчитывается от 0
  lastDay.setDate(1);
  return [firstDay, lastDay];
};

