export type IOneOrMany<Type> = Type | readonly Type[];

export type IPartialSome<Type, Key extends keyof Type> = Omit<Type, Key> &
  Pick<Partial<Type>, Key>;

export type IRequiredSome<Type, Key extends keyof Type> = Omit<Type, Key> &
  Pick<Required<Type>, Key>;

export interface IFunction<
  ArgsType extends unknown[] = unknown[],
  ReturnType = unknown,
> {
  (...args: ArgsType): ReturnType;
  (...args: ArgsType): Promise<ReturnType>;
}
