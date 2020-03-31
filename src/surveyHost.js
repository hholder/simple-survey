import React from 'react';
import { FreeTextItem, SingleChoiceItem, MultiChoiceItem, Survey } from './survey.js';
import './survey.css';

const MongoClient = require('mongodb').MongoClient;

class SurveyHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyId: props.surveyId,
      survey: new Survey({items: []}),
      mongoClient: null,
      error: null,
    }

    this.state.survey = new Survey({
      items:
      [
        new FreeTextItem({
          ordinal: 1,
          questionText: 'Question 1',
          answerText: ''
        }),
        new SingleChoiceItem({
          ordinal: 2,
          choiceName: 'choice1',
          questionText: 'Question 2',
          answerOptions: ['Option 1', 'Option 2', 'Option 3'],
          selectedOption: 1
        }),
        new MultiChoiceItem({
          ordinal: 3,
          choiceName: 'choice2',
          questionText: 'Question 3',
          answerOptions: ['Option 4', 'Option 5', 'Option 6']
        }),
      ]
    });

    console.log(JSON.stringify(this.state.survey));
  }

  async loadData(err) {
    if (err) {
      this.setState({
        error: err
      });
    } else {
      var db = this.state.mongoClient.db('simple-survey');
      var surveys = db.collection('surveys');
      var results = await surveys.find({surveyId: this.state.surveyId}).toArray();
      this.mongoClient.close();

      if (results.length > 0) {
        var survey = results[0];
        this.setState({
          survey: new Survey(survey)
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
        <header className='survey-host-header'>
          <h1>Welcome to Simple Survey</h1>
        </header>
        <body className='survey-host-body'>
          <div>
            {content}
          </div>
        </body>
      </div>
    );
  }
}

export default SurveyHost;