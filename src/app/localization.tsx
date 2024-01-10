import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';

export interface IStrings extends LocalizedStringsMethods{
  _home: string;
  _about: string;
  language_switches: string;
  title: string;
  generate_error: string;
  in_details: string;
  error: string;
  unknown_error_format: string;
  copy_to_clipboard: string;
  type: string;
  time: string;
  call: string;
  source: string;
  assessment: string;
  excellent: string;
  good: string;
  bad: string;
  duration: string;
  person: string;
  script_not_used: string;
  date_from: string;
  date_to: string;
  all_type: string;
  incoming: string;
  outgoing: string;
  reset_filters: string;
}

// Таблица перевода
let strings: IStrings;
  strings = new LocalizedStrings({
    ru: {
      _home: "Главная",
      _about: "Контакты",
      language_switches: "язык",
      title: "Заголовок",
      generate_error: 'Сгенерировать ошибку',
      in_details: 'Подробно',
      error: 'Ошибка',
      unknown_error_format: 'Неизвестный формат ошибки',
      copy_to_clipboard: 'Скопировать в буфер обмена',
      type: 'Тип',
      time: 'Время',
      call: 'Звонок',
      source: 'Источник',
      assessment: 'Оценка',
      excellent: 'Отлично',
      good: 'Хорошо',
      bad: 'Плохо',
      duration: 'Длительность',
      person: 'Сотрудник',
      script_not_used: 'Скрипт не использован',
      date_from: 'с :',
      date_to: 'по :',
      all_type: 'Все типы',
      incoming: 'Входящие',
      outgoing: 'Исходящие',
      reset_filters: 'Сбросить фильтры',
    },
    // en: {
    //   _home: "Home",
    //   _about: "Contacts",
    //   language_switches: "language",
    //   title: "Title",
    //   generate_error: 'Generate error',
    // },
  });
 
export default strings;