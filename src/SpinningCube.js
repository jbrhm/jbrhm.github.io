import * as THREE from 'three';
import { Vector3, } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class SpinningCube {
    constructor(scene) { 
		this.scene = scene;
        this.init(scene);
    }

    async init(scene) {
        try {
            this.mesh = await this.loadMesh('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/e45218f23f4b3cd3e10393d65bf399cfaee0a8f5/meshes/cube.glb');
    
            // Add mesh to the scene
			this.addToScene();

			// Generate a Random Location
			var [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    		
			// Make sure none of the Cubes are too close
			const radius = 20;

			while(Math.abs(x) <= radius || Math.abs(y) <= radius || Math.abs(z) <= radius){
				[x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
			}

			this.mesh.position.set(x, y, z);
			this.mesh.scale.set(5,5,5);

			// Set up the animation values
			[this.a0, this.a1, this.a2] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(2));
			[this.b0, this.b1, this.b2] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(2));
        } catch (error) {
            console.error(error);
        }
    }

    loadMesh(url) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                resolve(gltf.scene);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }

	update(time){
		function rotationFunction(x){
			return [Math.sin(x), Math.cos(x), 0.1 * x];
		}

		this.mesh.rotation.set(this.a0 * rotationFunction(time)[0] + this.b0, this.a1 * rotationFunction(time)[1] + this.b1, this.a2 * rotationFunction(time)[2] + this.b2)	
	}

	addToScene(){
		this.scene.add(this.mesh);
	}

	removeFromScene(){
		this.scene.remove(this.mesh);
	}
}

export default SpinningCube
