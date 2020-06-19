const path = require(`path`)
const genPreview = require("../generate-shader-preview")

const VERT = `
#ifdef GL_ES
precision mediump float;
#endif
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
}
`
const FRAG = `
  precision mediump float;
  const int max_iterations = 255;
  uniform vec2 u_resolution;
  uniform float u_time;
  vec2 complex_square( vec2 v ) {
    return vec2(
      v.x * v.x - v.y * v.y,
      v.x * v.y * 2.0
    );
  }
  void main()
  {
    vec2 uv = gl_FragCoord.xy - vec2(u_resolution.x,u_resolution.y) * 0.5;
    uv *= 2.5 / min( u_resolution.x, u_resolution.y );
#if 0 // Mandelbrot
    vec2 c = uv;
    vec2 v = vec2( 0.0 );
    float scale = 0.06;
#else // Julia
    vec2 c = vec2( 0.285, 0.01 );
    vec2 v = uv;
    float scale = 0.01;
#endif
    int count = max_iterations;
    for ( int i = 0 ; i < max_iterations; i++ ) {
      v = c + complex_square( v );
      if ( dot( v, v ) > 4.0 ) {
        count = i;
        break;
      }
    }
    gl_FragColor = vec4( float( count ) * scale * abs(sin(u_time * 3.)));
  }
`

genPreview(path.dirname(__filename), VERT, FRAG, {
  width: 128,
  height: 128,
  filename: "preview",
})
  .then()
  .catch(err => {
    console.error(err)
  })
