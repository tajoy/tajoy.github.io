// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
import "gatsby-remark-vscode/styles.css"
import "./src/styles/index.scss"
import "normalize.css"
import "katex/dist/katex.min.css"

import * as $ from "jquery"

export const wrapPageElement = require(`./src/wrappers/PageWrapper`).default
export const wrapRootElement = require(`./src/wrappers/RootWrapper`).default

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
      tag.onload = () => resolve(url)
      tag.onerror = () => reject(url)
      document.body.appendChild(tag)
      console.log("loadExternalResource", url, type)
    }
  })
}

window.loadExternalResource = loadExternalResource;

/* 以后试着自己部署一下, 并且更换和新增下模型 */
loadExternalResource(
  "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js",
  "js"
)