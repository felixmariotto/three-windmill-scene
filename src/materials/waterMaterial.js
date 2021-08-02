
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

import waterTexture1URL from '../../assets/waterNormal1.jpg'
import waterTexture2URL from '../../assets/waterNormal2.jpg'

//

const vertexShader = `
	varying vec2 vUv;
	varying vec4 vPos;

	uniform float time;
	uniform sampler2D water_texture1;
	uniform sampler2D water_texture2;

	${ shaderUtils.smoothNoise }

	void main() {

		vUv = uv;

		// VERTEX POSITION

		vec4 mvPosition = vec4( position, 1.0 );

		// DISPLACEMENT

		float noise = smoothNoise( mvPosition.xz + vec2( time * 1.2, time * 1.7 ) );

		mvPosition.y += noise * 0.5;

		//

		vec4 modelViewPosition = modelViewMatrix * mvPosition;
		vPos = modelViewPosition;
		gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
	varying vec2 vUv;
	varying vec4 vPos;

	uniform float time;
	uniform sampler2D water_texture1;
	uniform sampler2D water_texture2;

	${ shaderUtils.smoothNoise }

	void main() {

		// WATER COLOURING DEPENDING ON NORMAL

		float t = time * 0.3;

		vec3 waterNormal1 = texture2D( water_texture1, 3.0 * vUv + vec2( t * -0.03, t * 0.06 ) ).xyz;
		vec3 waterNormal2 = texture2D( water_texture2, 3.0 * vUv + vec2( t * 0.04, t * 0.03 ) ).xyz;
		waterNormal1 = normalize( waterNormal1 );
		waterNormal2 = normalize( waterNormal2 );
		vec3 waterNormal = normalize( waterNormal1 * waterNormal2 );

		// FOG

		float minFog = 350.0;
		float maxFog = 500.0;
		float fogIntensity = max( 0.0, length( vPos.xyz ) - minFog ) / maxFog;

		//

		float azimuth = 1.0 - abs( dot( normalize( waterNormal ), vec3( 0, 0, -1.0 ) ) );
		azimuth += 0.15 * min( 1.0, length( vPos.xyz ) / 500.0 );
		float stp = smoothstep( 0.06, 0.08, azimuth );
		stp = 1.0 - stp;

		vec3 waterColor = vec3( 0, 0, 1.0 );
		vec3 reflectedColor = vec3( 0, 1.0, 0.0 );
		
		vec3 color = reflectedColor * stp + waterColor * ( 1.0 - stp );

		gl_FragColor = vec4( color, 1.0 - fogIntensity );

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
	water_texture1: { value: waterTexture1 },
	water_texture2: { value: waterTexture2 }
}

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	side: THREE.DoubleSide,
	transparent: true
} );

material.userData.update = function ( elapsedTime ) {
	uniforms.time.value = elapsedTime;
	material.uniformsNeedUpdate = true;
}

//

export default material
