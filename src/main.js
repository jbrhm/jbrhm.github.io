import './style.css'

// My code
import Line from './Line.js'
import Grid from './Grid.js'
import SpinningCubeField from './SpinningCubeField.js'

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
const loader = new GLTFLoader();

var grid = new Grid(20, 20, new THREE.Vector3(-100,0,0), scene);

var portfolioTitle;
loader.load('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/e1d057416af091949c4be01412eead7bff658cf7/meshes/text.glb', (gltf) => {
	portfolioTitle = gltf.scene;
	scene.add(portfolioTitle);
	portfolioTitle.position.set(-75, 25, 10);
	portfolioTitle.rotation.set(Math.PI / 2 + 0.05, 0, 0);
	portfolioTitle.scale.set(25, 1, 25);
}, undefined, (error) => {
	reject(error);
});

var rover;
loader.load('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/f3295a4b63b7c7707989c028444046bfb30deea3/meshes/rover.glb', (gltf) => {
	rover = gltf.scene;
	scene.add(rover);
	rover.position.set(-200,75, 10);
	rover.rotation.set(Math.PI / 2 + 0.05, 0, 0);
	rover.scale.set(7, 7, 7);
}, undefined, (error) => {
	reject(error);
});

const moonTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/1da3704178dc47d4c654b74a6d75faf27b03d3fa/resources/mars2.jpg');
const normalTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/685cbb8086e34b1fbba2c88cd50517b5ccc5e44f/resources/normal.jpg');

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

const spinningCubeField = new SpinningCubeField(scene);

// Init Lights //

const pointLight = new THREE.PointLight( 0xffffff, 1000, 2000 );
pointLight.position.set(0, 65, 30);

const lightHelper =  new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( pointLight, ambientLight );

// Animation //

function animate() {
	requestAnimationFrame( animate );

	const t = Math.abs(document.body.getBoundingClientRect().top);
	console.log(t)

	// Loaded Meshes
	if(t < 3000){
		grid.addToScene();
		scene.add(moon);
		scene.add(rover);
	}else if(t > 4000 && t < 5100){
		grid.removeFromScene();
		scene.remove(moon);
		scene.remove(rover);
	}

	// Camera Scroll Movement
	if(Math.abs(t) < 2000){
		camera.position.z = -1 * Math.abs(t/250) ** 2 + 75;
		camera.position.y = 0.1 * 1.003 ** Math.abs(t) + 2;
		camera.rotation.x = 0.4 * Math.abs(t/1000) ** 2 + Math.PI/20;
	}else if(t > 2000 && t < 3100){
		camera.position.z = -1 * Math.abs(2000/250) ** 2 + 75;
		camera.position.y = 0.1 * 1.003 ** Math.abs(2000) + 2;
		camera.rotation.x = 0.4 * Math.abs(2000/1000) ** 2 + Math.PI/20;
	}else if(t > 3100 && t < 5100){
		camera.position.x = 20 * Math.cos((t-3100)/444) - 20 + 0.4 * (2**2) + (Math.PI/20);
		camera.position.y = ((t-3100)/20) + 0.1 * 1.003 ** Math.abs(2000) + 2;
		camera.position.z = 20 * Math.sin((t-3100)/444) + 11;
		camera.rotation.x = 0.4 * Math.abs(2000/1000) ** 2 + Math.PI/20 + (0.4 * Math.abs(2000/1000) ** 2 + Math.PI/20) * (0 - (Math.min(500, (t-3100))/500));
		camera.rotation.y = ((Math.max(500, t-3100) - 500) / 1500) * (Math.PI)
	}

	// Mars Scroll Movement
	if(t > 1500 && t < 2000){
		moon.position.set(200 * ((t-1500)/500) - 225, 75, 10);
	}else if(t > 2000 && t < 3100){
		moon.position.set(-25, 75, 10);
	}else if(t > 3100 && t < 4200){
		moon.position.set(200 * (1-(t-3100)/500) - 225, 75, 10);
	}

	// Rover Scrol Movement
	if(t > 1500 && t < 2000){
		rover.position.set(200 * ((t-1500)/500) - 217, 70, 21);
	}else if(t > 2000 && t < 3100){
		rover.position.set(-17 + 0.5 * Math.sin(time), 70 + 1 * Math.sin(time), 21);
	}else if(t > 3100 && t < 4200){
		rover.position.set(200 * (1-(t-3100)/500) - 225, 75, 10);
	}

	time += 0.0075;
	grid.updateRandom(time);

	// Mars Animation

	moon.rotation.set(2*Math.PI/4, time, 0)

	// Rover Animation

	rover.getObjectByName('front_right_wheel').rotation.set(0, 5 * time, 0);
	rover.getObjectByName('center_right_wheel').rotation.set(0, 5 * time, 0);
	rover.getObjectByName('back_right_wheel').rotation.set(0, 5 * time, 0);
	rover.getObjectByName('front_left_wheel').rotation.set(0, 5 * time, 0);
	rover.getObjectByName('center_left_wheel').rotation.set(0, 5 * time, 0);
	rover.getObjectByName('back_left_wheel').rotation.set(0, 5 * time, 0);

	rover.rotation.set(3*Math.PI/4 + 0.3 * Math.sin(time) ** 2 + 0.1, -3*Math.PI/4, Math.PI/4 + 0.1 * Math.sin(time) + 0.05);

	// Cube animations
	
	spinningCubeField.update(time);

	// Render Call

	renderer.render( scene, camera );
}

animate();

