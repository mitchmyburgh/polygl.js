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