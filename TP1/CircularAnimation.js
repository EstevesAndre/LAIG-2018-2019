class CircularAnimation extends Animation 
{
    constructor(time, center, radius, initialAngle, rotationAngle)
    {
        super(time);
        this.center = center;
        this.radius = radius;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;
    };

    getCenter()
    {
        return this.center;
    };

    getRadius()
    {
        return this.radius;
    };

    getInitialAngle()
    {
        return this.initialAngle;
    };

    getRotationAngle()
    {
        return this.rotationAngle;
    };

    setCenter(newCenter)
    {
        this.center = newCenter;
    };

    setRadius(newRadius)
    {
        this.radius = newRadius;
    };

    setInitialAngle(newInitialAngle)
    {
        this.initialAngle = newInitialAngle;
    };

    setRotationAngle(newRotationAngle)
    {
        this.rotationAngle = newRotationAngle;
    };
};