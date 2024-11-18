import React, { Component, type ChangeEvent } from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import ListenButton from "./ListenButton";

import "./InputArea.scss";

interface IProps {
  inputText: string;
  sourceLang: string;
  handleInputText: (text: string) => void;
}

interface IState {}

class InputArea extends Component<IProps, IState> {
  resizeTextArea = () => {
    const textarea = ReactDOM.findDOMNode(
      this.refs.textarea
    ) as HTMLTextAreaElement;
    textarea.style.height = "1px";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };

  handleInputText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    this.props.handleInputText(inputText);
  };

  shouldComponentUpdate(nextProps: IProps) {
    const shouldUpdate =
      this.props.inputText !== nextProps.inputText ||
      this.props.sourceLang !== nextProps.sourceLang;
    return shouldUpdate;
  }

  componentDidUpdate = () => {
    this.resizeTextArea();
  };

  render() {
    const { inputText, sourceLang } = this.props;
    return (
      <div id="inputArea">
        <textarea
          value={inputText}
          ref="textarea"
          placeholder={browser.i18n.getMessage("initialTextArea")}
          onChange={this.handleInputText}
          autoFocus
          spellCheck={false}
          dir="auto"
        />
        <div className="listen">
          {sourceLang && <ListenButton text={inputText} lang={sourceLang} />}
        </div>
      </div>
    );
  }
}

export default InputArea;
