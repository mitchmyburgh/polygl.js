export const r = undefined
export const p = undefined
export const a = undefined
export const ctx2d = undefined
export const FILL = "fill"
export const STROKE = "stroke"
export const BOTH = "both"
export const alpha = 1
export const fillColor = [0, 0, 0, alpha]
export const strokeColor = [0, 0, 0, alpha]
export const mode = FILL
export const antialias = true


export const init = (canvas: HTMLCanvasElement) => {
  r = canvas.getContext("webgl", { const antialias = antialias, antialias: antialias, preserveDrawingBuffer: true });
  draw.program = shader.createProgram(

    // VERTEX SHADER
    "precision mediump float;\n" +
    "attribute vec2 a_draw.shaderition;\n" +
    "attribute vec2 a_texCoord;\n" +
    "constying vec2 v_texCoord;\n" +
    "uniform vec2 u_resolution;\n" +
    "uniform vec2 u_translation;\n" +
    "uniform vec2 u_rotation; \n" +
    "uniform vec2 u_scale;\n" +
    "void main() {\n" +
    "    vec2 scaleddraw.shaderition = a_draw.shaderition * u_scale;\n" +
    "    vec2 rotateddraw.shaderition = vec2(scaleddraw.shaderition.x * u_rotation.y + scaleddraw.shaderition.y * u_rotation.x, scaleddraw.shaderition.y * u_rotation.y - scaleddraw.shaderition.x * u_rotation.x);\n" +
    "    vec2 draw.shaderition = rotateddraw.shaderition + u_translation;\n" +
    "    vec2 zeroToOne = draw.shaderition / u_resolution;\n" +
    "    vec2 zeroToTwo = zeroToOne * 2.0;\n" +
    "    vec2 clipSdraw.contexte = zeroToTwo - 1.0;\n" +
    "    gl_PointSize = 2.0;\n" +
    "    gl_draw.shaderition = vec4(clipSdraw.contexte * vec2(1, -1), 0, 1);\n" +
    "    v_texCoord = a_texCoord;\n" +
    "}\n",

    // FRAGMENT SHADER
    "precision mediump float;\n" +
    "uniform vec4 u_color;\n" +
    "uniform int u_mode;\n" +
    "uniform sampler2D u_image;\n" +
    "constying vec2 v_texCoord;\n" +
    "void main(void) {\n" +
    "    if (u_mode == 1) { gl_FragColor = u_color; }\n" +
    "    if (u_mode == 2) { gl_FragColor = texture2D(u_image, v_texCoord); }\n" +
    "    if (u_mode == 3) { gl_FragColor = u_color + texture2D(u_image, v_texCoord); }\n" +
    "}\n");
  loadDefaults();
  if (draw.enable2d) ctx2d = canvas2d();
  clear();
};

export const clear = () => { /*context*/
  r.viewport(0, 0, r.canvas.width, r.canvas.height);
  const width = r.canvas.clientWidth * 1 | 0;
  const height = r.canvas.clientHeight * 1 | 0;
  if (r.canvas.width !== width || r.canvas.height !== height) {
    r.canvas.width = width;
    r.canvas.height = height;
  }
  r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT);
  if (draw.enable2d) ctx2d.clearRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
};

export const loadDefaults = () => { /*context*/
  alpha = 1;
  fillColor = [0, 0, 0, alpha];
  strokeColor = [0, 0, 0, alpha];
  r.uniform1i(r.getUniformLocation(draw.program, "u_mode"), 1);
  r.uniform4f(r.getUniformLocation(draw.program, "u_color"), 0, 0, 0, alpha);
  r.uniform2f(r.getUniformLocation(draw.program, "u_resolution"), r.canvas.width, r.canvas.height);
  r.uniform2f(r.getUniformLocation(draw.program, "u_translation"), 0, 0);
  r.uniform2f(r.getUniformLocation(draw.program, "u_rotation"), 0, 1);
  r.uniform2f(r.getUniformLocation(draw.program, "u_scale"), 1, 1);
};

