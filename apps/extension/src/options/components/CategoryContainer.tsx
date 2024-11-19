import React from "react";
import browser from "webextension-polyfill";
import OptionContainer from "./OptionContainer";

import "./CategoryContainer.scss";

interface IProps {
  category: string;
  elements: IOption[];
  currentValues?: Record<string, unknown>;
}

interface IOption {
  id: string;
  childElements?: IOption[];
}

function CategoryContainer({ category, elements, currentValues = {} }: IProps) {
  return (
    <li className="categoryContainer">
      <fieldset>
        <legend>
          <p className="categoryTitle">
            {category !== "" ? browser.i18n.getMessage(category) : ""}
          </p>
        </legend>

        <ul className="categoryElements">
          {elements.map((option, index) => (
            <div key={index}>
              {/* @ts-expect-error too generic */}
              <OptionContainer
                {...option}
                currentValue={String(currentValues[option.id])}
              >
                {option.hasOwnProperty("childElements") && (
                  <ul className="childElements">
                    {option.childElements.map((option, index) => (
                      // @ts-expect-error too generic
                      <OptionContainer
                        {...option}
                        currentValue={String(currentValues[option.id])}
                        key={index}
                      />
                    ))}
                  </ul>
                )}
              </OptionContainer>
              <hr />
            </div>
          ))}
        </ul>
      </fieldset>
    </li>
  );
}

export default CategoryContainer;
