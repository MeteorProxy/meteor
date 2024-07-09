import { config } from '@/config'
import { render } from 'dom-serializer'
import DomHandler, { Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import { rewriteCss } from './css'
import { rewriteJs } from './js'
import { rewriteSrcset } from './srcset'
import { encodeURL } from './url'

const attributes = {
  csp: ['nonce', 'integrity', 'csp'],
  url: ['action', 'data', 'href', 'src', 'formaction'],
  html: ['srcdoc'],
  css: ['style'],
  js: ['src'],
  srcset: ['srcset']
}

export function rewriteHtml(content: string, origin: URL) {
  const dom = new DomHandler()
  const parser = new Parser(dom)
  parser.write(content)
  parser.end()

  return render(rewriteElement(dom.root as unknown as Element, origin))
}

function rewriteElement(element: Element, origin: URL) {
  for (const child of element.children) {
    if (child.type === 'style') {
      ;(child.children[0] as { data: string }).data = rewriteCss(
        (child.children[0] as { data: string }).data,
        origin
      )
    }

    if (child.type === 'script' && child.children[0]) {
      ;(child.children[0] as { data: string }).data = rewriteJs(
        (child.children[0] as { data: string }).data,
        origin
      )
    }
  }

  for (const attr of attributes.csp) {
    if (hasAttrib(element, attr)) {
      delete element.attribs[attr]
    }
  }

  for (const attr of attributes.url) {
    if (hasAttrib(element, attr)) {
      element.attribs[attr] = encodeURL(element.attribs[attr], origin)
    }
  }

  for (const attr of attributes.srcset) {
    if (hasAttrib(element, attr)) {
      element.attribs[attr] = rewriteSrcset(element.attribs[attr], origin)
    }
  }

  if (element.name === 'head') {
    const scriptsToPush = ['bundle', 'config', 'client']
    const clientScripts = []

    for (const script of scriptsToPush) {
      clientScripts.push(
        new Element('script', {
          src: config.files[script]
        })
      )
    }
    element.children.push(...clientScripts)
  }

  for (const child of element.children) {
    if (child.type === ElementType.ElementType.Tag) {
      rewriteElement(child, origin)
    }
  }

  return element
}