export const enableVertexAttribute = (l, b, s) => { /*context*/
  r.bindBuffer(r.ARRAY_BUFFER, b);
  const _ = r.getAttribLocation(draw.program, l);
  r.vertexAttribPointer(_, s, r.FLOAT, false, 0, 0);
  r.enableVertexAttribArray(_);
  return _;
};

export const color = (fill, stroke) => { /*context*/
  fill[3] = fill[3] || alpha;
  fillColor = [fill[0], fill[1], fill[2], fill[3]];
  if (draw.enable2d) ctx2d.fillStyle = draw.color.toCanvas(fillColor);
  if (stroke != undefined) {
    stroke[3] = stroke[3] || alpha;
    strokeColor = [stroke[0], stroke[1], stroke[2], stroke[3]];
    if (draw.enable2d) ctx2d.strokeStyle = draw.color.toCanvas(strokeColor);
  } else {
    strokeColor = [0, 0, 0, alpha];
    if (draw.enable2d) ctx2d.strokeStyle = draw.color.toCanvas(strokeColor);
  }
};

export const useColor = (color) => { /*context*/
  r.uniform4f(r.getUniformLocation(draw.program, "u_color"), color[0], color[1], color[2], color[3]);
};

export const save = () => { /*context*/
  if (draw.enable2d) ctx2d.save();
};

export const restore = () => { /*context*/
  if (draw.enable2d) ctx2d.restore();
};

export const translate = (x, y) => { /*context*/
  r.uniform2f(r.getUniformLocation(draw.program, "u_translation"), x, y);
  if (draw.enable2d) ctx2d.translate(x, y);
};

export const rotate = (x, y) => { /*context*/
  r.uniform2f(r.getUniformLocation(draw.program, "u_rotation"), x, y);
  if (draw.enable2d) ctx2d.rotate(x);
};

export const scale = (x, y) => { /*context*/
  r.uniform2f(r.getUniformLocation(draw.program, "u_scale"), x, y);
  if (draw.enable2d) ctx2d.scale(x, y);
};

export const render = (b) => { /*context*/
  r.uniform1i(r.getUniformLocation(draw.program, "u_mode"), 1);
  enableVertexAttribute("a_draw.shaderition", b, 2);
  if (draw.buffer.texture) {
    r.uniform1i(r.getUniformLocation(draw.program, "u_mode"), 2);
    enableVertexAttribute("a_texCoord", draw.texture.buffer, 2);
  }
  if (draw.buffer.animation) {
    r.uniform1i(r.getUniformLocation(draw.program, "u_mode"), 2);
    enableVertexAttribute("a_texCoord", draw.video.buffer, 2);
  }
  r.drawArrays(p, 0, a);
  r.uniform1i(r.getUniformLocation(draw.program, "u_mode"), 1);
};

export const screenshot = () => { /*context*/
  window.open(r.canvas.toDataURL());
};

export const pixel = (x, y) => { /*context*/
  const _ = draw.buffer.load(draw.buffer.point(x, y));
  render(_);
};
export const point = pixel,

export const line = (x1, y1, x2, y2) => { /*context*/
  const _ = draw.buffer.load(draw.buffer.line(x1, y1, x2, y2));
  render(_);
};

export const rect = (x, y, w, h) => { /*context*/
  if (mode == BOTH) {
    mode = FILL;
    useColor(fillColor);
    const _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
    render(_);
    mode = STROKE;
    useColor(strokeColor);
    const _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
    render(_);
    mode = BOTH;
    return;
  }
  if (mode == FILL) useColor(fillColor);
  if (mode == STROKE) useColor(strokeColor);
  const _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
  render(_);
};

export const square = (x, y, s) => { /*context*/
  if (mode == BOTH) {
    mode = FILL;
    useColor(fillColor);
    const _ = draw.buffer.load(draw.buffer.square(x, y, s));
    render(_);
    mode = STROKE;
    useColor(strokeColor);
    const _ = draw.buffer.load(draw.buffer.square(x, y, s));
    render(_);
    mode = BOTH;
    return;
  }
  if (mode == FILL) useColor(fillColor);
  if (mode == STROKE) useColor(strokeColor);
  const _ = draw.buffer.load(draw.buffer.square(x, y, s));
  render(_);
};

