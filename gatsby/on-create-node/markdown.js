const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: {
      keywords,
      showComments,
      draft,
      title,
      description,
      date,
      tags,
    },
  } = node

  const filePath = createFilePath({ node, getNode })
  createNodeField({
    name: `slug`,
    node,
    value: slugify(filePath),
  })

  const pagePath = createPagePath(node)
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

  if (keywords) {
    createNodeField({
      node,
      name: "keywords",
      value: keywords,
    })
  } else {
    const tagsNames = []
    if (tags) {
      tags.forEach(tag => {
        tagsNames.push(tag)
      })
    }
    createNodeField({
      node,
      name: "keywords",
      value: tagsNames,
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
