
const unified = require(`unified`)
const remarkParse = require(`remark-parse`)
const remarkRehype = require(`remark-rehype`)
const rehypePrism = require(`@mapbox/rehype-prism`)
const stringify = require(`rehype-stringify`)



module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `Site`) return

  const sloganMarkdown = node.siteMetadata.slogan
  const sloganHtml = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(stringify)
    .processSync(sloganMarkdown)
    .toString()
  node.siteMetadata.slogan = sloganHtml

}