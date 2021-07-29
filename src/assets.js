
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import landscapeURL from '../assets/windmill.glb';

import waterMaterial from './materials/waterMaterial.js';
import cloudMaterial from './materials/cloudMaterial.js';
import grassMaterials from './materials/grassMaterials.js';

// WATER

const waterGeometry = new THREE.PlaneGeometry( 800, 800, 100, 100 );
waterGeometry.rotateX( - Math.PI / 2 );
waterGeometry.translate( -150, -3, -250 );

const water = new THREE.Mesh(
	waterGeometry,
	waterMaterial
);

// SKY

const CLOUDS_NUMBER = 170;
const CLOUD_MIN_SIZE = 0.1;
const CLOUD_MAX_SIZE = 0.45;
const CLOUDS_SPEED = 0.0005;
const cloudDummies = [];
const cloudVelocity = 0.5;

const clouds = new THREE.InstancedMesh(
	new THREE.PlaneGeometry(),
	cloudMaterial,
	CLOUDS_NUMBER
);

for ( let i=0 ; i<CLOUDS_NUMBER ; i++ ) {

	const dummy = new THREE.Object3D();
	cloudDummies.push( dummy );

	const distance = Math.random();

	const spherical = new THREE.Spherical(
		0.8 + distance * 0.4, // radius
		0.6 + distance * Math.PI * 0.3, // phi
		Math.random() * Math.PI * 2 // theta
	);

	const speed = 1 - distance * 0.9;

	dummy.scale.setScalar( CLOUD_MIN_SIZE + Math.random() * ( CLOUD_MAX_SIZE - CLOUD_MIN_SIZE ) );

	dummy.userData.update = function update() {
		spherical.theta -= CLOUDS_SPEED * speed;
		dummy.position.setFromSpherical( spherical );
		dummy.lookAt( clouds.position );
		dummy.updateMatrix();
		clouds.setMatrixAt( i, dummy.matrix );
	}

}

const sky = new THREE.Group();
sky.scale.setScalar( 2000 );

sky.add( clouds );

sky.userData.update = function update() {
	cloudDummies.forEach( dummy => dummy.userData.update() );
	clouds.instanceMatrix.needsUpdate = true;
}

// GLTF ASSETS

function makeInstancedMeshFrom( container, material ) {

	const mesh = new THREE.InstancedMesh(
		container.children[0].geometry,
		material,
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

		const animations = glb.animations;
		const windmill = glb.scene.getObjectByName( 'windmill' );
		const blades = glb.scene.getObjectByName( 'blades' );
		const ground = glb.scene.getObjectByName( 'ground' );

		let grass = glb.scene.getObjectByName( 'grass' );
		let bigGrass = glb.scene.getObjectByName( 'big_grass' );
		let waterGrass = glb.scene.getObjectByName( 'water_grass' );

		grass = makeInstancedMeshFrom( grass, grassMaterials.grass );
		bigGrass = makeInstancedMeshFrom( bigGrass, grassMaterials.bigGrass );
		waterGrass = makeInstancedMeshFrom( waterGrass, grassMaterials.waterGrass );

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
			water,
			sky
		};

		resolve( assets );

	} )

} );
