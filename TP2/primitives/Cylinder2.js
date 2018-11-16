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

        this.cylinder = null;

		this.createNurbs();
    };
    
    createNurbs()
    {
        var controlvertexes = [];
        controlvertexes.push(
            [
                [0.0, -this.base, 0.0, 1.0],
                [-this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
                [-this.base, 0.0, 0.0, 1.0],
                [-this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
                [0.0, this.base, 0.0, 1.0],
                [this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
                [this.base, 0.0, 0.0, 1.0],
                [this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
                [0.0, -this.base, 0.0, 1.0]                
            ],
            [
                [0.0, -this.top, this.height, 1.0],
                [-this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
                [-this.top, 0.0, this.height, 1.0],
                [-this.top, this.top, this.height, Math.sqrt(2) / 2.0],
                [0.0, this.top, this.height, 1.0],
                [this.top, this.top, this.height, Math.sqrt(2) / 2.0],
                [this.top, 0.0, this.height, 1.0],
                [this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
                [0.0, -this.top, this.height, 1.0]                 
            ]   
        );

		var nurbsSurface = new CGFnurbsSurface(1, 8, controlvertexes);        
        this.cylinder = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
    };

    display()
    {
        this.cylinder.display();
    };
}