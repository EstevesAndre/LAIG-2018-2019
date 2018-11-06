var DEGREE_TO_RAD = Math.PI / 180;

class CircularAnimation extends Animation 
{
    constructor(time, center, radius, initialAngle, rotationAngle)
    {
        super(time);
        this.center = center;
        this.radius = radius;
        
        this.initialAngle = initialAngle * DEGREE_TO_RAD;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;

        if(this.rotationAngle > 0) this.angularSpeed = this.rotationAngle / this.time;
        else this.angularSpeed = - this.rotationAngle / this.time;
    };
    
    apply(scene)
    {        
        let angRotation = this.initialAngle + this.angularSpeed * this.timeElapsed;

        scene.translate(this.center[0],this.center[1],this.center[2]);
        scene.rotate(angRotation,0,1,0);
        scene.translate(0,0,this.radius);
    };

    applyLast(scene)
    {
        scene.translate(this.center[0],this.center[1],this.center[2]);
        scene.rotate(this.initialAngle + this.rotationAngle,0,1,0);
        scene.translate(0,0,this.radius);
    }

};