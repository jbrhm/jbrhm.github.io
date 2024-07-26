import './style.css'

// My code
import Line from './Line.js'
import Grid from './Grid.js'

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Init Scene //
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(0, 4, 75);
camera.rotation.set(Math.PI/20, 0, 0);

renderer.render( scene, camera );

// Helpers //
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Init Geometery //

var time = 0;
var grid = new Grid(20, 20, new THREE.Vector3(-100,0,0), scene);

var portfolioTitle;
const loader = new GLTFLoader();
loader.load('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/e1d057416af091949c4be01412eead7bff658cf7/meshes/text.glb', (gltf) => {
	portfolioTitle = gltf.scene;
	scene.add(portfolioTitle);
	portfolioTitle.position.set(-75, 20, 10);
	portfolioTitle.rotation.set(Math.PI / 2 + 0.05, 0, 0);
	portfolioTitle.scale.set(25, 1, 25);
}, undefined, (error) => {
	reject(error);
});

const moonTexture = new THREE.TextureLoader().load('resources/mars.jpeg');
const normalTexture = new THREE.TextureLoader().load('resources/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.set(-200,75, 10);
moon.scale.set(5, 5, 5);


// Init Lights //

const pointLight = new THREE.PointLight( 0x8f2f06, 1000, 1000 );
pointLight.position.set(0, 65, 30);

const lightHelper =  new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( pointLight, ambientLight );

// Scrolling //

function moveCamera() {
	const t = Math.abs(document.body.getBoundingClientRect().top);

	// Camera Scroll Movement
	if(Math.abs(t) < 2000){
		camera.position.z = -1 * Math.abs(t/250) ** 2 + 75;
		camera.position.y = 0.1 * 1.003 ** Math.abs(t) + 2;

		camera.rotation.x = 0.4 * Math.abs(t/1000) ** 2 + Math.PI/20;
	}else if(t > 2000 && t < 3000){
		camera.position.z = -1 * Math.abs(2000/250) ** 2 + 75;
		camera.position.y = 0.1 * 1.003 ** Math.abs(2000) + 2;

		camera.rotation.x = 0.4 * Math.abs(2000/1000) ** 2 + Math.PI/20;
	}

	// Mars Scroll Movement
	if(t > 1500 && t < 2000){
		moon.position.set(200 * ((t-1500)/500) - 225, 75, 10);
	}else if(t > 2000 && t < 3000){
		moon.position.set(-25, 75, 10);
		moon.rotation.set(0, 0, (t - 2000) / 300)
	}

	console.log(t);
}

document.body.onscroll = moveCamera;


// Animation //

function animate() {
	requestAnimationFrame( animate );

	time += 0.01;
	grid.updateRandom(time);

	renderer.render( scene, camera );
}

animate();

