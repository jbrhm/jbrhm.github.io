import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Init Scene //
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ( 30 );

renderer.render( scene, camera );

// Init Geometery //

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh( geometry, material );

scene.add( torus );

// Load Assets

const loader = new GLTFLoader();

var xScale = 1.0;
var yScale = 1.0;
var zScale = 1.0;

var testMesh;

loader.load( 'meshes/test.glb', function ( gltf ) {

	testMesh = gltf.scene;

	scene.add( testMesh );

}, undefined, function ( error ) {

	console.error( error );

} );

// Init Lights //

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
	requestAnimationFrame( animate );
	
	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	yScale += 0.01;

	testMesh.scale.set(xScale, yScale, zScale);

	controls.update();

	renderer.render( scene, camera );
}

animate();
