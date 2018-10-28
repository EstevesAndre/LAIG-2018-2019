class LinearAnimation extends Animation 
{
    constructor(time,controlPoints)
    {
        super(time);
        this.controlPoints = controlPoints;
        this.index = 0;
    };

    getControlPoints()
    {
        return this.controlPoints;
    };

    getCurrentControlPoint()
    {
        return this.controlPoints[this.index];
    };

    update()
    {
        
    };

    apply()
    {

    };
};