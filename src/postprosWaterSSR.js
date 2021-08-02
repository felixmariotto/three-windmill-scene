
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

				vec3 depthColor = vec3( 0, 0, 0 );
				vec2 uv = vec2( vUv.x, ( 0.7 - vUv.y ) + waterValue.x * 0.25 );
				vec3 reflectionColor = texture2D( tDiffuse, uv ).xyz;

				float t = waterValue.y / ( waterValue.y + waterValue.z );
				vec3 finalColor = mix( reflectionColor, depthColor, t );
				sceneColor = vec4( finalColor, 1.0 );

			}

			gl_FragColor = sceneColor;

		}
	`

};

export default shader;
