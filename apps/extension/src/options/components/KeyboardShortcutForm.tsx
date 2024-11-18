import React, {
  Component,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
// @ts-expect-error no types for this
import browserInfo from "browser-info";
import browser from "webextension-polyfill";
import ClearIcon from "../icons/clear.svg";
import RestetIcon from "../icons/reset.svg";

interface IProps {
  id: string;
  shortcut: string;
  defaultValue: string;
}

interface IState {
  shortcut: string;
  value: string;
  defaultValue: string;
  error: string;
}

class KeyboardShortcutForm extends Component<IProps, IState> {
  isMac: boolean;

  constructor(props: IProps) {
    super(props);
    this.isMac = browserInfo().os == "OS X";
    this.state = {
      shortcut: props.shortcut,
      value: props.shortcut,
      defaultValue: props.defaultValue,
      error: "",
    };
  }

  handleFocus(event: FocusEvent<HTMLInputElement, Element>) {
    event.target.select();
    window.document.onkeydown = () => false;
    window.document.onkeypress = () => false;
  }

  handleBlur(event: FocusEvent<HTMLInputElement, Element>) {
    const shortcut = this.state.shortcut;
    this.setState({ error: "", value: shortcut });
    window.document.onkeydown = () => true;
    window.document.onkeypress = () => true;
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {}

  handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.repeat) {
      return;
    }

    if (event.key == "Tab") {
      (window.document.activeElement as HTMLElement).blur();
      return;
    }

    const normalizedKey = normalizeKey(event.key, event.keyCode);
    let error = "";

    const mediaKeys =
      /^(MediaPlayPause|MediaStop|MediaNextTrack|MediaPrevTrack)$/;
    const funcKeys = /^F([0-9]|1[0-2])$/;
    const modifierKeys = /^(Control|Alt|Shift|Meta)$/;

    if (mediaKeys.test(normalizedKey) || funcKeys.test(normalizedKey)) {
      error = "";
    } else if (modifierKeys.test(event.key)) {
      error = browser.i18n.getMessage("typeLetterMessage");
    } else if (!event.ctrlKey && !event.altKey && !event.metaKey) {
      error = this.isMac
        ? browser.i18n.getMessage("includeMacModifierKeysMessage")
        : browser.i18n.getMessage("includeModifierKeysMessage");
    } else if (normalizedKey == "") {
      error = browser.i18n.getMessage("invalidLetterMessage");
    }

    const value = `${event.ctrlKey ? (this.isMac ? "MacCtrl+" : "Ctrl+") : ""}${
      event.metaKey && this.isMac ? "Command+" : ""
    }${event.altKey ? "Alt+" : ""}${
      event.shiftKey ? "Shift+" : ""
    }${normalizedKey}`;

    this.setState({ error: error, value: value || "" });
    const isValidShortcut = value != "" && error == "";

    if (isValidShortcut) {
      this.updateShortcut(value);
    }
  }

  handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (this.state.error != "") {
      this.setState({ value: "" });
    }
  }

  async updateShortcut(shortcut: string) {
    try {
      await browser.commands.update({
        name: this.props.id,
        shortcut: shortcut,
      });
      this.setState({ shortcut: shortcut || "" });
    } catch (e) {
      this.setState({
        error: browser.i18n.getMessage("invalidShortcutMessage"),
      });
    }
  }

  async clearShortcut(event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    await browser.commands.reset(this.props.id).catch(() => {});
    this.setState({ shortcut: "", value: "" });
  }

  async resetShortcut(event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    const defaultValue = this.state.defaultValue;
    this.updateShortcut(defaultValue);
    this.setState({ value: defaultValue || "" });
  }

  render() {
    const { id } = this.props;
    const { value } = this.state;

    return (
      <div className={`keyboardShortcut ${this.state.error && "isError"}`}>
        <div className="row">
          <input
            type="text"
            id={id}
            value={value}
            placeholder={browser.i18n.getMessage("typeShortcutMessage")}
            onKeyDown={(event) => this.handleKeyDown(event)}
            onKeyUp={(event) => this.handleKeyUp(event)}
            onChange={(event) => this.handleChange(event)}
            onFocus={(event) => this.handleFocus(event)}
            onBlur={(event) => this.handleBlur(event)}
            style={{ imeMode: "disabled" }}
          />
          <button
            className="clearButton"
            title={browser.i18n.getMessage("clear")}
            onClick={(event) => this.clearShortcut(event)}
          >
            <ClearIcon />
          </button>
          <button
            className="resetButton"
            title={browser.i18n.getMessage("reset")}
            onClick={(event) => this.resetShortcut(event)}
          >
            <RestetIcon />
          </button>
        </div>
        <p className="error">{this.state.error}</p>
      </div>
    );
  }
}

function normalizeKey(key: string, keyCode: number) {
  const alphabet = /^([a-z]|[A-Z])$/;

  if (alphabet.test(key)) {
    return key.toUpperCase();
  }

  const digit = /^[0-9]$/;
  const func = /^F([0-9]|1[0-2])$/;
  const homes = /^(Home|End|PageUp|PageDown|Insert|Delete)$/;

  if (digit.test(key) || func.test(key) || homes.test(key)) {
    return key;
  }

  const space = /^\s$/;

  if (space.test(key)) {
    return "Space";
  }

  const arrows = /^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/;

  if (arrows.test(key)) {
    return key.split("Arrow")[1];
  }

  const medias = /^(MediaPlayPause|MediaStop)$/;
  if (medias.test(key)) {
    return key;
  }

  if (key == "MediaTrackNext") {
    return "MediaNextTrack";
  }

  if (key == "MediaTrackPrevious") {
    return "MediaPrevTrack";
  }

  const keyCode0 = 48;

  if (keyCode0 <= keyCode && keyCode <= keyCode0 + 9) {
    return String(keyCode - keyCode0);
  }

  if (keyCode == 188) {
    return "Comma";
  }

  if (keyCode == 190) {
    return "Period";
  }

  return "";
}

export default KeyboardShortcutForm;
