import React from 'react';
import { CASING_OPTIONS, DEFAULT_OPTIONS } from './options';
import _ from 'lodash'; // todo: import only modules needed from lodash

import logo from './logo.svg';
import './App.css';

// import TextField from '@material-ui/core/TextField';

// TODO: use HOOKS, use context

// todo: redo with updated dependencies (react, babel, yarn)
// todo: over-engineer the state management
// todo: internationalization?

export default class App extends React.Component {
  // todo: get/save options in localstorage
  // todo: proptypes/typing
  constructor(props) {
    super(props);
    this.state = {
      generatedPhrase: '',
      wordList: localStorage.wordArray ? JSON.parse(localStorage.wordArray) : window.wordArray,
      words: [],
      options: localStorage.passphraseOptions ? JSON.parse(localStorage.passphraseOptions) : DEFAULT_OPTIONS,
    };
    this.generatePhrase = this.generatePhrase.bind(this);
    this.checkPhraseLength = this.checkPhraseLength.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.handlePhraseChange = this.handlePhraseChange.bind(this);
    this.onOptionsChange = this.onOptionsChange.bind(this);
  }

  generatePhrase() {
    console.log('this.state.options: ', this.state.options);
    // build phrase using lodash sampleSize - is this random enough?
    let words = [];
    // defaults for now - allow more customization
    let characterLimit = this.state.options.characterLimit ? 20 : Number.MAX_SAFE_INTEGER;
    let separator = this.state.options.useSpaces ? ' ' : '';

    // generate a set of words until one is found within the character limit
    do {
      let wordCount = this.state.options.wordCount;
      let number = null;
      if (this.state.options.includeNumbers) {
        number = getRandomInt(0, 999);
        wordCount--;
      }

      words = _.sampleSize(this.state.wordList, wordCount);

      if (number) {
        let randomIndex = getRandomInt(0, wordCount + 1);
        words.splice(randomIndex, 0, number);
      }
    } while (this.checkPhraseLength(words) > characterLimit);

    // move logic with options?
    switch (this.state.options.casing) {
      case CASING_OPTIONS.upperCase:
        words.forEach((word, i, words) => words[i] = word.toUpperCase());
        break;
      case CASING_OPTIONS.lowerCase:
        words.forEach((word, i, words) => words[i] = word.toLowerCase());
        break;
      case CASING_OPTIONS.startCase:
      default:
        words.forEach((word, i, words) => words[i] = _.upperFirst(word));
        break;
      // TODO: kebab case? camel case? snake case?
    }

    let generatedPhrase = words.join(separator);
    this.setState({words, generatedPhrase}, this.copyToClipboard);
  }
  checkPhraseLength(words) {
    return words.join(this.state.options.separator).length;
  }
  copyToClipboard() {
    // store initial cursor position
    let el = this.phraseInput,
      selectionStart = el.selectionStart,
      selectionEnd = el.selectionEnd;

    if (!el.value) return;

    el.select();

    try {
      // Now that we've selected the text, execute the copy command
      var successful = document.execCommand('copy');
      if (successful) {
        // TODO: clear this attached handler to refresh the message on each click <<<<---
        // TODO: no jquery
        // $('#passphrase .copied-success').show().delay(500).fadeOut(2000);

        // Remove the selection and replace cursor where it was
        window.getSelection().removeAllRanges();
        el.setSelectionRange(selectionStart, selectionEnd);

      } else {
        this.showAltMessage();
      }
    } catch(err) {
      this.showAltMessage();
    }

  }
  handlePhraseChange(event) {
    this.setState({ generatedPhrase: event.target.value }, this.copyToClipboard);
  }
  onOptionsChange(optionChanged) {
    console.log('option changed: ', optionChanged);

    if (optionChanged.hasOwnProperty('useSpaces')) {
      optionChanged.separator = optionChanged.useSpaces ? ' ' : '';
    }

    const updatedOptions = Object.assign(this.state.options, optionChanged);
    this.setState({ options: updatedOptions });

    // todo: check support, use set/get
    localStorage.passphraseOptions = JSON.stringify(updatedOptions);
  }
  showAltMessage() {
    // todo: no jquery
    // $('#passphrase .copy-failed').show().delay(4000).fadeOut(2000);
  }
  render() {
    let phrase = this.state.generatedPhrase;

    return (
      <div className="App wrapper">
        <header id="title">
          <h1>Passphrase</h1>
          <p className="lead">Instantly generate secure, memorable passphrases</p>
        </header>

        <main id="passphrase">
          <input
            type="text"
            className="generated"
            ref={(input) => this.phraseInput = input}
            value={this.state.generatedPhrase}
            onChange={this.handlePhraseChange}
            placeholder="Your next passphrase..."
          />
          <div className="button-group">
            <DisplayCharCount charCount={phrase.length} />
            <button
              id="generate"
              className="primary"
              onClick={this.generatePhrase}>
              Generate
            </button>
            <CopyButton onClick={this.copyToClipboard} phrase={phrase} />
          </div>
          <div className="message-area">
            <p className="copied-success">Your phrase has been copied to your clipboard</p>
            <p className="copy-failed">Press &#8984;+C (Mac) or Ctrl+C (Windows) to copy your passphrase</p>
          </div>
          <OptionsPanel
            {...this.state.options}
            onChange={this.onOptionsChange}
          />
        </main>
        <footer>
          <article className="credits">
            <aside><a href="https://xkcd.com/936/">Why passphrases are better than passwords</a></aside>
            <aside><a href="https://github.com/jbkly/passphrase">View the Project on GitHub</a></aside>
            <aside><img src={logo} className="App-logo" alt="logo" /></aside>
          </article>
        </footer>
      </div>
    );
  }
}

function DisplayCharCount(props) {
  return !props.charCount ? null :
    <div className="display-char-count">
      <span>{props.charCount} characters</span>
    </div>;
}

function CopyButton(props) {
  return !props.phrase ? null :
    <button
      id="copy-to-clipboard"
      className="secondary"
      onClick={props.onClick}>
      Copy
    </button>;
}

// todo: factor this component out
function OptionsPanel(props) {
  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    props.onChange && props.onChange({ [name]: value });
  };

  return (
    <form className="options-panel">
      <h3>Options</h3>
      <label className="option">
        <input type="checkbox" name="includeNumbers" checked={props.includeNumbers} onChange={handleChange} />
        &nbsp;Include numbers
      </label>
        <label className="option">
        <input type="checkbox" name="useSpaces" checked={props.useSpaces} onChange={handleChange} />
        &nbsp;Use spaces
      </label>
      <label className="option">
        <input type="checkbox" name="characterLimit" checked={props.characterLimit} onChange={handleChange} />
        &nbsp;Limit characters
      </label>
    </form>
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
