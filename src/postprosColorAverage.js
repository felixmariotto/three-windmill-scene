
const shader = {

	uniforms: {
		'tDiffuse': { value: null },
		'amount': { value: 0 }
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
		uniform float amount;
		varying vec2 vUv;

		void main() {

			// averaging
			vec3 color = texture2D( tDiffuse, vUv ).xyz;
			vec3 average = vec3( ( color.x + color.y + color.z ) / 3.0 );
			vec3 averagedColor = mix( color, average, amount );

			gl_FragColor = vec4( averagedColor, 1.0 );
		}
	`

};

export default shader;
