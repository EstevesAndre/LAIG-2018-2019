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

        this.cylinder2 = null;

		this.createNurbs();
    };
    
    createNurbs()
    {
        var controlvertexes = [];

        controlvertexes.push([
            [ this.base,        0.0, 0.0, 1.0],
            [ this.base, -this.base, 0.0, 1.0],            
            [       0.0, -this.base, 0.0, 1.0],
            [-this.base, -this.base, 0.0, 1.0],
            [-this.base,        0.0, 0.0, 1.0],
            [-this.base,  this.base, 0.0, 1.0],
            [      0.0,   this.base, 0.0, 1.0],
            [ this.base,  this.base, 0.0, 1.0],
            [ this.base,        0.0, 0.0, 1.0]
        ]);

        controlvertexes.push([
            [ this.base,        0.0, this.height, 1.0],
            [ this.base, -this.base, this.height, 1.0],            
            [       0.0, -this.base, this.height, 1.0],
            [-this.base, -this.base, this.height, 1.0],
            [-this.base,        0.0, this.height, 1.0],
            [-this.base,  this.base, this.height, 1.0],
            [      0.0,   this.base, this.height, 1.0],
            [ this.base,  this.base, this.height, 1.0],
            [ this.base,        0.0, this.height, 1.0]
        ]);


        console.log(controlvertexes);
		var nurbsSurface = new CGFnurbsSurface(1, 8, controlvertexes);
        
        this.cylinder2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
    };

    display()
    {
        this.cylinder2.display();
    };
}