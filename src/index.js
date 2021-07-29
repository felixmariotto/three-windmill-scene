
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import assets from './assets.js';
import waterMaterial from './materials/waterMaterial.js';
import grassMaterials from './materials/grassMaterials.js';
import ShadowedLight from './ShadowedLight.js';

import nx from '../assets/cubemap/nx.jpg';
import ny from '../assets/cubemap/ny.jpg';
import nz from '../assets/cubemap/nz.jpg';
import px from '../assets/cubemap/px.jpg';
import py from '../assets/cubemap/py.jpg';
import pz from '../assets/cubemap/pz.jpg';

//

let blades, sky;

// scene basic setup

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xffffff, 50, 600 );

const camera = new THREE.PerspectiveCamera( 50, WIDTH/HEIGHT, 0.1, 5000 );
camera.position.set( 0, 50, 50 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( WIDTH, HEIGHT );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.append( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const clock = new THREE.Clock();

window.addEventListener( 'resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
} );

// lights

const light = new THREE.AmbientLight( 0x404040, 1 );

const dirLight = ShadowedLight({
	x: 70,
	y: 70,
	z: -100,
	width: 250,
	near: 50,
	far: 250,
	intensity: 0.5,
	radius: 10,
	// useHelpers: true
});

scene.add( light, dirLight, dirLight.helpers );

// assets

assets.then( a => {

	scene.add(
		a.windmill,
		a.ground,
		a.grass,
		a.bigGrass,
		a.waterGrass,
		a.water,
		a.sky
	);

	blades = a.blades;
	sky = a.sky;

} );

const textureCube = new THREE.CubeTextureLoader().load( [ px, nx, py, ny, pz, nz ] );

scene.background = textureCube;

// animation loop

loop();

function loop() {
	animate();
	requestAnimationFrame( loop );
	renderer.render( scene, camera );
	// console.log( renderer.info.render )
}

function animate() {

	if ( blades ) blades.rotation.z += 0.003;
	if ( sky ) sky.userData.update();

	const t = clock.getElapsedTime();

	waterMaterial.userData.update( t );
	grassMaterials.grass.userData.update( t );
	grassMaterials.bigGrass.userData.update( t );
	grassMaterials.waterGrass.userData.update( t );

}