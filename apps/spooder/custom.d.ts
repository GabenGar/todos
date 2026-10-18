// stolen from
// https://stackoverflow.com/a/65326058
declare module "*.svg" {
  import { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

// stolen from
// https://stackoverflow.com/a/41946697
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
