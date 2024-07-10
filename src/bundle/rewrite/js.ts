import { generate } from 'astring'
import { traverse } from 'estraverse'
import type { Node } from 'estree'
import { parseModule } from 'meriyah'
type StupidExtensionOfNode = Node & {
  source?: { value: string }
  property?: { name: string }
  object?: { name: string }
}

// ImportDeclaration
export function rewriteJs(content: string, origin: URL) {
  try {
    console.log(content)
    const tree = parseModule(content, {
      module: true,
      webcompat: true
    })

    console.log(tree)
    traverse(tree as Node, {
      leave(node: StupidExtensionOfNode) {
        // TODO: This is a very shitty method
        if (
          node.type === 'MemberExpression' &&
          node.object.name === 'window' &&
          node.property.name === 'location'
        ) {
          node.object.name = '$location'
        }
        if (node.type === 'Identifier' && node.name === 'location') {
          node.name = '$location'
        }
        if (
          [
            'ImportDeclaration',
            'ImportExpression',
            'ExportAllDeclaration',
            'ExportNamedDeclaration'
          ].includes(node.type)
        ) {
          if (node.source)
            node.source.value = self.Meteor.rewrite.url.encode(
              node.source.value,
              origin
            )
        }
      }
    })
    return generate(tree)
  } catch ({ message }) {
    self.Meteor.util.log(`Error parsing JS: ${message}`)
    return content
  }
}
