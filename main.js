import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Box from "./box.js"



// character motion parameters
var angle = 0,
		speed = 0.03;

var cameraAngle = 0;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// Shadows 1
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const Alight = new THREE.AmbientLight( 0xffffff, 0.5); // soft white light
scene.add( Alight );

scene.background = new THREE.Color( 0xf00fddd );

const Dlight = new THREE.DirectionalLight(0xffffff, 1);
Dlight.position.z = 1;
Dlight.position.y = 2;
Dlight.position.x = -1;
Dlight.castShadow = true;

scene.add(Dlight)



const loader1 = new THREE.CubeTextureLoader();
loader1.setPath( 'models/ThreejsSample-main/gltf/textures/' );

const textureCube = loader1.load( [
	'2.jpg', '2.jpg',
	'2.jpg', '2.jpg',
	'2.jpg', '2.jpg'
] );

const cubeTextures = new THREE.MeshPhongMaterial( { envMap: textureCube} );


const cube = new Box
({
	name: "cube",
	width: 1,
	height: 1,
	depth: 1,
	color: 0x0f0f000,
	position:
	{
		x: 0,
		y: 0,
		z: 0
	},
	velocity:
	{
		x: 0,
		y: 0,
		z: 0
	},
	// material: cubeTextures,
	cShadow: true

});

const platforme = new Box
({
	name: "platform",
	width: 12,
	height: 0.4,
	depth: 20,
	color: 0x000ff0,
	position:
	{
		x: 0,
		y: -2,
		z: - (20/2 - 2)
	},
	rShadow: true
});

const enemy1 = new Box
({
	name: "enemy",
	width: 1,
	height: 1,
	depth: 1,
	color: 0xff00000,
	position:
	{
		x: 0,
		y: -1.3,
		z: platforme.front + 0.5
	},
	velocity:
	{
		x: 0,
		y: 0,
		z: 0
	},
	cShadow: true,
	enemyType: "normal"
});

const enemy2 = new Box
({
	name: "enemy",
	width: 1,
	height: 1,
	depth: 1,
	color: 0x00fdff,
	position:
	{
		x: -2,
		y: -1.3,
		z: platforme.front + 0.5
	},
	velocity:
	{
		x: 0,
		y: 0,
		z: 0
	},
	cShadow: true,
	enemyType: "distance"
});


const flyEffect = new Box
({
	name: "effect",
	width: 1,
	height: 0.05,
	depth: 1,
	color: 0x00DDFFf,
	position:
	{
		x: 0,
		y: platforme.top + 0.025,
		z: platforme.back - 6.5
	},
	velocity:
	{
		x: 0,
		y: 0,
		z: 0
	}
});

scene.add(cube);
scene.add(flyEffect);
scene.add(platforme);
scene.add(enemy1);
scene.add(enemy2);

// var square;

// const loader = new GLTFLoader();

// loader.load( 'models/cubes/cube2.glb', function ( gltf ) {
// 	square = gltf.scene;
// 	square.position.y = -1;
	
// 	gltf.scene.traverse((child) => {
// 			// Check if the child is a mesh
// 		if (child instanceof THREE.Mesh) {
// 			// Assuming your model has a basic material
// 			// Create a texture loader
// 			const textureLoader = new THREE.TextureLoader();

// 			// Load texture image file
// 			textureLoader.load(
// 				'models/boy/textures/N00_005_01_Tops_01_CLOTH_Instance_baseColor.png', // or .png, .gif, etc.
// 				function (texture) {
// 					// Create a basic material using the texture
// 					const material = new THREE.MeshBasicMaterial({ map: texture });

// 					// Apply the material to the mesh
// 					child.material = material;

// 					// Ensure the texture is properly applied
// 					child.material.needsUpdate = true;
// 				}
// 			);
// 		}
// 	});
	
// 	scene.add( square );
//     renderer.render(scene, camera)

// }, undefined, function ( error ) {

// 	console.error( error );

// } );



