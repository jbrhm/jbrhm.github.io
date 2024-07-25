import './style.css'

// My code
import Line from './Line.js'
import Grid from './Grid.js'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Init Scene //
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(0, 10, 75);

renderer.render( scene, camera );

// Helpers //
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Init Geometery //

var time = 0;
var grid = new Grid(20, 20, new THREE.Vector3(-100,0,0), scene);

// Init Lights //

const pointLight = new THREE.PointLight( 0xffffff );
pointLight.position.set( 5, 5, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( pointLight, ambientLight );

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
	requestAnimationFrame( animate );

	time += 0.01;
	grid.updateRandom(time);

	controls.update();

	renderer.render( scene, camera );
}

animate();
