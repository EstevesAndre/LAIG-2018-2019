class BezierAnimation extends Animation 
{
    constructor(time, controlPoints, loop)
    {
        super(time, loop);
        this.controlPoints = controlPoints;

        this.P1 = { x:controlPoints[0][0], y:controlPoints[0][1], z:controlPoints[0][2] };
        this.P2 = { x:controlPoints[1][0], y:controlPoints[1][1], z:controlPoints[1][2] };
        this.P3 = { x:controlPoints[2][0], y:controlPoints[2][1], z:controlPoints[2][2] };
        this.P4 = { x:controlPoints[3][0], y:controlPoints[3][1], z:controlPoints[3][2] };

        this.angle = 0;        
    };

    apply(scene)
    {
        let percentage = this.timeElapsed / this.time;

        let newX =  Math.pow(1 - percentage, 3) * this.P1.x +
                    3 * percentage * Math.pow(1 - percentage, 2) * this.P2.x +
                    3 * Math.pow(percentage, 2) * (1 - percentage) * this.P3.x +
                    Math.pow(percentage, 3) * this.P4.x;
        let newY =  Math.pow(1 - percentage, 3) * this.P1.y +
                    3 * percentage * Math.pow(1 - percentage, 2) * this.P2.y +
                    3 * Math.pow(percentage, 2) * (1 - percentage) * this.P3.y +
                    Math.pow(percentage, 3) * this.P4.y;
        let newZ =  Math.pow(1 - percentage, 3) * this.P1.z +
                    3 * percentage * Math.pow(1 - percentage, 2) * this.P2.z +
                    3 * Math.pow(percentage, 2) * (1 - percentage) * this.P3.z +
                    Math.pow(percentage, 3) * this.P4.z;
    
        this.angle = Math.atan2(newZ - this.z, newX - this.x);

        scene.translate(newX, newY, newZ);
    };    
};