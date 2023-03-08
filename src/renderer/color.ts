import * as draw from './draw'

type RGBA = [number, number, number, number];

export const RGB = (r: number, g: number, b: number): RGBA => {
  return [r / 255, g / 255, b / 255, draw.context.alpha];
};

export const RGBA = (r: number, g: number, b: number, a: number): RGBA => {
  return [r / 255, g / 255, b / 255, a / 255];
};

// https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.htmlRGB
export const HEX2RGB = (h: string): RGBA => {
  if (h.length != 6) {
    return [0, 0, 0, 0];
  }

  const aRgbHex = h.match(/.{1,2}/g);
  if (!aRgbHex) {
    return [0, 0, 0, 0];
  }
  const aRgb: RGBA = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
    draw.context.alpha
  ];
  return aRgb;
};

// https://gist.github.com/mjackson/5311256#file-color-conversion-algorithms-js-L36
export const HSL2RGB = (h: number, s: number, l: number): RGBA => {
  const r, g, b;

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

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255, draw.context.alpha];
};
const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
export const HSLA2RGBA = (h: number, s: number, l: number, a: number): RGBA => {
  let r, g, b;

  if (s == 0) {
    r = g = b = a = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255, (a >= 0 && a <= 1) ? a * 255 : 255];
}

export const HEX = (h: string): RGBA => {
  return RGB(HEX2RGB(h)[0], HEX2RGB(h)[1], HEX2RGB(h)[2]);
}

export const HSL = (h: number, s: number, l: number): RGBA => {
  return RGB(HSL2RGB(h / 360, s, l)[0], HSL2RGB(h / 360, s, l)[1], HSL2RGB(h / 360, s, l)[2]);
}

export const HSLA = (h: number, s: number, l: number, a: number): RGBA => {
  return RGB(HSL2RGB(h / 360, s, l)[0], HSL2RGB(h / 360, s, l)[1], HSL2RGB(h / 360, s, l)[2], (a >= 0 && a <= 1) ? a : 1);
}

// Converts RGBA color from WebGL context to canvas2d context color from array!
export const toCanvas = (color: RGBA) => {
  if (draw.enable2d) return "rgba(" + (color[0] * 255) + "," + (color[1] * 255) + "," + (color[2] * 255) + "," + (color[3] * 255) + ")";
};

