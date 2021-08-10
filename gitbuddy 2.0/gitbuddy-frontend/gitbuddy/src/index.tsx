import React from 'react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import authReducer from './store/reducers'

const rootReducer = combineReducers({
  user: authReducer
})

const logger = (store: any) => {
  return (next: any) => {
    return (action: any) => {
      // console.log('logger: ', action)
      return next(action)
    }
  }
}

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const composeEnhancers = compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)))



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} > 
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

