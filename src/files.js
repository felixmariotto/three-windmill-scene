
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import landscapeURL from '../assets/windmill.glb';

//

const loader = new GLTFLoader();

const landscape = loadAsset( landscapeURL );

//

function loadAsset( url ) {

	return new Promise( (resolve) => {

		loader.load( url, ( glb ) => {

			resolve( glb );

		} );

	} )

}

//

export default {
	landscape
}
