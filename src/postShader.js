
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
		}`,

	fragmentShader: `
		uniform sampler2D tDiffuse;
		uniform float amount;
		varying vec2 vUv;
		void main() {
			vec4 color = texture2D( tDiffuse, vUv );
			vec4 average = vec4( vec3( ( color.x + color.y + color.z ) / 3.0 ), 1.0 );
			vec4 finalColor = mix( color, average, amount );
			gl_FragColor = finalColor;
		}`

};

export default shader;