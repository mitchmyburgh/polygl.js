p.c.r = undefined;
p.c.p = undefined;
p.c.a = undefined;
p.c.ctx2d = undefined;
p.c.FILL = "fill";
p.c.STROKE = "stroke";
p.c.BOTH = "both";
p.c.alpha = 1;
p.c.fillColor = [0, 0, 0, p.c.alpha];
p.c.strokeColor = [0, 0, 0, p.c.alpha];
p.c.mode = p.c.FILL;
p.c.antialias = true;

p.c.canvas2d = function() {
    if (p.e2d) {
        var _ = document.createElement("canvas");
        _.width = p.c.r.canvas.width;
        _.height = p.c.r.canvas.height;
        _.style.position = "absolute";
        _.style.zIndex = -1;
        _.style.left = 0;
        _.style.top = 0;
        document.body.appendChild(_);
        return _.getContext("2d");
    }
};

p.c.init = function(i) {
    if (i == undefined) i = 0;
    p.c.r = document.getElementsByTagName("canvas")[i].getContext("experimental-webgl", { antialias: p.c.antialias, preserveDrawingBuffer: true }) || document.getElementsByTagName("canvas")[i].getContext("webgl", { antialias: p.c.antialias, antialias: p.c.antialias, preserveDrawingBuffer: true });
    p.c.r.canvas.style.position = "absolute";
    p.c.r.canvas.style.left = 0;
    p.c.r.canvas.style.top = 0;
    p.c.r.canvas.style.zIndex = 0;
    p.pr = p.s.program(
    
    // VERTEX SHADER
    "precision mediump float;\n" +
    "attribute vec2 a_position;\n" +
    "attribute vec2 a_texCoord;\n" +
    "varying vec2 v_texCoord;\n" +
    "uniform vec2 u_resolution;\n" +
    "uniform vec2 u_translation;\n" +
    "uniform vec2 u_rotation; \n" +
    "uniform vec2 u_scale;\n" +
    "void main() {\n" +
    "    vec2 scaledPosition = a_position * u_scale;\n" +
    "    vec2 rotatedPosition = vec2(scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x, scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);\n" +
    "    vec2 position = rotatedPosition + u_translation;\n" +
    "    vec2 zeroToOne = position / u_resolution;\n" +
    "    vec2 zeroToTwo = zeroToOne * 2.0;\n" +
    "    vec2 clipSpace = zeroToTwo - 1.0;\n" +
    "    gl_PointSize = 2.0;\n" +
    "    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n" +
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
    p.c.loadDefaults();
    if (p.e2d) p.c.ctx2d = p.c.canvas2d();
    p.c.clear();
};

p.c.clear = function() {
    p.c.r.viewport(0, 0, p.c.r.canvas.width, p.c.r.canvas.height);
	var width  = p.c.r.canvas.clientWidth  * 1 | 0;
    var height = p.c.r.canvas.clientHeight * 1 | 0;
    if (p.c.r.canvas.width !== width || p.c.r.canvas.height !== height) {
		p.c.r.canvas.width  = width;
		p.c.r.canvas.height = height;
    }
    p.c.r.clear(p.c.r.COLOR_BUFFER_BIT | p.c.r.DEPTH_BUFFER_BIT);
    if (p.e2d) p.c.ctx2d.clearRect(0, 0, p.c.ctx2d.canvas.width, p.c.ctx2d.canvas.height);
};

p.c.loadDefaults = function() {
    p.c.alpha = 1;
    p.c.fillColor = [0, 0, 0, p.c.alpha];
    p.c.strokeColor = [0, 0, 0, p.c.alpha];
    p.c.r.uniform1i(p.c.r.getUniformLocation(p.pr, "u_mode"), 1);
    p.c.r.uniform4f(p.c.r.getUniformLocation(p.pr, "u_color"), 0, 0, 0, p.c.alpha);
	p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_resolution"), p.c.r.canvas.width, p.c.r.canvas.height);
	p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_translation"), 0, 0);
	p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_rotation"), 0, 1);
    p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_scale"), 1, 1);
};

p.c.enableVertexAttribute = function(l, b, s) {
    p.c.r.bindBuffer(p.c.r.ARRAY_BUFFER, b);
    var _ = p.c.r.getAttribLocation(p.pr, l);
    p.c.r.vertexAttribPointer(_, s, p.c.r.FLOAT, false, 0, 0);
    p.c.r.enableVertexAttribArray(_);
    return _;
};

p.c.color = function(f, s) {
    f[3] = f[3] || p.c.alpha;
    p.c.fillColor = [f[0], f[1], f[2], f[3]];
    if (p.e2d) p.c.ctx2d.fillStyle = p.co.toCanvas(p.c.fillColor);
    if (s != undefined) {
        s[3] = s[3] || p.c.alpha;
        p.c.strokeColor = [s[0], s[1], s[2], s[3]];
        if (p.e2d) p.c.ctx2d.strokeStyle = p.co.toCanvas(p.c.strokeColor);
    } else {
        p.c.strokeColor = [0, 0, 0, p.c.alpha];
        if (p.e2d) p.c.ctx2d.strokeStyle = p.co.toCanvas(p.c.strokeColor);
    }
};

p.c.useColor = function(c) {
    p.c.r.uniform4f(p.c.r.getUniformLocation(p.pr, "u_color"), c[0], c[1], c[2], c[3]);
};

p.c.save = function() {
    if (p.e2d) p.c.ctx2d.save();
};

p.c.restore = function() {
    if (p.e2d) p.c.ctx2d.restore();
};

p.c.translate = function(x, y) {
    p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_translation"), x, y);
    if (p.e2d) p.c.ctx2d.translate(x, y);
};

p.c.rotate = function(x, y) {
    p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_rotation"), x, y);
    if (p.e2d) p.c.ctx2d.rotate(x);
};

p.c.scale = function(x, y) {
    p.c.r.uniform2f(p.c.r.getUniformLocation(p.pr, "u_scale"), x, y);
    if (p.e2d) p.c.ctx2d.scale(x, y);
};

p.c.render = function(b) {
    p.c.r.uniform1i(p.c.r.getUniformLocation(p.pr, "u_mode"), 1);
    p.c.enableVertexAttribute("a_position", b, 2);
    if (p.b.texture) {
        p.c.r.uniform1i(p.c.r.getUniformLocation(p.pr, "u_mode"), 2);
        p.c.enableVertexAttribute("a_texCoord", p.t.buffer, 2);
    }
    if (p.b.animation) {
        p.c.r.uniform1i(p.c.r.getUniformLocation(p.pr, "u_mode"), 2);
        p.c.enableVertexAttribute("a_texCoord", p.v.buffer, 2);
    }
    p.c.r.drawArrays(p.c.p, 0, p.c.a);
    p.c.r.uniform1i(p.c.r.getUniformLocation(p.pr, "u_mode"), 1);
};

p.c.screenshot = function() {
    window.open(p.c.r.canvas.toDataURL());
};

p.c.point = p.c.pixel = function(x, y) {
    var _ = p.b.load(p.b.point(x, y));
    p.c.render(_);
};

p.c.line = function(x1, y1, x2, y2) {
    var _ = p.b.load(p.b.line(x1, y1, x2, y2));
    p.c.render(_);
};

p.c.rect = function(x, y, w, h) {
    if (p.c.mode == p.c.BOTH) {
        p.c.mode = p.c.FILL;
        p.c.useColor(p.c.fillColor);
        var _ = p.b.load(p.b.rect(x, y, w, h));
        p.c.render(_);
        p.c.mode = p.c.STROKE;
        p.c.useColor(p.c.strokeColor);
        var _ = p.b.load(p.b.rect(x, y, w, h));
        p.c.render(_);
        p.c.mode = p.c.BOTH;
        return;
    }
    if (p.c.mode == p.c.FILL) p.c.useColor(p.c.fillColor);
    if (p.c.mode == p.c.STROKE) p.c.useColor(p.c.strokeColor);
    var _ = p.b.load(p.b.rect(x, y, w, h));
    p.c.render(_);
};

p.c.square = function(x, y, s) {
    if (p.c.mode == p.c.BOTH) {
        p.c.mode = p.c.FILL;
        p.c.useColor(p.c.fillColor);
        var _ = p.b.load(p.b.square(x, y, s));
        p.c.render(_);
        p.c.mode = p.c.STROKE;
        p.c.useColor(p.c.strokeColor);
        var _ = p.b.load(p.b.square(x, y, s));
        p.c.render(_);
        p.c.mode = p.c.BOTH;
        return;
    }
    if (p.c.mode == p.c.FILL) p.c.useColor(p.c.fillColor);
    if (p.c.mode == p.c.STROKE) p.c.useColor(p.c.strokeColor);
    var _ = p.b.load(p.b.square(x, y, s));
    p.c.render(_);
};

p.c.circle = function(x, y, r) {
    if (p.c.mode == p.c.BOTH) {
        p.c.mode = p.c.FILL;
        p.c.useColor(p.c.fillColor);
        var _ = p.b.load(p.b.circle(x, y, r));
        p.c.render(_);
        p.c.mode = p.c.STROKE;
        p.c.useColor(p.c.strokeColor);
        var _ = p.b.load(p.b.circle(x, y, r));
        p.c.render(_);
        p.c.mode = p.c.BOTH;
        return;
    }
    if (p.c.mode == p.c.FILL) p.c.useColor(p.c.fillColor);
    if (p.c.mode == p.c.STROKE) p.c.useColor(p.c.strokeColor);
    var _ = p.b.load(p.b.circle(x, y, r));
    p.c.render(_);
};

p.c.triangle = function(x1, y1, x2, y2, x3, y3) {
    if (p.c.mode == p.c.BOTH) {
        p.c.mode = p.c.FILL;
        p.c.useColor(p.c.fillColor);
        var _ = p.b.load(p.b.triangle(x1, y1, x2, y2, x3, y3));
        p.c.render(_);
        p.c.mode = p.c.STROKE;
        p.c.useColor(p.c.strokeColor);
        var _ = p.b.load(p.b.triangle(x1, y1, x2, y2, x3, y3));
        p.c.render(_);
        p.c.mode = p.c.BOTH;
        return;
    }
    if (p.c.mode == p.c.FILL) p.c.useColor(p.c.fillColor);
    if (p.c.mode == p.c.STROKE) p.c.useColor(p.c.strokeColor);
    var _ = p.b.load(p.b.triangle(x1, y1, x2, y2, x3, y3));
    p.c.render(_);
};

p.c.clearRect = function(x, y, w, h) {   
    p.c.r.enable(p.g.c.SCISSOR_TEST);
    p.c.r.scissor(x, y, w, h);
    p.c.r.clear(p.g.c.COLOR_BUFFER_BIT);
    p.c.r.disable(p.g.c.SCISSOR_TEST);
    if (p.e2d) p.c.ctx2d.clearRect(x, y, w, h);
};

p.c.drawImage = p.c.image = p.t.image;

// The following functions uses canvas2d context...
p.c.roundedRect = function(x, y, w, h, r) {
    if (p.e2d) {
        p.c.ctx2d.beginPath();
        p.c.ctx2d.moveTo(x + r, y);
        p.c.ctx2d.lineTo(x + w - r, y);
        p.c.ctx2d.quadraticCurveTo(x + w, y, x + w, y + r);
        p.c.ctx2d.lineTo(x + w, y + h - r);
        p.c.ctx2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        p.c.ctx2d.lineTo(x + r, y + h);
        p.c.ctx2d.quadraticCurveTo(x, y + h, x, y + h - r);
        p.c.ctx2d.lineTo(x, y + r);
        p.c.ctx2d.quadraticCurveTo(x, y, x + r, y);
        p.c.ctx2d.closePath();
        if (p.c.mode == p.c.FILL) p.c.ctx2d.fill();
        if (p.c.mode == p.c.STROKE) p.c.ctx2d.stroke();
        if (p.c.mode == p.c.BOTH) {
            p.c.ctx2d.fill();
            p.c.ctx2d.stroke();
        }
    }
};

p.c.font = function(f, s) {
    if (p.e2d) p.c.ctx2d.font = (s + "px " + f).toString();
};

p.c.text = function(t, x, y) {
    if (p.e2d) {
        if (p.c.mode == p.c.FILL) p.c.ctx2d.fillText(t, x, y);
        if (p.c.mode == p.c.STROKE) p.c.ctx2d.strokeText(t, x, y);
        if (p.c.mode == p.c.BOTH) {
            p.c.ctx2d.fillText(t, x, y);
            p.c.ctx2d.strokeText(t, x, y);
        }
    }
};

p.c.polygon = function(po) {
    if (p.e2d) {
        p.c.ctx2d.beginPath();
        p.c.ctx2d.moveTo(po[0][0], po[0][1]);
        for (var i = 0; i < po.length; i++) p.c.ctx2d.lineTo(po[i][0], po[i][1]);
        p.c.ctx2d.closePath();
        if (p.c.mode == p.c.FILL) p.c.ctx2d.fill();
        if (p.c.mode == p.c.STROKE) p.c.ctx2d.stroke();
        if (p.c.mode == p.c.BOTH) {
            p.c.ctx2d.fill();
            p.c.ctx2d.stroke(); 
        }
    }
};

p.c.gradientRect = function(x, y, w, h, content) {
    if (p.e2d) {
        var linear = p.c.ctx2d.createLinearGradient(x, y, w, h);
        for(var loopdlg = 0; loopdlg < content.length; loopdlg++) linear.addColorStop(content[loopdlg][0], content[loopdlg][1]);
        p.c.ctx2d.fillStyle = linear;
        p.c.ctx2d.strokeStyle = linear;
        if (p.c.mode == p.c.FILL) p.c.ctx2d.fillRect(x, y, w, h);
	    if (p.c.mode == p.c.STROKE) p.c.ctx2d.strokeRect(x, y, w, h);
	    if (p.c.mode == p.c.BOTH)
	    {
            p.c.ctx2d.fillRect(x, y, w, h);
		    p.c.ctx2d.strokeRect(x, y, w, h);
        }
    }
};