const { slugify } = require(`../utils`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: { category },
  } = node

  if (!category) return

  const id = createNodeId(category)
  const slug = slugify(category)
  createNodeField({
    node,
    name: "category",
    value: {
      id,
      name: category,
      slug,
    },
  })

  const categoryNode = getNode(id)
  if (categoryNode) {
    categoryNode.posts = [node].concat(categoryNode.posts)
  } else {
    createNode({
      id,
      name: category,
      parent: null,
      children: [],
      slug,
      posts: [node],
      internal: {
        type: `Category`,
        mediaType: `text/plain`,
        content: category,
        contentDigest: createContentDigest(category),
      },
    })
  }
}
