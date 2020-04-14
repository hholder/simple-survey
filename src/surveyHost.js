import React from 'react';
import { Survey } from './survey.js';
import './survey.css';

var getReq = null;

class SurveyHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyId: props.surveyId,
      survey: new Survey({items: []}),
      error: null,
    }

    this.loadData.bind(this.loadData);
    this.loadData();
  }

  async loadData() {
    getReq = new XMLHttpRequest();
    getReq.owner = this;
    getReq.responseType = "json"
    var url = 'http://localhost:3001/surveys?surveyId=' + this.state.surveyId;   
    getReq.open('GET', url, true);  
    getReq.onreadystatechange = this.handleLoadDataResponse;
    getReq.send();
  }

  handleLoadDataResponse() {
    if (getReq.readyState === XMLHttpRequest.DONE) {
      var getRsp = getReq.response;
  
      var survey = new Survey(getRsp.survey);
      if (survey) {
        this.owner.setState({
          survey: survey
        })
      }
    }
  }

  render() {
    var content = null;
    if (this.state.error) {
      content = this.state.error.stack;
    } else {
      content = this.state.survey.render();
    }

    return(
      <div className='survey-host'>
        <div className='survey-host-header'>
          <h1 className="survey-h1">Welcome to Simple Survey</h1>
        </div>
        <div className='survey-host-body'>
          <div>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default SurveyHost;