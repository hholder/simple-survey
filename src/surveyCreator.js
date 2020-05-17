import React from 'react';
import { FreeTextItem, SingleChoiceItem, MultiChoiceItem, Survey } from './survey.js';
import './survey.css';

class SurveyCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: new Survey({items: []}),
      optionListHidden: true,
      currentItemOptions: []
    }

    this.addOption = this.addOption.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
    this.getOptionList = this.getOptionList.bind(this);
    this.getQuestionList = this.getQuestionList.bind(this);
    this.handleItemTypeChange = this.handleItemTypeChange.bind(this);
  }

  render() {
    return(
      <div className="survey-creator">
        <div className="survey-metadata">
          <div className="input-group">
            <div className="survey-input-item">          
              <label className="survey-label" htmlFor="survey-name">Survey Name:</label>
              <input className="survey-text-input" id="survey-name" type="text" />
            </div>
            <div className="survey-input-item">          
              <label className="survey-label" htmlFor="survey-desc">Survey Description:</label>
              <input className="survey-text-input" id="survey-desc" type="text" />
            </div>
          </div>
          <hr className="item-group-separator" />
          <div className="input-group">
            <div className="survey-input-item">
              <label className="survey-label" htmlFor="item-type">Question Type:</label>
              <select className="survey-combo" id="item-type" onChange={this.handleItemTypeChange}>
                <option value="free-text">Free Text</option>
                <option value="single">Single Choice</option>
                <option value="multi">Multiple Choice</option>
              </select>
            </div>
            <div className="survey-input-item">          
              <label className="survey-label" htmlFor="question-text">Question Text:</label>
              <input className="survey-text-input" id="question-text" type="text" />
            </div>
            {
              this.state.optionListHidden ? null :
                <div className="question-option-input">
                  <div className="survey-input-item">
                    <label className="survey-label" htmlFor="option-text">Option Text:</label>
                    <input className="survey-text-input" id="option-text" type="text" />
                    <input className="survey-add-button" id="add-option" type="button" value="Add Option" onClick={this.addOption} />
                  </div>
                  <div className="survey-input-item">
                    <label className="survey-label" htmlFor="option-list">Options:</label>
                    <select className="option-list" size="10">
                      {this.getOptionList()}
                    </select>
                  </div>            
                </div>
            }
            <input className="survey-add-button" id="add-question" type="button" value="Add Question" onClick={this.addQuestion} />
          </div>
        </div>
        <div className="question-display">
          <div className="survey-input-item">
            <label className="survey-label" htmlFor="question-list">Questions:</label>   
            <select className="question-list" size="35">
              {this.getQuestionList()}
            </select>
            <input className="survey-add-button" id="add-question" type="button" value="Submit Survey" onClick={this.submitSurvey} />
          </div>
        </div>
      </div>
    );
  }

  handleItemTypeChange() {
    var questionType = null;    
    if (document.getElementById("item-type")) {
      questionType = document.getElementById("item-type").value;
    }

    if (questionType === "free-text") {
      this.setState({
        optionListHidden: true
      });
    } else if (questionType === "single" || questionType === "multi") {
      this.setState({
        optionListHidden: false
      })
    }
  }

  addOption() {
    var optionText = null;
    if (document.getElementById("option-text")) {
      optionText = document.getElementById("option-text").value;
    }

    if (optionText) {
      this.setState({
        currentItemOptions: this.state.currentItemOptions.concat(optionText)
      });

      document.getElementById("option-text").value= null;
    }
  }

  addQuestion() {
    var questionType = null;
    if (document.getElementById("item-type")) {
      questionType = document.getElementById("item-type").value;
    }

    var questionText = null;
    if (document.getElementById("question-text")) {
      questionText = document.getElementById("question-text").value;
    }

    if (questionType && questionText) {
      var items = this.state.survey.state.items;
      var ordinal = 1;
      if (items) {
        ordinal = this.state.survey.state.items.length + 1;
      } else {
        items = [];
      }

      var question = null;

      if (questionType === "free-text") {      
        question = new FreeTextItem({
          ordinal: ordinal,
          questionText: questionText
        })
      } else if (questionType === "single") {
        question = new SingleChoiceItem({
          ordinal: ordinal,
          questionText: questionText,
          answerOptions: this.state.currentItemOptions,
          selectedOption: 0
        })
      } else if (questionType === "multi") {
        question = new MultiChoiceItem({
          ordinal: ordinal,
          questionText: questionText,
          answerOptions: this.state.currentItemOptions
        })
      }

      if (question) {
        items = items.concat(question);
      }

      var survey = new Survey({items: items});
      this.setState({
        survey: survey,
        currentItemOptions: []
      });

      document.getElementById("question-text").value = null;
    }
  }

  getOptionList() {
    var options = this.state.currentItemOptions;
    var optionList = [];

    if (options) {
      for (var i = 0; i < options.length; i++) {
        optionList = optionList.concat(
          <option key={i}>{options[i]}</option>
        )
      }
    }

    return optionList;
  }

  getQuestionList() {
    var items = this.state.survey.state.items;
    var listItems = [];

    if (items) {
      for (var i = 0; i < items.length; i++) {
        var text = items[i].state.ordinal + " - " + items[i].state.questionText;
        listItems = listItems.concat(
          <option key={i}>{text}</option>
        )
      }
    }

    return listItems;
  }

  submitSurvey() {
    var postReq = new XMLHttpRequest();
    var url = 'http://localhost:3001/surveys';
    postReq.open("POST", url);
    postReq.setRequestHeader("content-type", "application/json");

    var name = document.getElementById("survey-name").value;
    var desc = document.getElementById("survey-desc").value
    var surveyData = {
      name: name,
      description: desc,
      items: this.state.survey.state.items
    }
    var content = JSON.stringify(surveyData);

    postReq.send(content);
  }
}

export default SurveyCreator;