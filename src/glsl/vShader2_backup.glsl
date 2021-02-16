varying vec2 v_uv;

uniform float u_time;
uniform float u_offsetPos;
uniform vec2 u_scale;
uniform vec2 u_skew;


float wave (float speed, float amp, float offset) {
  return cos((u_time + offset) * speed) * amp;
}

void main() {

  // overflow
  float cropY = 0.86;
  float maxScale = 4.5;
  //
  float scaleX_Ratio = (u_scale.x - 1.) * ( 1./ (maxScale - 1.) ); 
  float centerY = (.5 * (1. - cropY)) + (0.1 * (1. - scaleX_Ratio));
  v_uv = vec2(
    uv.x,
    //( (uv.x - (.5 * tan(0.4) ) ) ),
    (uv.y * cropY * u_scale.y) + centerY + wave(1.5, 0.07, u_offsetPos)
  );

  //uv * scale + center
  //v_uv.x = (v_uv.x + ( .5 * (1. - scaleX_Ratio))) * scaleX_Ratio - (tan(0.4) * 0.5);
  //v_uv.x = (v_uv.x + ( .5 * (1. - scaleX_Ratio))) * scaleX_Ratio;
  

  mat3 trans = mat3(
    0.2 + scaleX_Ratio * 0.6   ,0.0 ,0.0,
    0.0   ,1.0 ,0.0,
    0.0   ,0.0 ,1.0
  );

  //scale
  float centerX = (0.3 * (1.- scaleX_Ratio));
  v_uv = (trans * vec3(v_uv, 0.)).xy;
  //v_uv.x += centerX;

  //revert skew
  v_uv.x += 0.19 * uv.y;
  //v_uv.x += tan(0.2 + (0.4 * (1. - scaleX_Ratio) ))  * uv.y;

  vec3 pos = position;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}