
const smoothNoise = `
	float N( vec2 st ) { // https://thebookofshaders.com/10/
		return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
	}

	float smoothNoise( vec2 ip ) { // https://www.youtube.com/watch?v=zXsWftRdsvU
		vec2 lv = fract( ip );
		vec2 id = floor( ip );

		lv = lv * lv * ( 3. - 2. * lv );

		float bl = N( id );
		float br = N( id + vec2( 1, 0 ));
		float b = mix( bl, br, lv.x );

		float tl = N( id + vec2( 0, 1 ));
		float tr = N( id + vec2( 1, 1 ));
		float t = mix( tl, tr, lv.x );

		return mix( b, t, lv.y );
	}
`;

const easeInCubic = `
	float easeInCubic( float x ) {
		return x * x * x;
	}
`;

const easeOutExpo = `
	float easeOutExpo( float x ) {
		return x == 1.0 ? 1.0 : 1.0 - pow( 2.0, -15.0 * x );
	}
`;

export default {
	smoothNoise,
	easeInCubic,
	easeOutExpo
}
