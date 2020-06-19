const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)
const jieba = require(`nodejieba`)

const toString = require(`mdast-util-to-string`)
const filter = require(`unist-util-filter`)

const unified = require(`unified`)
const parse = require(`remark-parse`)
// const stringify = require(`remark-stringify`)

function extract(content) {
  const results = jieba.extract(content, 100)
  const tags = [...new Set(jieba.tag(content))]
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      if (result.word == tag.word) {
        result.tag = tag.tag
        break
      }
    }
  }
  let count = 0
  const filtered = results.filter(function (result) {
    if (count >= 10) return false
    if (result.tag === "n") {
      count += 1
      return true
    }
    if (result.tag === "eng") {
      count += 1
      return true
    }
    return false
  })
  return filtered
}

module.exports = context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode } = actions

  if (node.internal.type !== `MarkdownRemark`) return

  const {
    frontmatter: { keywords, tags },
    rawMarkdownBody,
  } = node


  const filteredAst = filter(
    unified().use(parse).parse(rawMarkdownBody),
    node => node.type !== "code" && node.type !== "inlineCode"
  )
  const keywordsFromContent = extract(toString(filteredAst))
  const allKeywords = new Set()
  if (keywords) {
    keywords.forEach(k => allKeywords.add(k))
  } else {
    if (tags) {
      tags.forEach(tag => allKeywords.add(tag))
    }
  }
  keywordsFromContent.forEach(k => allKeywords.add(k.word))
  // console.log("allKeywords", allKeywords)
  createNodeField({
    node,
    name: "keywords",
    value: [...allKeywords],
  })
}
