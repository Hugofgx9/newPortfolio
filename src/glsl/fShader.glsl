varying vec2 v_uv;

uniform sampler2D u_texture1;
uniform float u_time;

void main() {
	vec4 texture1 = texture2D(u_texture1, v_uv );



	gl_FragColor = vec4(texture1.xyz, 1.0);
}