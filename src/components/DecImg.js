import React from "react"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${rhythm(0.3)};
  margin-bottom: ${rhythm(1)};
`

const Canvas = styled.canvas`
  padding: 0;
  width: 240px;
  height: 240px;
  max-width: 240px;
  max-height: 240px;
  margin: auto;
  background: #000;
  border-radius: 5%;
  mix-blend-mode: exclusion;
`

class DecImg extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.updateCanvas()
  }

  componentDidUpdate() {
    // this.updateCanvas()
  }

  updateCanvas() {
    const { src, threshold = 12, minSize = 6, animation = false } = this.props
    this.decImg(src, threshold, minSize, animation)
  }

  onChange() {}

  decImg(imgUrl, standardDeviationThreshold, minSize, animation = false) {
    // ---- canvas ----
    const canvas = this.canvas.current
    const ctx = canvas.getContext("2d")

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    // ---- treeMap ----
    const deconstruct = img => {
      const width = img.width
      const height = img.height
      const cmap = document.createElement("canvas")
      cmap.width = width
      cmap.height = height
      const ct = cmap.getContext("2d")
      ct.drawImage(img, 0, 0)
      const imageData = ct.getImageData(0, 0, width, height).data
      // ---- calc brilliance ----
      for (let i = 0; i < width * height * 4; i += 4) {
        imageData[i + 3] =
          0.34 * imageData[i] + 0.5 * imageData[i + 1] + 0.16 * imageData[i + 2]
      }
      const rx = canvas.width / img.width
      const ry = canvas.height / img.height
      const cmds = []
      const set = (field, value) => cmds.push({ type: "set", field, value })
      const call = (field, args) => cmds.push({ type: "call", field, args })
      const $set = (field, value) => ({
        type: "set",
        field,
        value,
      })
      const $call = (field, args) => ({
        type: "call",
        field,
        args,
      })
      const seq = (...args) => cmds.push({ type: "seq", cmds: args })
      // ---- create new Rectangle ----
      const Rect = (i, x, y, w, h) => {
        const x0 = Math.floor(x)
        const y0 = Math.floor(y)
        const w0 = Math.ceil(w)
        const h0 = Math.ceil(h)
        const n = w0 * h0
        // ---- average colors ----
        let r = 0,
          g = 0,
          b = 0,
          l = 0
        for (let xi = x0; xi < x0 + w0; xi++) {
          for (let yi = y0; yi < y0 + h0; yi++) {
            const p = (yi * width + xi) * 4
            r += imageData[p + 0]
            g += imageData[p + 1]
            b += imageData[p + 2]
            l += imageData[p + 3]
          }
        }
        r = (r / n) | 0
        g = (g / n) | 0
        b = (b / n) | 0
        l = (l / n) | 0
        // ---- standard deviation ----
        let sd = 0
        for (let xi = x0; xi < x0 + w0; xi++) {
          for (let yi = y0; yi < y0 + h0; yi++) {
            const bri = imageData[(yi * width + xi) * 4 + 3] - l
            sd += bri * bri
          }
        }
        if (
          (w > minSize || h > minSize) &&
          Math.sqrt(sd / n) > standardDeviationThreshold
        ) {
          // ---- recursive division ----
          const hw = w * 0.5
          const hh = h * 0.5
          Rect(i * 2, x, y, hw, hh)
          Rect(i * 2, x + hw, y, hw, hh)
          Rect(i * 2, x, y + hh, hw, hh)
          Rect(i * 2, x + hw, y + hh, hw, hh)
        } else {
          // ---- draw final rectangle ----
          if (w > 5) {
            seq(
              $set("fillStyle", `rgb(${r},${g},${b})`),
              $call("fillRect", [x * rx, y * ry, w * rx - 0.5, h * ry - 0.5]),
              $call("beginPath", []),
              $set(
                "fillStyle",
                `rgb(${(r * 1.1) | 0},${(g * 1.1) | 0},${(b * 1.1) | 0})`
              ),
              $call("arc", [
                (x + w / 2) * rx,
                (y + h / 2) * ry,
                (w / 2.2) * rx,
                0,
                2 * Math.PI,
              ]),
              $call("fill", []),
              $set("fillStyle", "#333"),
              $call("fillText", [i, x * rx + 2, y * ry + 10, w])
            )
          } else {
            seq(
              $set("fillStyle", `rgb(${r},${g},${b})`),
              $call("fillRect", [x * rx, y * ry, w * rx - 0.5, h * ry - 0.5])
            )
          }
        }
      }
      // ---- create the first rectangle ----
      Rect(1, 0, 0, width, height)

      const runCmd = (cmd, clear = false) => {
        if (!cmd || !cmd.type) {
          return
        }
        if (cmd.type === "set") {
          if (clear) {
            if (cmd.field === "fillStyle") {
              ctx.fillStyle = "rgba(0,0,0,0)"
            }
          } else {
            ctx[cmd.field] = cmd.value
          }
        } else if (cmd.type === "call") {
          if (clear) {
            if (cmd.field === "fillRect") {
              ctx.clearRect(
                cmd.args[0] - 1,
                cmd.args[1] - 1,
                cmd.args[2] + 2,
                cmd.args[3] + 2
              )
            }
          } else {
            ctx[cmd.field](...cmd.args)
          }
        } else if (cmd.type === "seq") {
          for (let i = 0; i < cmd.cmds.length; i++) {
            runCmd(cmd.cmds[i], clear)
          }
        }
      }

      if (!animation) {
        for (let i = 0; i < cmds.length; i++) {
          const cmd = cmds[i]
          runCmd(cmd, false)
        }
      } else {
        // shuffle 打乱顺序
        for (let i = 0; i < cmds.length * 10; i++) {
          const i1 = parseInt(`${Math.random() * cmds.length}`)
          const i2 = parseInt(`${Math.random() * cmds.length}`)
          const cmd1 = cmds[i1]
          const cmd2 = cmds[i2]
          cmds[i1] = cmd2
          cmds[i2] = cmd1
        }

        const delay = duration =>
          new Promise(resolve => {
            setTimeout(resolve, duration)
          })
        const run = async (cmds, clear = false) => {
          for (let i = 0; i < cmds.length; i++) {
            const cmd = cmds[i]
            runCmd(cmd, clear)
            await delay(1)
          }
        }

        // split and parallel run
        // 分片并行执行
        const splitCount = 12
        const sliceLen = Math.floor(cmds.length / splitCount)
        const cmdsSplitted = []
        for (let i = 0; i < splitCount; i++) {
          if (i + 1 < splitCount) {
            cmdsSplitted.push(cmds.slice(sliceLen * i, sliceLen * (i + 1)))
          } else {
            cmdsSplitted.push(cmds.slice(sliceLen * i, sliceLen * cmds.length))
          }
        }
        let draw = null
        let change = null
        let clear = null

        draw = () =>
          Promise.all(cmdsSplitted.map(cmds => run(cmds))).then(change)
        change = () => delay(5000).then(clear)
        clear = () =>
          Promise.all(cmdsSplitted.map(cmds => run(cmds, true))).then(draw)

        draw()
      }
    }
    // ---- load image and run ----
    const img = new Image()
    img.addEventListener("load", e => deconstruct(img))
    img.src = imgUrl
  }

  render() {
    return (
      <Container>
        <Canvas ref={this.canvas} />
      </Container>
    )
  }
}

export default DecImg
