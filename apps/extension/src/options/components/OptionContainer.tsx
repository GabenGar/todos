import React, {
  type ChangeEvent,
  MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import browser from "webextension-polyfill";
import { setSettings } from "../../settings/settings";
import KeyboardShortcutForm from "./KeyboardShortcutForm";

import "./OptionContainer.scss";
import clsx from "clsx";

interface IProps {
  title: string;
  useRawTitle: boolean;
  captions: [];
  useRawCaptions: boolean;
  extraCaption?: ReactNode;
  type:
    | "number"
    | "checkbox"
    | "text"
    | "textarea"
    | "radio"
    | "color"
    | "select"
    | "button"
    | "file"
    | "keyboard-shortcut"
    | "none";
  id: string;
  children?: ReactNode;
  currentValue: string | boolean;
  min: string;
  max: string;
  step: string;
  default: string;
  value: string;
  placeholder?: string;
  options: IOption[] | (() => IOption[]);
  useRawOptionName?: boolean;
  accept?: string;
  multiple?: boolean;
  shortcut: string;
  updated: boolean;
  new: boolean;
  shouldShow?: boolean | (() => boolean);
  hr: boolean;
  handleChange: () => void;
  onClick: (event: ReactMouseEvent<HTMLInputElement, MouseEvent>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface IOption {
  name: string;
  value: string;
}

function OptionContainer({
  title,
  useRawTitle,
  captions,
  useRawCaptions,
  extraCaption,
  type,
  id,
  children,
  currentValue,
  min,
  max,
  step,
  default: defaultValue,
  value,
  placeholder,
  options,
  useRawOptionName,
  accept,
  multiple,
  shortcut,
  updated,
  new: isNew,
  shouldShow,
  hr,
  onClick,
  handleChange,
  onChange,
}: IProps) {
  function handleValueChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    let value = event.target.value;

    if (type == "number") {
      const validity = event.target.validity;

      if (validity.rangeOverflow) {
        value = max;
      } else if (validity.rangeUnderflow) {
        value = min;
      } else if (validity.badInput || value == "" || !validity.valid) {
        value = defaultValue;
      }
    }

    setSettings(id, value);

    if (handleChange) {
      handleChange();
    }
  }

  function handleCheckedChange(event: ChangeEvent<HTMLInputElement>) {
    setSettings(id, event.target.checked);
  }

  let formId: undefined | string = undefined;
  let optionForm;
  switch (type) {
    case "checkbox": {
      formId = id;
      optionForm = (
        <label>
          <input
            type="checkbox"
            id={formId}
            onChange={handleCheckedChange}
            defaultChecked={Boolean(currentValue)}
          />
          <span className="checkbox" />
        </label>
      );
      break;
    }

    case "number": {
      formId = id;
      optionForm = (
        <input
          type="number"
          id={formId}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={handleValueChange}
          defaultValue={String(currentValue)}
        />
      );
      break;
    }

    case "text": {
      formId = id;
      optionForm = (
        <input
          type="text"
          id={formId}
          placeholder={placeholder}
          onChange={handleValueChange}
          defaultValue={String(currentValue)}
        />
      );
      break;
    }

    case "textarea": {
      formId = id;
      optionForm = (
        <textarea
          id={formId}
          spellCheck={false}
          placeholder={placeholder}
          onChange={handleValueChange}
          defaultValue={String(currentValue)}
        />
      );
      break;
    }

    case "radio": {
      formId = `${id}_${value}`;
      optionForm = (
        <label>
          <input
            type="radio"
            id={formId}
            name={id}
            value={value}
            onChange={handleValueChange}
            defaultChecked={value === currentValue}
          />
          <span className="radio" />
        </label>
      );
      break;
    }

    case "color": {
      formId = id;
      optionForm = (
        <label>
          <input
            type="color"
            id={formId}
            onChange={handleValueChange}
            defaultValue={String(currentValue)}
          />
        </label>
      );
      break;
    }

    case "select": {
      formId = id;
      optionForm = (
        <div className="selectWrap">
          <select
            id={formId}
            onChange={handleValueChange}
            value={String(currentValue)}
          >
            {(typeof options === "function" ? options() : options).map(
              (option, index) => (
                <option value={option.value} key={index}>
                  {useRawOptionName
                    ? option.name
                    : browser.i18n.getMessage(option.name)}
                </option>
              )
            )}
          </select>
        </div>
      );
      break;
    }

    case "button": {
      formId = "";
      optionForm = (
        <input
          type="button"
          value={browser.i18n.getMessage(value)}
          onClick={onClick}
        />
      );
      break;
    }

    case "file": {
      formId = "";
      optionForm = (
        <label className="button includeSpan" htmlFor={id}>
          <span>{browser.i18n.getMessage(value)}</span>
          <input
            type="file"
            id={id}
            accept={accept}
            multiple={multiple}
            onChange={onChange}
          />
        </label>
      );
      break;
    }

    case "keyboard-shortcut": {
      formId = id;
      optionForm = (
        <KeyboardShortcutForm
          id={id}
          shortcut={shortcut}
          defaultValue={defaultValue}
        />
      );
      break;
    }
    case "none": {
      formId = "";
      optionForm = "";
      break;
    }
  }

  const shouldShowForReal =
    shouldShow == undefined ||
    (typeof shouldShow === "function" ? shouldShow() : shouldShow);

  return (
    shouldShowForReal && (
      <li
        className={clsx(
          "optionContainer",
          updated ? "updated" : "",
          isNew ? "new" : ""
        )}
      >
        {hr && <hr />}
        <div
          className={`optionElement ${type == "textarea" ? "showColumn" : ""}`}
        >
          <div className="optionText">
            <label className="noHover" htmlFor={formId ? formId : null}>
              <p>
                {title
                  ? useRawTitle
                    ? title
                    : browser.i18n.getMessage(title)
                  : ""}
              </p>
            </label>
            {captions.map((caption, index) => (
              <p className="caption" key={index}>
                {caption
                  ? useRawCaptions
                    ? caption
                    : browser.i18n.getMessage(caption).replace(/<br>/g, "\n")
                  : ""}
              </p>
            ))}
            {extraCaption ? extraCaption : ""}
          </div>
          <div className="optionForm">{optionForm}</div>
        </div>
        {children && (
          <fieldset>
            <legend className="noDisplayLegend">
              {title
                ? useRawTitle
                  ? title
                  : browser.i18n.getMessage(title)
                : ""}
            </legend>
            {children}
          </fieldset>
        )}
      </li>
    )
  );
}

export default OptionContainer;
