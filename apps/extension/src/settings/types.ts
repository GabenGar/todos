import type React from "react";

export type ISettings = [
  IGeneralLabelSettings,
  IWebPageLabelSettings,
  IToolbarLabelSettings,
  IMenuLabelSettings,
  IPageTranslationLabelSettings,
  IStyleLabelSettings,
  IOtherLabelSettings
];

interface IGeneralLabelSettings {
  category: "generalLabel";
  elements: [
    {
      id: "translationApi";
      title: "translationApiLabel";
      captions: [];
      type: "none";
      default: "google";
      childElements: [
        {
          id: "translationApi";
          title: "googleApiLabel";
          captions: ["googleApiCaptionLabel"];
          type: "radio";
          value: "google";
          handleChange: () => void;
        },
        {
          id: "translationApi";
          title: "deeplApiLabel";
          captions: ["deeplApiCaptionLabel"];
          extraCaption: React.DetailedReactHTMLElement<
            {
              className: string;
            },
            HTMLElement
          >;
          type: "radio";
          value: "deepl";
          handleChange: () => void;
        },
        {
          id: "deeplPlan";
          title: "deeplPlanLabel";
          captions: ["deeplPlanCaptionLabel"];
          type: "select";
          default: "deeplFree";
          shouldShow: () => boolean;
          hr: true;
          options: [
            {
              name: "deeplFreeLabel";
              value: "deeplFree";
            },
            {
              name: "deeplProLabel";
              value: "deeplPro";
            }
          ];
        },
        {
          id: "deeplAuthKey";
          title: "deeplAuthKeyLabel";
          captions: ["deeplAuthKeyCaptionLabel"];
          type: "text";
          default: "";
          placeholder: "00000000-0000-0000-0000-00000000000000:fx";
          shouldShow: () => boolean;
        }
      ];
    },
    {
      id: "targetLang";
      title: "targetLangLabel";
      captions: ["targetLangCaptionLabel"];
      type: "select";
      default: string;
      options: () => {
        value: string;
        name: string;
      }[];
      useRawOptionName: true;
    },
    {
      id: "secondTargetLang";
      title: "secondTargetLangLabel";
      captions: ["secondTargetLangCaptionLabel"];
      type: "select";
      default: string;
      options: () => {
        value: string;
        name: string;
      }[];
      useRawOptionName: true;
    },
    {
      id: "ifShowCandidate";
      title: "ifShowCandidateLabel";
      captions: ["ifShowCandidateCaptionLabel"];
      type: "checkbox";
      default: true;
      shouldShow: () => boolean;
    }
  ];
}

interface IWebPageLabelSettings {
  category: "webPageLabel";
  elements: [
    {
      id: "whenSelectText";
      title: "whenSelectTextLabel";
      captions: [];
      type: "none";
      default: "showButton";
      childElements: [
        {
          id: "whenSelectText";
          title: "ifShowButtonLabel";
          captions: ["ifShowButtonCaptionLabel"];
          type: "radio";
          value: "showButton";
        },
        {
          id: "whenSelectText";
          title: "ifAutoTranslateLabel";
          captions: ["ifAutoTranslateCaptionLabel"];
          type: "radio";
          value: "showPanel";
        },
        {
          id: "whenSelectText";
          title: "dontShowButtonLabel";
          captions: ["dontShowButtonCaptionLabel"];
          type: "radio";
          value: "dontShowButton";
        },
        {
          id: "ifCheckLang";
          title: "ifCheckLangLabel";
          captions: ["ifCheckLangCaptionLabel"];
          type: "checkbox";
          default: true;
          hr: true;
        }
      ];
    },
    {
      id: "ifOnlyTranslateWhenModifierKeyPressed";
      title: "ifOnlyTranslateWhenModifierKeyPressedLabel";
      captions: ["ifOnlyTranslateWhenModifierKeyPressedCaptionLabel"];
      type: "checkbox";
      default: false;
      childElements: [
        {
          id: "modifierKey";
          title: "modifierKeyLabel";
          captions: [];
          type: "select";
          default: "shift";
          options: [
            {
              name: "shiftLabel";
              value: "shift";
            },
            {
              name: "ctrlLabel";
              value: "ctrl";
            },
            {
              name: "altLabel";
              value: "alt";
            },
            {
              name: "cmdLabel";
              value: "cmd";
            }
          ];
        }
      ];
    },
    {
      id: "ifChangeSecondLangOnPage";
      title: "ifChangeSecondLangLabel";
      captions: ["ifChangeSecondLangOnPageCaptionLabel"];
      type: "checkbox";
      default: false;
    },
    {
      title: "disableTranslationLabel";
      captions: [];
      type: "none";
      childElements: [
        {
          id: "isDisabledInTextFields";
          title: "isDisabledInTextFieldsLabel";
          captions: ["isDisabledInTextFieldsCaptionLabel"];
          type: "checkbox";
          default: false;
        },
        {
          id: "isDisabledInCodeElement";
          title: "isDisabledInCodeElementLabel";
          captions: ["isDisabledInCodeElementCaptionLabel"];
          type: "checkbox";
          default: false;
        },
        {
          id: "ignoredDocumentLang";
          title: "ignoredDocumentLangLabel";
          captions: ["ignoredDocumentLangCaptionLabel"];
          type: "text";
          default: "";
          placeholder: "en, ru, zh";
        },
        {
          id: "disableUrlList";
          title: "disableUrlListLabel";
          captions: ["disableUrlListCaptionLabel"];
          type: "textarea";
          default: "";
          placeholder: "https://example.com/*\nhttps://example.net/*";
        }
      ];
    }
  ];
}

