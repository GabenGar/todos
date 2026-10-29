export function mergeSets<Element>(...inputSets: Set<Element>[]): Set<Element> {
  const resultSet = new Set<Element>();

  for (const inputSet of inputSets) {
    for (const value of inputSet.values()) {
      resultSet.add(value);
    }
  }

  return resultSet;
}
