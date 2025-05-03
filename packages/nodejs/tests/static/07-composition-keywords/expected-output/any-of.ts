export type IAnyOf =
  | {
      lorem: "ipsum";
    }
  | {
      ipsum?: "lorem";
    }
  | {
      dolorem?: string;
    };
