"use client";

import { useState } from "react";
import { createBlockComponent } from "#components/meta";
import { type IInputFileProps, InputFile } from "../input";
import { Label } from "../label";
import { IInputSectionProps, InputSection } from "./section";

import styles from "./file.module.scss";

interface IProps
  extends IInputSectionProps,
    Pick<IInputFileProps, "accept" | "multiple"> {}

export const InputSectionFile = createBlockComponent(styles, Component);

function Component({
  id,
  name,
  form,
  accept,
  multiple,
  defaultValue,
  readOnly,
  required,
  disabled,
  children,
  ...props
}: IProps) {
  const [currentFiles, changeCurrentFiles] = useState<File[]>();

  return (
    <InputSection {...props}>
      <InputFile
        id={id}
        className={styles.input}
        name={name}
        form={form}
        accept={accept}
        multiple={multiple}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        onChange={async (event) => {
          const fileList = event.target.files;

          if (!fileList) {
            changeCurrentFiles(undefined);
            return;
          }

          const files = Array.from(fileList);
          changeCurrentFiles(files);
        }}
      />
      {!currentFiles ? (
        <Label className={styles.label} htmlFor={id}>
          {children}
        </Label>
      ) : (
        <ul>
          {currentFiles.map(({ name, size, type }, index) => (
            <li key={index}>
              {type} - {name} - {size}
            </li>
          ))}
        </ul>
      )}
    </InputSection>
  );
}
