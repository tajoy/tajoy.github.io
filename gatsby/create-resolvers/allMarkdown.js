const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)
const _ = require(`lodash`)


module.exports = {
  Query: {
    allMarkdown: {
      type: `allMarkdown`,
      args: {
        skip: `Int`,
        limit: `Int`,
        tag: `String`,
        category: `String`,
        series: `String`,
        sortDateOrder: `String`,
      },
      resolve: (source, args, context, info) => {
        let skipCount = 0
        let limitCount = 0
        const posts = context.nodeModel
          .getAllNodes(
            { type: `MarkdownRemark` },
            { connectionType: `MarkdownRemark` }
          )
          .sort((a, b) => {
            if (a.frontmatter.date === undefined) {
              if (args.sortDateOrder === "ASCE") return 1
              else return -1
            }
            if (a.frontmatter.date === undefined) {
              if (args.sortDateOrder === "ASCE") return 1
              else return -1
            }
            const ta = new Date(a.frontmatter.date).getTime()
            const tb = new Date(b.frontmatter.date).getTime()
            if (args.sortDateOrder === "ASCE") return ta - tb
            else return tb - ta
          })
          .filter((md, i) => {
            if (
              process.env.NODE_ENV !== `development` &&
              md.frontmatter.draft === true
            )
              return false
            if (
              args.tag !== undefined &&
              (md.frontmatter.tags === undefined ||
                md.frontmatter.tags.find(tag => tag === args.tag) === undefined)
            ) {
              return false
            }
            if (
              args.category !== undefined &&
              (md.frontmatter.category === undefined ||
                md.frontmatter.category !== args.category)
            ) {
              return false
            }
            if (
              args.series !== undefined &&
              (md.frontmatter.series === undefined ||
                md.frontmatter.series !== args.series)
            ) {
              return false
            }
            if (args.skip !== undefined) {
              skipCount += 1
              if (skipCount <= args.skip) return false
            }
            if (args.limit !== undefined) {
              limitCount += 1
              if (limitCount > args.limit) return false
            }
            return true
          })
        posts.forEach(post => {
          if (!post) return
          const filePath = createFilePath({
            node: post,
            getNode: id => context.nodeModel.getNodeById({ id }),
          })
          const slug = slugify(filePath)
          const path = createPagePath(post, slug)
          context.nodeModel.trackPageDependencies(post, {
            path,
            connectionType: `MarkdownRemark`,
          })
        })
        return {
          posts,
        }
      },
    },
  },
}