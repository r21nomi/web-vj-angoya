precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;
uniform vec2 textureResolution;
uniform float offset;

varying float vIndex;
varying float vTotalIndex;
varying vec2 vUv;
varying vec3 vColor;
varying vec2 vResolution;
varying float vDirection;
varying float vRatio;
varying vec2 vWeight;

float rand(float t) {
  return fract(sin(t * 1234.0) * 5678.0);
}

void main() {
  vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);

  uv *= 50.0;
  vec2 id = floor(uv);
  vec3 color = vec3(1.0);
  float t = time + 100.0;

  if (mod(id.x, 2.0) == 0.0) {
    float speed = 1.0 * (offset + id.x);
    float y = uv.y * 0.4 + rand(id.x) * 100.0 + t * rand(id.x) * speed;
    float l = max(mod(-y, 20.0), 0.0) / 15.0;
    float fff = 0.3 / length(fract(uv.x) - 0.5);
    vec3 highlight = vec3(1.0, 1.0, 1.0) * pow(fff, 2.0);
    color = mix(vColor * l, highlight, offset);
  } else {
    color = vec3(0.0);
  }

  gl_FragColor = vec4(color + offset * 3.0, 1.0);
}
