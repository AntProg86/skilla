import React from 'react';
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { rootReducer } from './store/rootReducer';

import Application from './app';

//const root = document.getElementById('root');
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

if (root) {
  {
    root.render(
      <Provider store={ rootReducer }>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );
  } 
}