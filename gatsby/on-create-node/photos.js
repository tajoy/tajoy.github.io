const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`../utils`)
const sharp = require(`sharp`)
const exifr = require(`exifr`)
const _ = require(`lodash`)

module.exports = async context => {
  const { node, actions, getNode, createNodeId, createContentDigest } = context
  const { createNodeField, createNode, createParentChildLink } = actions

  if (node.internal.type !== `File`) return
  if (node.sourceInstanceName !== `photos`) return
  if (!node.internal.mediaType.startsWith(`image/`)) return

  // console.log("node", JSON.stringify(node, null, 2))

  const filePath = createFilePath({ node, getNode })
  const slug = slugify(filePath)
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  })

  let metadata = await sharp(node.absolutePath).metadata()

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
  const exifrParsed = await exifr.parse(node.absolutePath, exifrOptions)
  metadata = _.merge({}, metadata, exifrParsed)
  // console.log("metadata", metadata)
  // createNodeField({
  //   node,
  //   name: `metadata`,
  //   value: metadata,
  // })

  // console.log("node", JSON.stringify(node, null, 2))
  // process.exit(-1)

  if (metadata.CreateDate) {
    createNodeField({
      node,
      name: `date`,
      value: metadata.CreateDate,
    })
  }

  const pagePath = createPagePath(node, slug, "photos")
  createNodeField({
    node,
    name: `url`,
    value: pagePath,
  })

  const imageExt = {
    id: createNodeId(`${node.id} >>> ImageExt`),
    parent: node.id,
    children: [],
    internal: {
      type: `ImageExt`,
      contentDigest: node.internal.contentDigest,
    },
  }
  createNode(imageExt)
  createParentChildLink({ parent: node, child: imageExt })
}
