p.t.buffer = undefined;
p.t.rect = undefined;
p.t.image = function(i, x, y, w, h) {
  polygl.buffer.image(x, y, w, h);
  var _ = p.c.r.createTexture();
  p.c.r.bindTexture(p.c.r.TEXTURE_2D, _);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_WRAP_S, p.c.r.CLAMP_TO_EDGE);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_WRAP_T, p.c.r.CLAMP_TO_EDGE);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_MIN_FILTER, p.c.r.NEAREST);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_MAG_FILTER, p.c.r.NEAREST);
  p.c.r.texImage2D(p.c.r.TEXTURE_2D, 0, p.c.r.RGBA, p.c.r.RGBA, p.c.r.UNSIGNED_BYTE, i);
  p.c.render(p.t.rect);
};

p.t.empty = function() {
  var _ = p.c.r.createTexture();
  p.c.r.bindTexture(p.c.r.TEXTURE_2D, _);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_WRAP_S, p.c.r.CLAMP_TO_EDGE);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_WRAP_T, p.c.r.CLAMP_TO_EDGE);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_MIN_FILTER, p.c.r.NEAREST);
  p.c.r.texParameteri(p.c.r.TEXTURE_2D, p.c.r.TEXTURE_MAG_FILTER, p.c.r.NEAREST);
  p.c.r.texImage2D(p.c.r.TEXTURE_2D, 0, p.c.r.RGBA, 1, 1, 0, p.c.r.RGBA, p.c.r.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  return _;
};