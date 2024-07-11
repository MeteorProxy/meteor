export function rewriteCss(content: string, origin: URL) {
  const regex =
    /(@import\s+(?!url\())?\s*url\(\s*(['"]?)([^'")]+)\2\s*\)|@import\s+(['"])([^'"]+)\4/g

  return content.replace(
    regex,
    (
      match,
      importStatement,
      urlQuote,
      urlContent,
      importQuote,
      importContent
    ) => {
      const url = urlContent || importContent
      const encodedUrl = self.$meteor.rewrite.url.encode(url.trim(), origin)

      if (importStatement) {
        return `@import url(${urlQuote}${encodedUrl}${urlQuote})`
      }

      if (importQuote) {
        return `@import ${importQuote}${encodedUrl}${importQuote}`
      }

      return `url(${urlQuote}${encodedUrl}${urlQuote})`
    }
  )
}
