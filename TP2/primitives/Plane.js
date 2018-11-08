class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV)
    {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        
        var nurbsSurface = new CGFnurbsSurface(
            1, 
            1, 
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

        this.plane = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it);
    };

    display()
    {
        this.plane.display();        
    };
   
};