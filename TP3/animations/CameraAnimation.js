class CameraAnimation extends Animation 
{
    constructor(time, camera, param1, param2)
    {
        super(time);
        
        if(param2 != null)
        {
            this.type = "LINEAR";

            this.camera = camera;
            this.position = param1;
            this.target = param2;

            this.init_position = camera.position;
            this.init_target = camera.target;
        }
        else
        {
            this.type = "CIRCULAR";

            this.camera = camera;
            this.angle = param1;

            this.current_angle = 0;

            this.finalTarget = vec3.scale(vec3.create(), this.camera.target, -1);

            this.camera.setTarget(vec3.create());
        }

    };
    
    apply()
    {   
        if(this.type == "LINEAR")
        {
            this.camera.setPosition(vec3.add(vec3.create(), this.init_position, vec3.scale(vec3.create(), vec3.subtract(vec3.create(), this.position, this.init_position), this.timeElapsed / this.time)));
            this.camera.setTarget(vec3.add(vec3.create(), this.init_target, vec3.scale(vec3.create(), vec3.subtract(vec3.create(), this.target, this.init_target), this.timeElapsed / this.time)));
        }
        else
        {
            this.rotAngle = this.angle * (this.timeElapsed / this.time) - this.current_angle;

            if(this.current_angle + this.rotAngle > this.angle) this.rotAngle = this.angle - this.current_angle;

            this.current_angle += this.rotAngle;

            this.camera.orbit(vec3.fromValues(0, 1, 0), this.rotAngle);

            if(this.isAnimationOver())
            {
                this.camera.setTarget(this.finalTarget);
            }
        }
    };

};