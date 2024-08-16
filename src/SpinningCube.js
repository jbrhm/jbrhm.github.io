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
			var [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));
    		
			// Make sure none of the Cubes are too close
			const radius = 20;

			while(Math.abs(x) <= radius || Math.abs(y) <= radius || Math.abs(z) <= radius){
				[x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));
			}

			this.mesh.position.set(x, y, z);
			this.mesh.scale.set(2,2,2);

            // Scale the Line
            this.setEndpoints(start, end);
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

	addToScene(){
		this.scene.add(this.mesh);
	}

	removeFromScene(){
		this.scene.remove(this.mesh);
	}
}

export default SpinningCube
