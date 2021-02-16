varying vec2 v_uv;

uniform float u_time;
uniform float u_offsetPos;


float wave (float speed, float amp, float offset) {
  return cos((u_time + offset) * speed) * amp;
}

void main() {

  v_uv = uv;
  vec3 pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}