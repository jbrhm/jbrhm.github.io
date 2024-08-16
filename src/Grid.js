import { Vector3, } from "three";
import Line from "./Line";
import Point from "./Point";

function getRandomInt(max) {
	if(max == 0){
		return 0;
	}
	return Math.floor(Math.random() * max);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const MAX_HEIGHT = 10;
const MIN_HEIGHT = 0;
const MOVING_RATE = 5;

class Grid {
	// width num of lines MUST BE greater than 1
	// height num of lines MUST BE greater than 1
	// origin location of start of the back left line
	constructor(height, width, origin, scene){
		this.height = height;
		this.width = width;
		this.origin = origin;
		
		this.grid = new Map();

		// Keys are described by their unique endpoints
		for(let row = 0; row < height; row++){
			for(let col = 0; col < width; col++){
				// Start and end points
				var start = new Vector3(10 * col + origin.x, 0, 10 * row + origin.z);

				{
					var end = new Vector3(10 * col + origin.x + 10, 0, 10 * row + origin.z);
					this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
				}

				{
					var end = new Vector3(10 * col + origin.x, 0, 10 * row + origin.z + 10);
					this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
				}
			}
		}

		// Add the height edge
		for(let row = 0; row < height; row++){
			var start = new Vector3(10 * width + origin.x, 0, 10 * row + origin.z);
			var end = new Vector3(10 * width + origin.x, 0, 10 * row + origin.z + 10);
			this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
		}

		// Add the height edge
		for(let col = 0; col < width; col++){
			var start = new Vector3(10 * col + origin.x, 0, 10 * height + origin.z);
			var end = new Vector3(10 * col + origin.x + 10, 0, 10 * height + origin.z);
			this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
		}

		// Create the grid of points
		// we use <= because there is one more point in every direction that grid box

		this.points = new Map();

		for(let row = 0; row <= this.height; row++){
			for(let col = 0; col <= this.width; col++){
				// Randomize the seed time for the point
				var initTime = getRandomFloat(0, 2 * Math.PI);

				this.points.set(JSON.stringify([col, row]), new Point(col, row, initTime));
			}
		}
	}

	// location is Vector3
	// height is double
	updateHeight(location, height) {
		var start = new Vector3(location.x, location.y, location.z);

		// right
		{
			var end = new Vector3(location.x + 10, location.y, location.z);
			if(this.grid.has(JSON.stringify([start.x, start.z, end.x, end.z]))){
				var line = this.grid.get(JSON.stringify([start.x, start.z, end.x, end.z]));
				start.y = height;
				line.setEndpoints(start, line.getEnd());
			}
		}

		// down
		{
			var end = new Vector3(location.x, location.y, location.z + 10);
			if(this.grid.has(JSON.stringify([start.x, start.z, end.x, end.z]))){
				var line = this.grid.get(JSON.stringify([start.x, start.z, end.x, end.z]));
				start.y = height;
				line.setEndpoints(start, line.getEnd());
			}
		}

		// up
		{
			var start = new Vector3(location.x, location.y, location.z - 10);
			var end = new Vector3(location.x, height, location.z);
			if(this.grid.has(JSON.stringify([start.x, start.z, end.x, end.z]))){
				var line = this.grid.get(JSON.stringify([start.x, start.z, end.x, end.z]));
				line.setEndpoints(line.getStart(), end);
			}
		}

		// left
		{
			var start = new Vector3(location.x - 10, location.y, location.z);
			var end = new Vector3(location.x, height, location.z);
			if(this.grid.has(JSON.stringify([start.x, start.z, end.x, end.z]))){
				var line = this.grid.get(JSON.stringify([start.x, start.z, end.x, end.z]));
				line.setEndpoints(line.getStart(), end);
			}
		}
	}

	removeFromScene(){
		for(let line of this.grid.values()) {
			line.removeFromScene();
		}
	}

	addToScene(){
		for(let line of this.grid.values()) {
			line.addToScene();
		}
	}

	updateRandom(time){

		function curve(x){
			return ((Math.cos(x)) ** 2) * 3 * ((Math.sin(2 * x) ** 2) + 2 * (Math.cos(Math.PI * x)) ** 2);
		}

		function scale(x){
			return 2 ** (-x+2);
		}


		for(let row = 0; row <= this.height; row++){
			for(let col = 0; col <= this.width; col++){
				if(this.points.has(JSON.stringify([col, row]))){
					var point = this.points.get(JSON.stringify([col, row]));

					this.updateHeight(new Vector3(10 * col + this.origin.x, 0, 10 * row + this.origin.z), scale(row)  * curve(point.getInitTime() + time));
				}
			}
		}	
	}

	
}

export default Grid
