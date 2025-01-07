export type IOneOrMany<Type> = Type | readonly Type[];

export type IPartialSome<Type, Key extends keyof Type> = Omit<Type, Key> &
  Pick<Partial<Type>, Key>;

export type IRequiredSome<Type, Key extends keyof Type> = Omit<Type, Key> &
  Pick<Required<Type>, Key>;

/**
 * Stolen from [github](https://github.com/microsoft/TypeScript/issues/1897#issuecomment-822032151).
 */
export type IJSONAble =
  | string
  | number
  | boolean
  | null
  | IJSONAble[]
  | { [key: string]: IJSONAble };
