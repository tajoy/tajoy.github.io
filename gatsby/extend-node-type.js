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

const sharp = require(`sharp`)
const exifr = require(`exifr`)
const _ = require(`lodash`)

const { cnWordCount } = require(`./utils`)

module.exports = ({
  type,
  basePath,
  getNode,
  getNodesByType,
  cache,
  getCache,
  reporter,
}) => {
  if (type.name === `Tag`) {
  }

  if (type.name === `MarkdownRemark`) {
    return {
      cnWordCount: {
        type: GraphQLInt,
        resolve(markdownNode) {
          let counts = {}
          const count = () => {
            return tree => {
              visit(tree, node => {
                counts[node.type] = (counts[node.type] || 0) + 1
              })
            }
          }
          unified()
            .use(parse)
            .use(remark2retext, unified().use(english).use(count))
            .use(stringify)
            .processSync(markdownNode.internal.content)
          return counts.WordNode + cnWordCount(markdownNode.internal.content)
        },
      },
    }
  }

  // if (type.name === `File`) {
  //   return {
  //     metadata: {
  //       type: GraphQLJSON,
  //       async resolve(fileNode) {
  //         const img = sharp(fileNode.absolutePath)
  //         let metadata = await img.metadata()
  //         metadata.exif = null
  //         metadata.icc = null
  //         metadata.iptc = null
  //         metadata.xmp = null
  //         const exifrOptions = {
  //           // APP segments
  //           tiff: true,
  //           // TIFF blocks
  //           ifd0: false,
  //           ifd1: false,
  //           exif: true,
  //           gps: true,
  //           interop: false,
  //           // other data
  //           makerNote: false,
  //           userComment: false,
  //           xmp: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
  //           icc: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
  //           iptc: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
  //           jfif: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
  //           // output style
  //           mergeOutput: true,
  //           sanitize: true,
  //           reviveValues: true,
  //           translateKeys: true,
  //           translateValues: true,
  //           // for XMP Extended
  //           multiSegment: true,
  //         }
  //         const exifrParsed = await exifr.parse(
  //           fileNode.absolutePath,
  //           exifrOptions
  //         )
  //         return _.merge({}, metadata, exifrParsed)
  //       },
  //     },
  //     tinyImg: {
  //       type: GraphQLJSON,
  //       async resolve(fileNode) {
  //         let tinyImg = sharp(fileNode.absolutePath)
  //           .resize({ width: Math.max(60, Math.floor(metadata.width / 100)) })
  //           .raw()
  //         return {
  //           ...(await tinyImg.metadata()),
  //           data: (await tinyImg.toBuffer()).toString("base64"),
  //         }
  //       },
  //     },
  //     smallImg: {
  //       type: GraphQLJSON,
  //       async resolve(fileNode) {
  //         let smallImg = sharp(fileNode.absolutePath)
  //           .resize({ width: Math.max(240, Math.floor(metadata.width / 10)) })
  //           .raw()
  //         return {
  //           ...(await smallImg.metadata()),
  //           data: (await smallImg.toBuffer()).toString("base64"),
  //         }
  //       },
  //     },
  //   }
  // }

  return {}
}
