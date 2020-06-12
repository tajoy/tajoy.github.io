const toml = require("toml")

module.exports = {
  siteMetadata: {
    title: `Tajoy's Blog`,
    author: {
      name: `Tajoy`,
      summary: `who lives and works in Guiyang, China building funny things.`,
      photo: `/my-photo.jpg`,
    },
    description: `A personal blog for Tajoy.`,
    slogan: [
      "一个不会摄影的程序猿, 不是一个好的艺术家.",
      "```c",
      "if (!can(take_photograph) && !is(coder)) {",
      '  printf("bad artist!\\n");',
      "} else {",
      '  printf("good artist!\\n");',
      "}",
      "```",
    ].join("\n"),
    siteUrl: `https://tajoy.net/`,
    buildSince: `2014/06/18 01:56:03 +0800`,
    social: {
      twitter: `tajoy4abit`,
      github: `tajoy`,
      qq: `328111241`,
      wechat: `tj328111241`,
    },
    qrcode: {
      qq: `/qrcode/qq.jpg`,
      wechat: `/qrcode/weixin.jpg`,
      rewardAlipay: `/qrcode/reward-alipay.jpg`,
      rewardWeixin: `/qrcode/reward-weixin.jpg`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
        delimiters: "+++",
        engines: {
          toml: toml.parse.bind(toml),
        },
        language: `toml`,
        plugins: [
          `gatsby-remark-toc`, // 本地插件, 用于生成目录
          {
            resolve: `gatsby-remark-images`, // 智能缩放图片, 并加载中的 blur up 特效
            options: {
              maxWidth: 590,
              showCaptions: true,
              inlineCodeMarker: "||",
            },
          },
          // {
          //   resolve: `gatsby-remark-responsive-iframe`, // 智能缩放 iframes 和 objects
          //   options: {
          //     wrapperStyle: `margin-bottom: 1.0725rem`,
          //   },
          // },

          // diagrams 画图: 关系图, 类图, 流程图, 甘特图, 饼图, Git图, 状态图
          // 参见: https://mermaid-js.github.io/mermaid/#/
          `gatsby-remark-mermaid`,
          `gatsby-remark-code-buttons`, // copy button
          {
            resolve: `gatsby-remark-vscode`, // 语法高亮
            options: {
              inlineCode: {
                marker: "•",
              },
              theme: {
                default: `Monokai`,
                light: `Visual Studio Light`,
                parentSelector: {
                  "div.layout[data-theme=dark]": `Monokai`,
                  "div.layout[data-theme=light]": `Visual Studio Light`,
                },
                media: [
                  {
                    // Longhand for `dark` option.
                    // Don’t forget the parentheses!
                    match: "(prefers-color-scheme: dark)",
                    theme: "Monokai",
                  },
                  {
                    // Longhand for `dark` option.
                    // Don’t forget the parentheses!
                    match: "(prefers-color-scheme: light)",
                    theme: "Visual Studio Light",
                  },
                ],
              },
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
              trust: true,
            },
          },
          // {
          //   resolve: `gatsby-remark-prismjs`, // 语法高亮
          //   options: {
          //     showLineNumbers: true,
          //   },
          // },
          `gatsby-remark-copy-linked-files`, // 拷贝被链接的文件到根目录
          `gatsby-remark-smartypants`, // 智能标点符号
          `gatsby-remark-external-links`, // 外部链接处理, 跳转为新标签页
          {
            resolve: `gatsby-remark-embedder`,
            options: {
              customTransformers: require("./gatsby/embedder-custom-transformers"),
              // services: {
              //   // The service-specific options by the name of the service
              // },
            },
          },
          {
            resolve: "gatsby-remark-emojis",
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: "emoji-icon",
              // In order to avoid pattern mismatch you can specify
              // an escape character which will be prepended to the
              // actual pattern (e.g. `#:poop:`).
              // escapeCharacter: "#", // (default: '')
              // Select the size (available size: 16, 24, 32, 64)
              size: 24,
              // Add custom styles
              styles: {
                display: "inline",
                margin: "0",
                "vertical-align": "middle",
                // "margin-top": "1px",
                // position: "relative",
                // top: "5px",
                // width: "25px",
              },
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-82071116-1`,
      },
    },
    {
      resolve: `gatsby-plugin-baidu-analytics`,
      options: {
        // baidu analytics siteId
        siteId: "15073995",
        // Put analytics script in the head instead of the body [default:false]
        head: false,
      },
    },
    {
      resolve: `gatsby-plugin-baidu-tongji`,
      options: {
        // 百度统计站点ID
        siteid: "15073995",
        // 配置统计脚本插入位置，默认值为 false, 表示插入到 body 中, 为 true 时插入脚本到 head 中
        head: false,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.url,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Tajoy's Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tajoy Personal Blog`,
        short_name: `Tajoy`,
        start_url: `/`,
        // background_color: `#22223b`,
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-styled-components`,
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     printRejected: true, // Print removed selectors and processed file names
    //     develop: process.env.NODE_ENV === "development", // Enable while using `gatsby develop`
    //     // tailwind: true, // Enable tailwindcss support
    //     // whitelist: ['whitelist'], // Don't remove this selector
    //     // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
    //     // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
    //   },
    // },
  ],
}
