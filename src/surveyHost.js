import React from 'react';
import Survey from './survey.js';
import './survey.css';

var getReq = null;

class SurveyHost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      surveyId: props.surveyId,
      surveyName: "",
      surveyDescription: "",
      surveyItems: [],
      error: null,
    }

    this.loadData = this.loadData.bind(this);
    this.loadData();
  }

  async loadData() {
    if (this.state.surveyId) {
      getReq = new XMLHttpRequest();
      getReq.owner = this;
      getReq.responseType = "json"
      var url = 'http://localhost:3001/surveys?surveyId=' + this.state.surveyId;   
      getReq.open('GET', url, true);  
      getReq.onreadystatechange = this.handleLoadDataResponse;
      getReq.send();
    }
  }

  handleLoadDataResponse() {
    if (getReq.readyState === XMLHttpRequest.DONE) {
      var getRsp = getReq.response;
  
      if (getRsp.survey) {
        this.owner.setState({
          surveyName: getRsp.survey.name,
          surveyDescription: getRsp.survey.description,
          surveyItems: getRsp.survey.items
        });
      }
    }
  }

  render() {

    var survey = {
      name: this.state.surveyName,
      description: this.state.surveySescription,
      items: this.state.surveyItems
    }

    return(
      <div className="survey-host">
        <Survey surveyId={this.state.surveyId} />
      </div>
    );
  }
}

export default SurveyHost;