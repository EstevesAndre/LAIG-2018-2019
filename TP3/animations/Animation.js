class Animation 
{
    constructor(time, loop)
    {
        this.time = time;
        this.loop = loop || false;
        this.timeElapsed = 0.0;
        this.angRotation = 0.0;
    };

    isAnimationOver()
    {
        return !this.loop && this.timeElapsed > this.time;
    };

    update(currTime)
    {
        this.timeElapsed += currTime;
        if(this.loop) this.timeElapsed %= this.time;
    };
    
};