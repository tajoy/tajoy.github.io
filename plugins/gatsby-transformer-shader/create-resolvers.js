const { createFilePath } = require(`gatsby-source-filesystem`)
const { slugify, createPagePath } = require(`./utils`)
const _ = require(`lodash`)
const path = require(`path`)

const resolvers = ({ basePath }) => ({
  Query: {
    allShaders: {
      type: `allShaders`,
      args: {
        skip: `Int`,
        limit: `Int`,
        sortDateOrder: `String`,
      },
      resolve: async (source, args, context, info) => {
        let skipCount = 0
        let limitCount = 0
        const shaders = context.nodeModel
          .getAllNodes({ type: `Shader` }, { connectionType: `Shader` })
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

        function findFile(filepath) {
          // return context.nodeModel.runQuery(`
          //   query findFile {
          //     allFile(filter: { absolutePath: { eq: "${filepath}" } }) {
          //       edges {
          //         node {
          //           id
          //           dir
          //           absolutePath
          //           publicURL
          //         }
          //       }
          //     }
          //   }
          // `)

          return context.nodeModel.runQuery({
            type: `File`,
            query: {
              filter: {
                absolutePath: { eq: filepath },
                publicURL: { ne: null },
              },
            },
            firstOnly: true,
          })
        }
        for (let i = 0; i < shaders.length; i++) {
          const shader = shaders[i]

          // replace texture path to url
          let nTextures = shader.frag.search(/sampler2D/g)
          if (nTextures) {
            let lines = shader.frag.split("\n")
            const REGEX = /uniform\s*sampler2D\s*([\w]*);\s*\/\/\s*([\w|\:\/\/|\.|\-|\_]*)/i
            for (let i = 0; i < lines.length; i++) {
              let match = lines[i].match(REGEX)
              // console.log("match", match)
              if (match && match[1] && match[2]) {
                let ext = match[2].split(".").pop().toLowerCase()
                if (
                  ext === "jpg" ||
                  ext === "jpeg" ||
                  ext === "png" ||
                  ext === "ogv" ||
                  ext === "webm" ||
                  ext === "mp4"
                ) {
                  const filepath = path.resolve(
                    path.dirname(shader.fileAbsolutePath),
                    match[2]
                  )
                  const fileNode = await findFile(filepath)
                  if (fileNode) {
                    const picPath = match[2]
                      .replace(/\//g, `\/`)
                      .replace(/\./g, `\.`)
                      .replace(/\-/g, `\-`)
                      .replace(/\_/g, `\_`)
                    // console.log("picPath", picPath)
                    const regex = new RegExp(
                      `uniform\\s*sampler2D\\s*(${match[1]});\\s*\\/\\/\\s*${picPath}`,
                      "ig"
                    )
                    // console.log("fileNode", JSON.stringify(fileNode, null, 2))
                    shader.frag = shader.frag.replace(
                      regex,
                      `uniform sampler2D $1; // ${fileNode.__gatsby_resolved.publicURL}`
                    )
                    // console.log("regex", regex)
                    // console.log("shader.frag", shader.frag)
                  }
                  // process.exit(-1)
                }
              }
              let main = lines[i].match(/\s*void\s*main\s*/g)
              if (main) {
                break
              }
            }
          }
        }
        return {
          shaders,
        }
      },
    },
  },
})

module.exports = ({ createResolvers }, pluginOptions) => {
  createResolvers(resolvers(pluginOptions))
}
