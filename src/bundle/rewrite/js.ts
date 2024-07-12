import { generate } from 'astring'
import { replace } from 'estraverse'
import type { Node } from 'estree'
import { parseModule } from 'meriyah'

export function rewriteJs(content: string, origin: URL) {
  try {
    const tree = parseModule(content, { module: true, webcompat: true })

    replace(tree as Node, {
      enter(node) {
        if (
          node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          ['window', 'self', 'document', 'globalThis'].includes(
            node.object.name
          ) &&
          node.property.type === 'Identifier' &&
          node.property.name === 'location'
        ) {
          return {
            ...node,
            property: {
              ...node.property,
              name: '$location'
            }
          }
        }

        if (
          node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          node.object.name === 'location'
        ) {
          return {
            ...node,
            object: {
              ...node.object,
              name: '$location'
            }
          }
        }

        if (
          (node.type === 'ImportDeclaration' ||
            node.type === 'ExportNamedDeclaration' ||
            node.type === 'ExportAllDeclaration') &&
          node.source
        ) {
          const encodedSource = self.$meteor.rewrite.url.encode(
            String(node.source.value),
            origin
          )

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
          return {
            ...node,
            source: {
              ...node.source,
              value: self.$meteor.rewrite.url.encode(
                String(node.source.value),
                origin
              )
            }
          }
        }
        if (
          node.type === 'CallExpression' &&
          'name' in node.callee &&
          node.callee.name === 'importScripts'
        ) {
          return {
            ...node,
            arguments: node.arguments.map((arg) => {
              if (arg.type === 'Literal') {
                return {
                  ...arg,
                  value: self.$meteor.rewrite.url.encode(
                    String(arg.value),
                    origin
                  )
                }
              }
              return arg
            })
          }
        }
      }
    })

    return generate(tree)
  } catch ({ message }) {
    self.$meteor.util.log(`Error parsing JS: ${message}`, '#FF5757')
    return content
  }
}