interface IToolbarLabelSettings {
  category: "toolbarLabel";
  elements: [
    {
      id: "waitTime";
      title: "waitTimeLabel";
      captions: ["waitTimeCaptionLabel", "waitTime2CaptionLabel"];
      type: "number";
      min: 0;
      placeholder: 500;
      default: 500;
    },
    {
      id: "ifChangeSecondLang";
      title: "ifChangeSecondLangLabel";
      captions: ["ifChangeSecondLangCaptionLabel"];
      type: "checkbox";
      default: true;
    }
  ];
}

interface IMenuLabelSettings {
  category: "menuLabel";
  elements: [
    {
      id: "ifShowMenu";
      title: "ifShowMenuLabel";
      captions: ["ifShowMenuCaptionLabel"];
      type: "checkbox";
      default: true;
    }
  ];
}

interface IPageTranslationLabelSettings {
  category: "pageTranslationLabel";
  elements: [
    {
      id: "pageTranslationOpenTo";
      title: "pageTranslationOpenToLabel";
      captions: ["pageTranslationOpenToCaptionLabel"];
      type: "select";
      default: "newTab";
      options: [
        { name: "newTabLabel"; value: "newTab" },
        { name: "currentTabLabel"; value: "currentTab" }
      ];
    }
  ];
}

interface IStyleLabelSettings {
  category: "styleLabel";
  elements: [
    {
      id: "theme";
      title: "themeLabel";
      captions: ["themeCaptionLabel"];
      type: "select";
      default: "system";
      options: [
        { name: "lightLabel"; value: "light" },
        { name: "darkLabel"; value: "dark" },
        { name: "systemLabel"; value: "system" }
      ];
    },
    {
      title: "buttonStyleLabel";
      captions: ["buttonStyleCaptionLabel"];
      type: "none";
      childElements: [
        {
          id: "buttonSize";
          title: "buttonSizeLabel";
          captions: [];
          type: "number";
          min: 1;
          placeholder: 22;
          default: 22;
        },
        {
          id: "buttonDirection";
          title: "displayDirectionLabel";
          captions: [];
          type: "select";
          default: "bottomRight";
          options: [
            {
              name: "topLabel";
              value: "top";
            },
            {
              name: "bottomLabel";
              value: "bottom";
            },
            {
              name: "rightLabel";
              value: "right";
            },
            {
              name: "leftLabel";
              value: "left";
            },
            {
              name: "topRightLabel";
              value: "topRight";
            },
            {
              name: "topLeftLabel";
              value: "topLeft";
            },
            {
              name: "bottomRightLabel";
              value: "bottomRight";
            },
            {
              name: "bottomLeftLabel";
              value: "bottomLeft";
            }
          ];
        },
        {
          id: "buttonOffset";
          title: "positionOffsetLabel";
          captions: [];
          type: "number";
          default: 10;
          placeholder: 10;
        }
      ];
    },
    {
      title: "panelStyleLabel";
      captions: ["panelStyleCaptionLabel"];
      type: "none";
      childElements: [
        {
          id: "width";
          title: "widthLabel";
          captions: [];
          type: "number";
          min: 1;
          placeholder: 300;
          default: 300;
        },
        {
          id: "height";
          title: "heightLabel";
          captions: [];
          type: "number";
          min: 1;
          placeholder: 200;
          default: 200;
        },
        {
          id: "fontSize";
          title: "fontSizeLabel";
          captions: [];
          type: "number";
          min: 1;
          placeholder: 13;
          default: 13;
        },
        {
          id: "panelReferencePoint";
          title: "referencePointLabel";
          captions: [];
          type: "select";
          default: "bottomSelectedText";
          options: [
            { name: "topSelectedTextLabel"; value: "topSelectedText" },
            { name: "bottomSelectedTextLabel"; value: "bottomSelectedText" },
            { name: "clickedPointLabel"; value: "clickedPoint" }
          ];
        },
        {
          id: "panelDirection";
          title: "displayDirectionLabel";
          captions: [];
          type: "select";
          default: "bottom";
          options: [
            { name: "topLabel"; value: "top" },
            { name: "bottomLabel"; value: "bottom" },
            { name: "rightLabel"; value: "right" },
            { name: "leftLabel"; value: "left" },
            { name: "topRightLabel"; value: "topRight" },
            { name: "topLeftLabel"; value: "topLeft" },
            { name: "bottomRightLabel"; value: "bottomRight" },
            { name: "bottomLeftLabel"; value: "bottomLeft" }
          ];
        },
        {
          id: "panelOffset";
          title: "positionOffsetLabel";
          captions: [];
          type: "number";
          default: 10;
          placeholder: 10;
        },
        {
          id: "isOverrideColors";
          title: "isOverrideColorsLabel";
          captions: [];
          type: "checkbox";
          default: false;
        },
        {
          id: "resultFontColor";
          title: "resultFontColorLabel";
          captions: [];
          type: "color";
          default: string;
        },
        {
          id: "candidateFontColor";
          title: "candidateFontColorLabel";
          captions: [];
          type: "color";
          default: string;
        },
        {
          id: "bgColor";
          title: "bgColorLabel";
          captions: [];
          type: "color";
          default: string;
        }
      ];
    }
  ];
}

interface IOtherLabelSettings {
  category: "otherLabel";
  elements: [
    {
      id: "isShowOptionsPageWhenUpdated";
      title: "isShowOptionsPageWhenUpdatedLabel";
      captions: ["isShowOptionsPageWhenUpdatedCaptionLabel"];
      type: "checkbox";
      default: true;
    },
    {
      id: "isDebugMode";
      title: "isDebugModeLabel";
      captions: ["isDebugModeCaptionLabel"];
      type: "checkbox";
      default: false;
    }
  ];
}
