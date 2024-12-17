import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18.2/+esm";

const canvasEl = document.querySelector("canvas");
const textureEl = document.createElement("canvas");
const textureCtx = textureEl.getContext("2d");

const fontOptions = {
    "Arial": "Arial, sans-serif",
    "Verdana": "Verdana, sans-serif",
    "Tahoma": "Tahoma, sans-serif",
    "Times New Roman": "Times New Roman, serif",
    "Georgia": "Georgia, serif",
    "Garamond": "Garamond, serif",
    "Courier New": "Courier New, monospace",
    "Brush Script MT": "Brush Script MT, cursive"
};

const params = {
    fontName: "Verdana",
    isBold: false,
    fontSize: 80,
    text: "fluid",
    pointerSize: null,
    color: {r: 1., g: .0, b: .5}
};

const pointer = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    moved: false,
};

let outputColor, velocity, divergence, pressure, canvasTexture;
let isPreview = true;

const gl = canvasEl.getContext("webgl");
gl.getExtension("OES_texture_float");

const vertexShader = createShader(
    document.getElementById("vertShader").innerHTML,
    gl.VERTEX_SHADER);

const splatProgram = createProgram("fragShaderPoint");
const divergenceProgram = createProgram("fragShaderDivergence");
const pressureProgram = createProgram("fragShaderPressure");
const gradientSubtractProgram = createProgram("fragShaderGradientSubtract");
const advectionProgram = createProgram("fragShaderAdvection");
const outputShaderProgram = createProgram("fragShaderOutputShader");

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,
    1, -1
]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

createTextCanvasTexture();
initFBOs();
createControls();
setupEvents();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

render();

function createTextCanvasTexture() {
    canvasTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function updateTextCanvas() {
    textureCtx.fillStyle = "black";
    textureCtx.fillRect(0, 0, textureEl.width, textureEl.height);

    textureCtx.font = (params.isBold ? "bold" : "normal") + " " + (params.fontSize * devicePixelRatio) + "px " + fontOptions[params.fontName];
    textureCtx.fillStyle = "#ffffff";
    textureCtx.textAlign = "center";

    textureCtx.filter = "blur(3px)";

    const textBox = textureCtx.measureText(params.text);
    textureCtx.fillText(params.text, .5 * textureEl.width, .5 * textureEl.height + .5 * textBox.actualBoundingBoxAscent);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureEl);
}

function createProgram(elId) {
    const shader = createShader(
        document.getElementById(elId).innerHTML,
        gl.FRAGMENT_SHADER);
    const program = createShaderProgram(vertexShader, shader);
    const uniforms = getUniforms(program);
    return {
        program, uniforms
    };
}

// Shader and WebGL program setup functions continue here...

function render(t) {
    // Fluid simulation rendering loop
    // Update velocity, pressure, and other simulation steps...
}