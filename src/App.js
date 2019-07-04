import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CASING_OPTIONS, DEFAULT_OPTIONS } from './options';
import { COPY_SUCCESS, COPY_FAILED } from './messages';
import { sampleSize, upperFirst } from 'lodash';

import logo from './logo.svg';
import './App.css';

export default function App() {
  const storedWordlist = localStorage.wordArray ?
    JSON.parse(localStorage.wordArray) : window.wordArray;
  const initialOptions = localStorage.passphraseOptions ?
    JSON.parse(localStorage.passphraseOptions) : DEFAULT_OPTIONS;
  const [wordList] = useState(storedWordlist);
  const [options, setOptions] = useState(initialOptions);
  const [generatedPhrase, setGeneratedPhrase] = useState('');
  const [copyMessage, setCopyMessage] = useState(null);
  const phraseInput = useRef(null);

  const lastMessage = useRef(copyMessage);
  useEffect(() => {
    lastMessage.current = copyMessage || lastMessage.current;
  }, [copyMessage]);

  const copyToClipboard = useCallback(() => {
    let messageTimeoutID;
    const displayMessage = (text, displayTime) => {
      clearTimeout(messageTimeoutID);
      setCopyMessage(text);
      messageTimeoutID = setTimeout(() => {
        setCopyMessage(null)
      }, displayTime);
    };

    // store initial cursor position
    let el = phraseInput.current,
      selectionStart = el.selectionStart,
      selectionEnd = el.selectionEnd;
    if (!el.value) return;

    el.select();
    try {
      // Now that we've selected the text, execute the copy command
      if (document.execCommand('copy')) {
        displayMessage(COPY_SUCCESS, 1000);

        // Remove the selection and replace cursor where it was
        window.getSelection().removeAllRanges();
        el.setSelectionRange(selectionStart, selectionEnd);
      } else {
        displayMessage(COPY_FAILED, 3000);
      }
    } catch(err) {
      displayMessage(COPY_FAILED, 3000);
    }
  }, [phraseInput]);

  useEffect(() => {
    copyToClipboard();
  }, [generatedPhrase, copyToClipboard]);

  const checkPhraseLength = words => words.join(options.separator).length;

  const generatePhrase = () => {
    // build phrase using lodash sampleSize - is this random enough?
    let words = [];
    // defaults for now - todo: allow more customization
    let characterLimit = options.characterLimit ? 20 : Number.MAX_SAFE_INTEGER;
    let separator = options.useSpaces ? ' ' : '';

    // generate a set of words until one is found within the character limit
    do {
      let wordCount = options.wordCount;
      let number = null;
      if (options.includeNumbers) {
        number = getRandomInt(0, 999);
        wordCount--;
      }

      words = sampleSize(wordList, wordCount);

      if (number) {
        let randomIndex = getRandomInt(0, wordCount + 1);
        words.splice(randomIndex, 0, number);
      }
    } while (checkPhraseLength(words) > characterLimit);

    // move logic with options?
    switch (options.casing) {
      case CASING_OPTIONS.upperCase:
        words.forEach((word, i, words) => words[i] = word.toUpperCase());
        break;
      case CASING_OPTIONS.lowerCase:
        words.forEach((word, i, words) => words[i] = word.toLowerCase());
        break;
      case CASING_OPTIONS.startCase:
      default:
        words.forEach((word, i, words) => words[i] = upperFirst(word));
        break;
      // todo: other case options
    }

    let generatedPhrase = words.join(separator);
    setGeneratedPhrase(generatedPhrase);
  };

  const handlePhraseChange = event => {
    setGeneratedPhrase(event.target.value);
  };

  const onOptionsChange = optionChanged => {
    if (optionChanged.hasOwnProperty('useSpaces')) {
      optionChanged.separator = optionChanged.useSpaces ? ' ' : '';
    }

    const updatedOptions = { ...options, ...optionChanged };
    setOptions(updatedOptions);

    // todo: check localStorage support, use set/get
    // todo: useEffect
    localStorage.passphraseOptions = JSON.stringify(updatedOptions);
  };

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
          ref={phraseInput}
          value={generatedPhrase}
          onChange={handlePhraseChange}
          placeholder="Your next passphrase..."
        />
        <div className="button-group">
          <DisplayCharCount charCount={generatedPhrase.length} />
          <button
            id="generate"
            className="primary"
            onClick={generatePhrase}>
            Generate
          </button>
          <CopyButton onClick={copyToClipboard} phrase={generatedPhrase} />
        </div>
        <div className="message-area">
          <p className={`copy-message ${copyMessage && 'show'}`}>
            {copyMessage || lastMessage.current}
          </p>
        </div>
        <OptionsPanel
          {...options}
          onChange={onOptionsChange}
        />
      </main>
      <footer>
        <article className="credits">
          <aside><a href="https://xkcd.com/936/">Why passphrases are better than passwords</a></aside>
          <aside><a href="https://github.com/jbkly/passphrase-v2">View the Project on GitHub</a></aside>
          <span><img src={logo} className="App-logo" alt="logo" /></span>
        </article>
      </footer>
    </div>
  );
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
