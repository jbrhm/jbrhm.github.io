import { Vector3, } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Line {
    constructor(start, end, scene) { 
        this.init(start, end, scene);
    }

    async init(start, end, scene) {
        try {
            this.mesh = await this.loadMesh('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/63fe28bc13d66bfacaf6946f9ecf8ea73be39e5f/meshes/test.glb');
    
            // Add mesh to the scene
            scene.add(this.mesh);
    
            // Scale the Line
            this.setEndpoints(start, end);
        } catch (error) {
            console.error(error);
        }

        // This log will happen after the mesh is loaded
        console.log('Mesh has been loaded.');
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

    setEndpoints(start, end){
        this.start = start;
        this.end = end; 

        // Calculate length
        length = (start.sub(end)).length();

        this.mesh.scale.set(1, 1, length * 1);

        this.mesh.rotation.set()
    }
}

export default Line