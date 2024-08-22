import { Vector3, } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import SpinningCube from './SpinningCube.js'

class SpinningCubeField {
    constructor(scene) { 
		this.scene = scene;

		// Load all of the cubes into an array
		this.numCubes = 100;
		this.array = Array(this.numCubes);

		for(let i = 0; i < this.numCubes; i++){
			this.array[i] = new SpinningCube(this.scene);
		}

		this.addToScene();
    }

	update(time){
		for(let i = 0; i < this.numCubes; i++){
			this.array[i].update(time);
		}
	}

	addToScene(){
		for(let i = 0; i < this.numCubes; i++){
			this.array[i].addToScene();
		}
	}

	removeFromScene(){
		for(let i = 0; i < this.numCubes; i++){
			this.array[i].removeFromScene();
		}
	}
}

export default SpinningCubeField
