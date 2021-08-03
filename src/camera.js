
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//

const USE_CONTROLS = false;

const mouse = new THREE.Vector2();
const targetPos = new THREE.Vector3();
const targetDir = new THREE.Vector3( 0, 0.25, -1 );
const lastDir = new THREE.Vector3( 0, 0.25, -1 );
const _vec = new THREE.Vector3();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 65, aspect, 0.1, 5000 );
camera.position.set( 0, 10, 100 );
camera.userData.reflectionCamera = camera.clone();

if ( USE_CONTROLS ) {

	camera.position.set( 0, 10, 100 );
	camera.lookAt( 0, 10, 0 );

	new OrbitControls( camera, document.body );

}

// animation

window.addEventListener( 'pointermove', (e) => {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
} );

camera.userData.update = function update( dtRatio ) {

	if ( !USE_CONTROLS ) {

		targetPos.set( 0, 10, 100 );
		targetPos.x += mouse.x * 10;
		targetPos.y += mouse.y * 5;

		camera.position.lerp( targetPos, 0.02 * dtRatio );

		// point the camera towards target

		targetDir.set( 0, 0.2, -1 );
		targetDir.x += mouse.x * 0.2;
		targetDir.y += mouse.y * 0.1;

		lastDir.lerp( targetDir, 0.02 * dtRatio );

		_vec
		.copy( camera.position )
		.add( lastDir );

		camera.lookAt( _vec );

	}

	// position reflection camera so that it draws the scene from "inside" the water

	camera.userData.reflectionCamera.position.copy( camera.position );
	camera.userData.reflectionCamera.position.y *= -1;
	camera.userData.reflectionCamera.position.y -= 3;

	_vec
	.copy( camera.position )
	.add( lastDir );
	_vec.y *= -1;
	_vec.y -= 3;

	camera.userData.reflectionCamera.lookAt( _vec );

}

//

export default camera
