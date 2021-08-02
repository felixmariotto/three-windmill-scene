
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

if ( USE_CONTROLS ) {

	camera.position.set( 0, 10, 100 );
	camera.lookAt( 0, 10, 0 );

	const controls = new OrbitControls( camera, document.body );

}

// animation

window.addEventListener( 'pointermove', (e) => {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
} );

camera.userData.update = function update() {

	if ( !USE_CONTROLS ) {

		targetPos.set( 0, 10, 100 );
		targetPos.x += mouse.x * 10;
		targetPos.y += mouse.y * 1;

		camera.position.lerp( targetPos, 0.08 );

		// point the camera towards target

		targetDir.set( 0, 0.2, -1 );
		targetDir.x += mouse.x * 0.2;
		targetDir.y += mouse.y * 0.01;

		lastDir.lerp( targetDir, 0.03 );

		_vec
		.copy( camera.position )
		.add( lastDir );

		camera.lookAt( _vec );

	}

}

//

export default camera
