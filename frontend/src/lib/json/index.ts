export function fromJSON<OutputType = unknown>(inputJSON: string): OutputType {
  return JSON.parse(inputJSON) as OutputType;
}

export function toJSON(inputValue: unknown): string {
  return JSON.stringify(inputValue);
}

export function toJSONPretty<InputType = unknown>(
  inputValue: InputType,
): string {
  return JSON.stringify(inputValue, undefined, 2);
}
