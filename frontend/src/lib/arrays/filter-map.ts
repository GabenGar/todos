export function filterMapArray<OutputType, InputType>(
  inputArray: readonly InputType[],
  filterFunction: (inputItem: InputType, index: number) => boolean,
  mapperFunction: (inputItem: InputType, index: number) => OutputType,
): [OutputType, ...OutputType[]] | undefined {
  const outputArray = inputArray.reduce<OutputType[]>(
    (outputArray, inputItem, index) => {
      if (!filterFunction(inputItem, index)) {
        return outputArray;
      }

      const outputItem = mapperFunction(inputItem, index);

      outputArray.push(outputItem);

      return outputArray;
    },
    [],
  );

  if (!outputArray.length) {
    return undefined;
  }

  return outputArray as [OutputType, ...OutputType[]];
}
