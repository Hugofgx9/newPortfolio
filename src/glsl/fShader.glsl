varying vec2 v_uv;

uniform sampler2D u_texture1;
uniform float u_time;
uniform float u_offsetPos;
uniform vec2 u_scale;
uniform float u_skew;
uniform float u_planeRatio;

float wave (float speed, float amp, float offset) {
  return cos((u_time + offset) * speed) * amp;
}

void main() {
	vec2 newUV = v_uv;

	float texRatio = 16. / 10.;

	// fit y
	//newUV.y *= texRatio / u_planeRatio;

	// fit x
	newUV.x *= u_planeRatio * u_scale.x / texRatio;

	//center x
	newUV.x += (.5 * (1. - (u_planeRatio * u_scale.x / texRatio) )) ;
	

	// unskew;
	float skewFactor = 0.265;
	newUV.x += newUV.y * 0.265 * u_skew;

	//wave y
	newUV = newUV * 0.98 + 0.01;
	newUV.y += wave(1.5, 0.01, u_offsetPos);





	vec4 texture1 = texture2D(u_texture1, newUV );

	gl_FragColor = vec4(texture1.rgb, 1.0);
}