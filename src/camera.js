
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//

const mouse = new THREE.Vector2();
const targetPos = new THREE.Vector3();
const targetDir = new THREE.Vector3();
const _vec = new THREE.Vector3();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 65, aspect, 0.1, 5000 );
const controls = new OrbitControls( camera, document.body );

// animation

window.addEventListener( 'pointermove', (e) => {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
} );

camera.userData.update = function update() {

	targetPos.set( 0, 10, 100 );
	targetPos.x += mouse.x * 10;
	targetPos.y += mouse.y * 5;

	camera.position.copy( targetPos );

	// point the camera towards target

	targetDir.set( 0, 0.2, -1 );
	targetDir.x += mouse.x * 0.2;
	targetDir.y += mouse.y * 0.1;

	_vec
	.copy( camera.position )
	.add( targetDir );

	camera.lookAt( _vec );

}

//

export default camera
