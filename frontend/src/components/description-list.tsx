import type { ReactNode } from "react";
import clsx from "clsx";
import type {
  IBaseComponentProps,
  IBaseComponentPropsWithChildren,
} from "#components/types";
import { createBlockComponent } from "./meta";

import styles from "./description-list.module.scss";

interface IDescriptionListProps extends IBaseComponentPropsWithChildren<"dl"> {}

type IDescriptionSectionProps = IBaseComponentProps<"div"> & {
  isHorizontal?: boolean;
} & ({ dKey: ReactNode; dValue?: ReactNode } | { children?: ReactNode });

interface IDescriptionTermProps extends IBaseComponentPropsWithChildren<"dt"> {}

interface IDescriptionDetailsProps
  extends IBaseComponentPropsWithChildren<"dd"> {}

/**
 * @TODO accept `Map` as props.
 */
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

function DescriptionListComponent({ ...props }: IDescriptionListProps) {
  return <dl {...props} />;
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

  return (
    <div className={blockClass} {...props}>
      {!("dKey" in props) ? (
        props.children
      ) : (
        <>
          <DescriptionTerm className={styles.key}>
            {props.dKey}:
          </DescriptionTerm>
          <DescriptionDetails className={styles.value}>
            {props.dValue}
          </DescriptionDetails>
        </>
      )}
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
