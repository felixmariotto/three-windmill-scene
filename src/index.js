
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import assets from './assets.js';

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
		a.grass
	);

} );

// animation loop

loop();

function loop() {
	requestAnimationFrame( loop );
	renderer.render( scene, camera );
}