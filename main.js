'use strict';

import React, {
  Component,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import shuffle from 'knuth';
import HiraganaMap from './hiraganamap';

const pickRandomProperty = obj => {
  let result;
  let count = 0;
  for (var prop in obj)
    if (Math.random() < 1 / ++count) result = prop;
  return result;
};

export default class hiragana extends Component {
  constructor() {
    super();
    this.showChoices = this.showChoices.bind(this);
    this.rightChoiceSelected = this.rightChoiceSelected.bind(this);
    this.wrongChoiceSelected = this.wrongChoiceSelected.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      hiraganaToSolve: shuffle(Object.keys(HiraganaMap)),
      correct: 0,
      total: 0
    };
  }

  reset() {
    this.setState({
      hiraganaToSolve: shuffle(Object.keys(HiraganaMap)),
      correct: 0,
      total: 0
    });
  }

  showHiraganaToSolve() {
    return (
      <View><Text style={styles.hiragana}>{this.state.hiraganaToSolve[0]}</Text></View>
    );
  }

  rightChoiceSelected() {
    this.setState({
      correct: this.state.correct + 1,
      hiraganaToSolve: this.state.hiraganaToSolve.splice(1),
      total: this.state.total + 1
    });
  }

  wrongChoiceSelected() {
    this.setState({
      hiraganaToSolve: this.state.hiraganaToSolve.splice(1),
      total: this.state.total + 1
    });
  }

  showChoices() {
    const HiraganaToSolve = this.state.hiraganaToSolve[0];
    const CorrectAnswer = HiraganaMap[HiraganaToSolve];

    // build some noise (wrong answers)
    let wrongChoices = [];
    while (wrongChoices.length < 3) {
      let randomHiragana = pickRandomProperty(HiraganaMap);
      if (randomHiragana !== HiraganaToSolve) {
        wrongChoices.push(HiraganaMap[randomHiragana]);
      }
    }

    // build the elements
    let allChoices = wrongChoices.concat(CorrectAnswer);
    shuffle(allChoices);

    const renderChoices = () => {
      return allChoices.map(choice => {
        if (choice !== CorrectAnswer) {
          return (
            <TouchableHighlight underlayColor={styles.wrongChoice} style={styles.choice} onPress={this.wrongChoiceSelected}>
              <Text>{choice}</Text>
            </TouchableHighlight>
          );
        } else {
          return (
            <TouchableHighlight underlayColor={styles.rightChoice} style={styles.choice} onPress={this.rightChoiceSelected}>
              <Text>{CorrectAnswer}</Text>
            </TouchableHighlight>
          );
        }
      });
    };

    return (
      <View style={styles.choices}>
        {renderChoices()}
      </View>
    );
  }

  render() {
    const show = () => {
      if (this.state.hiraganaToSolve.length > 0) {
        return (
          <View style={styles.main}>
            { this.showHiraganaToSolve() }
            { this.showChoices() }
          </View>
        );
      } else {
        let x = this.state.correct / this.state.total;
        x = Math.round((x * 100 + 0.00001) * 100) / 100;
        return (
          <View style={styles.main}>
            <Text>{ x }% correct!</Text>
            <TouchableHighlight underlayColor='#00f' onPress={this.reset} style={styles.reset}>
              <Text>Try again</Text>
            </TouchableHighlight>
          </View>
        );
      }
    };
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <View><Text style={styles.infoText}>Correct: {this.state.correct} / {this.state.total}</Text></View>
          <View><Text style={styles.infoText}>Remaining: {this.state.hiraganaToSolve.length}</Text></View>
        </View>
        { show() }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  hiragana: {
    fontSize: 100,
    color: 'black'
  },
  rightChoice: '#0c0',
  wrongChoice: '#c00',
  choices: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  choice: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 2
  },
  reset: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 50,
    borderRadius: 5
  },
  info: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flex: 2
  },
  infoText: {
    fontSize: 8
  },
  main: {
    flex: 23,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
