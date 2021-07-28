
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import landscapeURL from '../assets/windmill.glb';

export default new Promise( (resolve) => {

	new GLTFLoader().load( landscapeURL, (glb) => {

		const animations = glb.animations;
		const windmill = glb.scene.getObjectByName( 'windmill' );
		const blades = glb.scene.getObjectByName( 'blades' );
		const ground = glb.scene.getObjectByName( 'ground' );
		const grass = glb.scene.getObjectByName( 'grass' );

		const assets = {
			animations,
			windmill,
			blades,
			ground,
			grass
		};

		resolve( assets );

	} )

} );
