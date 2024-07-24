import './style.css'

// My code
import Line from './Line.js'

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
camera.position.setZ( 30 );

renderer.render( scene, camera );

// Helpers //
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Init Geometery //

var start = new THREE.Vector3(0, 0, 0);
var end = new THREE.Vector3(0, 0, 0);
var angle = 0;
const line = new Line(start, end, scene);

var start2 = new THREE.Vector3(10, 0, 0);
const line2 = new Line(start2, end, scene);


// Init Lights //

const pointLight = new THREE.PointLight( 0xffffff );
pointLight.position.set( 5, 5, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( pointLight, ambientLight );

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
	requestAnimationFrame( animate );

	angle += 0.01;
	end.x = 10*Math.cos(angle);
	end.y = 10*Math.sin(angle);

	line.setEndpoints(start, end);
	line2.setEndpoints(start2, end);

	controls.update();

	renderer.render( scene, camera );
}

animate();
