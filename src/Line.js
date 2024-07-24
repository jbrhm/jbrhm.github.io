import { Vector3, } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Line {
    constructor(start, end, scene) { 
        this.init(start, end, scene);
    }

    async init(start, end, scene) {
        try {
            this.mesh = await this.loadMesh('https://raw.githubusercontent.com/jbrhm/jbrhm.github.io/684ed5feeb3923d0b47308e7dbfcfbec0774a1f7/meshes/test.glb');
    
            // Add mesh to the scene
            scene.add(this.mesh);
    
            // Scale the Line
            this.setEndpoints(start, end);
        } catch (error) {
            console.error(error);
        }

        // This log will happen after the mesh is loaded
        console.log('Mesh has been loaded.');
        console.log(this.mesh);
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
        var length = new Vector3(start.x, start.y, start.z);
        var dist = (length.sub(end)).length() - 1;

        var z = Math.atan((end.z - start.z) / (end.x - start.x));
        var y = -Math.atan((end.y - start.y) / (end.x - start.x));
        var x = Math.atan((end.z - start.z) / (end.y - start.y));

        if(isNaN(z)){
            z = 0;
        }else if(!isFinite(z)){
            z = Math.PI/2;
        }

        if(isNaN(y)){
            y = 0;
        }else if(!isFinite(y)){
            y = Math.PI/2;
        }

        if(isNaN(x)){
            x = 0;
        }else if(!isFinite(x)){
            x = Math.PI/2;
        }

        this.mesh.scale.set(1 + dist * Math.cos(x), 1 + dist * Math.cos(y), 1 + dist * Math.cos(z));

        this.mesh.rotation.set(0, y, -(Math.PI * 90)/180 + z);

        this.mesh.position.set(start.x, start.y, start.z);
    }
}

export default Line