export const createProgram = (vertexShaderSource: string, fragmentShaderSource: string) => {
  const vertexShader = draw.context.r.createShader(draw.context.r.VERTEX_SHADER);
  if (!vertexShader) throw new Error("Vertex shader failed to compile.");
  draw.context.r.shaderSource(vertexShader, vertexShaderSource);
  draw.context.r.compileShader(vertexShader);
  const fragmentShader = draw.context.r.createShader(draw.context.r.FRAGMENT_SHADER);
  if (!fragmentShader) throw new Error("Fragment shader failed to compile.");
  draw.context.r.shaderSource(fragmentShader, fragmentShaderSource);
  draw.context.r.compileShader(fragmentShader);
  const program = draw.context.r.createProgram();
  if (!program) throw new Error("Program failed to compile.");
  draw.context.r.attachShader(program, vertexShader);
  draw.context.r.attachShader(program, fragmentShader);
  draw.context.r.linkProgram(program);
  draw.context.r.useProgram(program);
  draw.context.r.deleteShader(vertexShader);
  draw.context.r.deleteShader(fragmentShader);
  draw.context.r.deleteProgram(program);
  return program;
}

export let program

