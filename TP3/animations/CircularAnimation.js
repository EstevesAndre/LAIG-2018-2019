var DEGREE_TO_RAD = Math.PI / 180;

class CircularAnimation extends Animation 
{
    constructor(time, center, radius, initialAngle, rotationAngle, loop)
    {
        super(time, loop);
        this.center = center;
        this.radius = radius;
        
        this.initialAngle = (initialAngle + 90) * DEGREE_TO_RAD;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;
    
        this.angularSpeed = this.rotationAngle / this.time;
        if(this.rotationAngle > 0) this.initialRotAngle = Math.PI/2.0;
        else this.initialRotAngle = -Math.PI/2.0;
    };
    
    apply(scene)
    {        
        let angRotation = this.initialAngle + this.angularSpeed * this.timeElapsed;

        scene.translate(this.center[0],this.center[1],this.center[2]);
        scene.rotate(angRotation,0,1,0);
        scene.translate(0,0,this.radius);
        scene.rotate(this.initialRotAngle, 0,1,0);
    };

    applyLast(scene)
    {
        scene.translate(this.center[0],this.center[1],this.center[2]);
        scene.rotate(this.initialAngle + this.rotationAngle,0,1,0);
        scene.translate(0,0,this.radius);
        scene.rotate(this.initialRotAngle, 0,1,0);
    };

};