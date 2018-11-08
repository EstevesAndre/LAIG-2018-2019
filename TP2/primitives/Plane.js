class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV)
    {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        
        this.plane = null;

        this.makeSurface(
            1, // degree on U: degreeU + 1 control vertexes U
            1, // degree on V: degreeV + 1 control vertexes on V
            [	// U = 0
               [ // V = 0..1;
                    [0.5, 0.0, -0.5, 1 ],
                    [0.5, 0.0,  0.5, 1 ]								
               ],
               // U = 1
               [ // V = 0..1
                   [-0.5, 0.0, -0.5, 1 ],
                   [-0.5, 0.0, 0.5, 1 ]				 
               ]
           ]
        );
    };

    makeSurface(degree1, degree2, controlvertexes) {
		
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

        var obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
        
		this.plane = obj;
    };
    
    display()
    {
        this.plane.display();        
    };
   
};