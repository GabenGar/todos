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
      const resolvedSize = size / DIGITAL_SIZE.KILOBYTE;

      return kiloByteFormatter.format(resolvedSize);
    }

    if (size < DIGITAL_SIZE.GIGABYTE) {
      const resolvedSize = size / DIGITAL_SIZE.MEGABYTE;

      return megaByteFormatter.format(resolvedSize);
    }

    if (size < DIGITAL_SIZE.TERABYTE) {
      const resolvedSize = size / DIGITAL_SIZE.GIGABYTE;

      return gigaByteFormatter.format(resolvedSize);
    }

    if (size < DIGITAL_SIZE.PETABYTE) {
      const resolvedSize = size / DIGITAL_SIZE.TERABYTE;

      return teraByteFormatter.format(resolvedSize);
    }

    const resolvedSize = size / DIGITAL_SIZE.PETABYTE;

    return petaByteFormatter.format(resolvedSize);
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
