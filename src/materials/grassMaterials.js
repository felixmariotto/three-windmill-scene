
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

import grassTextureURL from '../../assets/grass.png';
import bigGrassTextureURL from '../../assets/big_grass.png';
import waterGrassTextureURL from '../../assets/water_grass.png';

//

const textureLoader = new THREE.TextureLoader();

function makeGrassMaterial( textureURL, isReflection ) {

	const vertexShader = `
		varying vec2 vUv;
		uniform float time;

		${ shaderUtils.smoothNoise }

		void main() {

			vUv = uv;
			float t = time * 2.;

			// VERTEX POSITION

			vec4 mvPosition = vec4( position, 1.0 );
			#ifdef USE_INSTANCING
			mvPosition = instanceMatrix * mvPosition;
			#endif

			// DISPLACEMENT

			float noise = smoothNoise( mvPosition.xz * 0.1 + vec2( 0., t ) );
			noise = pow(noise * 0.5 + 0.5, 2.) * 2.;

			// here the displacement is made stronger on the blades tips.
			float dispPower = 1. - cos( ( 1.0 - uv.y ) * 3.1416 * 0.5 );

			float displacement = noise * ( 0.3 * dispPower );
			// mvPosition.z -= displacement * 5.0;
			mvPosition += vec4( -3.0, 0, 3.0, 0.0 ) * displacement;

			//

			vec4 modelViewPosition = modelViewMatrix * mvPosition;
			gl_Position = projectionMatrix * modelViewPosition;

		}
	`;

	const fragmentShader = `
		varying vec2 vUv;

		uniform sampler2D map;

		void main() {

			vec2 uv = vUv;
			uv.y = 1.0 - uv.y;
			vec4 sampledC = texture2D( map, uv );

			${
				isReflection ?
					'gl_FragColor = vec4( vec3( 0 ), sampledC.a );' :
					'gl_FragColor = sampledC;'
			}
			
		}
	`;

	const uniforms = {
		time: { value: 0 },
		map: { value: textureLoader.load( textureURL ) }
	}

	const material = new THREE.ShaderMaterial( {
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

	return material

}

//

const grass = makeGrassMaterial( grassTextureURL );
const bigGrass = makeGrassMaterial( bigGrassTextureURL );
const waterGrass = makeGrassMaterial( waterGrassTextureURL );

const grassReflection = makeGrassMaterial( grassTextureURL, true );
const bigGrassReflection = makeGrassMaterial( bigGrassTextureURL, true );
const waterGrassReflection = makeGrassMaterial( waterGrassTextureURL, true );

//

export default {
	grass,
	bigGrass,
	waterGrass,
	grassReflection,
	bigGrassReflection,
	waterGrassReflection
}
