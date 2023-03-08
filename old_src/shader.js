p.s.program = function(v, f) {
    var _ = p.c.r.createShader(p.c.r.VERTEX_SHADER);
    p.c.r.shaderSource(_, v);
    p.c.r.compileShader(_);
    var __ = p.c.r.createShader(p.c.r.FRAGMENT_SHADER);
    p.c.r.shaderSource(__, f);
    p.c.r.compileShader(__);
    var ___ = p.c.r.createProgram();
    p.c.r.attachShader(___, _);
    p.c.r.attachShader(___, __);
    p.c.r.linkProgram(___);
    p.c.r.useProgram(___);
    p.c.r.deleteShader(_);
    p.c.r.deleteShader(__);
    p.c.r.deleteProgram(___);
    return ___;
};