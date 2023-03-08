type RGBA = [number, number, number, number];

interface DrawInterface {
  buffer: any,
  context: {
    r: WebGLRenderingContext,
    p: unknown,
    a: number,
    ctx2d: CanvasRenderingContext2D,
    FILL: "fill",
    STROKE: "stroke",
    BOTH: "both",
    mode: "fill" | "stroke" | "both",
    alpha: number,
    fillColor: RGBA,
    strokeColor: RGBA,
    antialias: boolean,
    canvas2d: () => CanvasRenderingContext2D
    init: () => void,
    clear: () => void,
    loadDefaultShader: () => void,
    enableVertexAttribute: (l: unknown, b: unknown, s: unknown) => void,
    color: (fill: RGBA, stroke: RGBA) => void,
    useColor: (color: RGBA) => void,
    save: () => void,
    restore: () => void,
    translate: (x: number, y: number) => void,
    rotate: (x: number, y: number) => void,
    scale: (x: number, y: number) => void,

  },
  color: {
    RGB: (r: number, g: number, b: number) => RGBA,
    RGBA: (r: number, g: number, b: number, a: number) => RGBA,
    HEX2RGB: (hex: string) => RGBA,
    HSL2RGB: (h: number, s: number, l: number) => RGBA,
    HSLA2RGBA: (h: number, s: number, l: number, a: number) => RGBA,
    HEX: (hex: string) => RGBA,
    HSL: (h: number, s: number, l: number) => RGBA,
    HSLA: (h: number, s: number, l: number, a: number) => RGBA,
    toCanvas: (color: RGBA) => string,
  },
  shader: {
    program: (vertexShaderSource: string, fragmentShaderSource: string) => WebGLProgram,
  },
  texture: any,
  video: any,
  program?: WebGLProgram,
  enable2d: boolean
}


