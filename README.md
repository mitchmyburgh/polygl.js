# polygl.js

Tiny 2D graphics renderer...

Portions of this repo source are used by [Pancake](https://github.com/Rabios/Pancake)'s WebGL layer!

### Usage

Add `polygl.js` or `polygl.min.js` to your HTML file...

```html
<!DOCTYPE html>
<html>
    <head>
        <title>polygl.js</title>
        <script src="https://cdn.jsdelivr.net/gh/Rabios/polygl.js@master/build/polygl.min.js"></script>
    </head>
    <body>
        <canvas width="600" height="600"></canvas>
        <script>
            polygl.context.init();
            polygl.context.color(polygl.color.RGB(0, 0, 255));
            polygl.context.rect(100, 100, 50, 50);
        </script>
    </body>
</html>
```

Open this in your browser...You should see blue rectangle :)

For usage read the [API](https://github.com/Rabios/polygl.js/blob/master/api.md), It's simple...

### Examples

1. [200 colored rectangles](https://rabios.github.io/polygl.js/examples/test.html)
2. [Mixing `WebGLRenderingContext` with `CanvasRenderingContext2D`](https://rabios.github.io/polygl.js/examples/canvas2d_with_webgl.html)
3. [Keyboard player movement](https://rabios.github.io/polygl.js/examples/keyboard.html)
4. [Mouse movement](https://rabios.github.io/polygl.js/examples/mouse.html)
5. [Drawing textures](https://rabios.github.io/polygl.js/examples/image.html)
6. [Fill with stroke mode](https://rabios.github.io/polygl.js/examples/fill_with_stroke.html)
