
const shader = {

	uniforms: {
		'tDiffuse': { value: null },
		'tWater': { value: null },
		'tReflection': { value: null },
		'camHeight': { value: 0 }
	},

	vertexShader: `

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform sampler2D tWater;
		uniform sampler2D tReflection;
		uniform float camHeight;

		varying vec2 vUv;

		void main() {

			vec4 sceneColor = texture2D( tDiffuse, vUv );
			vec4 waterValue = texture2D( tWater, vUv );

			if ( length( waterValue.x ) > 0.01 ) {

				float reflectionCorrection = 0.05;

				// get scene reflected pixel
				vec2 uv = vec2( vUv.x, ( 1.0 + reflectionCorrection - vUv.y ) - waterValue.x * 0.25 );
				vec3 reflectionColor = texture2D( tReflection, uv ).xyz;

				// darker reflection with proximity
				float horizonHeight = 0.4 - camHeight * 0.15;
				float waterFragT = 1.0 - ( vUv.y / horizonHeight );
				reflectionColor.x -= 0.6 * waterFragT;
				reflectionColor.y -= 0.5 * waterFragT;
				reflectionColor.z -= 0.55 * waterFragT;

				// reflection power
				vec3 darkColor = vec3( 48.0/255.0, 43.0/255.0, 34.0/255.0 ) * sceneColor.xyz;
				float reflectionPower = ( waterValue.x * 2.0 + 0.5 ) * ( 0.3 + 0.7 * ( 1.0 - waterFragT ) );
				reflectionColor = mix( darkColor, reflectionColor, reflectionPower );

				float blendT = max( 0.0, min( 1.0, ( vUv.y - horizonHeight + 0.01 ) * 35.0 ) );
				vec3 blendedColor = mix( reflectionColor, sceneColor.xyz, vUv.y );

				sceneColor = vec4( reflectionColor, 1.0 );
				// sceneColor = vec4( vec3( blendT ), 1.0 );

			}

			gl_FragColor = sceneColor;

		}
	`

};

export default shader;
