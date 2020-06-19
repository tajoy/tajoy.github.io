const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)
const moment = require(`moment`)

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `Shader`) return

  const filePath = createFilePath({ node, getNode })
  const slug = slugify(filePath)
  createNodeField({
    name: `slug`,
    node,
    value: slug,
  })

  const {
    frontmatter: {
      showComments = true,
      draft = false,
      title = slug,
      description = "<无描述>",
      date = moment().toISOString(),
      keywords = [""],
    },
  } = node

  const pagePath = createPagePath(node, slug, "shader")
  createNodeField({
    name: `url`,
    node,
    value: pagePath,
  })

  createNodeField({
    node,
    name: "title",
    value: title,
  })

  createNodeField({
    node,
    name: "keywords",
    value: keywords,
  })

  createNodeField({
    node,
    name: "description",
    value: description,
  })

  createNodeField({
    node,
    name: "date",
    value: date,
  })

  createNodeField({
    node,
    name: "showComments",
    value: showComments === false ? false : true,
  })

  createNodeField({
    node,
    name: "draft",
    value: draft === true,
  })
}
