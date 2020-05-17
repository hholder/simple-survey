import React from 'react';
import { Survey } from './survey.js';
import './survey.css';

var getReq

class SurveyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surveys: []
    }

    this.loadData.bind(this.loadData);
    this.loadData();
  }  

  async loadData() {
    getReq = new XMLHttpRequest();
    getReq.owner = this;
    getReq.responseType = "json"
    var url = 'http://localhost:3001/surveyList';   
    getReq.open('GET', url, true);  
    getReq.onreadystatechange = this.handleLoadDataResponse;
    getReq.send();
  }

  handleLoadDataResponse() {
    if (getReq.readyState === XMLHttpRequest.DONE) {
      var getRsp = getReq.response;
  
      if (getRsp) {
        for (var i = 0; i < getRsp.length; i++) {
          var surveyData = getRsp[i];
          if (surveyData) {            
            var survey = new Survey(surveyData);
            var surveys = this.owner.state.surveys.concat(survey);
            if (survey) {
              this.owner.setState({
                surveys: surveys
              })
            }
          }
        }
      }
    }
  }

  render() {
    var surveyListContent = []
    for (var i = 0; i < this.state.surveys.length; i++) {
      var surveyId = this.state.surveys[i].state.surveyId;
      var surveyUrl = '/complete?surveyId=' + surveyId;

      var item =
        <div className="survey-list-item" key={surveyId}>
          <h2 className="survey-h2"><a href={surveyUrl}>{this.state.surveys[i].state.name}</a></h2>
          <p className="survey-desc-p">{this.state.surveys[i].state.description}</p>
        </div>

        surveyListContent = surveyListContent.concat(item);
    }

    return (
      <div className="survey-list">
        {surveyListContent}
      </div>
    )
  }
}

export default SurveyList