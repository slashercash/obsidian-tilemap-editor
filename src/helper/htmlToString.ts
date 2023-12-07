export function htmlToString(html: Element): string {
  return format(html).outerHTML
}

function format(node: Element, level: number = 1): Element {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter = new Array(level - 1).join('  '),
    textNode

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore)
    node.insertBefore(textNode, node.children[i] ?? null)

    const child = node.children[i]
    if (child !== undefined) {
      format(child, level)
    }

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter)
      node.appendChild(textNode)
    }
  }

  return node
}
