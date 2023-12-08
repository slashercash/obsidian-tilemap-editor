export class Space {
  private readonly root: HTMLDivElement

  constructor(parent: HTMLDivElement) {
    this.root = document.createElement('div')
    this.root.style.position = 'relative'
    parent.appendChild(this.root)
  }

  public setStyle(width: number, height: number, overflowHorizontalInverted: number, overflowVerticalInverted: number) {
    this.root.style.width = width - 2 * overflowHorizontalInverted + 'px'
    this.root.style.height = height - 2 * overflowVerticalInverted + 'px'
    this.root.style.position = 'relative'
  }

  public append(...nodes: (string | Node)[]) {
    this.root.append(...nodes)
  }
}
