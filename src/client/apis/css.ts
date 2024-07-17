import { patchFunction } from '../patch'
const urlProps = [
  'background',
  'background-image',
  'mask',
  'mask-image',
  'list-style',
  'list-style-image',
  'border-image',
  'border-image-source',
  'cursor'
]
CSSStyleDeclaration.prototype.setProperty = patchFunction(
  CSSStyleDeclaration.prototype.setProperty,
  ([prop, value, ...rest]) => {
    if (urlProps.includes(prop)) {
      value = self.$meteor.rewrite.css(value, new URL(self.$location.origin))
    }
    return [prop, value, ...rest]
  }
)
