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
  float cropY = 0.6;
  float centerY = (.5 * (1. - cropY));
  v_uv = vec2(
    (uv.x * 0.2 * u_scale.x) + 0.4 ,
    (uv.y * cropY * u_scale.y) + centerY + wave(1.5, 0.03, u_offsetPos)
  );

  vec3 pos = position;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}