/** A simple interface for higlight.js. */
interface HighlightJS {
  /** Apply highlighting to an HTML element. */
  highlightBlock(element: Element | Document): void
}

interface IHighlightCode {
  scan(rootElem?: Element): void
}

declare global {
  const hljs: HighlightJS
  const HighlightCode: IHighlightCode

  interface Window {
    HighlightCode: IHighlightCode
  }
}

export {}
