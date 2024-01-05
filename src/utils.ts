// TODO: This is maybe not KISS

type CreateElementOptions<K extends keyof HTMLElementTagNameMap> = Partial<HTMLElementTagNameMap[K]> & {
  childrenToAppend?: ReadonlyArray<Node>
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: CreateElementOptions<K>
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  if (!options) {
    return element
  }
  options.className && (element.className = options.className)
  options.innerText && (element.innerText = options.innerText)
  options.childrenToAppend && element.append(...options.childrenToAppend)
  'onclick' in options && (element.onclick = options.onclick as (e: MouseEvent) => any)
  'onchange' in options && (element.onchange = options.onchange as (e: Event) => any)
  return element
}
