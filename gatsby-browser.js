// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

// 分离到单个文件
import "gatsby-remark-vscode/styles.css"
import "./src/styles/index.scss"
import "normalize.css"
import "katex/dist/katex.min.css"
import "gitalk/dist/gitalk.css"
import "glslEditor/build/glslEditor.css"

import * as $ from "jquery"

export const wrapPageElement = require(`./src/wrappers/PageWrapper`).default
export const wrapRootElement = require(`./src/wrappers/RootWrapper`).default
// https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag

    if (type === "css") {
      if ($(`link[href='${url}']`)) {
        resolve(url)
        return
      }
      tag = document.createElement("link")
      tag.rel = "stylesheet"
      tag.href = url
    } else if (type === "js") {
      if ($(`script[src='${url}']`)) {
        resolve(url)
        return
      }
      tag = document.createElement("script")
      tag.src = url
    }
    if (tag) {
      tag.onabort = () => reject(url)
      tag.onload = () => resolve(url)
      tag.onerror = () => reject(url)
      document.body.appendChild(tag)
    }
    console.log("loadExternalResource", url, type)
  })
}

window.loadExternalResource = loadExternalResource

loadExternalResource(
  "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js",
  "js"
)
