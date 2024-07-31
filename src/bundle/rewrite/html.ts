import type { Config } from '@/types'
import { render } from 'dom-serializer'
import DomHandler, { Element } from 'domhandler'
import { hasAttrib } from 'domutils'
import { ElementType, Parser } from 'htmlparser2'
import { createContext } from '../util/createContext'
import { rewriteCss } from './css'
import { rewriteJs } from './js'
import { rewriteSrcset } from './srcset'

const attributes = {
  csp: ['nonce', 'integrity', 'csp'],
  url: ['action', 'data', 'href', 'src', 'formaction'],
  html: ['srcdoc'],
  css: ['style'],
  js: ['src'],
  srcset: ['srcset']
}

export async function rewriteHtml(content: string, origin: URL) {
  const dom = new DomHandler()
  const parser = new Parser(dom)
  parser.write(content)
  parser.end()

  let rendered = render(rewriteElement(dom.root as unknown as Element, origin))

  for (const plugin of await self.$meteor.util.getEnabledPlugins(
    origin.href,
    'inject'
  )) {
    self.$meteor.util.log(`Running inject for ${plugin.name}`, 'teal')
    const context = createContext(rendered, origin)
    await plugin.inject(context)
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
      element.attribs[attr] = self.$meteor.rewrite.url.encode(
        element.attribs[attr],
        origin
      )
    }
  }

  for (const attr of attributes.srcset) {
    if (hasAttrib(element, attr)) {
      element.attribs[attr] = rewriteSrcset(element.attribs[attr], origin)
    }
  }

  if (element.name === 'head') {
    const scriptsToPush: (keyof Config['files'])[] = [
      'client',
      'bundle',
      'config',
      'codecs'
    ]

    for (const script of scriptsToPush) {
      if (!script) continue
      element.children.unshift(
        new Element('script', {
          src: self.$meteor.config.files[script]
        })
      )
    }
  }

  if (['video', 'audio'].includes(element.name)) {
    if (hasAttrib(element, 'src')) {
      element.attribs.src = self.$meteor.rewrite.url.encode(
        element.attribs.src,
        origin
      )
    }
  }

  if (['link', 'a'].includes(element.name)) {
    if (hasAttrib(element, 'href')) {
      self.$meteor.util.log(element.attribs.href, 'green')
      /*
      if (typeof location !== "undefined") {
        element.attribs.onclick = `
          ${location.href = element.attribs.href}
        `
        delete element.attribs.href
      }
      */
    }
  }

  for (const child of element.children) {
    if (child.type === ElementType.ElementType.Tag) {
      rewriteElement(child, origin)
    }
  }

  return element
}
