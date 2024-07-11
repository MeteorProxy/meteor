import { config } from '@/config'
import { render } from 'dom-serializer'
import DomHandler, { Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import { createContext } from '../util/createContext'
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

  let rendered = render(rewriteElement(dom.root as unknown as Element, origin))

  for (const plugin of config.plugins) {
    const context = createContext(rendered)
    plugin.inject(context)

    rendered = context.getModified()
  }

  return rendered
}

function rewriteElement(element: Element, origin: URL) {
  // idk why this for loop is needed but it is
  for (const child of element.children) {
    if (child.type === ElementType.Script) {
      rewriteElement(child, origin)
    }

    if (
      child.type === 'style' &&
      child.children[0] &&
      'data' in child.children[0]
    ) {
      child.children[0].data = rewriteCss(child.children[0].data, origin)
    }

    if (
      child.type === 'script' &&
      child.children[0] &&
      'data' in child.children[0]
    ) {
      child.children[0].data = rewriteJs(child.children[0].data, origin)
    }
  }

  for (const attr of attributes.csp) {
    if (hasAttrib(element, attr)) {
      delete element.attribs[attr]
    }
  }

  for (const attr of attributes.url) {
    if (hasAttrib(element, attr)) {
      element.attribs[attr] =
        element.attribs[attr].startsWith('/') &&
        !element.attribs[attr].startsWith('//')
          ? encodeURL(origin.origin + element.attribs[attr], origin)
          : element.attribs[attr].startsWith('//')
            ? encodeURL(`https:${element.attribs[attr]}`, origin)
            : encodeURL(element.attribs[attr], origin)
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
