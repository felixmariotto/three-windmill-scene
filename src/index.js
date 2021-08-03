
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import assets from './assets.js';
import waterMaterial from './materials/waterMaterial.js';
import grassMaterials from './materials/grassMaterials.js';
import camera from './camera.js';
import postprosColorAverage from './postprosColorAverage.js';
import postprosWater from './postprosWater.js';

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

const waterScene = new THREE.Scene();
waterScene.background = new THREE.Color( 'black' );

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.append( renderer.domElement );

const waterRenderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT );
const reflectionRenderTarget = new THREE.WebGLRenderTarget( WIDTH / 2, HEIGHT / 2 );

const clock = new THREE.Clock();
const dtClock = new THREE.Clock();

const stats = new Stats();
document.body.appendChild( stats.dom );

// postprocessing

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const waterSSREffect = new ShaderPass( postprosWater );
waterSSREffect.uniforms[ 'tWater' ].value = waterRenderTarget.texture;
waterSSREffect.uniforms[ 'tReflection' ].value = reflectionRenderTarget.texture;
composer.addPass( waterSSREffect );

const colorAverageEffect = new ShaderPass( postprosColorAverage );
colorAverageEffect.uniforms[ 'amount' ].value = 0.65;
composer.addPass( colorAverageEffect );

const aaEffect = new ShaderPass( FXAAShader );
composer.addPass( aaEffect );

// resizing

window.addEventListener( 'resize', () => {
	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	camera.userData.reflectionCamera.aspect = WIDTH / HEIGHT;
	camera.userData.reflectionCamera.updateProjectionMatrix();
	renderer.setSize( WIDTH, HEIGHT );
	composer.setSize( WIDTH, HEIGHT );
	waterRenderTarget.setSize( WIDTH, HEIGHT );
	reflectionRenderTarget.setSize( WIDTH / 2, HEIGHT / 2 );
} );

// lights

const light1 = new THREE.DirectionalLight( 0xffffff, 1.1 );
light1.position.set( 1, 1, -1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 0.4 );
light2.position.set( -0.4, -0.1, 0.5 );

scene.add( light1, light2 );

// assets

assets.then( a => {

	scene.add(
		a.windmill,
		a.ground,
		a.grass,
		a.bigGrass,
		a.waterGrass,
		a.sky
	);

	a.ground.layers.set( 1 );
	const groundClone = a.ground.clone();
	groundClone.material = new THREE.MeshBasicMaterial({ color: 'black' });

	waterScene.add(
		a.water,
		a.grassReflection,
		a.bigGrassReflection,
		a.waterGrassReflection,
		groundClone
	);

	blades = a.blades;
	sky = a.sky;

} );

const textureCube = new THREE.CubeTextureLoader().load( [ px, nx, py, ny, pz, nz ] );

scene.background = textureCube;
scene.environment = textureCube;

// animation loop

loop();

function loop() {

	animate();

	waterSSREffect.uniforms[ 'camHeight' ].value = ( camera.position.y - 5 ) / 8.8;

	//
 
	camera.layers.disable( 1 );
	renderer.setRenderTarget( reflectionRenderTarget );
	renderer.clear();
	renderer.render( scene, camera.userData.reflectionCamera );

	//

	camera.layers.enable( 1 );
	renderer.setRenderTarget( waterRenderTarget );
	renderer.clear();
	renderer.render( waterScene, camera );

	//

	renderer.setRenderTarget();
	renderer.clear();

	composer.render();

	stats.update();

	//

	requestAnimationFrame( loop );

}

function animate() {

	const t = clock.getElapsedTime();
	const dt = dtClock.getDelta();
	const dtRatio = dt / ( 1 / 60 );

	if ( blades ) blades.rotation.z += 0.003 * dtRatio;
	if ( sky ) sky.userData.update( dtRatio );

	waterMaterial.userData.update( t );
	grassMaterials.grass.userData.update( t );
	grassMaterials.bigGrass.userData.update( t );
	grassMaterials.waterGrass.userData.update( t );

	camera.userData.update( dtRatio, dt );

}
