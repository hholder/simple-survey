import React from 'react';
import { FreeTextItem, SingleChoiceItem, MultiChoiceItem, Survey } from './survey.js';
import { BrowserRouter as Router, Switch, Route, Link, useParams} from "react-router-dom";
import logo from './logo.svg';
import './survey.css';
import SurveyCreator from './surveyCreator.js';
import SurveyHost from './surveyHost.js';

function App() {

  return (
    <Router>
      <div className="simple-survey">
        <div className="survey-nav-div">
            <ul className="survey-nav-list">
              <li className="survey-nav-list-item">
                <Link to="/">Home</Link>
              </li>
              <li className="survey-nav-list-item">
                <Link to="/create">Create a Survey</Link>
              </li>
              <li className="survey-nav-list-item">
                <Link to="/complete">Complete a Survey</Link>
              </li>
            </ul>
        </div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/complete" render={(props) => Complete(props)} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h1 className="survey-h1">Welcome to Simple Survey</h1>;
}

function Create() {
  return <SurveyCreator />;
}

function Complete(props) {
  var searchParams = new URLSearchParams(props.location.search);  
  var surveyId = searchParams.get('surveyId');
  return <SurveyHost surveyId={surveyId} />;
}

export default App;
