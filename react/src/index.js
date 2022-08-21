import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "bulma/css/bulma.css";
import "./index.css";
import axios from "axios";
import store from './redux/store'
import { Provider } from 'react-redux'
 
axios.defaults.withCredentials = true;
 
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);