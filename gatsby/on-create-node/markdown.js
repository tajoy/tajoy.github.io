const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: {
      showComments,
      draft,
      title,
      description,
      date,
    },
  } = node

  const filePath = createFilePath({ node, getNode })
  const slug = slugify(filePath)
  createNodeField({
    name: `slug`,
    node,
    value: slug,
  })

  const pagePath = createPagePath(node, slug, "article")
  createNodeField({
    name: `url`,
    node,
    value: pagePath,
  })

  if (title) {
    createNodeField({
      node,
      name: "title",
      value: title,
    })
  }

  if (description) {
    createNodeField({
      node,
      name: "description",
      value: description,
    })
  }

  if (date) {
    createNodeField({
      node,
      name: "date",
      value: date,
    })
  }

  if (showComments === false) {
    createNodeField({
      node,
      name: "showComments",
      value: false,
    })
  } else {
    createNodeField({
      node,
      name: "showComments",
      value: true,
    })
  }

  if (draft === true) {
    createNodeField({
      node,
      name: "draft",
      value: true,
    })
  } else {
    createNodeField({
      node,
      name: "draft",
      value: false,
    })
  }
}
