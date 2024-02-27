export function validateValue(value: string, maxLength: number) {
  const pattern = /^\d+$/;
  if (!pattern.test(value)) {
    return "";
  }

  if (value.length > maxLength) {
    return value.slice(0, maxLength);
  }

  return value;
}
