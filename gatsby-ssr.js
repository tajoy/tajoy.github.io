// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

// 分离到单个文件
import "gatsby-remark-vscode/styles.css"
import "./src/styles/index.scss"
import "normalize.css"
import "katex/dist/katex.min.css"
import "gitalk/dist/gitalk.css"

import * as $ from "jquery"

export const wrapPageElement = require(`./src/wrappers/PageWrapper`).default
export const wrapRootElement = require(`./src/wrappers/RootWrapper`).default
