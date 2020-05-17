import React from 'react';
import './survey.css';

class SurveyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemType: '',
            ordinal: 0,
            questionText: '',
            answerValue: '',
        }
    }    
}

class FreeTextItem extends SurveyItem {
    constructor(props) {
        super(props);
        this.state = {
            itemType: 'free-text-item',
            ordinal: props.ordinal,
            questionText: props.questionText,
            answerValue: props.answerValue,
        };

        this.handleTextChange = this.handleTextChange.bind(this);
    }

    render() {
        var text = this.state.answerValue || "";

        return (
            <div className="free-text-item" key={this.state.ordinal}>
                <label className="survey-label" htmlFor="answer-text">{this.state.questionText}</label>
                <input
                    id="answer-text"
                    className="survey-text-input"
                    type="text"
                    value={text}
                    onChange={this.handleTextChange}
                />
            </div>            
        );
    }

    handleTextChange(event) {
        var value = event.target.value;
        
        this.setState({
            answerValue: value,
        });
    }
}

class SingleChoiceItem extends SurveyItem {
    constructor(props) {
        super(props);
        this.state = {
            itemType: 'single-choice-item',
            ordinal: props.ordinal,
            questionText: props.questionText,
            answerOptions: [],
            selectedOption: props.SelectedOption
        };

        this.state.answerOptions = this.state.answerOptions.concat(props.answerOptions);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    render() {
        var choices = [];

        for (let i = 0; i < this.state.answerOptions.length; i++) {
            var isChecked =  i === this.state.selectedOption;
            choices = choices.concat(
                <li key={i}>
                    <label>{this.state.answerOptions[i]}</label>
                    <input
                      type="radio"
                      id={i}
                      value={this.state.answerOptions[i]}
                      checked={isChecked}
                      onChange={this.handleCheckChange}
                    />
                </li>
            );
        }

        return (
            <div className="single-choice-item" key={this.state.ordinal}>
                <label className="survey-label">{this.state.questionText}</label>
                <ul className="single-choice-list">{choices}</ul>
            </div>            
        );
    }

    handleCheckChange(event) {
        for (var i = 0; i < this.state.answerOptions.length; i++) {
            if (event.target === this.state.answerOptions[i]) {
                this.setState({
                    selectedOption: i
                })
                break;
            }
        }
    }
}

class MultiChoiceItem extends SurveyItem {
    constructor(props) {
        super(props);
        this.state = {
            itemType: 'multi-choice-item',
            ordinal: props.ordinal,
            questionText: props.questionText,
            answerOptions: [],
            selectedOptions: []
        };

        this.state.answerOptions = this.state.answerOptions.concat(props.answerOptions);
        this.state.selectedOption = this.state.selectedOptions.concat(props.selectedOptions);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    render() {
        var choices = [];

        for (let i = 0; i < this.state.answerOptions.length; i++) {
            var isChecked =  i === this.state.selectedOption;
            choices = choices.concat(
                <li key={i}>
                    <label id={i}>{this.state.answerOptions[i]}</label>
                    <input
                      type="checkbox"
                      id={i}
                      name={this.state.choiceName}
                      value={this.state.answerOptions[i]}
                      checked={isChecked}
                      onChange={this.handleCheckChange}
                      />
                </li>
            );
        }

        return (
            <div className="multi-choice-item">
                <label className="survey-label">{this.state.questionText}</label>
                <ul className="multi-choice-list">{choices}</ul>
            </div>            
        );
    }

    handleCheckChange(event) {
    }
}

class ItemGroup extends SurveyItem {
    constructor(props) {
        super(props);
        this.state = {
            ordinal: props.ordinal,
            startText: props.startText,
            desription: props.description,
            endText: props.endText,
            items: [],
            currentItem: 0
        };

        var sortedItems = props.items;
        sortedItems.sort(compareItems);
        this.state.items = sortedItems;
    }

    render() {
        var sortedItems = this.state.items;
        sortedItems.sort(compareItems);
        var content = [];

        for (let i = 0; i < sortedItems.length; i++) {
            content = content.concat(sortedItems[i].render());
        }

        return (
            <div className="item-group">
                {content}
            </div>
        )
    }

    handleNextClick() {
        var item = this.state.currentItem + 1;
        this.setState({
            currentItem: item
        });
    }
}

class Survey extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            surveyId: props.surveyId,
            name: props.survey ? props.survey.name : '',
            description: props.survey ? props.survey.description : '',
            items: [],
            currentItem: null,
            currentItemIndex: 0
        }

        var rawItems = props.survey ? props.survey.items : [];
        var sortedItems = [];
        for (var i = 0; i < rawItems.length; i++) {
            var item = rawItems[i];
            if (item && item.state && item.state.itemType === 'free-text-item') {
                sortedItems = sortedItems.concat(new FreeTextItem({
                    ordinal: item.state.ordinal,
                    questionText: item.state.questionText,
                    answerValue: item.state.answerValue
                }));
            } else if (item && item.state && item.state.itemType === 'single-choice-item') {
                sortedItems = sortedItems.concat(new SingleChoiceItem({
                    ordinal: item.state.ordinal,
                    questionText: item.state.questionText,
                    answerOptions: item.state.answerOptions,
                    selectedOption: item.state.selectedOption
                }));
            } else if (item && item.state && item.state.itemType === 'multi-choice-item') {
                sortedItems = sortedItems.concat(new MultiChoiceItem({
                    ordinal: item.state.ordinal,
                    questionText: item.state.questionText,
                    answerOptions: item.state.answerOptions,
                    selectedOption: item.state.selectedOption
                }));
            }
        }

        sortedItems.sort(compareItems);
        this.state.items = sortedItems;
        this.state.currentItem = sortedItems[0];
        
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
      this._isMounted = true
    }
  
    componentWillUnmount() {
      this._isMounted = false
    }

    handleBack() {
        if (this.state.currentItemIndex > 0) {
            var newItemIndex = this.state.currentItemIndex - 1;
            this.setState({
                currentItemIndex: newItemIndex,
                currentItem: this.state.items[newItemIndex]
            });
        }
    }

    handleNext() {
        if (this.state.currentItemIndex < this.state.items.length - 1) {
            var newItemIndex = this.state.currentItemIndex + 1;
            var newItem = this.state.items[newItemIndex]
            this.setState({
                currentItemIndex: newItemIndex,
                currentItem: newItem
            });
        }
    }

    handleDone() {

    }

    render() {
        var currentItem = 'No Data';
        if (this.state.currentItem) {
            currentItem = this.state.currentItem.render();
        }

        return (
            <div className="survey" key={this.state.surveyId}>
                <div className="survey-current-item">
                    {currentItem}
                </div>
                <div className="survey-buttons">
                    <input
                      className="survey-button"
                      type="image"
                      src="back.png"
                      alt="back"
                      onClick={this.handleBack} />
                    <input
                      className="survey-button"
                      type="image"
                      src="done.png"
                      alt="done"
                      onClick={this.handleDone} hidden="1" />
                    <input
                      className="survey-button"
                      type="image"
                      src="next.png"
                      alt="next"
                      onClick={this.handleNext} />
                </div>
            </div>
        )
    }
}

function compareItems(item1, item2) {
    if (item1.ordinal >= item2.ordinal) {
        return -1;
    } else {
        return 1;
    }
}

export {
    SurveyItem,
    FreeTextItem,
    SingleChoiceItem,
    MultiChoiceItem,
    ItemGroup,
    Survey,
}