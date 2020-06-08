const { slugify } = require(`../utils`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: { tags },
  } = node

  if (!tags) return

  const fieldTags = []
  const tagsNames = []

  tags.forEach(tag => {
    const id = createNodeId(tag)
    const slug = slugify(tag)
    fieldTags.push({
      id,
      name: tag,
      slug,
    })
    tagsNames.push(tag)
    const tagNode = getNode(id)
    if (tagNode) {
      tagNode.posts = [node].concat(tagNode.posts)
    } else {
      createNode({
        id,
        name: tag,
        parent: null,
        children: [],
        slug,
        posts: [node],
        internal: {
          type: `Tag`,
          mediaType: `text/plain`,
          content: tag,
          contentDigest: createContentDigest(tag),
        },
      })
    }
  })
  createNodeField({
    node,
    name: "tags",
    value: fieldTags,
  })
  createNodeField({
    node,
    name: "tagsNames",
    value: tagsNames,
  })
}