const draw: DrawInterface = {
  buffer: {

    animation: false,
    load: (v: number[]) => {
      var _ = draw.context.r.createBuffer();
      draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, _);
      draw.context.r.bufferData(draw.context.r.ARRAY_BUFFER, new Float32Array(v), draw.context.r.STATIC_DRAW);
      draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, null);
      return _;
    },

    use: (b) => {
      draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, b);
    },

    clear: () => { /*buffer*/
      draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, null);
    },

    rect: (x, y, w, h) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.a = 4;
      draw.context.p = (draw.context.mode == draw.context.FILL) ? draw.context.r.TRIANGLE_FAN : draw.context.r.LINE_LOOP;
      return [
        x, y,
        x + w, y,
        x + w, y + h,
        x, y + h
      ];
    },

    square: (x, y, s) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.a = 4;
      draw.context.p = (draw.context.mode == draw.context.FILL) ? draw.context.r.TRIANGLE_FAN : draw.context.r.LINE_LOOP;
      return [
        x, y,
        x + s, y,
        x + s, y + s,
        x, y + s
      ];
    },

    line: (x1, y1, x2, y2) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.a = 2;
      draw.context.p = draw.context.r.LINES;
      return [
        x1, y1,
        x2, y2
      ];
    },

    triangle: (x1, y1, x2, y2, x3, y3) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.a = 3;
      draw.context.p = (draw.context.mode == draw.context.FILL) ? draw.context.r.TRIANGLES : draw.context.r.LINE_LOOP;
      return [
        x1, y1,
        x2, y2,
        x3, y3
      ];
    },

    point: (x, y) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.a = 1;
      draw.context.p = draw.context.r.POINTS;
      return [x, y];
    },

    // For filled circles
    // https://stackoverflow.com/a/1237519/10896648
    // For stroked circles
    // https://stackoverflow.com/questions/47671374/fill-a-drawed-circle-with-the-midpoint-algorithm-in-c-infinite-loop
    circle: (x, y, r) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = false;
      draw.context.p = draw.context.POINTS;
      var cp = [];
      if (draw.context.mode == draw.context.FILL) {
        for (var y1 = -r; y1 <= r; y1++) {
          for (var x1 = -r; x1 <= r; x1++) {
            if (x1 * x1 + y1 * y1 <= r * r) {
              cp.draw.shaderh(x + x1, y + y1);
            }
          }
        }
      } else if (draw.context.mode == draw.context.STROKE) {
        r = r + 2;
        var x1 = r - 1;
        var y1 = 0;
        var dx = 1;
        var dy = 1;
        var err = dx - (r << 1);

        while (x1 >= y1) {
          cp.draw.shaderh(x + x1, y + y1);
          cp.draw.shaderh(x + y1, y + x1);
          cp.draw.shaderh(x - y1, y + x1);
          cp.draw.shaderh(x - x1, y + y1);
          cp.draw.shaderh(x - x1, y - y1);
          cp.draw.shaderh(x - y1, y - x1);
          cp.draw.shaderh(x + y1, y - x1);
          cp.draw.shaderh(x + x1, y - y1);

          if (err <= 0) {
            y1++;
            err += dy;
            dy += 2;
          }

          if (err > 0) {
            x1--;
            dx += 2;
            err += dx - (r << 1);
          }
        }
      }
      draw.context.a = cp.length / 2;
      return cp;
    },

    image: (x, y, w, h) => { /*buffer*/
      draw.buffer.texture = true;
      draw.buffer.animation = false;
      draw.context.a = 6;
      draw.context.p = draw.context.r.TRIANGLES;
      var x1 = x;
      var x2 = x + w;
      var y1 = y;
      var y2 = y + h;
      draw.texture.buffer = draw.buffer.load([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
      ]);
      draw.texture.rect = draw.buffer.load([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
      ]);
    },

    video: (x, y, w, h) => { /*buffer*/
      draw.buffer.texture = false;
      draw.buffer.animation = true;
      draw.context.a = 6;
      draw.context.p = draw.context.r.TRIANGLES;
      var x1 = x;
      var x2 = x + w;
      var y1 = y;
      var y2 = y + h;
      draw.video.buffer = draw.buffer.load([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
      ]);
      draw.video.rect = draw.buffer.load([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
      ]);
    },
  },
  context: {
    r: undefined,
    p: undefined,
    a: undefined,
    ctx2d: undefined,
    FILL: "fill",
    STROKE: "stroke",
    BOTH: "both",
    alpha: 1,
    fillColor: [0, 0, 0, draw.context.alpha],
    strokeColor: [0, 0, 0, draw.context.alpha],
    mode: draw.context.FILL,
    antialias: true,

    canvas2d: () => { /*canvas*/
      if (draw.enable2d) {
        var _ = document.createElement("canvas");
        _.width = draw.context.r.canvas.width;
        _.height = draw.context.r.canvas.height;
        _.style.draw.shaderition = "absolute";
        _.style.zIndex = -1;
        _.style.left = 0;
        _.style.top = 0;
        document.body.appendChild(_);
        return _.getContext("2d");
      }
    },

    init: (i) => { /*context*/
      if (i == undefined) i = 0;
      draw.context.r = document.getElementsByTagName("canvas")[i].getContext("webgl", { antialias: draw.context.antialias, antialias: draw.context.antialias, preserveDrawingBuffer: true });
      draw.context.r.canvas.style.draw.shaderition = "absolute";
      draw.context.r.canvas.style.left = 0;
      draw.context.r.canvas.style.top = 0;
      draw.context.r.canvas.style.zIndex = 0;
      draw.program = draw.shader.program(

        // VERTEX SHADER
        "precision mediump float;\n" +
        "attribute vec2 a_draw.shaderition;\n" +
        "attribute vec2 a_texCoord;\n" +
        "varying vec2 v_texCoord;\n" +
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
        "varying vec2 v_texCoord;\n" +
        "void main(void) {\n" +
        "    if (u_mode == 1) { gl_FragColor = u_color; }\n" +
        "    if (u_mode == 2) { gl_FragColor = texture2D(u_image, v_texCoord); }\n" +
        "    if (u_mode == 3) { gl_FragColor = u_color + texture2D(u_image, v_texCoord); }\n" +
        "}\n");
      draw.context.loadDefaults();
      if (draw.enable2d) draw.context.ctx2d = draw.context.canvas2d();
      draw.context.clear();
    },

    clear: () => { /*context*/
      draw.context.r.viewport(0, 0, draw.context.r.canvas.width, draw.context.r.canvas.height);
      var width = draw.context.r.canvas.clientWidth * 1 | 0;
      var height = draw.context.r.canvas.clientHeight * 1 | 0;
      if (draw.context.r.canvas.width !== width || draw.context.r.canvas.height !== height) {
        draw.context.r.canvas.width = width;
        draw.context.r.canvas.height = height;
      }
      draw.context.r.clear(draw.context.r.COLOR_BUFFER_BIT | draw.context.r.DEPTH_BUFFER_BIT);
      if (draw.enable2d) draw.context.ctx2d.clearRect(0, 0, draw.context.ctx2d.canvas.width, draw.context.ctx2d.canvas.height);
    },

    loadDefaults: () => { /*context*/
      draw.context.alpha = 1;
      draw.context.fillColor = [0, 0, 0, draw.context.alpha];
      draw.context.strokeColor = [0, 0, 0, draw.context.alpha];
      draw.context.r.uniform1i(draw.context.r.getUniformLocation(draw.program, "u_mode"), 1);
      draw.context.r.uniform4f(draw.context.r.getUniformLocation(draw.program, "u_color"), 0, 0, 0, draw.context.alpha);
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_resolution"), draw.context.r.canvas.width, draw.context.r.canvas.height);
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_translation"), 0, 0);
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_rotation"), 0, 1);
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_scale"), 1, 1);
    },

    enableVertexAttribute: (l, b, s) => { /*context*/
      draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, b);
      var _ = draw.context.r.getAttribLocation(draw.program, l);
      draw.context.r.vertexAttribPointer(_, s, draw.context.r.FLOAT, false, 0, 0);
      draw.context.r.enableVertexAttribArray(_);
      return _;
    },

    color: (fill, stroke) => { /*context*/
      fill[3] = fill[3] || draw.context.alpha;
      draw.context.fillColor = [fill[0], fill[1], fill[2], fill[3]];
      if (draw.enable2d) draw.context.ctx2d.fillStyle = draw.color.toCanvas(draw.context.fillColor);
      if (stroke != undefined) {
        stroke[3] = stroke[3] || draw.context.alpha;
        draw.context.strokeColor = [stroke[0], stroke[1], stroke[2], stroke[3]];
        if (draw.enable2d) draw.context.ctx2d.strokeStyle = draw.color.toCanvas(draw.context.strokeColor);
      } else {
        draw.context.strokeColor = [0, 0, 0, draw.context.alpha];
        if (draw.enable2d) draw.context.ctx2d.strokeStyle = draw.color.toCanvas(draw.context.strokeColor);
      }
    },

    useColor: (color) => { /*context*/
      draw.context.r.uniform4f(draw.context.r.getUniformLocation(draw.program, "u_color"), color[0], color[1], color[2], color[3]);
    },

    save: () => { /*context*/
      if (draw.enable2d) draw.context.ctx2d.save();
    },

    restore: () => { /*context*/
      if (draw.enable2d) draw.context.ctx2d.restore();
    },

    translate: (x, y) => { /*context*/
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_translation"), x, y);
      if (draw.enable2d) draw.context.ctx2d.translate(x, y);
    },

    rotate: (x, y) => { /*context*/
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_rotation"), x, y);
      if (draw.enable2d) draw.context.ctx2d.rotate(x);
    },

    scale: (x, y) => { /*context*/
      draw.context.r.uniform2f(draw.context.r.getUniformLocation(draw.program, "u_scale"), x, y);
      if (draw.enable2d) draw.context.ctx2d.scale(x, y);
    },

    render: (b) => { /*context*/
      draw.context.r.uniform1i(draw.context.r.getUniformLocation(draw.program, "u_mode"), 1);
      draw.context.enableVertexAttribute("a_draw.shaderition", b, 2);
      if (draw.buffer.texture) {
        draw.context.r.uniform1i(draw.context.r.getUniformLocation(draw.program, "u_mode"), 2);
        draw.context.enableVertexAttribute("a_texCoord", draw.texture.buffer, 2);
      }
      if (draw.buffer.animation) {
        draw.context.r.uniform1i(draw.context.r.getUniformLocation(draw.program, "u_mode"), 2);
        draw.context.enableVertexAttribute("a_texCoord", draw.video.buffer, 2);
      }
      draw.context.r.drawArrays(draw.context.p, 0, draw.context.a);
      draw.context.r.uniform1i(draw.context.r.getUniformLocation(draw.program, "u_mode"), 1);
    },

    screenshot: () => { /*context*/
      window.open(draw.context.r.canvas.toDataURL());
    },

    pixel: (x, y) => { /*context*/
      var _ = draw.buffer.load(draw.buffer.point(x, y));
      draw.context.render(_);
    },
    point: draw.context.pixel,

    line: (x1, y1, x2, y2) => { /*context*/
      var _ = draw.buffer.load(draw.buffer.line(x1, y1, x2, y2));
      draw.context.render(_);
    },

    rect: (x, y, w, h) => { /*context*/
      if (draw.context.mode == draw.context.BOTH) {
        draw.context.mode = draw.context.FILL;
        draw.context.useColor(draw.context.fillColor);
        var _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
        draw.context.render(_);
        draw.context.mode = draw.context.STROKE;
        draw.context.useColor(draw.context.strokeColor);
        var _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
        draw.context.render(_);
        draw.context.mode = draw.context.BOTH;
        return;
      }
      if (draw.context.mode == draw.context.FILL) draw.context.useColor(draw.context.fillColor);
      if (draw.context.mode == draw.context.STROKE) draw.context.useColor(draw.context.strokeColor);
      var _ = draw.buffer.load(draw.buffer.rect(x, y, w, h));
      draw.context.render(_);
    },

    square: (x, y, s) => { /*context*/
      if (draw.context.mode == draw.context.BOTH) {
        draw.context.mode = draw.context.FILL;
        draw.context.useColor(draw.context.fillColor);
        var _ = draw.buffer.load(draw.buffer.square(x, y, s));
        draw.context.render(_);
        draw.context.mode = draw.context.STROKE;
        draw.context.useColor(draw.context.strokeColor);
        var _ = draw.buffer.load(draw.buffer.square(x, y, s));
        draw.context.render(_);
        draw.context.mode = draw.context.BOTH;
        return;
      }
      if (draw.context.mode == draw.context.FILL) draw.context.useColor(draw.context.fillColor);
      if (draw.context.mode == draw.context.STROKE) draw.context.useColor(draw.context.strokeColor);
      var _ = draw.buffer.load(draw.buffer.square(x, y, s));
      draw.context.render(_);
    },

    circle: (x, y, r) => { /*context*/
      if (draw.context.mode == draw.context.BOTH) {
        draw.context.mode = draw.context.FILL;
        draw.context.useColor(draw.context.fillColor);
        var _ = draw.buffer.load(draw.buffer.circle(x, y, r));
        draw.context.render(_);
        draw.context.mode = draw.context.STROKE;
        draw.context.useColor(draw.context.strokeColor);
        var _ = draw.buffer.load(draw.buffer.circle(x, y, r));
        draw.context.render(_);
        draw.context.mode = draw.context.BOTH;
        return;
      }
      if (draw.context.mode == draw.context.FILL) draw.context.useColor(draw.context.fillColor);
      if (draw.context.mode == draw.context.STROKE) draw.context.useColor(draw.context.strokeColor);
      var _ = draw.buffer.load(draw.buffer.circle(x, y, r));
      draw.context.render(_);
    },

    triangle: (x1, y1, x2, y2, x3, y3) => { /*context*/
      if (draw.context.mode == draw.context.BOTH) {
        draw.context.mode = draw.context.FILL;
        draw.context.useColor(draw.context.fillColor);
        var _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
        draw.context.render(_);
        draw.context.mode = draw.context.STROKE;
        draw.context.useColor(draw.context.strokeColor);
        var _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
        draw.context.render(_);
        draw.context.mode = draw.context.BOTH;
        return;
      }
      if (draw.context.mode == draw.context.FILL) draw.context.useColor(draw.context.fillColor);
      if (draw.context.mode == draw.context.STROKE) draw.context.useColor(draw.context.strokeColor);
      var _ = draw.buffer.load(draw.buffer.triangle(x1, y1, x2, y2, x3, y3));
      draw.context.render(_);
    },

    clearRect: (x, y, w, h) => { /*context*/
      draw.context.r.enable(p.g.c.SCISSOR_TEST);
      draw.context.r.scissor(x, y, w, h);
      draw.context.r.clear(p.g.c.COLOR_BUFFER_BIT);
      draw.context.r.disable(p.g.c.SCISSOR_TEST);
      if (draw.enable2d) draw.context.ctx2d.clearRect(x, y, w, h);
    },

    draw.context.drawImage = draw.context.image = draw.texture.image;

    // The following functions uses canvas2d context...
    roundedRect: (x, y, w, h, r) => { /*context*/
      if (draw.enable2d) {
        draw.context.ctx2d.begindraw.textureh();
        draw.context.ctx2d.moveTo(x + r, y);
        draw.context.ctx2d.lineTo(x + w - r, y);
        draw.context.ctx2d.quadraticCurveTo(x + w, y, x + w, y + r);
        draw.context.ctx2d.lineTo(x + w, y + h - r);
        draw.context.ctx2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        draw.context.ctx2d.lineTo(x + r, y + h);
        draw.context.ctx2d.quadraticCurveTo(x, y + h, x, y + h - r);
        draw.context.ctx2d.lineTo(x, y + r);
        draw.context.ctx2d.quadraticCurveTo(x, y, x + r, y);
        draw.context.ctx2d.closedraw.textureh();
        if (draw.context.mode == draw.context.FILL) draw.context.ctx2d.fill();
        if (draw.context.mode == draw.context.STROKE) draw.context.ctx2d.stroke();
        if (draw.context.mode == draw.context.BOTH) {
          draw.context.ctx2d.fill();
          draw.context.ctx2d.stroke();
        }
      }
    },

    font: (f, s) => { /*context*/
      if (draw.enable2d) draw.context.ctx2d.font = (s + "px " + f).toString();
    },

    text: (t, x, y) => { /*context*/
      if (draw.enable2d) {
        if (draw.context.mode == draw.context.FILL) draw.context.ctx2d.fillText(t, x, y);
        if (draw.context.mode == draw.context.STROKE) draw.context.ctx2d.strokeText(t, x, y);
        if (draw.context.mode == draw.context.BOTH) {
          draw.context.ctx2d.fillText(t, x, y);
          draw.context.ctx2d.strokeText(t, x, y);
        }
      }
    },

    polygon: (po) => { /*context*/
      if (draw.enable2d) {
        draw.context.ctx2d.begindraw.textureh();
        draw.context.ctx2d.moveTo(po[0][0], po[0][1]);
        for (var i = 0; i < po.length; i++) draw.context.ctx2d.lineTo(po[i][0], po[i][1]);
        draw.context.ctx2d.closedraw.textureh();
        if (draw.context.mode == draw.context.FILL) draw.context.ctx2d.fill();
        if (draw.context.mode == draw.context.STROKE) draw.context.ctx2d.stroke();
        if (draw.context.mode == draw.context.BOTH) {
          draw.context.ctx2d.fill();
          draw.context.ctx2d.stroke();
        }
      }
    },

    gradientRect: (x, y, w, h, content) => { /*context*/
      if (draw.enable2d) {
        var linear = draw.context.ctx2d.createLinearGradient(x, y, w, h);
        for (var loopdlg = 0; loopdlg < content.length; loopdlg++) linear.addColorStodraw.colorntent[loopdlg][0], content[loopdlg][1]);
        draw.context.ctx2d.fillStyle = linear;
        draw.context.ctx2d.strokeStyle = linear;
        if (draw.context.mode == draw.context.FILL) draw.context.ctx2d.fillRect(x, y, w, h);
        if (draw.context.mode == draw.context.STROKE) draw.context.ctx2d.strokeRect(x, y, w, h);
        if (draw.context.mode == draw.context.BOTH) {
          draw.context.ctx2d.fillRect(x, y, w, h);
          draw.context.ctx2d.strokeRect(x, y, w, h);
        }
      }
    },
  },
  color: {
    RGB: (r, g, b) => { /*color*/
      return [r / 255, g / 255, b / 255, draw.context.alpha];
    },

    RGBA: (r, g, b, a) => { /*color*/
      return [r / 255, g / 255, b / 255, a / 255];
    },

    // https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.htmlRGB
    HEX2RGB: (h) => {
      if (h.length != 6) {
        return [0, 0, 0, 0];
      }

      var aRgbHex = h.match(/.{1,2}/g);
      var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16),
        draw.context.alpha
      ];
      return aRgb;
    },

    // https://gist.github.com/mjackson/5311256#file-color-conversion-algorithms-js-L36
    HSL2RGB: (h, s, l) => { /*HSL*/
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [r * 255, g * 255, b * 255, draw.context.alpha];
    },

    HSLA2RGBA: (h, s, l, a) => { /*HSLA*/
      var r, g, b, a;

      if (s == 0) {
        r = g = b = a = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [r * 255, g * 255, b * 255, (a >= 0 && a <= 1) ? a * 255 : 255];
    },

    HEX: (h) => { /*color*/
      return draw.color.RGB(draw.color.HEX2RGB(h)[0], draw.color.HEX2RGB(h)[1], draw.color.HEX2RGB(h)[2]);
    },

    HSL: (h, s, l) => { /*color*/
      return draw.color.RGB(draw.color.HSL2RGB(h / 360, s, l)[0], draw.color.HSL2RGB(h / 360, s, l)[1], draw.color.HSL2RGB(h / 360, s, l)[2]);
    },

    HSLA: (h, s, l, a) => { /*color*/
      return draw.color.RGB(draw.color.HSL2RGB(h / 360, s, l)[0], draw.color.HSL2RGB(h / 360, s, l)[1], draw.color.HSL2RGB(h / 360, s, l)[2], (a >= 0 && a <= 1) ? a : 1);
    },

    // Converts RGBA color from WebGL context to canvas2d context color from array!
    toCanvas: (a) => { /*color*/
      if (draw.enable2d) return "rgba(" + (a[0] * 255) + "," + (a[1] * 255) + "," + (a[2] * 255) + "," + (a[3] * 255) + ")";
    },


  },
  shader: {
    program: (vertexShaderSource, fragmentShaderSource) => {
      const vertexShader = draw.context.r.createShader(draw.context.r.VERTEX_SHADER);
      if (!vertexShader) throw new Error("Vertex shader failed to compile.");
      draw.context.r.shaderSource(vertexShader, vertexShaderSource);
      draw.context.r.compileShader(vertexShader);
      const fragmentShader = draw.context.r.createShader(draw.context.r.FRAGMENT_SHADER);
      if (!fragmentShader) throw new Error("Fragment shader failed to compile.");
      draw.context.r.shaderSource(fragmentShader, fragmentShaderSource);
      draw.context.r.compileShader(fragmentShader);
      const program = draw.context.r.createProgram();
      if (!program) throw new Error("Program failed to compile.");
      draw.context.r.attachShader(program, vertexShader);
      draw.context.r.attachShader(program, fragmentShader);
      draw.context.r.linkProgram(program);
      draw.context.r.useProgram(program);
      draw.context.r.deleteShader(vertexShader);
      draw.context.r.deleteShader(fragmentShader);
      draw.context.r.deleteProgram(program);
      return program;
    },
  },
  texture: {

    buffer: undefined,
    rect: undefined,
    image: (i, x, y, w, h) => { /*texture*/
      polygl.buffer.image(x, y, w, h);
      var _ = draw.context.r.createTexture();
      draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, _);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.shader, draw.context.r.CLAMdraw.textureO_EDGE);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.texture, draw.context.r.CLAMdraw.textureO_EDGE);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MIN_FILTER, draw.context.r.NEAREST);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MAG_FILTER, draw.context.r.NEAREST);
      draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, i);
      draw.context.render(draw.texture.rect);
    },

    empty: () => { /*texture*/
      var _ = draw.context.r.createTexture();
      draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, _);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.shader, draw.context.r.CLAMdraw.textureO_EDGE);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.texture, draw.context.r.CLAMdraw.textureO_EDGE);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MIN_FILTER, draw.context.r.NEAREST);
      draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MAG_FILTER, draw.context.r.NEAREST);
      draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, 1, 1, 0, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      return _;
    },

  },
  video: {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL
    tex: undefined,
    buffer: undefined,
    rect: undefined,
    load: (x, y, w, h) => { /*video*/
      draw.buffer.video(x, y, w, h);
      draw.video.tex = draw.texture.empty();
    },

    draw: (v) => { /*video*/
      draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, draw.video.tex);
      draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, v);
      draw.context.render(draw.video.rect);
    },

  },
  program: undefined,
  enable2d: true,

};












