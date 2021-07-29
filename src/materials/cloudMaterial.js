
import * as THREE from 'three';

import textureURL from '../../assets/cloud.jpg';

//

const vertexShader = `
	varying vec2 vUv;
	varying vec4 vPos;

	void main() {

		vUv = uv;
		
		vec4 pos = vec4( position, 1.0 );
		#ifdef USE_INSTANCING
			pos = instanceMatrix * pos;
		#endif

		vPos = modelMatrix * pos;
		gl_Position = projectionMatrix * viewMatrix * vPos;

	}
`;

const fragmentShader = `
	varying vec2 vUv;
	varying vec4 vPos;

	uniform sampler2D map;

	float easeOutExpo( float x ) {
		return x == 1.0 ? 1.0 : 1.0 - pow( 2.0, -15.0 * x );
	}

	void main() {

		vec4 s = texture2D( map, vUv );

		float opacity = ( s.x + s.y + s.z ) / 3.0;
		if ( opacity < 0.2 ) discard;

		// intensity based on cloud position
		vec3 vDir = normalize( vPos.xyz );
		float t = 0.5 + 0.5 * dot( vDir, normalize( vec3( -0.3, 0.1, 1.0 ) ) );
		t = easeOutExpo( t );

		// intensity based on pixel normal on cloud
		vec3 normal = normalize( s.xyz );
		t *= 0.5 + 0.5 * dot( normal, vec3( 0, 1.0, 0 ) );

		vec3 brigthColor = vec3( 0.98, 1.0, 1.0 );
		vec3 darkColor = vec3( 0.4, 0.42, 0.42 );
		vec3 color = mix( brigthColor, darkColor, t );

		gl_FragColor = vec4( color, opacity );
	}
`;

const uniforms = {
	time: { value: 0 },
	map: { value: new THREE.TextureLoader().load( textureURL ) }
}

const material = new THREE.ShaderMaterial( {
	vertexShader,
	fragmentShader,
	uniforms,
	transparent: true
} );

material.userData.update = function ( elapsedTime ) {
	uniforms.time.value = elapsedTime;
	material.uniformsNeedUpdate = true;
}

export default material
