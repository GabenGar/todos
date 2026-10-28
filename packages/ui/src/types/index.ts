export type IOneOrMany<Type> = Type | Type[];

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

/**
 * Stolen from [stackoverflow answer][1].
 *
 * [1]: https://stackoverflow.com/a/76082750
 */
export type IElementType<Type extends Iterable<any>> =
  Type extends Iterable<infer Element> ? Element : never;
