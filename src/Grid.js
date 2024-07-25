import { Vector3, } from "three";
import Line from "./Line";

class Grid {
	// width num of lines MUST BE greater than 1
	// height num of lines MUST BE greater than 1
	// origin location of start of the back left line
	constructor(height, width, origin, scene){
		this.grid = new Map();

		// Keys are described by their unique endpoints
		for(let row = 0; row < height; row++){
			for(let col = 0; col < width; col++){
				// Start and end points
				var start = new Vector3(10 * col + origin.x, 0, 10 * row + origin.y);

				{
					var end = new Vector3(10 * col + origin.x + 10, 0, 10 * row + origin.y);
					this.grid.set([start.x, start.z, end.x, end.z], new Line(start, end, scene));
				}

				{
					var end = new Vector3(10 * col + origin.x, 0, 10 * row + origin.y + 10);
					this.grid.set([start.x, start.z, end.x, end.z], new Line(start, end, scene));
				}
			}
		}

		// Add the height edge
		for(let row = 0; row < height; row++){
			var start = new Vector3(10 * width + origin.x, 0, 10 * row + origin.y);
			var end = new Vector3(10 * width + origin.x, 0, 10 * row + origin.y + 10);
			this.grid.set([start.x, start.z, end.x, end.z], new Line(start, end, scene));
		}

		// Add the height edge
		for(let col = 0; col < width; col++){
			var start = new Vector3(10 * col + origin.x, 0, 10 * height + origin.y);
			var end = new Vector3(10 * col + origin.x + 10, 0, 10 * height + origin.y);
			this.grid.set([start.x, start.z, end.x, end.z], new Line(start, end, scene));
		}
	}
}

export default Grid