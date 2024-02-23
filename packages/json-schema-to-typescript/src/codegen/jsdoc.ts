import { createMultiLineString } from "#strings";

export function createJSDoc(...inputLines: (string | undefined)[]): string {
	const jsDocLines = inputLines.reduce<string[]>((filteredLines, line) => {
		if (line) {
			filteredLines.push(` * ${line}`);
		}

		return filteredLines;
	}, []);

	if (jsDocLines.length === 0) {
		return "";
	}

	const annotation = createMultiLineString("/**", ...jsDocLines, "*/");

	return annotation;
}
