p.co.RGB = function(r, g, b) {
    return [r / 255, g / 255, b / 255, p.c.alpha];
};

p.co.RGBA = function(r, g, b, a) {
    return [r / 255, g / 255, b / 255, a / 255];
};

// https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.html
p.co.HEX2RGB = function(h){
  if (h.length != 6){
      return [ 0, 0, 0, 0 ];
  }

  var aRgbHex = h.match(/.{1,2}/g);
  var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16),
      p.c.alpha
  ];
  return aRgb;
}

// https://gist.github.com/mjackson/5311256#file-color-conversion-algorithms-js-L36
p.co.HSL2RGB = function(h, s, l) {
    var r, g, b;
  
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
  
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
  
    return [ r * 255, g * 255, b * 255, p.c.alpha ];
};

p.co.HSLA2RGBA = function(h, s, l, a) {
    var r, g, b, a;
  
    if (s == 0) {
      r = g = b = a = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
  
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
  
    return [ r * 255, g * 255, b * 255, (a >= 0 && a <= 1) ? a * 255 : 255 ];
};

p.co.HEX = function(h) {
  return p.co.RGB(p.co.HEX2RGB(h)[0], p.co.HEX2RGB(h)[1], p.co.HEX2RGB(h)[2]);
};

p.co.HSL = function(h, s, l) {
    return p.co.RGB(p.co.HSL2RGB(h / 360, s, l)[0], p.co.HSL2RGB(h / 360, s, l)[1], p.co.HSL2RGB(h / 360, s, l)[2]);
};

p.co.HSLA = function(h, s, l, a) {
    return p.co.RGB(p.co.HSL2RGB(h / 360, s, l)[0], p.co.HSL2RGB(h / 360, s, l)[1], p.co.HSL2RGB(h / 360, s, l)[2], (a >= 0 && a <= 1) ? a : 1);
};

// Converts RGBA color from WebGL context to canvas2d context color from array!
p.co.toCanvas = function(a) {
  if (p.e2d) return "rgba(" + (a[0] * 255) + "," + (a[1] * 255) + "," + (a[2] * 255) + "," + (a[3] * 255) + ")";
};