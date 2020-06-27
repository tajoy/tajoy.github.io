const _ = require(`lodash`)
const moment = require(`moment`)

module.exports = {
  Query: {
    updateFrequency: {
      type: `UpdateFrequency`,
      args: {
        // skip: `Int`,
        // limit: `Int`,
        // tag: `String`,
        // category: `String`,
        // series: `String`,
        // sortDateOrder: `String`,
      },
      resolve: (source, args, context, info) => {
        const updates = []
        const increaseUpdate = md => {
          const date = (md.frontmatter || {}).date
          if (!date) return
          const m = moment(date)
          let found = null
          for (let i = 0; i < updates.length; i++) {
            const it = updates[i]
            if (it.year === m.weekYear() && it.weekOfYear === m.weeks()) {
              found = it
              break
            }
          }
          if (found === null) {
            found = {
              year: m.weekYear(),
              weeksInYear: m.weeksInYear(),
              weekOfYear: m.weeks(),
              articles: [],
            }
            updates.push(found)
          }
          found.articles.push({
            id: md.id,
            title: (md.frontmatter || {}).title || "<无标题>",
          })
        }
        context.nodeModel
          .getAllNodes(
            { type: `MarkdownRemark` },
            { connectionType: `MarkdownRemark` }
          )
          .sort((a, b) => {
            if (a.frontmatter === undefined) {
              return -1
            }
            if (b.frontmatter === undefined) {
              return -1
            }
            if (a.frontmatter.date === undefined) {
              return -1
            }
            if (a.frontmatter.date === undefined) {
              return -1
            }
            const ta = new Date(a.frontmatter.date).getTime()
            const tb = new Date(b.frontmatter.date).getTime()
            return tb - ta
          })
          .filter((md, i) => {
            if (md.frontmatter === undefined) {
              return false
            }
            if (
              process.env.NODE_ENV !== `development` &&
              md.frontmatter.draft === true
            )
              return false
            if (md.frontmatter.date === undefined) return false
            return true
          })
          .forEach((md, i) => {
            increaseUpdate(md)
          })
        return { updates }
      },
    },
  },
}
