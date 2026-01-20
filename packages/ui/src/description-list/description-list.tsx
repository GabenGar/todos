import clsx from "clsx";
import type { ReactNode } from "react";
import { Preformatted } from "#formatting";
import {
  createBlockComponent,
  type IBaseComponentProps,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./description-list.module.scss";

type IDescriptionListProps = IBaseComponentProps<"dl"> & {
  isNested?: boolean;
} & ({ sections: IDescriptionMap } | { children: ReactNode });

/**
 * Is not actual `Map` because keys can be of nullish values
 * without being equal.
 */
interface IDescriptionMap extends Array<[ReactNode, ReactNode]> {}
type IDescriptionSectionProps = IBaseComponentProps<"div"> & {
  isHorizontal?: boolean;
} & (
    | { children?: ReactNode }
    | {
        dKey: ReactNode;
        dValue?: ReactNode;
        isKeyPreformatted?: boolean;
        isValuePreformatted?: boolean;
      }
  );

interface IDescriptionTermProps extends IBaseComponentPropsWithChildren<"dt"> {}

interface IDescriptionDetailsProps
  extends IBaseComponentPropsWithChildren<"dd"> {}

export const DescriptionList = createBlockComponent(
  styles,
  DescriptionListComponent,
);

export const DescriptionSection = createBlockComponent(
  styles.section,
  DescriptionSectionComponent,
);

export const DescriptionTerm = createBlockComponent(
  styles.term,
  DescriptionTermComponent,
);

export const DescriptionDetails = createBlockComponent(
  styles.details,
  DescriptionDetailsComponent,
);

function DescriptionListComponent({
  isNested,
  className,
  ...props
}: IDescriptionListProps) {
  const resolvedClassname = clsx(className, isNested && styles.nested);

  if ("children" in props) {
    return <dl className={resolvedClassname} {...props} />;
  }

  const { sections, ...otherProps } = props;

  return (
    <dl className={resolvedClassname} {...otherProps}>
      {sections.map(([dKey, dValue], index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: only index can be truly unique key in there
        <DescriptionSection key={index} dKey={dKey} dValue={dValue} />
      ))}
    </dl>
  );
}

function DescriptionSectionComponent({
  isHorizontal = false,
  className,
  ...props
}: IDescriptionSectionProps) {
  const blockClass = clsx(
    className,
    "dKey" in props && styles.section_keyValue,
    isHorizontal && styles.section_horizontal,
  );

  // separate returns to avoid passing `dKey` and `dValue` to DOM
  if (!("dKey" in props)) {
    return (
      <div className={blockClass} {...props}>
        {props.children}
      </div>
    );
  }

  const {
    dKey,
    dValue,
    isKeyPreformatted,
    isValuePreformatted,
    ...blockProps
  } = props;

  return (
    <div className={blockClass} {...blockProps}>
      <DescriptionTerm className={styles.key}>
        {isKeyPreformatted ? (
          <Preformatted>{dKey}:</Preformatted>
        ) : (
          <>{dKey}:</>
        )}
      </DescriptionTerm>

      <DescriptionDetails className={styles.value}>
        {isValuePreformatted ? <Preformatted>{dValue}</Preformatted> : dValue}
      </DescriptionDetails>
    </div>
  );
}

function DescriptionTermComponent({ ...props }: IDescriptionTermProps) {
  return <dt {...props} />;
}

function DescriptionDetailsComponent({
  children,
  ...props
}: IDescriptionDetailsProps) {
  return <dd {...props}>{children ?? "Unknown"}</dd>;
}
