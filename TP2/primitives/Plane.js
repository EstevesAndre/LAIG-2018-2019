class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV)
    {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.plane = null;
        this.createSurface();
    };

    createSurface()
    {
        var controlvertexes = [];
        var controlPointsV = [];
        let xdiv = this.npartsV / 2;
        let zdiv = this.npartsU / 2;

        for(let j = 0; j <= this.npartsU; j++)
        {
            controlPointsV = [];
            for(let i = 0; i <= this.npartsV; i++)
            {
                controlPointsV.push([xdiv - j, 0, -zdiv + i, 1 ]);
            }
            controlvertexes.push(controlPointsV);
        }

        console.log(controlvertexes);

        this.makeSurface(this.npartsU, // degree on U: npartsU + 1 control vertexes U
						 this.npartsV, // degree on V: npartsV + 1 control vertexes on V
						controlvertexes
                        );

    };
    
    makeSurface(degree1, degree2, controlvertexes) {
		
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        var obj = new CGFnurbsObject(this.scene, 20, 20, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
        
		this.plane = obj;
    };
    
    display()
    {
        if(this.plane != null)
            this.plane.display();        
    };
   
};