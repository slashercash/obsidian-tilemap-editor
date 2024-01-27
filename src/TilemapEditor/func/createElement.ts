export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
  // TODO: propably remove the children element
  children?: Array<string | Node>
): HTMLElementTagNameMap[K] {
  const element = Object.assign(document.createElement(tagName), options)
  children && element.append(...children)
  return element
}
