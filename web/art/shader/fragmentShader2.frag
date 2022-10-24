precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float offset;

varying vec2 vUv;
varying vec2 vResolution;

void main() {
    vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);

    vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0, 1.0), step(offset, length(uv)));

    gl_FragColor = vec4(color, 1.0);
}
