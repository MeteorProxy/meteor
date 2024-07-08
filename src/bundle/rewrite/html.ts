import { config } from '@/config'
import serialize from 'dom-serializer'
import DomHandler, { Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import { rewriteCss } from './css'
import { rewriteJs } from './js'
import { encodeURL } from './url'

const attributes = {
  url: ['action', 'data', 'href', 'src'],
  html: ['srcdoc'],
  css: ['style'],
  js: []
}

// const eventListeners: string[] = []
// const properties = Object.getOwnPropertyNames(HTMLElement.prototype)

// properties.forEach((prop) => {
//   if (prop.startsWith('on')) {
//     eventListeners.push(prop)
//   }
// })

// eventListeners.sort()
// attributes.js.push(...eventListeners)

export function rewriteHtml(content: string) {
  const dom = new DomHandler()
  const parser = new Parser(dom)
  parser.write(content)
  parser.end()

  const parsed = rewriteAttributes(dom.root as unknown as Element)

  return serialize(dom.root)
}

function rewriteAttributes(element: Element) {
  if (element.type !== ElementType.Tag) return
  const node = new ElementProxy(element)

  for (const attr of attributes.url) {
    node.encode(attr, 'url')
  }

  for (const attr of attributes.css) {
    node.encode(attr, 'css')
  }

  node.encodeChildren()

  if (node.element.tagName === 'head') {
    const scripts: Element[] = []

    scripts.push(
      new Element('script', {
        src: config.files.bundle
      })
    )

    scripts.push(
      new Element('script', {
        src: config.files.client
      })
    )

    scripts.push(
      new Element('script', {
        src: config.files.config
      })
    )

    node.element.children.push(...scripts)
  }

  return node.element
}

class ElementProxy {
  element: Element
  constructor(element: Element) {
    this.element = element
  }

  encode(attribute: string, type: 'url' | 'html' | 'css' | 'js') {
    if (!hasAttrib(this.element, attribute)) return

    switch (type) {
      case 'url':
        this.element.attribs[attribute] = encodeURL(
          this.element.attribs[attribute]
        )
        break
      case 'html':
        this.element.attribs[attribute] = rewriteHtml(
          this.element.attribs[attribute]
        )
        break
      case 'css':
        this.element.attribs[attribute] = rewriteCss(
          this.element.attribs[attribute]
        )
        break
      case 'js':
        this.element.attribs[attribute] = rewriteJs(
          this.element.attribs[attribute]
        )
    }
  }

  encodeChildren() {
    // biome-ignore lint: this is weird
    this.element.children.forEach((child) => {
      if (child.type === ElementType.Tag) child = rewriteAttributes(child)
    })
  }
}
