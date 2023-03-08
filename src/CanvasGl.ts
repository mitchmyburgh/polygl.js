const vertexShaderSource = `
precision mediump float; 
attribute vec2 a_position;     
attribute vec2 a_texCoord; 
varying vec2 v_texCoord; 
uniform vec2 u_resolution; 
uniform vec2 u_translation; 
uniform vec2 u_rotation;  
uniform vec2 u_scale; 
void main() { 
    vec2 scaledPosition = a_position * u_scale; 
    vec2 rotatedPosition = vec2(scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x, scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);
    vec2 position = rotatedPosition + u_translation; 
    vec2 zeroToOne = position / u_resolution; 
    vec2 zeroToTwo = zeroToOne * 2.0; 
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
}
`
const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;
uniform int u_mode;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(void) {
  if (u_mode == 1) { gl_FragColor = u_color; }
  if (u_mode == 2) { gl_FragColor = texture2D(u_image, v_texCoord); }
  if (u_mode == 3) { gl_FragColor = u_color + texture2D(u_image, v_texCoord); }
}
`

const load = (v: number[]) => {

}


class CanvasGl {
  gl: WebGLRenderingContext;
  constructor(public canvas: HTMLCanvasElement) {
    this.gl = this.canvas.getContext("webgl");
  }
}
