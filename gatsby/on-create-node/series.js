const { slugify } = require(`../utils`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: { series },
  } = node

  if (!series) return

  const id = createNodeId(series)
  const slug = slugify(series)
  createNodeField({
    node,
    name: "series",
    value: {
      id,
      name: series,
      slug,
    },
  })

  const seriesNode = getNode(id)
  if (seriesNode) {
    seriesNode.posts = [node].concat(seriesNode.posts)
  } else {
    createNode({
      id,
      name: series,
      parent: null,
      children: [],
      slug,
      posts: [node],
      internal: {
        type: `series`,
        mediaType: `text/plain`,
        content: series,
        contentDigest: createContentDigest(series),
      },
    })
  }
}
