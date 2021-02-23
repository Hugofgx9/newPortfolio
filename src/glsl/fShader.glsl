varying vec2 v_uv;

uniform sampler2D u_texture1;
uniform float u_time;
uniform float u_offsetPos;
uniform vec2 u_scale;
uniform float u_skew;
uniform float u_tint;
uniform float u_tint2;
uniform float u_tintTransfert;
uniform float u_tintAmount;
uniform float u_greyAmount;
uniform float u_planeRatio;

float wave (float speed, float amp, float offset) {
	return cos((u_time + offset) * speed) * amp;
}

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {


	/* RATIO SCALE AND SKEW */

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
	//offset is for scroll
	newUV = newUV * 0.98 + 0.01;
	newUV.y += wave(1.5, 0.01, u_offsetPos);

	vec4 image = texture2D(u_texture1, newUV );


	/* GREY/COLOR */

	float grey = 0.21 * image.r + 0.49 * image.g + 0.30 * image.b;
	vec3 color = hsv2rgb( vec3(
		u_tint, 
		u_tintAmount * (1. - u_tintTransfert), 
		1.0
	));

	vec3 color2 = hsv2rgb( vec3(
		u_tint2, 
		u_tintAmount * (u_tintTransfert), 
		1.0
	));


	image.rgb = image.rgb * (1. - u_tintAmount) + vec3(grey) * u_tintAmount;
	image.rgb = image.rgb * (1. - u_greyAmount) + vec3(grey) * u_greyAmount;


	gl_FragColor = vec4(image.rgb * color * color2, 1.0);
}