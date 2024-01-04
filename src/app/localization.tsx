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