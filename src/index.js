
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader.js';

import RenderTargetHelper from 'three-rt-helper';

import assets from './assets.js';
import waterMaterial from './materials/waterMaterial.js';
import grassMaterials from './materials/grassMaterials.js';
import ShadowedLight from './ShadowedLight.js';
import camera from './camera.js';
import postprosColorAverage from './postprosColorAverage.js';
import postprosWaterSSR from './postprosWaterSSR.js';

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
renderer.setSize( WIDTH, HEIGHT );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.append( renderer.domElement );

const renderTarget = new THREE.WebGLRenderTarget( WIDTH, HEIGHT );

const renderTargetHelper = RenderTargetHelper( renderer, renderTarget );
document.body.append( renderTargetHelper );

const clock = new THREE.Clock();

// postprocessing

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const waterSSREffect = new ShaderPass( postprosWaterSSR );
waterSSREffect.uniforms[ 'tWater' ].value = renderTarget.texture;
composer.addPass( waterSSREffect );

/*
const brigthContrastEffect = new ShaderPass( BrightnessContrastShader );
brigthContrastEffect.uniforms[ 'brightness' ].value = -0.1;
brigthContrastEffect.uniforms[ 'contrast' ].value = -0.1;
composer.addPass( brigthContrastEffect );

const colorAverageEffect = new ShaderPass( postprosColorAverage );
colorAverageEffect.uniforms[ 'amount' ].value = 0.7;
composer.addPass( colorAverageEffect );

const aaEffect = new ShaderPass( FXAAShader );
composer.addPass( aaEffect );
*/

// resizing

window.addEventListener( 'resize', () => {
	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	renderer.setSize( WIDTH, HEIGHT );
	composer.setSize( WIDTH, HEIGHT );
	renderTarget.setSize( WIDTH, HEIGHT );
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
		a.sky
	);

	const groundClone = a.ground.clone();
	groundClone.material = new THREE.MeshBasicMaterial({ color: 'black' });

	waterScene.add(
		a.water,
		groundClone
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

	//

	renderer.setRenderTarget( renderTarget );
	renderer.clear();
	renderer.render( waterScene, camera );

	renderTargetHelper.update();

	//

	renderer.setRenderTarget();
	renderer.clear();

	composer.render();

	//

	// renderer.render( scene, camera );
	// console.log( renderer.info.render )

	requestAnimationFrame( loop );

}

function animate() {

	if ( blades ) blades.rotation.z += 0.003;
	if ( sky ) sky.userData.update();

	const t = clock.getElapsedTime();

	waterMaterial.userData.update( t );
	grassMaterials.grass.userData.update( t );
	grassMaterials.bigGrass.userData.update( t );
	grassMaterials.waterGrass.userData.update( t );

	camera.userData.update();

}