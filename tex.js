var file = document.getElementById('tex_file');
var offset = document.getElementById('tex_offset');
var width = document.getElementById('tex_width');
var height = document.getElementById('tex_height');
var format = document.getElementById('tex_format');
var type = document.getElementById('tex_type');

var canvas = document.getElementById('tex_canvas');

var gl = canvas.getContext("experimental-webgl")
    || canvas.getContext("webgl");

gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

var vshaderId = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vshaderId, 
"\
attribute vec2 position;\
attribute vec2 coord;\
varying vec2 vCoord;\
void main()\
{\
    vCoord = coord;\
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);\
}");
gl.compileShader(vshaderId);
if (!gl.getShaderParameter(vshaderId, gl.COMPILE_STATUS)) {
    console.log("Could not compile vertex shader: " + gl.getShaderInfoLog(vshaderId));
}

var fshaderId = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fshaderId, 
"\
precision highp float;\
uniform sampler2D uTex;\
varying vec2 vCoord;\
void main()\
{\
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\
}\
");
gl.compileShader(fshaderId);
if (!gl.getShaderParameter(fshaderId, gl.COMPILE_STATUS)) {
    console.log("Could not compile fragment shader: " + gl.getShaderInfoLog(fshaderId));
}

var prgId = gl.createProgram();
gl.attachShader(prgId, vshaderId);
gl.attachShader(prgId, fshaderId);
gl.linkProgram(prgId);
if (!gl.getProgramParameter(prgId, gl.LINK_STATUS)) {
    console.log("Could not link program: " + gl.getProgramInfoLog(prgId));
}

var vertexBufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferId);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    +1, -1,
    +1, +1,
    -1, +1]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var indexBufferId = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferId);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
    0, 1, 2,
    2, 3, 0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

var uvBufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBufferId)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1]), gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

gl.useProgram(prgId);

var position = gl.getAttribLocation(prgId, "position");
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferId);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var uv = gl.getAttribLocation(prgId, "coord")
gl.bindBuffer(gl.ARRAY_BUFFER, uvBufferId)
gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(uv)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferId)
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, null)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