const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	s: {
		pressed: false
	},
	w: {
		pressed: false
	},
	space: {
		pressed: false
	},
	shiftLeft: {
		pressed: false
	}
}

window.addEventListener("keydown", (event) => {
	switch(event.code){
		case "KeyD" : 
			keys.d.pressed = true
			break;
		case "KeyA":
			keys.a.pressed = true
			break
		case "KeyS":
			keys.s.pressed = true
			break
		case "KeyW":
			keys.w.pressed = true
			break
		case "Space":
			keys.space.pressed = true;
			break;
		case "ShiftLeft":
			keys.shiftLeft.pressed = true
			break;
	}
})

window.addEventListener("keyup", (event) => {
	switch(event.code){
		case "KeyD" : 
			keys.d.pressed = false
			break;
		case "KeyA":
			keys.a.pressed = false
			break
		case "KeyS":
			keys.s.pressed = false
			break
		case "KeyW":
			keys.w.pressed = false
			break
		case "Space":
			keys.space.pressed = false
			break
		case "ShiftLeft":
			keys.shiftLeft.pressed = false
			break
	}
})

function colligenDetect(shape1, shape2){
	if (   ( shape1.front < shape2.back  && shape1.left < shape2.right && shape1.right > shape2.right  && shape1.back > shape2.front ) 
			|| ( shape1.front < shape2.back  && shape1.right > shape2.left && shape1.left < shape2.left  && shape1.back > shape2.front )
			|| ( shape1.front < shape2.back && shape1.right == shape2.right && shape1.left == shape2.left  && shape1.back > shape2.front ) ){
		return 1;
	}
}

function updateDLight(){
	//Set up shadow properties for the light
	Dlight.shadow.mapSize.height = 5120 // default
	Dlight.shadow.mapSize.width = 5120 // default
	Dlight.shadow.camera.near = 0.1 // default
	Dlight.shadow.camera.far = 500 // default
	Dlight.shadow.camera.top = -100 // default
	Dlight.shadow.camera.right = 100 // default
	Dlight.shadow.camera.left = -100 // default
	Dlight.shadow.camera.bottom = 100 // default
}


angle = 0.05;
const PI = Math.PI;

var rotation = 0;

function animate() {
	requestAnimationFrame( animate );
	
	if ( keys.w.pressed )
	cube.pVelocity = -0.05;
	else if ( keys.s.pressed )
	cube.pVelocity = 0.05;


	if ( keys.a.pressed ){
		cube.rotateY(0.05);
		rotation += 0.05;
	}
	else if ( keys.d.pressed ){
		cube.rotateY(-0.05);
		rotation -= 0.05;

	}

	if (keys.space.pressed && cube.bottom == platforme.top){
		cube.velocity.y = 0.1;
	}

	if (keys.shiftLeft.pressed && keys.w.pressed){
		cube.pVelocity = -0.2
	}

	if (colligenDetect(cube, flyEffect)){
		cube.velocity.y = 0.01
	}

	// Fixing Error: After Cube Falling + Rotating It => Camera Lost The Right Angle
	if (cube.dead){
		rotation = 0;
		cube.dead = false;
	} 
	
    // Update camera position to follow the cube
	cameraAngle = THREE.MathUtils.lerp( cameraAngle, rotation , 0.1 );
	camera.position.setFromSphericalCoords( 7, 1.1, cameraAngle );
	camera.position.add( cube.position );
  	camera.lookAt( cube.position.x, cube.position.y + 1, cube.position.z );

	// controls.update();
	

	if (colligenDetect(cube, enemy1)){
		cube.respawn( {x:false, y:false, z:false});
		enemy1.respawn({x:false, y:false, z:true});
	}
	
	cube.update(platforme);
	enemy1.update(platforme);
	enemy2.update(platforme);
	updateDLight();



	// cube.position.set(cube.position.x, platforme.top + cube.height/2, cube.position.z)

	renderer.render( scene, camera );
}

animate();
