class Animation 
{

    constructor(time)
    {
        this.time = time;
        this.timeElapsed = 0.0;
        this.angRotation = 0.0;
    };

    isAnimationOver()
    {
        return this.timeElapsed > this.time;
    }

    update(currTime)
    {
        this.timeElapsed += currTime;
    };
    
};