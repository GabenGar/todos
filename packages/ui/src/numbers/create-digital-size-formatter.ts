import { DIGITAL_SIZE } from "./digital-sizes";
import type { INumberFormatOptions } from "./types";

type IDigitalSizeUnit =
  | "byte"
  | "kilobyte"
  | "megabyte"
  | "gigabyte"
  | "terabyte"
  | "petabyte";
// | "exabyte"
// | "zettabyte"
// | "yottabyte"
// | "ronnabyte"
// | "quettabyte";

const defaultDigitalSizeFormattingOptions: INumberFormatOptions = {
  style: "unit",
  unitDisplay: "long",
};

export function createDigitialSizeFormatter(
  locale: Intl.Locale,
): (size: number) => string {
  const byteFormatter = createFormatter(locale, "byte");
  const kiloByteFormatter = createFormatter(locale, "kilobyte");
  const megaByteFormatter = createFormatter(locale, "megabyte");
  const gigaByteFormatter = createFormatter(locale, "gigabyte");
  const teraByteFormatter = createFormatter(locale, "terabyte");
  const petaByteFormatter = createFormatter(locale, "petabyte");

  function formatDigitalSize(size: number): string {
    if (size < DIGITAL_SIZE.KILOBYTE) {
      return byteFormatter.format(size);
    }

    if (size < DIGITAL_SIZE.MEGABYTE) {
      return kiloByteFormatter.format(size);
    }

    if (size < DIGITAL_SIZE.GIGABYTE) {
      return megaByteFormatter.format(size);
    }

    if (size < DIGITAL_SIZE.TERABYTE) {
      return gigaByteFormatter.format(size);
    }

    if (size < DIGITAL_SIZE.PETABYTE) {
      return teraByteFormatter.format(size);
    }

    return petaByteFormatter.format(size);
  }

  return formatDigitalSize;
}

function createFormatter(
  locale: Intl.Locale,
  unit: IDigitalSizeUnit,
): Intl.NumberFormat {
  const formatter = new Intl.NumberFormat(locale, {
    ...defaultDigitalSizeFormattingOptions,
    unit: unit,
  } satisfies INumberFormatOptions);

  return formatter;
}
