precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;
uniform vec2 textureResolution;
uniform float textureBlockSize;
uniform vec3 bgColor;
uniform float isDetail;

varying float vIndex;
varying float vTotalIndex;
varying vec2 vUv;
varying vec3 vColor;
varying vec2 vResolution;
varying float vDirection;
varying float vRatio;
varying vec2 vWeight;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
  return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

vec2 getUVForTexture (vec2 uv, float t) {
  float count = textureBlockSize;
  vec2 pos = vec2(
  floor(fract(t) * count),
  floor(mod(t, count))
  );
  vec2 eachSize = textureResolution / count / textureResolution;
  vec2 ff = vec2(pos.x, pos.y);

  return vec2(
  uv.x * eachSize.x + eachSize.x * ff.x,
  uv.y * eachSize.y + (1.0 - eachSize.y) - eachSize.y * ff.y
  );
}

float getTypePos(float index) {
  return index / textureBlockSize;
}

vec2 detailedUV(float pixelated) {
  vec2 uv = vUv;
  if (pixelated > 0.0) {
    uv = floor(uv * pixelated) / pixelated;
  }

  return vec2(
    map(uv.x, 0.0, 1.0, vWeight.x, vWeight.x + vResolution.x / resolution.x),
    map(uv.y, 0.0, 1.0, vWeight.y, vWeight.y + vResolution.y / resolution.y)
  );
}

void main() {
  vec2 weight = vWeight;
  vec2 weight2 = (vWeight * resolution * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  bool isOver = abs(weight2.x) > 1.0 || abs(weight2.y) > 1.0;

  float count = textureBlockSize;
  float totalCount = count * count;

  vec2 ratio = vec2(
    max((vResolution.x / vResolution.y) / (textureResolution.x / textureResolution.y), 1.0),
    max((vResolution.y / vResolution.x) / (textureResolution.y / textureResolution.x), 1.0)
  );


  float s = 1.0;
  vec2 _uv = vec2(weight.x, weight.y);
  if (isDetail > 0.5) {
    vec2 _detailedUV = detailedUV(30.0);
    _uv = _detailedUV;
  }
  vec2 uvForTex = vec2(
    _uv.x * ratio.x * s + (1.0 - ratio.x * s) * 0.5,
    _uv.y * ratio.y * s + (1.0 - ratio.y * s) * 0.5
  );
  //    uvForTex = getUVForTexture(uvForTex, getTypePos(0.0));
  vec3 color = texture2D(texture, uvForTex).rgb;
  if (isOver) {
    color = bgColor;
  }

  gl_FragColor = vec4(color, 1.0);
}
