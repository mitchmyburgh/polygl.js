// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL
p.v.tex = undefined;
p.v.buffer = undefined;
p.v.rect = undefined;
p.v.load = function(x, y, w, h) {
    p.b.video(x, y, w, h);
    p.v.tex = p.t.empty();
};

p.v.draw = function(v) {
    p.c.r.bindTexture(p.c.r.TEXTURE_2D, p.v.tex);
    p.c.r.texImage2D(p.c.r.TEXTURE_2D, 0, p.c.r.RGBA, p.c.r.RGBA, p.c.r.UNSIGNED_BYTE, v);
    p.c.render(p.v.rect);
};