
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import assets from './assets.js';
import waterMaterial from './materials/waterMaterial.js';
import nx from '../assets/cubemap/nx.jpg';
import ny from '../assets/cubemap/ny.jpg';
import nz from '../assets/cubemap/nz.jpg';
import px from '../assets/cubemap/px.jpg';
import py from '../assets/cubemap/py.jpg';
import pz from '../assets/cubemap/pz.jpg';

//

let blades;

// scene basic setup

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 70, WIDTH/HEIGHT, 0.1, 1000 );
camera.position.set( 0, 50, 50 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( WIDTH, HEIGHT );
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
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

// assets

assets.then( a => {

	scene.add(
		a.windmill,
		a.ground,
		a.grass,
		a.water,
		a.bigGrass,
		a.waterGrass
	);

	blades = a.blades;

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

	waterMaterial.userData.update( clock.getElapsedTime() );

}