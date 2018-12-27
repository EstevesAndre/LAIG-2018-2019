class Animation 
{
    constructor(time, loop, StartTimeElapsed)
    {
        this.time = time;
        this.loop = loop || false;
        this.timeElapsed = StartTimeElapsed || 0.0;
        this.angRotation = 0.0;
    };

    isAnimationOver()
    {
        return !this.loop && this.timeElapsed > this.time;
    };

    update(currTime)
    {
        this.timeElapsed += currTime;
        if(this.loop && this.timeElapsed >= this.time) this.timeElapsed %= this.time;
    };    
};