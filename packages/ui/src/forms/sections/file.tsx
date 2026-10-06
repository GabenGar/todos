import { type ChangeEvent, type ReactNode, useRef, useState } from "react";
import { FileItem } from "#files";
import { useTranslation } from "#hooks";
import { List } from "#lists";
import { createBlockComponent } from "#meta";
import { type IInputFileProps, InputFile } from "../inputs";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "./section";
//

import styles from "./file.module.scss";

interface IProps
  extends IInputSectionProps,
    Pick<IInputFileProps, "accept" | "multiple"> {
  label?: ReactNode;
}

/**
 * @TODOs
 * - styling for drag and drop states
 * - validation of inputs
 */
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
  label,
  children,
  onDragEnter,
  onDragOver,
  onDrop,
  ...props
}: IProps) {
  const { t } = useTranslation();
  const [currentFiles, changeCurrentFiles] = useState<File[]>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    const fileList = event.target.files;

    if (!fileList) {
      changeCurrentFiles(undefined);
      return;
    }

    const files = Array.from(fileList);
    changeCurrentFiles(files);
  }

  return (
    <InputSection
      // Drag'n'Drop from
      // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop
      onDragEnter={async (event) => {
        event.stopPropagation();
        event.preventDefault();

        onDragEnter?.(event);
      }}
      onDragOver={async (event) => {
        event.stopPropagation();
        event.preventDefault();

        onDragOver?.(event);
      }}
      onDrop={async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        const fileList = dataTransfer.files;

        if (!inputRef.current) {
          return;
        }

        inputRef.current.files = fileList;
        // setting the thing above doesn't trigger `onChange()`
        // so it is set manually in there
        // @TODO find a way to trigger `onChange()`
        changeCurrentFiles(Array.from(fileList));

        onDrop?.(event);
      }}
      {...props}
    >
      {!label ? undefined : <Label htmlFor={id}>{label}</Label>}

      <InputFile
        ref={inputRef}
        id={id}
        className={styles.input}
        name={name}
        form={form}
        accept={accept}
        multiple={multiple}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />

      <Label className={styles.label} htmlFor={id} separator={null}>
        {children ?? t((t) => t.input.file.label)}
      </Label>

      {!currentFiles ? undefined : (
        <List className={styles.list}>
          {currentFiles.map((file, index) => (
            <FileItem key={index} file={file} />
          ))}
        </List>
      )}
    </InputSection>
  );
}
