const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLJSON,
} = require("gatsby/graphql")

const sharp = require(`sharp`)
const exifr = require(`exifr`)
const _ = require(`lodash`)

module.exports = ({
  actions,
  schema,
  getNode,
  pathPrefix,
  getNodeAndSavePathDependency,
  reporter,
  cache,
}) => {
  const { createTypes } = actions
  const key = (prefix, fileNode) => `${prefix} >>> ${fileNode.absolutePath}`

  const imageExtType = schema.buildObjectType({
    name: `ImageExt`,
    fields: {
      metadata: {
        type: GraphQLJSON,
        async resolve(node) {
          const fileNode = getNode(node.parent)
          let ret = await cache.get(key(`metadata`, fileNode))
          if (ret) {
            return ret
          }
          const img = sharp(fileNode.absolutePath)
          let metadata = await img.metadata()
          metadata.exif = null
          metadata.icc = null
          metadata.iptc = null
          metadata.xmp = null
          const exifrOptions = {
            // APP segments
            tiff: true,
            // TIFF blocks
            ifd0: false,
            ifd1: false,
            exif: true,
            gps: true,
            interop: false,
            // other data
            makerNote: false,
            userComment: false,
            xmp: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
            icc: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
            iptc: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
            jfif: false, // exifr 5.0.2 的 BUG, 等待其修复再打开
            // output style
            mergeOutput: true,
            sanitize: true,
            reviveValues: true,
            translateKeys: true,
            translateValues: true,
            // for XMP Extended
            multiSegment: true,
          }
          const exifrParsed = await exifr.parse(
            fileNode.absolutePath,
            exifrOptions
          )
          exifrParsed.gps = await exifr.gps(fileNode.absolutePath)
          ret = _.merge({}, metadata, exifrParsed)
          await cache.set(key(`metadata`, fileNode), ret)
          return ret
        },
      },
      tinyImg: {
        type: GraphQLJSON,
        async resolve(node) {
          const fileNode = getNode(node.parent)
          let ret = await cache.get(key(`tinyImg`, fileNode))
          if (ret) {
            return ret
          }
          const metadata = await sharp(fileNode.absolutePath).metadata()
          const width = Math.max(60, Math.floor(metadata.width / 100))
          const height = Math.floor((metadata.height * width) / metadata.width)
          let raw = await sharp(fileNode.absolutePath)
            .resize({ width })
            .toColorspace(`srgb`)
            .ensureAlpha()
            .raw()
            .toBuffer()
          let jpg = await sharp(fileNode.absolutePath)
            .resize({ width })
            .toFormat("jpg")
            .toBuffer()
          raw = raw.toString("base64")
          jpg = jpg.toString("base64")
          ret = {
            ...metadata,
            format: undefined,
            hasAlpha: true,
            channels: 4,
            width,
            height,
            raw,
            jpg,
          }
          ret.exif = undefined
          ret.iptc = undefined
          ret.xmp = undefined
          ret.icc = undefined
          await cache.set(key(`tinyImg`, fileNode), ret)
          return ret
        },
      },
      smallImg: {
        type: GraphQLJSON,
        async resolve(node) {
          const fileNode = getNode(node.parent)
          let ret = await cache.get(key(`smallImg`, fileNode))
          if (ret) {
            return ret
          }
          const metadata = await sharp(fileNode.absolutePath).metadata()
          const width = Math.max(240, Math.floor(metadata.width / 10))
          const height = Math.floor((metadata.height * width) / metadata.width)
          let raw = await sharp(fileNode.absolutePath)
            .resize({ width })
            .toColorspace(`srgb`)
            .ensureAlpha()
            .raw()
            .toBuffer()
          let jpg = await sharp(fileNode.absolutePath)
            .resize({ width })
            .toFormat("jpg")
            .toBuffer()
          raw = raw.toString("base64")
          jpg = jpg.toString("base64")
          ret = {
            ...metadata,
            format: undefined,
            hasAlpha: true,
            channels: 4,
            width,
            height,
            raw,
            jpg,
          }
          ret.exif = undefined
          ret.iptc = undefined
          ret.xmp = undefined
          ret.icc = undefined
          await cache.set(key(`smallImg`, fileNode), ret)
          return ret
        },
      },
    },
    interfaces: [`Node`],
    extensions: {
      infer: true,
      childOf: {
        types: [`File`],
      },
    },
  })
  createTypes(imageExtType)
}