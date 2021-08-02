
const shader = {

	uniforms: {
		'tDiffuse': { value: null },
		'tWater': { value: null }
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

		varying vec2 vUv;

		void main() {

			vec4 sceneColor = texture2D( tDiffuse, vUv );
			vec4 waterValue = texture2D( tWater, vUv );

			if ( length( waterValue.xyz ) > 0.5 ) {

				// get scene reflected pixel
				vec2 uv = vec2( vUv.x, ( 0.7 - vUv.y ) + waterValue.x * 0.25 );
				vec3 reflectionColor = texture2D( tDiffuse, uv ).xyz;

				// darker reflection with proximity
				float waterFragT = 1.0 - ( vUv.y / 0.35 );
				reflectionColor.x -= 0.6 * waterFragT;
				reflectionColor.y -= 0.5 * waterFragT;
				reflectionColor.z -= 0.55 * waterFragT;

				// reflection power
				float rp = ( waterValue.x * 2.0 + 0.5 ) * ( 0.3 + 0.7 * ( 1.0 - waterFragT ) );
				reflectionColor = mix( vec3( 48.0/255.0, 43.0/255.0, 34.0/255.0 ), reflectionColor, rp );

				sceneColor = vec4( reflectionColor, 1.0 );

			}

			gl_FragColor = sceneColor;

		}
	`

};

export default shader;
