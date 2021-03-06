
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

import waterTexture1URL from '../../assets/waterNormal1.jpg'
import waterTexture2URL from '../../assets/waterNormal2.jpg'

//

const vertexShader = `
	varying vec2 vUv;

	uniform float time;
	uniform sampler2D water_texture1;
	uniform sampler2D water_texture2;

	${ shaderUtils.smoothNoise }

	void main() {

		vUv = uv;

		// VERTEX POSITION

		vec4 mvPosition = vec4( position, 1.0 );

		// DISPLACEMENT

		float noise = smoothNoise( mvPosition.xz * 0.2 + vec2( time * 1.2, time * 1.7 ) );

		mvPosition.y += noise * 0.75;

		//

		gl_Position = projectionMatrix * modelViewMatrix * mvPosition;

	}
`;

const fragmentShader = `
	varying vec2 vUv;

	uniform float time;
	uniform sampler2D water_texture1;
	uniform sampler2D water_texture2;

	${ shaderUtils.smoothNoise }

	void main() {

		// WATER COLOURING DEPENDING ON NORMAL

		float t = time * 0.3;

		vec3 waterNormal1 = texture2D( water_texture1, 3.0 * vUv + vec2( t * -0.03, t * 0.06 ) ).xyz;
		vec3 waterNormal2 = texture2D( water_texture2, 3.0 * vUv + vec2( t * 0.04, t * 0.03 ) ).xyz;
		vec3 waterNormal = normalize( waterNormal1 * waterNormal2 );

		//

		gl_FragColor = vec4( waterNormal.y, 0.0, 0.0, 1.0 );

	}
`;

const textureLoader = new THREE.TextureLoader();

const waterTexture1 = textureLoader.load( waterTexture1URL );
waterTexture1.wrapS = THREE.RepeatWrapping;
waterTexture1.wrapT = THREE.RepeatWrapping;

const waterTexture2 = textureLoader.load( waterTexture2URL );
waterTexture2.wrapS = THREE.RepeatWrapping;
waterTexture2.wrapT = THREE.RepeatWrapping;

const uniforms = {
	time: { value: 0 },
	'water_texture1': { value: waterTexture1 },
	'water_texture2': { value: waterTexture2 }
}

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	transparent: true
} );

material.userData.update = function ( elapsedTime ) {
	uniforms.time.value = elapsedTime;
	material.uniformsNeedUpdate = true;
}

//

export default material
