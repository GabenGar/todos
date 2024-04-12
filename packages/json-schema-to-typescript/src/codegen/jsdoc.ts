import { createMultiLineString, NEWLINE } from "#strings";

export function createJSDoc(...inputLines: (string | undefined)[]): string {
	const jsDocLines = inputLines.reduce<string[]>((filteredLines, inputLine) => {
		if (inputLine) {
			const moreLines = inputLine.split(NEWLINE).map((line) => ` * ${line}`);
			filteredLines.push(...moreLines);
		}

		return filteredLines;
	}, []);

	if (jsDocLines.length === 0) {
		return "";
	}

	const annotation = createMultiLineString("/**", ...jsDocLines, "*/");

	return annotation;
}
