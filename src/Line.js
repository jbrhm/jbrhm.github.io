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
        var dist = (length.sub(end)).length();

        this.mesh.scale.set(1, 1, dist * 1);

        var z = (end.z - start.z) / (end.x - start.x) == NaN ? Math.atan((end.z - start.z) / (end.x - start.x)) : 0;
        var y = (end.y - start.y) / (end.x - start.x) == NaN ? -Math.atan((end.y - start.y) / (end.x - start.x)) : 0;
        var x = (end.z - start.z) / (end.y - start.y) == NaN ? Math.atan((end.z - start.z) / (end.y - start.y)) : 0;

        var z = (end.z - start.z) / (end.x - start.x) == Infinity ? Math.atan((end.z - start.z) / (end.x - start.x)) : Math.PI / 2;
        var y = (end.y - start.y) / (end.x - start.x) == Infinity ? -Math.atan((end.y - start.y) / (end.x - start.x)) : Math.PI / 2;
        var x = (end.z - start.z) / (end.y - start.y) == Infinity ? Math.atan((end.z - start.z) / (end.y - start.y)) : Math.PI / 2;


        this.mesh.rotation.set(x, y, -(Math.PI * 90)/180 + z);

        this.mesh.position.set(start.x, start.y, start.z);
    }
}

export default Line