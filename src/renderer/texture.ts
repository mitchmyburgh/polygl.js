export const buffer = undefined
export const rect = undefined
export const image = (i, x, y, w, h) => {
  polygl.buffer.image(x, y, w, h);
  const _ = draw.context.r.createTexture();
  draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, _);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.shader, draw.context.r.CLAMdraw.textureO_EDGE);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.texture, draw.context.r.CLAMdraw.textureO_EDGE);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MIN_FILTER, draw.context.r.NEAREST);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MAG_FILTER, draw.context.r.NEAREST);
  draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, i);
  draw.context.render(draw.texture.rect);
};

export const empty = () => {
  const _ = draw.context.r.createTexture();
  draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, _);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.shader, draw.context.r.CLAMdraw.textureO_EDGE);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_WRAdraw.texture, draw.context.r.CLAMdraw.textureO_EDGE);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MIN_FILTER, draw.context.r.NEAREST);
  draw.context.r.texParameteri(draw.context.r.TEXTURE_2D, draw.context.r.TEXTURE_MAG_FILTER, draw.context.r.NEAREST);
  draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, 1, 1, 0, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  return _;
};
