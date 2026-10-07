export function yamlScalar(value: string): string {
  if (value === "") return '""';
  if (
    /^\d/.test(value) ||
    /[:#{}[\],&*!|>'"%@`]/.test(value) ||
    /^\s|\s$/.test(value)
  ) {
    return JSON.stringify(value);
  }
  return value;
}
