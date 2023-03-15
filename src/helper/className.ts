export function cn(name: string, extension: string | false): string {
  if (extension) {
    return `${name} ${name}--${extension}`
  }
  return name
}
