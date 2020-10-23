p.b.texture = false;
p.b.animation = false;
p.b.load = function(v) {
    var _ = p.c.r.createBuffer();
    p.c.r.bindBuffer(p.c.r.ARRAY_BUFFER, _);
    p.c.r.bufferData(p.c.r.ARRAY_BUFFER, new Float32Array(v), p.c.r.STATIC_DRAW);
    p.c.r.bindBuffer(p.c.r.ARRAY_BUFFER, null);
    return _;
};

p.b.use = function(b) {
    p.c.r.bindBuffer(p.c.r.ARRAY_BUFFER, b);
};

p.b.clear = function() {
    p.c.r.bindBuffer(p.c.r.ARRAY_BUFFER, null);
};

p.b.rect = function(x, y, w, h) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.a = 4;
    p.c.p = (p.c.mode == p.c.FILL) ? p.c.r.TRIANGLE_FAN : p.c.r.LINE_LOOP;
    return [
        x, y,
        x + w, y,
        x + w, y + h,
        x, y + h
    ];
};

p.b.square = function(x, y, s) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.a = 4;
    p.c.p = (p.c.mode == p.c.FILL) ? p.c.r.TRIANGLE_FAN : p.c.r.LINE_LOOP;
    return [
        x, y,
        x + s, y,
        x + s, y + s,
        x, y + s
    ];
};

p.b.line = function(x1, y1, x2, y2) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.a = 2;
    p.c.p = p.c.r.LINES;
    return [
        x1, y1,
        x2, y2
    ];
};

p.b.triangle = function(x1, y1, x2, y2, x3, y3) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.a = 3;
    p.c.p = (p.c.mode == p.c.FILL) ? p.c.r.TRIANGLES : p.c.r.LINE_LOOP;
    return [
        x1, y1,
        x2, y2,
        x3, y3
    ];
};

p.b.point = function(x, y) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.a = 1;
    p.c.p = p.c.r.POINTS;
    return [ x, y ];
};

// For filled circles
// https://stackoverflow.com/a/1237519/10896648
// For stroked circles
// https://stackoverflow.com/questions/47671374/fill-a-drawed-circle-with-the-midpoint-algorithm-in-c-infinite-loop
p.b.circle = function(x, y, r) {
    p.b.texture = false;
    p.b.animation = false;
    p.c.p = p.c.POINTS;
    var cp = [];
    if (p.c.mode == p.c.FILL) {
        for(var y1 = -r; y1 <= r; y1++) {
            for(var x1 = -r; x1 <= r; x1++) {
                if(x1 * x1 + y1 * y1 <= r * r) {
                    cp.push(x + x1, y + y1);
                }
            }
        }
    } else if (p.c.mode == p.c.STROKE) {
        r = r + 2;
        var x1 = r - 1;
        var y1 = 0;
        var dx = 1;
        var dy = 1;
        var err = dx - (r << 1);
        
        while (x1 >= y1) {
            cp.push(x + x1, y + y1);
            cp.push(x + y1, y + x1);
            cp.push(x - y1, y + x1);
            cp.push(x - x1, y + y1);
            cp.push(x - x1, y - y1);
            cp.push(x - y1, y - x1);
            cp.push(x + y1, y - x1);
            cp.push(x + x1, y - y1);

            if (err <= 0)
            {
                y1++;
                err += dy;
                dy += 2;
            }

            if (err > 0)
            {
                x1--;
                dx += 2;
                err += dx - (r << 1);
            }
        }
    }
    p.c.a = cp.length / 2;
    return cp;
};

p.b.image = function(x, y, w, h) {
    p.b.texture = true;
    p.b.animation = false;
    p.c.a = 6;
    p.c.p = p.c.r.TRIANGLES;
    var x1 = x;
    var x2 = x + w;
    var y1 = y;
    var y2 = y + h;
    p.t.buffer = p.b.load([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]);
    p.t.rect = p.b.load([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]);
};

p.b.video = function(x, y, w, h) {
    p.b.texture = false;
    p.b.animation = true;
    p.c.a = 6;
    p.c.p = p.c.r.TRIANGLES;
    var x1 = x;
    var x2 = x + w;
    var y1 = y;
    var y2 = y + h;
    p.v.buffer = p.b.load([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]);
    p.v.rect = p.b.load([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]);
};