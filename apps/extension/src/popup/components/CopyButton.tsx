import React, { Component } from "react";
import browser from "webextension-polyfill";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../icons/copy.svg";

import "./CopyButton.scss";

interface IProps {
  text: string;
}

interface IState {
  isCopied: boolean;
}

class CopyButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { isCopied: false };
  }

  handleCopy = (copiedText: string) => {
    navigator.clipboard.writeText(copiedText);
    this.setState({ isCopied: true });
  };

  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.text !== nextProps.text) this.setState({ isCopied: false });
  }

  render() {
    const { text } = this.props;
    if (!text) return null;

    return (
      <div className="copy">
        {this.state.isCopied && (
          <span className="copiedText">
            {browser.i18n.getMessage("copiedLabel")}
          </span>
        )}
        <CopyToClipboard text={text} onCopy={this.handleCopy}>
          <button
            className="copyButton"
            title={browser.i18n.getMessage("copyLabel")}
          >
            <CopyIcon />
          </button>
        </CopyToClipboard>
      </div>
    );
  }
}

export default CopyButton;
