export function filterMapArray<OutputType, InputType>(
  inputArray: readonly InputType[],
  filterFunction: (inputItem: InputType) => boolean,
  mapperFunction: (inputItem: InputType) => OutputType,
): [OutputType, ...OutputType[]] | undefined {
  const outputArray = inputArray.reduce<OutputType[]>(
    (outputArray, inputItem) => {
      if (!filterFunction(inputItem)) {
        return outputArray;
      }

      const outputItem = mapperFunction(inputItem);

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
