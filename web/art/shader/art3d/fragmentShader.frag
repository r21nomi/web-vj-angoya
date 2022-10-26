precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;
uniform vec2 textureResolution;
uniform float offset;
////拡散色
//uniform vec3 diffuse;
//
////放射色
//uniform vec3 emissive;
//uniform mat4 viewMatrix;

varying float vIndex;
varying float vTotalIndex;
varying vec2 vUv;
varying vec3 vColor;
varying vec2 vResolution;
varying float vDirection;
varying float vRatio;
varying vec2 vWeight;
//varying vec3 vViewPosition;
//varying vec3 vNormal;

//#include <common>
//#include <bsdfs>
//#include <lights_pars_begin>

void main() {
//  vec3 mvPosition = vViewPosition;
//  vec3 transformedNormal = vNormal;
//
//  //ランバート・シェーディング
//  GeometricContext geometry;
//  geometry.position = mvPosition.xyz;
//  geometry.normal = normalize(transformedNormal);
//  geometry.viewDir = (normalize(-mvPosition.xyz));
//  vec3 lightFront = vec3(0.0);
//  vec3 indirectFront = vec3(0.0);
//  IncidentLight directLight;
//  float dotNL;
//  vec3 directLightColor_Diffuse;
//
//  //ポイントライト
//  #if NUM_POINT_LIGHTS > 0
//  #pragma unroll_loop_start
//  for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
//    getPointDirectLightIrradiance(pointLights[ i ], geometry, directLight);
//    dotNL = dot(geometry.normal, directLight.direction);
//    directLightColor_Diffuse = PI * directLight.color;
//    lightFront += saturate(dotNL) * directLightColor_Diffuse;
//  }
//    #pragma unroll_loop_end
//    #endif
//
//    //スポットライト
//    #if NUM_SPOT_LIGHTS > 0
//    #pragma unroll_loop_start
//  for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
//    getSpotDirectLightIrradiance(spotLights[ i ], geometry, directLight);
//    dotNL = dot(geometry.normal, directLight.direction);
//    directLightColor_Diffuse = PI * directLight.color;
//    lightFront += saturate(dotNL) * directLightColor_Diffuse;
//  }
//    #pragma unroll_loop_end
//    #endif
//
//    //ディレクショナルライト
//    #if NUM_DIR_LIGHTS > 0
//    #pragma unroll_loop_start
//  for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
//    getDirectionalDirectLightIrradiance(directionalLights[ i ], geometry, directLight);
//    dotNL = dot(geometry.normal, directLight.direction);
//    directLightColor_Diffuse = PI * directLight.color;
//    lightFront += saturate(dotNL) * directLightColor_Diffuse;
//  }
//    #pragma unroll_loop_end
//    #endif
//
//    //へミスフィアライト
//    #if NUM_HEMI_LIGHTS > 0
//    #pragma unroll_loop_start
//  for (int i = 0; i < NUM_HEMI_LIGHTS; i++) {
//    indirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
//  }
//    #pragma unroll_loop_end
//    #endif
//
//  vec4 diffuseColor = vec4(diffuse, 1.0);
//  ReflectedLight reflectedLight = ReflectedLight(vec3(1.0),vec3(0.0),vec3(0.0),vec3(1.0));
//  vec3 totalEmissiveRadiance = emissive;
//  reflectedLight.indirectDiffuse = getAmbientLightIrradiance(ambientLightColor);
//  reflectedLight.indirectDiffuse += indirectFront;
//  reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb);
//  reflectedLight.directDiffuse = lightFront;
//  reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb);
//  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

  vec2 uv = (vUv.xy * vResolution * 2.0 - vResolution.xy) / min(vResolution.x, vResolution.y);
  vec3 color = vColor;
  //  color = mix(vec3(1.0), color, length(uv));
//  gl_FragColor = vec4(color * outgoingLight, diffuseColor.a);
  gl_FragColor = vec4(color, 0.1 + offset);
}
