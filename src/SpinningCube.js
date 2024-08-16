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
            this.mesh = await this.loadMesh('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/2f55e0dbc928874955191ff10c79e3a0f395e1fb/meshes/cube.glb');
    
            // Add mesh to the scene
			this.addToScene();

			// Generate a Random Location
			var [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    		
			// Make sure none of the Cubes are too close
			const radius = -200;

			while(x <= radius || y <= radius || z <= radius){
				[x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
			}

			this.mesh.position.set(x, y, z);

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
