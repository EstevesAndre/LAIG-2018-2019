class Cylinder2 extends CGFobject
{
    constructor(scene, base, top, height, slices, stacks) 
	{
		super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.cylinderUp = null;
        this.cylinderDown = null;

		this.createNurbs();
    };
    
    createNurbs()
    {
        var controlvertexes = [];
        controlvertexes.push(
            [
                [this.base, 0.0,         0.0, 1.0],
                [this.top, 0.0, this.height, 1.0]                
            ],
            [
                [this.base, this.base,         0.0, 1.0],
                [this.top,   this.top, this.height, 1.0]                
            ],
            [
                [-this.base, this.top,         0.0, 1.0],
                [-this.top,  this.top, this.height, 1.0]                
            ],
            [
                [-this.base, 0.0,         0.0, 1.0],
                [-this.top,  0.0, this.height, 1.0]                
            ]            
        );

		var nurbsSurface = new CGFnurbsSurface(3, 1, controlvertexes);        
        this.cylinderUp = new CGFnurbsObject(this.scene, this.slices/2.0, this.stacks, nurbsSurface);

        
        controlvertexes = [];
        controlvertexes.push(
            [
                [-this.base, 0.0,         0.0, 1.0],
                [-this.top, 0.0, this.height, 1.0]                
            ],
            [
                [-this.base, -this.base,         0.0, 1.0],
                [-this.top,   -this.top, this.height, 1.0]                
            ],
            [
                [this.base, -this.top,         0.0, 1.0],
                [this.top,  -this.top, this.height, 1.0]                
            ],
            [
                [this.base, 0.0,         0.0, 1.0],
                [this.top,  0.0, this.height, 1.0]                
            ]            
        );

		nurbsSurface = new CGFnurbsSurface(3, 1, controlvertexes);        
        this.cylinderDown = new CGFnurbsObject(this.scene, this.slices/2.0, this.stacks, nurbsSurface);
    };

    display()
    {
        this.cylinderUp.display();
        this.cylinderDown.display();
    };
}