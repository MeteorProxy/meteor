import { generate } from 'astring'
import { replace, type VisitorOption } from 'estraverse'
import type { Node } from 'estree'
import { parseModule, parse } from 'meriyah'
import { encodeURL } from './url'

export function rewriteJs(content: string, origin: URL) {
  try {
    const tree = parseModule(content, { module: true, webcompat: true })

    replace(tree as Node, {
      enter: (node): Node | VisitorOption => {
        if (
          node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          node.object.name === 'window' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'location'
        ) {
          return {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'window'
            },
            property: {
              type: 'Identifier',
              name: '$location'
            },
            computed: false
          } as Node
        }

        if (
          (node.type === 'ImportDeclaration' ||
            node.type === 'ExportNamedDeclaration' ||
            node.type === 'ExportAllDeclaration') &&
          node.source
        ) {
          console.log(String(node.source.value), origin)
          const encodedSource = encodeURL(String(node.source.value), origin)

          console.log(encodedSource, {
            ...node,
            source: {
              ...node.source,
              value: encodedSource
            }
          })

          return {
            ...node,
            source: {
              ...node.source,
              value: encodedSource
            }
          } as Node
        }

        if (
          node.type === 'ImportExpression' &&
          node.source &&
          node.source.type === 'Literal'
        ) {
          const encodedSource = encodeURL(String(node.source.value), origin)

          return {
            ...node,
            source: {
              ...node.source,
              value: encodedSource
            }
          } as Node
        }
      }
    })

    return generate(tree)
  } catch ({ message }) {
    self.$meteor.util.log(`Error parsing JS: ${message}`)
    return content
  }
}
