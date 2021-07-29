
import * as THREE from 'three';

export default function ShadowedLight( options ) {

	// DEFAULTS

	if ( !options ) options = {};

	const x = options.x || 2;
	const y = options.y || 10;
	const z = options.z || 2;
	const width = options.width || 10;
	const shadowOffsetX = options.shadowOffsetX || 0;
	const shadowOffsetY = options.shadowOffsetY || 0;
	const near = options.near || 0.1;
	const far = options.far || 30;
	const bias = options.bias || -0.001;
	const normalBias = options.normalBias || 0;
	const radius = options.radius || 1;
	const resolution = options.resolution || 2048;
	const color = options.color || 0xffffff;
	const intensity = options.intensity || 1;
	const useHelpers = options.useHelpers || false;
	const castShadow = options.castShadow || true;

	// LIGHT CONSTRUCTION

	const directionalLight = new THREE.DirectionalLight( color, intensity );

	directionalLight.position.set( x, y, z );
	directionalLight.castShadow = castShadow;

	const d = width / 2;

	directionalLight.shadow.camera.left = -d + shadowOffsetX;
	directionalLight.shadow.camera.right = d + shadowOffsetX;
	directionalLight.shadow.camera.top = d + shadowOffsetY;
	directionalLight.shadow.camera.bottom = -d + shadowOffsetY;
	directionalLight.shadow.camera.near = near;
	directionalLight.shadow.camera.far = far;
	directionalLight.shadow.mapSize.width = resolution;
	directionalLight.shadow.mapSize.height = resolution;
	directionalLight.shadow.bias = bias;
	directionalLight.shadow.normalBias = normalBias;
	directionalLight.shadow.radius = radius;

	// Helpers

	directionalLight.helpers = new THREE.Group();

	if ( useHelpers ) {

		const lightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
		const cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
		
		directionalLight.helpers.add( lightHelper, cameraHelper );

	}

	return directionalLight;
	
}
