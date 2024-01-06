import {
  vector_incoming,
  vector_missed_call,
  vector_missed,
  vector_outgoing,
} from './pictures/pictures';

export enum in_out {
  incoming = 1,
  outgoing = 0
};

export enum call_status {
  successful = 'Дозвонился',
  fail = 'Не дозвонился'
};

export enum call_type {
  /**входящий */
  incoming = vector_incoming,
  /**исходящий */
  outgoing = vector_outgoing,
  /**пропущенный */
  missed = vector_missed,
  /**недозвон */
  missed_call = vector_missed_call
};

export enum assessment {
  'excellent',
  'good',
  'bad'
}

export interface ICall {
  
  /**Тип 
   * -> incoming - входящий
   * -> outgoing - исходящий
   * -> missed - пропущенный
   * -> missed_call - недозвон
  */
  type: call_type;
  
  //**Время */
  time: string;

  /**Сотрудник */
  person_avatar: string;

  /**Звонок */
  call: string;

  /** Источник*/
  source: string;

  /**Оценка 
   * -> excellent - отлично
   * -> good - хорошо
   * -> bad - плохо
  */
  //assessment: 'excellent' | 'good' | 'bad';
  assessment: assessment;

  /**длительность */
  duration: string;
  
  //--------------------------------------
  
  /**Признак входящего или исходящего звонка */
  in_out?: in_out;

  //**дата и время звонка */
  data?: Date;

  /**номер с которого был звонок */
  from_number?: string;
  
  /**номер на который был звконок */
  to_number?: string;

  /**статус звонка 
   * Возможные значения:
   * Не дозвонился
   * Дозвонился*/
  status?: call_status;
}