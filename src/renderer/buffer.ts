export const animation = false;
export const load = (v: number[]) => {
  var _ = draw.context.r.createBuffer();
  draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, _);
  draw.context.r.bufferData(draw.context.r.ARRAY_BUFFER, new Float32Array(v), draw.context.r.STATIC_DRAW);
  draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, null);
  return _;
};

export const use = (b) => {
  draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, b);
};

export const clear = () => { /*buffer*/
  draw.context.r.bindBuffer(draw.context.r.ARRAY_BUFFER, null);
};

export const rect = (x, y, w, h) => { /*buffer*/
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
};

export const square = (x, y, s) => { /*buffer*/
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
};

export const line = (x1, y1, x2, y2) => { /*buffer*/
  draw.buffer.texture = false;
  draw.buffer.animation = false;
  draw.context.a = 2;
  draw.context.p = draw.context.r.LINES;
  return [
    x1, y1,
    x2, y2
  ];
};

export const triangle = (x1, y1, x2, y2, x3, y3) => { /*buffer*/
  draw.buffer.texture = false;
  draw.buffer.animation = false;
  draw.context.a = 3;
  draw.context.p = (draw.context.mode == draw.context.FILL) ? draw.context.r.TRIANGLES : draw.context.r.LINE_LOOP;
  return [
    x1, y1,
    x2, y2,
    x3, y3
  ];
};

export const point = (x, y) => { /*buffer*/
  draw.buffer.texture = false;
  draw.buffer.animation = false;
  draw.context.a = 1;
  draw.context.p = draw.context.r.POINTS;
  return [x, y];
};

// For filled circles
// https://stackoverflow.com/a/1237519/10896648
// For stroked circles
// https://stackoverflow.com/questions/47671374/fill-a-drawed-circle-with-the-midpoint-algorithm-in-c-infinite-loop
export const circle = (x, y, r) => { /*buffer*/
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
}

export const image = (x, y, w, h) => { /*buffer*/
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
}

export const video = (x, y, w, h) => { /*buffer*/
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
};

