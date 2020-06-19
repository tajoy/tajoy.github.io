const path = require(`path`)

const TEXT = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D pic; // ./profile.jpg

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor=texture2D(pic, st);
}
`

const REGEX = /uniform\s*sampler2D\s*([\w]*);\s*\/\/\s*([\w|\:\/\/|\.|\-|\_]*)/i

let lines = TEXT.split("\n")
for (let i = 0; i < lines.length; i++) {
  let match = lines[i].match(REGEX)
  console.log("match", match)
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
      const picPath = match[2]
        .replace(/\//g, `\/`)
        .replace(/\./g, `\.`)
        .replace(/\-/g, `\-`)
        .replace(/\_/g, `\_`)
      console.log("picPath", picPath)
      // const regex = new RegExp(
      //   `uniform\s*sampler2D\s*(${match[1]});\s*\/\/\s*${picPath}`,
      //   "ig"
      // )
      const text = TEXT.replace(
        // regex,
        /uniform\s*sampler2D\s*(pic);\s*\/\/\s*\.\/profile\.jpg/gi,
        `uniform sampler2D $1; // http://baidu.com`
      )
      // console.log("regex", regex)
      console.log("text", text)
    }
  }
}
