
class serviceApi {
  //public _CONSTANTS: any = CONSTANTS;
    
  // Базовый URL для API
  //_apiURLBase:string = this._CONSTANTS.ConnectData.ApiURL;
  
  //Выполнение запроса
  getResource = async (url:string, requestOptions:object) => {

    return await fetch(`${url}`, requestOptions).then(result => {       
      //Here body is not ready yet, throw promise
      //console.log(result);
      
      if (!result.ok) throw result;
        return {res_body: result.text().then((text) => text ? JSON.parse(text) : {}), res_status: result?.status};
        //return result.text().then((text) => text ? JSON.parse(text) : {});
    })
    .catch(error => {     
      //Here is still promise
      return {res_body: error, res_status: error?.status};
    })
  };

  getResourceBlobBuffer = async (url:string, requestOptions:object, progressBarShow:boolean = true) => {

    return await fetch(`${url}`, requestOptions).then(result => {
      console.log('-*-*--*--result');
      console.log(result);
      
      //Here body is not ready yet, throw promise
      if (!result.ok) throw result;
        return {res_body: result.blob().then(buffer => buffer ? buffer : []), res_status: result?.status};
    })
    .catch(error => {
      //Here is still promise
      return {res_body: error, res_status: error?.status};
    })
  }

  getRequestOptions  = (token?:string) => {
    let requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json', // Ответ приходит в виде json
        
      },
    } as any;
    requestOptions.headers['Content-Type'] = 'application/json';
    //requestOptions.headers['Access-Control-Allow-Origin'] = 'http://localhost:3030';
    // requestOptions.headers['Host'] = '<calculated when request is sent>';
    // requestOptions.headers['Referer'] = '<calculated when request is sent>';
    // requestOptions.headers['Origin'] = '<calculated when request is sent>';
    return requestOptions;
  }
  
  // Проверка на наличие ошибок
    isError = async (res:any, request = '', res_resource?:any) => {

    let resBadRequest:any | string = '';
    let errorMessage = '';

    if (res_resource){
      const {res_body, res_status} = res_resource;
      
      // Если статус ответа не определен, значит связь с сервером отсутствует
      // res.status тут не подходил, так как в объекте с ответом без ошибки он отсутствует. Другая структура
      if (!res_status){
        //return LocalizedStrings.no_connection_to_the_server + '_._\n' + request;
        return 'no connection to the server' + '_._\n' + request;
      }
    }
    
    // Если статус ошибки 401, то есть пользователь неавторизирован, выдаем ошибку о том, что пользователь неавторизирован
    if (res.status === 401){
      errorMessage = '(401 Unauthorized)' + '_._\n' + request;
      return errorMessage;
    }

    // Если ошибка при ответе из API
    if (res.ok === false && res.status && (res.status !== 200)){

      const contentType = res.headers.get('content-type')!;

      if(!contentType){
        errorMessage = 'Сервер возвратил ошибку с кодом: '+ res.status + '_._\n' + request;
        return errorMessage;
      }

      if (contentType?.startsWith('text/plain')){
        resBadRequest = await res.text().then((body:any) => {
          return body;
        });  
      }
      // else if (contentType.startsWith('application/json;')){
      else {
        resBadRequest = await res.json().then((body:any) => {
          return body;
        }); 
      }
    }

    if (resBadRequest !== ''){
      // Выводим первый параметр значение в объекте ошибки
      // Если ошибка является строкой
      if( Object.prototype.toString.call(resBadRequest) == '[object String]' ) {
        errorMessage = resBadRequest + '_._\n' + request;
      }
      // Если ошибка является объектом
      else{

        if(resBadRequest.errors && resBadRequest.title){
            errorMessage = resBadRequest.title + '\n' + JSON.stringify(resBadRequest.errors) + '_._\n' + request;
        }
        else if(resBadRequest.errors){
            //errorMessage =LocalizedStrings.unknown_error + " array error" + + '_._\n' + request;
            errorMessage = 'unknown error' + " array error" + + '_._\n' + request;
        }
        else if(resBadRequest.error){
          errorMessage = resBadRequest.error + '_._\n' + request;
        }
        else{
            //errorMessage = LocalizedStrings.unknown_error + '_._\n' + request;
            errorMessage = 'unknown error' + '_._\n' + request;
        }
        
      }
    }
    
    // Если ошибка не при ответе, а просто допустим обратились к адресу, которого не существует
    if (res.message){
      errorMessage = res.message + '_._\n' + request;
    }

    return errorMessage;
  }

  postCallList = async (address:string, args? : any) => {  
    
    // Получаем заголовки и свойства запроса
    //let requestOptions = this.requestOptionsGet(token);
    let requestOptions = {
      // method: 'GET',
      headers: {
        Accept: 'application/json', // Ответ приходит в виде json
        Authorization: 'Bearer testtoken'
      },
    } as any;
    // Определяем метод запроса
    requestOptions["method"] = 'POST';

    // console.log('*-*-*---*requestOptions');
    // console.log(args);

    const queries = new Array();
    for(var key in args) {
      args[key] === null ? queries.push(`${key}:${args[key]}`) : queries.push(`${key}=${args[key]}`);
    }
    
    const queryString = queries.join('&');
    
    // console.log('*-*-*-*-*-*queryString');
    // console.log(queryString);

    const res_resource = await this.getResource(`${address+'?'}${queryString}`, requestOptions);
    //const res_resource = await this.getResource(`${address}`, requestOptions);
    const res = await res_resource.res_body;
            
    // Проверяем наличие ошибок и если ошибки есть, генерируем exception
    const errorMessage = await this.isError(res, address, res_resource);
    if (errorMessage) throw errorMessage;

    return res
  }

  //Получить запись звонка
  postRecord = async (address:string, args? : any) => {  
    
    // Получаем заголовки и свойства запроса
    //let requestOptions = this.requestOptionsGet(token);
    let requestOptions = {
      // method: 'GET',
      headers: {
        //Accept: 'application/json', // Ответ приходит в виде json
        'Authorization': 'Bearer testtoken',
        'Content-type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
        'Content-Transfer-Encoding': 'binary',
        'Content-Disposition': 'filename="record.mp3"'
      },
    } as any;
    // Определяем метод запроса
    requestOptions["method"] = 'POST';

    // console.log('*-*-*---*requestOptions');
    // console.log(args);

    const queries = new Array();
    for(var key in args) {
      args[key] === null ? queries.push(`${key}:${args[key]}`) : queries.push(`${key}=${args[key]}`);
    }
    
    const queryString = queries.join('&');
    console.log(`${address+'?'}${queryString}`);
    
    const res_resource = await this.getResourceBlobBuffer(`${address+'?'}${queryString}`, requestOptions);
    //const res_resource = await this.getResource(`${address}`, requestOptions);
    const res = await res_resource.res_body;
            
    // Проверяем наличие ошибок и если ошибки есть, генерируем exception
    const errorMessage = await this.isError(res, address, res_resource);
    if (errorMessage) throw errorMessage;

    return res
  }
}



export default new serviceApi()