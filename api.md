# polygl.js API

- [polygl.js API](#polygljs-api)
    - [globals](#globals)
    - [polygl.texture](#polygltexture)
    - [polygl.video](#polyglvideo)
    - [polygl.shader](#polyglshader)
    - [polygl.buffer](#polyglbuffer)
    - [polygl.color](#polyglcolor)
    - [polygl.context](#polyglcontext)

### globals

```js
polygl.program                                    // Current WebGL program used by polygl.js (Already defined from source with shaders made)
polygl.enable2d                                   // Enable CanvasRenderingContext2D (Used by polygl.js for partial stuff)
```

### polygl.texture

```js
// Variables
polygl.texture.buffer                             // Buffer contains vertices of texture
polygl.texture.rect                               // Rectangle buffer of texture

// Functions
polygl.texture.empty();                           // Creates empty texture (Used by video module)
polygl.texture.image(i, x, y, w, h);              // Draws texture at x and y with width and height
```

### polygl.video

```js
// Variables
polygl.video.tex                                 // Texture of video
polygl.video.buffer                              // Buffer for video texture
polygl.video.rect                                // Rectangle buffer of video

// Functions
polygl.video.load(x, y, w, h);                   // Loads video buffer for drawing!
polygl.video.draw(v);                            // Draws video
```

### polygl.shader

```js
// Functions
polygl.shader.program(v, f);                     // Creates a program and returns it from vertex shader code v and fragment buffer code f
```

### polygl.buffer

```js
// Variables
polygl.buffer.texture                            // Will context draw a texture?
polygl.buffer.animation                          // Will context draw video?

// Functions
polygl.buffer.use(b);                            // Bind buffer b
polygl.buffer.load(v);                           // Returns buffer with array v
polygl.buffer.clear();                           // Binds gl.ARRAY_BUFFEr to null (Unbind current buffer)
polygl.buffer.rect(x, y, w, h);                  // Returns array can be used for drawing rectangle
polygl.buffer.square(x, y, s);                   // Returns array can be used for drawing square
polygl.buffer.line(x1, y1, x2, y2);              // Returns array can be used for drawing line
polygl.buffer.triangle(x1, y1, x2, y2, x3, y3);  // Returns array can be used for drawing triangle
polygl.buffer.point(x, y);                       // Returns array can be used for drawing point
polygl.buffer.circle(x, y, r);                   // Returns array can be used for drawing circle
polygl.buffer.image(x, y, w, h);                 // Sets texture buffer and sets texture rectangle that will be drawn with x and y with width and height
polygl.buffer.video(x, y, w, h);                 // Sets video buffer and sets video rectangle that will be drawn with x and y with width and height
```

### polygl.color

```js
polygl.color.HSL2RGB(h, s, l);                   // Converts HSL color to RGB for use
polygl.color.HSLA2RGBA(h, s, l, a);              // Converts HSLA color to RGBA for use
polygl.color.HEX2RGB(h);                         // Converts Hex color to RGB color for use
polygl.color.RGB(r, g, b);                       // Returns RGB color in array
polygl.color.RGBA(r, g, b, a);                   // Returns RGBA color in array
polygl.color.HEX(h);                             // Returns RGB color converted from Hex in array
polygl.color.HSL(h, s, l);                       // Returns RGB color converted from HSL color in array
polygl.color.HSLA(h, s, l, a);                   // Returns RGBA color converted from HSLA color in array
polygl.color.toCanvas(c);                        // Returns RGBA canvas2d color from WebGL RGBA array
```

### polygl.context

```js
// Variables
polygl.context.r                                 // WebGLRenderingContext renderer
polygl.context.p                                 // Current primitive type
polygl.context.a                                 // Vertex attribute buffer size
polygl.context.ctx2d                             // CanvasRenderingContext2D renderer (For partial stuff)
polygl.context.FILL                              // "fill", For drawing filled shapes
polygl.context.STROKE                            // "stroke" For drawing stroked shapes
polygl.context.BOTH                              // "both" For drawing filled and stroked shapes at same time
polygl.context.mode                              // Draw mode, String should be one of the three above (polygl.context.FILL, polygl.context.STROKE, polygl.context.BOTH)
polygl.context.alpha                             // Alpha
polygl.context.fillColor                         // Array contains current fill color
polygl.context.strokeColor                       // Array contains current stroke color
polygl.context.antialias                         // Antialiasing enabled?

// Functions
polygl.context.canvas2d();                       // Creates CanvasRenderingContext2D context with canvas on top of WebGL one
polygl.context.init(i);                          // Initializes polygl.js with canvas index i (From document.getElementsByTagName)
polygl.context.clear();                          // Clears graphics
polygl.context.loadDefaults();                   // Load defaults (Can be used to reset edit of color and alpha and uniforms if stuck)
polygl.context.enableVertexAttribute(l, b, s);   // Passes buffer b to attribute l with size s from polygl.program
polygl.context.color(f, s);                      // Set colors f for fill and s for stroke and should be arrays or from color module functions (You can ignore setting s value)
polygl.context.useColor(c);                      // Lets color uniform uses color c
polygl.context.translate(x, y);                  // Translates graphics in x and y
polygl.context.rotate(x, y);                     // Rotates graphics in x and y
polygl.context.scale(x, y);                      // Scales graphics in x and y
polygl.context.render(b);                        // After passing buffer, You can use this to draw it as shape
polygl.context.screenshot();                     // Takes screenshot and opens it in window
polygl.context.point(x, y);                      // Draws a point
polygl.context.pixel(x, y);                      // Same as above...
polygl.context.line(x1, y1, x2, y2);             // Draws a line
polygl.context.rect(x, y, w, h);                 // Draws a rectangle
polygl.context.square(x, y, s);                  // Draws a square
polygl.context.circle(x, y, r);                  // Draws a circle
polygl.context.triangle(x1, y1, x2, y2, x3, y3); // Draws a triangle
polygl.context.clearRect(x, y, w, h);            // Clears a part of rectangle
polygl.context.drawImage(i, x, y, w, h);         // Draws image i with position and dimensions (Same as polygl.texture.image)
polygl.context.image(i, x, y, w, h);             // Same as above...

// WARNING: The following functions needs polygl.enable2d to be true (If you want to use them)
polygl.context.roundedRect(x, y, w, h, r);       // Draws a rounded rectangle
polygl.context.font(f, s);                       // Sets font f with size s
polygl.context.text(txt, x, y);                  // Draws text txt in position x and y
polygl.context.polygon(points);                  // Draws a polygon
/*
polygl.context.polygon([
    10, 200,
    100, 200,
    10, 300,
    100, 300
])
*/
polygl.context.gradientRect(x, y, w, h, c);      // Draws a gradient in rectangle shape
/*
// c is array with stops and colors
polygl.context.gradientRect(100, 100, 50, 50, [
    [ 0, "dodgerblue" ],
    [ 0.5, "blue" ],
    [ 1, "darkblue" ]
]);
*/
```