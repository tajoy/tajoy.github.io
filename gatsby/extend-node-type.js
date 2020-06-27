const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLJSON,
} = require("gatsby/graphql")

const unified = require(`unified`)
const parse = require(`remark-parse`)
const stringify = require(`remark-stringify`)
const english = require(`retext-english`)
const remark2retext = require(`remark-retext`)
const visit = require(`unist-util-visit`)

const { cnWordCount } = require(`./utils`)

const subs = [require(`./extend-node-type/markdown-remark`)]

module.exports = context => {
  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i]
    const ret = sub(context)
    if (ret) return ret
  }
  return {}
}
