
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import landscapeURL from '../assets/windmill.glb';

import waterMaterial from './materials/waterMaterial.js';

//

const waterGeometry = new THREE.PlaneGeometry( 800, 800, 100, 100 );
waterGeometry.rotateX( - Math.PI / 2 );
waterGeometry.translate( -150, -3, -250 );

const water = new THREE.Mesh(
	waterGeometry,
	waterMaterial
);

//

function makeInstancedMeshFrom( container ) {

	const mesh = new THREE.InstancedMesh(
		container.children[0].geometry,
		new THREE.MeshNormalMaterial(),
		container.children.length
	);

	container.updateWorldMatrix( false, true );

	for ( let i=0 ; i<container.children.length-1 ; i++ ) {

		mesh.setMatrixAt( i, container.children[i].matrixWorld );

	}

	return mesh

}

export default new Promise( (resolve) => {

	new GLTFLoader().load( landscapeURL, (glb) => {

		console.log( glb.scene )

		const animations = glb.animations;
		const windmill = glb.scene.getObjectByName( 'windmill' );
		const blades = glb.scene.getObjectByName( 'blades' );
		const ground = glb.scene.getObjectByName( 'ground' );

		/*
		const grass = glb.scene.getObjectByName( 'grass' );
		const bigGrass = glb.scene.getObjectByName( 'big_grass' );
		const waterGrass = glb.scene.getObjectByName( 'water_grass' );
		*/

		let grass = glb.scene.getObjectByName( 'grass' );
		let bigGrass = glb.scene.getObjectByName( 'big_grass' );
		let waterGrass = glb.scene.getObjectByName( 'water_grass' );

		grass = makeInstancedMeshFrom( grass );
		bigGrass = makeInstancedMeshFrom( bigGrass );
		waterGrass = makeInstancedMeshFrom( waterGrass );

		//

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
