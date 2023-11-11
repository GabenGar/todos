# Typescript

## Asserton Functions

For some reason typescript requires explicit type assignment to assertion functions.<br>
Given an assertion factory function:

```typescript
export function createAssertionFunction<InputType>(
  guard: (inputData: unknown) => inputData is InputType
): (inputData: unknown) => asserts inputData is InputType {
  function assertData(inputData: unknown): asserts inputData is InputType {
    if (!guard(inputData)) {
      throw new Error(`Assertion failed.`);
    }
  }

  return assertData;
}
```

The usage like this will result in compile error:

```typescript
interface ITask {
  title: string;
}

const validateTask = createAssertionFunction<ITask>((inputData) => {
  const isInputData =
    typeof inputData === "object" &&
    inputData !== null &&
    "title" in inputData &&
    typeof inputData.title === "string" &&
    inputData.title.length !== 0;

  return isInputData;
});
```

So it has to be written like this instead:

```typescript
const validateTask: ReturnType<typeof createAssertionFunction<ITask>> = createAssertionFunction<ITask>((inputData) => {
  const isInputData =
    typeof inputData === "object" &&
    inputData !== null &&
    "title" in inputData &&
    typeof inputData.title === "string" &&
    inputData.title.length !== 0;

  return isInputData;
});
```
