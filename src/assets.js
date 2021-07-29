
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import landscapeURL from '../assets/windmill.glb';

import waterMaterial from './materials/waterMaterial.js';

//

const waterGeometry = new THREE.PlaneGeometry( 500, 500, 100, 100 );
waterGeometry.rotateX( - Math.PI / 2 );
waterGeometry.translate( 0, -3, -100 );

const water = new THREE.Mesh(
	waterGeometry,
	waterMaterial
);

//

export default new Promise( (resolve) => {

	new GLTFLoader().load( landscapeURL, (glb) => {

		console.log( glb.scene )

		const animations = glb.animations;
		const windmill = glb.scene.getObjectByName( 'windmill' );
		const blades = glb.scene.getObjectByName( 'blades' );
		const ground = glb.scene.getObjectByName( 'ground' );
		const grass = glb.scene.getObjectByName( 'grass' );
		const bigGrass = glb.scene.getObjectByName( 'big_grass' );
		const waterGrass = glb.scene.getObjectByName( 'water_grass' );

		windmill.traverse( child => child.castShadow = true );
		ground.traverse( child => child.receiveShadow = true );

		const assets = {
			animations,
			windmill,
			blades,
			ground,
			grass,
			bigGrass,
			waterGrass,
			// not from the GLB file
			water
		};

		resolve( assets );

	} )

} );
