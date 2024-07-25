import { Vector3, } from "three";
import Line from "./Line";

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
		
		this.grid = new Map();

		// Keys are described by their unique endpoints
		for(let row = 0; row < height; row++){
			for(let col = 0; col < width; col++){
				// Start and end points
				var start = new Vector3(10 * col + origin.x, 0, 10 * row + origin.y);

				{
					var end = new Vector3(10 * col + origin.x + 10, 0, 10 * row + origin.y);
					this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
				}

				{
					var end = new Vector3(10 * col + origin.x, 0, 10 * row + origin.y + 10);
					this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
				}
			}
		}

		// Add the height edge
		for(let row = 0; row < height; row++){
			var start = new Vector3(10 * width + origin.x, 0, 10 * row + origin.y);
			var end = new Vector3(10 * width + origin.x, 0, 10 * row + origin.y + 10);
			this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
		}

		// Add the height edge
		for(let col = 0; col < width; col++){
			var start = new Vector3(10 * col + origin.x, 0, 10 * height + origin.y);
			var end = new Vector3(10 * col + origin.x + 10, 0, 10 * height + origin.y);
			this.grid.set(JSON.stringify([start.x, start.z, end.x, end.z]), new Line(start, end, scene));
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
				var line = this.grid.get(JSON.stringify([end.x, end.z]));
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

	updateRandom(){
		if(this.grid != undefined){
			var numberPointsToUpdate = getRandomInt((this.height) * (this.width - 1));
			for(let i = 0; i < numberPointsToUpdate; i++){
				// Generate a random non front edge point
				var point = new Vector3(getRandomInt(this.width + 1) * 10, 0, getRandomInt(this.height) * 10)
				if(this.grid.has(JSON.stringify([point.x, point.z, point.x, point.z + 10]))){
					var height = this.grid.get(JSON.stringify([point.x, point.z, point.x, point.z + 10])).getStart().y + MOVING_RATE * getRandomFloat(-0.1, 0.1);
					
					if(height == NaN){
						console.log("bruh");
					}

					// Clamp
					height = Math.min(...[MAX_HEIGHT, height]);
					height = Math.max(...[MIN_HEIGHT, height]);

					this.updateHeight(point, height);
				}
			}
		}
		
	}
}

export default Grid