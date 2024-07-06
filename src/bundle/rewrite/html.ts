import DomHandler, { Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import serialize from 'dom-serializer'

import { encodeURL } from './url'
import { config } from '@/config'

// action
// data
// href
// src

export function rewriteHtml(content: string) {
  const dom = new DomHandler()
  const parser = new Parser(dom)
  parser.write(content)
  parser.end()

  const parsed = rewriteAttributes(dom.root as unknown as Element)

  return serialize(parsed)
}

function rewriteAttributes(element: Element) {
  if (element.type !== ElementType.Tag) return
  const node = new ElementProxy(element)
  node.encode('action', 'url')
  node.encode('href', 'url')
  node.encode('src', 'url')

  node.encodeChildren()

  if (node.element.tagName == 'head') {
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
        this.element.attribs[attribute] = encodeURL(this.element.attribs[attribute])
      case 'html':
      case 'css':
      case 'js':
    }
  }

  encodeChildren() {
    this.element.children.forEach((child) => {
      if (child.type == ElementType.Tag) child = rewriteAttributes(child)
    })
  }
}
