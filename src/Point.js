class Point {
    constructor(x, y, initTime){
        this.x = x;
        this.y = y;
        this.initTime = initTime;
    }

    getPose(){
        return [this.x, this.y];
    }

    getInitTime(){
        return this.initTime;
    }
}

export default Point