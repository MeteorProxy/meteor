import DomHandler from 'domhandler'
import { Parser } from 'htmlparser2'

// action
// data
// href
// src

function encodeAttribute(node: Element, attribute: string) {
  
}

export function rewriteHtml(content: string) {
  const handler = new DomHandler()
  const parser = new Parser(handler)
  parser.write(content)
  parser.end()


}
