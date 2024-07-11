import { generate } from 'astring'
import { replace } from 'estraverse'
import type { Node } from 'estree'
import { parseModule } from 'meriyah'
import { encodeURL } from './url'

export function rewriteJs(content: string, origin: URL) {
  try {
    const tree = parseModule(content, { module: true, webcompat: true })

    replace(tree as Node, {
      enter(node) {
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
            computed: false,
            optional: false
          }
        }

        if (
          (node.type === 'ImportDeclaration' ||
            node.type === 'ExportNamedDeclaration' ||
            node.type === 'ExportAllDeclaration') &&
          node.source
        ) {
          const encodedSource = encodeURL(String(node.source.value), origin)

          return {
            ...node,
            source: {
              ...node.source,
              value: encodedSource
            }
          }
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
          }
        }
      }
    })

    return generate(tree)
  } catch ({ message }) {
    self.$meteor.util.log(`Error parsing JS: ${message}`)
    return content
  }
}
