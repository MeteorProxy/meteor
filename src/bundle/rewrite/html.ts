import { render } from 'dom-serializer'
import DomHandler, { type Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import { rewriteCss } from './css'
import { rewriteJs } from './js'
import { encodeURL } from './url'

const attributes = {
  csp: ['nonce', 'integrity', 'csp'],
  url: ['action', 'data', 'href', 'src', 'formaction'],
  html: ['srcdoc'],
  css: ['style'],
  js: ['src']
}

export function rewriteHtml(content: string, origin: string) {
  const dom = new DomHandler()
  const parser = new Parser(dom)
  parser.write(content)
  parser.end()

  return render(rewriteElement(dom.root as unknown as Element, origin))
}

function rewriteElement(element: Element, origin: string) {
  for (const attr of attributes.csp) {
    if (hasAttrib(element, attr)) {
      delete element.attribs[attr]
    }
  }

  for (const attr of attributes.url) {
    if (hasAttrib(element, attr)) {
      element.attribs[attr] =
        location.origin +
        self.__meteor$config.prefix +
        encodeURL(element.attribs[attr], origin)
    }
  }

  for (const child of element.children) {
    if (child.type === ElementType.ElementType.Tag) {
      rewriteElement(child, origin)
    }
  }

  return element
}
