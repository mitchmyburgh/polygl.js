// const https =//developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL
export const tex = undefined
export const buffer = undefined
export const rect = undefined
export const load = (x, y, w, h) => {
  draw.buffer.video(x, y, w, h);
  draw.video.tex = draw.texture.empty();
}

export const draw = (v) => {
  draw.context.r.bindTexture(draw.context.r.TEXTURE_2D, draw.video.tex);
  draw.context.r.texImage2D(draw.context.r.TEXTURE_2D, 0, draw.context.r.RGBA, draw.context.r.RGBA, draw.context.r.UNSIGNED_BYTE, v);
  draw.context.render(draw.video.rect);
}
