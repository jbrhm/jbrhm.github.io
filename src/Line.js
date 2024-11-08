import { Vector3, } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function coordinatesToAngle(x, y) {
    // Use the Math.atan2 function to get the angle in radians
    let angle = Math.atan2(y, x);

    // atan2 returns values between -π and π, convert it to 0 to 2π
    if (angle < 0) {
        angle += 2 * Math.PI;
    }

    return angle;
}

class Line {
    constructor(start, end, scene) { 
		this.scene = scene;
        this.init(start, end, scene);
    }

    async init(start, end, scene) {
        try {
            this.mesh = await this.loadMesh('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/c643b37e33c073a89dccee2e4fd9f02896e16d80/meshes/test.glb');
    
            // Add mesh to the scene
			this.addToScene();
    
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

    setEndpoints(start, end){
        this.start = start;
        this.end = end; 

        // Assuming you have a mesh object
        this.mesh.position.set(start.x, start.y, start.z);

        var length = new Vector3(start.x, start.y, start.z);
        var dist = (length.sub(end)).length();

        this.mesh.scale.set(1, 1, dist/10);

        this.mesh.lookAt(end);
    }

    getStart(){
        return this.start;
    }

    getEnd(){
        return this.end;
    }
}

export default Line
