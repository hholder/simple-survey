import React from 'react';
import './survey.css';

class SurveyList extends React.Component {
  _getReq = null;

  constructor(props) {
    super(props);
    this.state = {
      surveyDataCollection: []
    }

    this.loadData = this.loadData.bind(this);
    this.handleLoadDataResponse = this.handleLoadDataResponse.bind(this);

    this.loadData();
  }  

  async loadData() {
    this._getReq = new XMLHttpRequest();
    this._getReq.responseType = "json"
    var url = 'http://localhost:3001/surveyList';   
    this._getReq.open('GET', url, true);  
    this._getReq.onreadystatechange = this.handleLoadDataResponse;
    this._getReq.send();
  }

  handleLoadDataResponse() {
    if (this._getReq.readyState === XMLHttpRequest.DONE) {
      var getRsp = this._getReq.response;
  
      if (getRsp) {
        for (var i = 0; i < getRsp.length; i++) {
          var surveyData = getRsp[i];
          if (surveyData) {
            var surveys = this.state.surveyDataCollection.concat(surveyData);
            this.setState({
              surveyDataCollection: surveys
            })
          }
        }
      }
    }
  }

  render() {
    var surveyListContent = []
    for (var i = 0; i < this.state.surveyDataCollection.length; i++) {
      var surveyId = this.state.surveyDataCollection[i].surveyId;
      var surveyUrl = '/complete?surveyId=' + surveyId;

      var item =
        <div className="survey-list-item" key={surveyId}>
          <h2 className="survey-h2"><a href={surveyUrl}>{this.state.surveyDataCollection[i].survey.name}</a></h2>
          <p className="survey-desc-p">{this.state.surveyDataCollection[i].survey.description}</p>
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