import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SurveyHost from './surveyHost';
import SurveyCreator from './surveyCreator';
import * as serviceWorker from './serviceWorker';



let search = window.location.search;
let params = new URLSearchParams(search);
let surveyId = params.get('surveyId');

//ReactDOM.render(<SurveyHost surveyId={surveyId} />, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
