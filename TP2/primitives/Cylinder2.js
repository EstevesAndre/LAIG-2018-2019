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
        var angle = (2* Math.PI) / this.slices;

        var controlvertexes = [];
        var controlPointsV = [];

        for(let k = 0; k <= 1; k++)
        {
            controlPointsV = [];			

            for(let i = 0; i <= this.slices; i++)
            {
                controlPointsV.push(
                    [   
                        Math.cos(i * angle) * (k == 0 ? this.base : this.top), 
                        Math.sin(-i * angle) * (k == 0 ? this.base : this.top),
                        (k == 0 ? 0 : this.height),
                        1
                    ]);
            }           
            controlvertexes.push(controlPointsV);
        }

		var nurbsSurface = new CGFnurbsSurface(1, this.slices, controlvertexes);
        
        this.cylinder2 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
    };

    display()
    {
        this.cylinder2.display();
    };
}