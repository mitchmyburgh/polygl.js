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
enum Mode {
  Fill = "fill"
  Stroke = "stroke"
  Both = "both"
}

type RGBA = [number, number, number, number];

class Renderer {
  r: WebGLRenderingContext
  program: WebGLProgram
  p: unknown = undefined
  a: unknown = undefined
  alpha: number = 1
  fillColor: RGBA = [0, 0, 0, this.alpha]
  strokeColor: RGBA = [0, 0, 0, this.alpha]
  mode: Mode = Mode.Fill
  antialias: boolean = true

  constructor(canvas: HTMLCanvasElement) {
    this.r = canvas.getContext("webgl", { const antialias = antialias, antialias: antialias, preservethis.ngBuffer: true });
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.loadDefaults()
  }

  createProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {

  }


  loadDefaults() {
    this.alpha = 1;
    this.fillColor = [0, 0, 0, this.alpha];
    this.strokeColor = [0, 0, 0, this.alpha];
    this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 1);
    this.r.uniform4f(this.r.getUniformLocation(this.program, "u_color"), 0, 0, 0, this.alpha);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_resolution"), this.r.canvas.width, this.r.canvas.height);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_translation"), 0, 0);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_rotation"), 0, 1);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_scale"), 1, 1);
  }
  clear() { /*context*/
    this.r.viewport(0, 0, this.r.canvas.width, this.r.canvas.height);
    var width = this.r.canvas.clientWidth * 1 | 0;
    var height = this.r.canvas.clientHeight * 1 | 0;
    if (this.r.canvas.width !== width || this.r.canvas.height !== height) {
      this.r.canvas.width = width;
      this.r.canvas.height = height;
    }
    this.r.clear(this.r.COLOR_BUFFER_BIT | this.r.DEPTH_BUFFER_BIT);
    if (this.enable2d) this.ctx2d.clearRect(0, 0, this.ctx2d.canvas.width, this.ctx2d.canvas.height);
  }

  loadDefaults() { /*context*/
    this.alpha = 1;
    this.fillColor = [0, 0, 0, this.alpha];
    this.strokeColor = [0, 0, 0, this.alpha];
    this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 1);
    this.r.uniform4f(this.r.getUniformLocation(this.program, "u_color"), 0, 0, 0, this.alpha);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_resolution"), this.r.canvas.width, this.r.canvas.height);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_translation"), 0, 0);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_rotation"), 0, 1);
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_scale"), 1, 1);
  }

  enableVertexAttribute(l, b, s) { /*context*/
    this.r.bindBuffer(this.r.ARRAY_BUFFER, b);
    var _ = this.r.getAttribLocation(this.program, l);
    this.r.vertexAttribPointer(_, s, this.r.FLOAT, false, 0, 0);
    this.r.enableVertexAttribArray(_);
    return _;
  }

  color(fill, stroke) { /*context*/
    fill[3] = fill[3] || this.alpha;
    this.fillColor = [fill[0], fill[1], fill[2], fill[3]];
    if (stroke != undefined) {
      stroke[3] = stroke[3] || this.alpha;
      this.strokeColor = [stroke[0], stroke[1], stroke[2], stroke[3]];
    } else {
      this.strokeColor = [0, 0, 0, this.alpha];
    }
  }

  useColor(color) { /*context*/
    this.r.uniform4f(this.r.getUniformLocation(this.program, "u_color"), color[0], color[1], color[2], color[3]);
  }

  translate(x, y) { /*context*/
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_translation"), x, y);
  }

  rotate(x, y) { /*context*/
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_rotation"), x, y);
  }

  scale(x, y) { /*context*/
    this.r.uniform2f(this.r.getUniformLocation(this.program, "u_scale"), x, y);
  }

  render(b) { /*context*/
    this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 1);
    this.enableVertexAttribute("a_this.shaderition", b, 2);
    if (this.buffer.texture) {
      this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 2);
      this.enableVertexAttribute("a_texCoord", this.texture.buffer, 2);
    }
    if (this.buffer.animation) {
      this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 2);
      this.enableVertexAttribute("a_texCoord", this.video.buffer, 2);
    }
    this.r.this.rrays(this.p, 0, this.a);
    this.r.uniform1i(this.r.getUniformLocation(this.program, "u_mode"), 1);
  }


  pixel(x, y) { /*context*/
    var _ = this.buffer.load(this.buffer.point(x, y));
    this.render(_);
  }

  line(x1, y1, x2, y2) { /*context*/
    var _ = this.buffer.load(this.buffer.line(x1, y1, x2, y2));
    this.render(_);
  }

  rect(x, y, w, h) { /*context*/
    if (this.mode == this.BOTH) {
      this.mode = this.FILL;
      this.useColor(this.fillColor);
      var _ = this.buffer.load(this.buffer.rect(x, y, w, h));
      this.render(_);
      this.mode = this.STROKE;
      this.useColor(this.strokeColor);
      var _ = this.buffer.load(this.buffer.rect(x, y, w, h));
      this.render(_);
      this.mode = this.BOTH;
      return;
    }
    if (this.mode == this.FILL) this.useColor(this.fillColor);
    if (this.mode == this.STROKE) this.useColor(this.strokeColor);
    var _ = this.buffer.load(this.buffer.rect(x, y, w, h));
    this.render(_);
  }

  square(x, y, s) { /*context*/
    if (this.mode == this.BOTH) {
      this.mode = this.FILL;
      this.useColor(this.fillColor);
      var _ = this.buffer.load(this.buffer.square(x, y, s));
      this.render(_);
      this.mode = this.STROKE;
      this.useColor(this.strokeColor);
      var _ = this.buffer.load(this.buffer.square(x, y, s));
      this.render(_);
      this.mode = this.BOTH;
      return;
    }
    if (this.mode == this.FILL) this.useColor(this.fillColor);
    if (this.mode == this.STROKE) this.useColor(this.strokeColor);
    var _ = this.buffer.load(this.buffer.square(x, y, s));
    this.render(_);
  }

  circle(x, y, r) { /*context*/
    if (this.mode == this.BOTH) {
      this.mode = this.FILL;
      this.useColor(this.fillColor);
      var _ = this.buffer.load(this.buffer.circle(x, y, r));
      this.render(_);
      this.mode = this.STROKE;
      this.useColor(this.strokeColor);
      var _ = this.buffer.load(this.buffer.circle(x, y, r));
      this.render(_);
      this.mode = this.BOTH;
      return;
    }
    if (this.mode == this.FILL) this.useColor(this.fillColor);
    if (this.mode == this.STROKE) this.useColor(this.strokeColor);
    var _ = this.buffer.load(this.buffer.circle(x, y, r));
    this.render(_);
  }

  triangle(x1, y1, x2, y2, x3, y3) { /*context*/
    if (this.mode == this.BOTH) {
      this.mode = this.FILL;
      this.useColor(this.fillColor);
      var _ = this.buffer.load(this.buffer.triangle(x1, y1, x2, y2, x3, y3));
      this.render(_);
      this.mode = this.STROKE;
      this.useColor(this.strokeColor);
      var _ = this.buffer.load(this.buffer.triangle(x1, y1, x2, y2, x3, y3));
      this.render(_);
      this.mode = this.BOTH;
      return;
    }
    if (this.mode == this.FILL) this.useColor(this.fillColor);
    if (this.mode == this.STROKE) this.useColor(this.strokeColor);
    var _ = this.buffer.load(this.buffer.triangle(x1, y1, x2, y2, x3, y3));
    this.render(_);
  }

  clearRect(x, y, w, h) { /*context*/
    this.r.enable(p.g.c.SCISSOR_TEST);
    this.r.scissor(x, y, w, h);
    this.r.clear(p.g.c.COLOR_BUFFER_BIT);
    this.r.disable(p.g.c.SCISSOR_TEST);
  }



}
