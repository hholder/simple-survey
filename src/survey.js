import React from 'react';
import './survey.css';

class Survey extends React.Component {
    _isMounted = false;
    _getReq = null;
    _postReq = null;

    constructor(props) {
        super(props);
        this.state = {
            surveyId: props.surveyId,
            name: "",
            description: "",
            questions: [],
            answerValues: [],
            currentItem: null,
            currentItemIndex: 0
        }

        this.loadData = this.loadData.bind(this);
        this.handleLoadDataResponse = this.handleLoadDataResponse.bind(this);
        this.isSurveyCompleted = this.isSurveyCompleted.bind(this);
        this.onFirstQuestion = this.onFirstQuestion.bind(this);
        this.onLastQuestion = this.onLastQuestion.bind(this);

        this.loadData();
    }

    async loadData() {
        if (this.state.surveyId) {
            this._getReq = new XMLHttpRequest();
            this._getReq.responseType = "json"
            var url = 'http://localhost:3001/surveys?surveyId=' + this.state.surveyId;
            this._getReq.open('GET', url, true);
            this._getReq.onreadystatechange = this.handleLoadDataResponse;
            this._getReq.send();
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleSubmitResponse = this.handleSubmitResponse.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleRadioCheckChange = this.handleRadioCheckChange.bind(this);
        this.handleCheckboxCheckChange = this.handleCheckboxCheckChange.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleLoadDataResponse() {
        if (this._getReq.readyState === XMLHttpRequest.DONE) {
            var getRsp = this._getReq.response;

            if (getRsp.survey) {
                var rawItems = getRsp.survey.items ? getRsp.survey.items : [];

                var sortedItems = rawItems.slice();
                sortedItems.sort(compareItems);
                var answerValues = new Array(rawItems.length).fill(null);

                this.setState({
                    name: getRsp.survey.name,
                    description: getRsp.survey.description,
                    questions: sortedItems,
                    answerValues: answerValues
                });
            }
        }
    }

    handleBack() {
        if (this.state.currentItemIndex > 0) {
            var newItemIndex = this.state.currentItemIndex - 1;
            this.setState({
                currentItemIndex: newItemIndex,
                currentItem: this.state.questions[newItemIndex]
            });
        }
    }

    handleNext() {
        if (this.state.currentItemIndex < this.state.questions.length - 1) {
            var newItemIndex = this.state.currentItemIndex + 1;
            var newItem = this.state.questions[newItemIndex]
            this.setState({
                currentItemIndex: newItemIndex,
                currentItem: newItem
            });
        }
    }

    handleDone() {
        if (this.isSurveyCompleted()) {

            var surveyResponse = {
                surveyId: this.state.surveyId,
                surveyName: this.state.name,
                surveyDescription: this.state.description,
                answers: this.state.answerValues
            }

            this._postReq = new XMLHttpRequest();
            var url = 'http://localhost:3001/surveyResponses';
            this._postReq.open("POST", url);
            this._postReq.setRequestHeader("content-type", "application/json");
            this._postReq.onreadystatechange = this.handleSubmitResponse;

            var content = JSON.stringify(surveyResponse);

            this._postReq.send(content);
        }
    }

    handleSubmitResponse() {
        if (this._postReq.readyState === XMLHttpRequest.DONE) {
            if (this._postReq.status === 200) { // TODO: better success indication
                window.location.href = "/";
            } else { // TODO: Proper error handling
                alert("Failed to save survey response");
            }
          }
    }

    isSurveyCompleted() {
        var onLastQuestion = this.onLastQuestion();

        return onLastQuestion;
    }

    onFirstQuestion() {
        return this.state.currentItemIndex === 0;
    }

    onLastQuestion() {
        return this.state.currentItemIndex === this.state.questions.length - 1;
    }

    handleTextChange(event) {
        var newAnswers = this.state.answerValues.slice();
        newAnswers[this.state.currentItemIndex] = event.target.value;
        this.setState({
            answerValues: newAnswers
        })
    }

    handleRadioCheckChange(event) {
        var currentItem = this.state.questions[this.state.currentItemIndex];
        var newAnswers = this.state.answerValues.slice();

        for (var i = 0; i < currentItem.answerOptions.length; i++) {
            if (event.target.value === currentItem.answerOptions[i]) {
                newAnswers[this.state.currentItemIndex] = i;
                this.setState({
                    answerValues: newAnswers
                });
                break;
            }
        }
    }

    handleCheckboxCheckChange(event) {
        var currentAnswer = this.state.answerValues[this.state.currentItemIndex] ?
            this.state.answerValues[this.state.currentItemIndex] : [];
        var currentItem = this.state.questions[this.state.currentItemIndex];
        var newAnswers = this.state.answerValues.slice();
        var newAnswer = [];

        for (var i = 0; i < currentItem.answerOptions.length; i++) {
            if (event.target.value === currentItem.answerOptions[i] &&
                currentAnswer.includes(i) &&
                !event.target.checked) {
                    // the user unchecked a previously selected option
                    newAnswer = currentAnswer.splice(i, 1);
                    break;
            } else if (event.target.value === currentItem.answerOptions[i] &&
                       !currentAnswer.includes(i) &&
                       event.target.checked) {
                    // the user checked a previously unselected option
                    newAnswer = currentAnswer.concat(i);
                    break;
            }
        }

        newAnswers[this.state.currentItemIndex] = newAnswer;
        this.setState({
            answerValues: newAnswers
        });
    }

    render() {
        var currentItem = this.state.questions ? this.state.questions[this.state.currentItemIndex] : null;
        var currentItemElement = <p>No Data</p>;
        var choices = [];
        var isChecked = false;

        if (currentItem && currentItem.itemType === 'free-text') {
            var answerValue = this.state.answerValues[this.state.currentItemIndex] ? 
                this.state.answerValues[this.state.currentItemIndex] : "";
            currentItemElement =                
                <div className="free-text-item">
                    <label className="survey-label" htmlFor="answer-text">{currentItem.questionText}</label>
                    <input
                        id="answer-text"
                        className="survey-text-input"
                        type="text"
                        value={answerValue}
                        onChange={this.handleTextChange}
                    />
                </div>;
        } else if (currentItem && currentItem.itemType === 'single') {
            for (let i = 0; i < currentItem.answerOptions.length; i++) {
                isChecked = i === this.state.answerValues[this.state.currentItemIndex];
                choices = choices.concat(
                    <li key={i}>
                        <label>{currentItem.answerOptions[i]}</label>
                        <input
                            type="radio"
                            id={i}
                            value={currentItem.answerOptions[i]}
                            checked={isChecked}
                            onChange={this.handleRadioCheckChange}
                        />
                    </li>
                );
            }

            currentItemElement = 
                <div className="single-choice-item" key={this.state.ordinal}>
                    <label className="survey-label">{this.state.questionText}</label>
                    <ul className="single-choice-list">{choices}</ul>
                </div>;
        } else if (currentItem && currentItem.itemType === 'multi') {
            var answer = this.state.answerValues[this.state.currentItemIndex] ?
                this.state.answerValues[this.state.currentItemIndex] : [];

            for (let i = 0; i < currentItem.answerOptions.length; i++) {
                isChecked = answer.includes(i);
                choices = choices.concat(
                    <li key={i}>
                        <label id={i}>{currentItem.answerOptions[i]}</label>
                        <input
                            type="checkbox"
                            id={i}
                            name={currentItem.choiceName}
                            value={currentItem.answerOptions[i]}
                            checked={isChecked}
                            onChange={this.handleCheckboxCheckChange}
                        />
                    </li>
                );
            }

            currentItemElement =
                <div className="multi-choice-item">
                    <label className="survey-label">{this.state.questionText}</label>
                    <ul className="multi-choice-list">{choices}</ul>
                </div>
        }

        return (
            <div className="survey" key={this.state.surveyId}>                
                <div className="survey-header">
                    <h1 className="survey-h1">{this.state.surveyName}</h1>
                    <h3 className="survey-h3">{this.state.surveyDescription}</h3>
                </div>
                <div className='survey-body'>
                    <div className="survey-current-item">
                        {currentItemElement}
                    </div>
                    <div className="survey-buttons">
                        {
                            this.onFirstQuestion() ? null :
                                <input
                                    className="survey-button"
                                    type="image"
                                    src="back.png"
                                    alt="back"
                                    onClick={this.handleBack} />
                        }
                        {
                            !this.isSurveyCompleted() ? null :
                                <input
                                    className="survey-button"
                                    type="image"
                                    src="done.png"
                                    alt="done"
                                    onClick={this.handleDone} />
                        }
                        {
                            this.onLastQuestion() ? null :                            
                                <input
                                className="survey-button"
                                type="image"
                                src="next.png"
                                alt="next"
                                onClick={this.handleNext} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function compareItems(item1, item2) {
    if (item1.ordinal <= item2.ordinal) {
        return -1;
    } else {
        return 1;
    }
}

export default Survey;