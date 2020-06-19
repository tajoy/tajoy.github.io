const path = require(`path`)
const { join, remove, trim, isEmpty } = require("lodash")
const slug = require(`slug`)
const pinyin = require(`./pinyin`)
const moment = require(`moment`)

const slugOptions = {
  replacement: "-",
  symbols: true,
  lower: true,
  remove: /[.]/g,
  charmap: Object.assign(slug.charmap, pinyin),
}

const slugify = text => {
  return slug(text, slugOptions)
}

const pathify = (...args) => {
  const parsedArgs = remove(
    args.map(arg => slugify(trim(arg, "/"))),
    a => !isEmpty(a)
  )
  return `/${join(parsedArgs, "/")}/`
}

const createPagePath = (node, slug, prefix = "") => {
  if (node.frontmatter.date) {
    const date = moment(node.frontmatter.date)
    return pathify(
      prefix,
      date.format("YYYY"),
      date.format("MM"),
      date.format("DD"),
      slug
    )
  } else {
    return pathify(prefix, slug)
  }
}

const cnWordCount = text => {
  let count = 0
  for (let i = 0, len = text.length; i < len; i++) {
    if (!/[\x00-\xff]/g.test(text.charAt(i))) count += 1
  }
  return count
}

module.exports = {
  slugify,
  pathify,
  createPagePath,
  cnWordCount,
}
