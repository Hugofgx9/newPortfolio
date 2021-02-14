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
  float cropY = 0.8;
  float centerY = (.5 * (1. - cropY));
  v_uv = vec2(
    (uv.x * 0.2 * u_scale.x) + 0.4 ,
    (uv.y * cropY * u_scale.y) + centerY + wave(1.5, 0.03, u_offsetPos)
  );

  vec3 pos = position;

  vec2 skew = u_skew;

  //better performance this in js ?
  mat3 trans = mat3(
    u_scale.x   ,tan(skew.x) ,0.0,
    tan(skew.y) ,1.0         ,0.0,
    0.0         ,0.03        ,1.0
  );

  //skew it
  //pos.x += pos.y * 1. *  (1. /u_scale.x);
  pos.xy = (trans * (vec3(pos.xy, 0.0))).xy;

  float displ = wave(1.5, 30. , u_offsetPos);
  pos.y += displ;
  pos.x += displ / tan( (3.14/ 4.) + skew.y);
  //pos.x += wave(1.5, 0.5 , u_offsetPos);


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}