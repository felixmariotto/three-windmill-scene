
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

//

const material = new THREE.MeshStandardMaterial({
	roughness: 0.1,
	metalness: 1.0
});

material.onBeforeCompile = function ( shader ) {

	// VERTEX

	shader.vertexShader = `

	varying vec2 vUv;

	uniform float time;

	` + shaderUtils.smoothNoise + shader.vertexShader;

	//

	shader.vertexShader = shader.vertexShader.replace(

		'vViewPosition = - mvPosition.xyz;',

		//

		`
		float noise = smoothNoise( mvPosition.xz + time );
    	noise = pow (noise * 0.5 + 0.5, 2.0 ) * 2.0;

    	mvPosition.y += noise * 10.0;

		vViewPosition = - mvPosition.xyz;

		vUv = uv;

		`
	);

	// FRAGMENT

	shader.fragmentShader = shader.fragmentShader.replace(

		'void main()',

		//

		`
		uniform float time;

		varying vec2 vUv;

		vec2 getMatcapUV() {
			vec3 normal = normalize( vNormal );
			vec3 viewDir = normalize( vViewPosition );
			vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
			vec3 y = cross( viewDir, x );
			return vec2( dot( x, normal ), dot( y, normal ) ) * 0.497 + 0.5;
		}

		void main()

		`
	);

	//

	shader.fragmentShader = shader.fragmentShader.replace(

		'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',

		//

		`

		vec2 matcapUV = getMatcapUV();

	    gl_FragColor = vec4( matcapUV, 1.0, 1.0 );

		`
	)

	shader.uniforms.time = { value: 0 };
	material.userData.uniforms = shader.uniforms;

}

material.userData.update = function ( elapsedTime ) {

	if ( material.userData.uniforms ) {

		material.userData.uniforms.time.value = elapsedTime;
		
	}

}

//

export default material
