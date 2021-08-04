
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

import grassTextureURL from '../../assets/grass/grass.png';
import bigGrassTextureURL from '../../assets/grass/big_grass.png';
import waterGrassTextureURL from '../../assets/grass/water_grass.png';

import grassMaskTextureURL from '../../assets/grass/grass_mask.png';
import bigGrassMaskTextureURL from '../../assets/grass/big_grass_mask.png';
import waterGrassMaskTextureURL from '../../assets/grass/water_grass_mask.png';

//

const textureLoader = new THREE.TextureLoader();

function makeGrassMaterial( textureURL, maskTextureURL, isReflection ) {

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

			float noise = smoothNoise( mvPosition.xz * 0.1 + vec2( 0.0, t ) );
			noise = pow( noise * 0.5 + 0.5, 2.0 ) * 2.0;

			// here the displacement is made stronger on the blades tips.
			float dispPower = 1.0 - cos( ( 1.0 - uv.y ) * 3.1416 * 0.5 );
			float displacement = noise * ( 0.3 * dispPower );
			mvPosition += vec4( -5.0, 0, -2.0, 0.0 ) * displacement;

			//

			vec4 modelViewPosition = modelViewMatrix * mvPosition;
			gl_Position = projectionMatrix * modelViewPosition;

		}
	`;

	const fragmentShader = `

		varying vec2 vUv;
		uniform sampler2D map;
		uniform sampler2D mask;

		${ shaderUtils.easeInCubic }

		void main() {

			// unfortunately Webkit premultiplies PNG alpha, so we have to
			// have two different images for the diffuse and the mask, so we
			// can manually reproduce Blink behavior.

			vec2 uv = vUv;
			uv.y = 1.0 - uv.y;
			vec3 sampledDiffuse = texture2D( map, uv ).xyz;
			float sampledAlpha = texture2D( mask, uv ).x;

			if ( sampledAlpha < 0.1 ) discard;

			// increase color lighness when small alpha value, to avoid dark rim.
			sampledDiffuse += sampledDiffuse * easeInCubic( 1.0 - sampledAlpha ) * 8.0;

			${
				isReflection ?
					'gl_FragColor = vec4( vec3( 0 ), sampledAlpha );' :
					'gl_FragColor = vec4( sampledDiffuse, 1.0 );'
			}
			
		}
	`;

	const uniforms = {
		time: { value: 0 },
		map: { value: textureLoader.load( textureURL ) },
		mask: { value: textureLoader.load( maskTextureURL ) }
	}

	const material = new THREE.ShaderMaterial( {
		vertexShader,
		fragmentShader,
		uniforms,
		side: THREE.DoubleSide
	} );

	material.userData.update = function ( elapsedTime ) {
		uniforms.time.value = elapsedTime;
		material.uniformsNeedUpdate = true;
	}

	return material

}

//

const grass = makeGrassMaterial( grassTextureURL, grassMaskTextureURL );
const bigGrass = makeGrassMaterial( bigGrassTextureURL, bigGrassMaskTextureURL );
const waterGrass = makeGrassMaterial( waterGrassTextureURL, waterGrassMaskTextureURL );

const grassReflection = makeGrassMaterial( grassTextureURL, grassMaskTextureURL, true );
const bigGrassReflection = makeGrassMaterial( bigGrassTextureURL, bigGrassMaskTextureURL, true );
const waterGrassReflection = makeGrassMaterial( waterGrassTextureURL, waterGrassMaskTextureURL, true );

//

export default {
	grass,
	bigGrass,
	waterGrass,
	grassReflection,
	bigGrassReflection,
	waterGrassReflection
}