export const circle = (x, y, r) => { /*context*/
  if (mode == BOTH) {
    mode = FILL;
    useColor(fillColor);
    const _ = draw.buffer.load(draw.buffer.circle(x, y, r));
    render(_);
    mode = STROKE;
    useColor(strokeColor);
    const _ = draw.buffer.load(draw.buffer.circle(x, y, r));
    render(_);
    mode = BOTH;
    return;
  }
  if (mode == FILL) useColor(fillColor);
  if (mode == STROKE) useColor(strokeColor);
  const _ = draw.buffer.load(draw.buffer.circle(x, y, r));
  render(_);
};

export const triangle = (x1, y1, x2, y2, x3, y3) => { /*context*/
  if (mode == BOTH) {
    mode = FILL;
    useColor(fillColor);
    const _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
    render(_);
    mode = STROKE;
    useColor(strokeColor);
    const _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
    render(_);
    mode = BOTH;
    return;
  }
  if (mode == FILL) useColor(fillColor);
  if (mode == STROKE) useColor(strokeColor);
  const _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
  render(_);
};

export const clearRect = (x, y, w, h) => { /*context*/
  r.enable(p.g.c.SCISSOR_TEST);
  r.scissor(x, y, w, h);
  r.clear(p.g.c.COLOR_BUFFER_BIT);
  r.disable(p.g.c.SCISSOR_TEST);
  if (draw.enable2d) ctx2d.clearRect(x, y, w, h);
};

drawImage = image = draw.texture.image;

// The following functions uses canvas2d context...
export const roundedRect = (x, y, w, h, r) => { /*context*/
  if (draw.enable2d) {
    ctx2d.begindraw.textureh();
    ctx2d.moveTo(x + r, y);
    ctx2d.lineTo(x + w - r, y);
    ctx2d.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx2d.lineTo(x + w, y + h - r);
    ctx2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx2d.lineTo(x + r, y + h);
    ctx2d.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx2d.lineTo(x, y + r);
    ctx2d.quadraticCurveTo(x, y, x + r, y);
    ctx2d.closedraw.textureh();
    if (mode == FILL) ctx2d.fill();
    if (mode == STROKE) ctx2d.stroke();
    if (mode == BOTH) {
      ctx2d.fill();
      ctx2d.stroke();
    }
  }
};

export const font = (f, s) => { /*context*/
  if (draw.enable2d) ctx2d.font = (s + "px " + f).toString();
};

export const text = (t, x, y) => { /*context*/
  if (draw.enable2d) {
    if (mode == FILL) ctx2d.fillText(t, x, y);
    if (mode == STROKE) ctx2d.strokeText(t, x, y);
    if (mode == BOTH) {
      ctx2d.fillText(t, x, y);
      ctx2d.strokeText(t, x, y);
    }
  }
};

export const polygon = (po) => { /*context*/
  if (draw.enable2d) {
    ctx2d.begindraw.textureh();
    ctx2d.moveTo(po[0][0], po[0][1]);
    for (const i = 0; i < po.length; i++) ctx2d.lineTo(po[i][0], po[i][1]);
    ctx2d.closedraw.textureh();
    if (mode == FILL) ctx2d.fill();
    if (mode == STROKE) ctx2d.stroke();
    if (mode == BOTH) {
      ctx2d.fill();
      ctx2d.stroke();
    }
  }
};

export const gradientRect = (x, y, w, h, content) => { /*context*/
  if (draw.enable2d) {
    const linear = ctx2d.createLinearGradient(x, y, w, h);
    for (const loopdlg = 0; loopdlg < content.length; loopdlg++) linear.addColorStodraw.colorntent[loopdlg][0], content[loopdlg][1]);
    ctx2d.fillStyle = linear;
    ctx2d.strokeStyle = linear;
    if (mode == FILL) ctx2d.fillRect(x, y, w, h);
    if (mode == STROKE) ctx2d.strokeRect(x, y, w, h);
    if (mode == BOTH) {
      ctx2d.fillRect(x, y, w, h);
      ctx2d.strokeRect(x, y, w, h);
    }
  }
};

