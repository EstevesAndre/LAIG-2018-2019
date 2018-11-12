class Vehicle extends CGFobject 
{
    constructor(scene)
    {
        super(scene);
        
        // wing
        this.wing_angRot = Math.PI/200;
        this.wing_middle = new Cylinder(this.scene, 0.1, 0.1, 0.15, 6, 1);
        this.wing_part = new Cylinder2(this.scene, 0.1, 0.1, 1.0, 8, 4);
        this.wing_outter = new Torus(this.scene, 0.05, 1.0, 6, 32);
        this.wing_propeller = this.makeSurface
            (12, 6, 3, 6, 
            [
                [
                    [0.0,  0.0, 0.0, 1 ],
                    [0.0, -0.05, 0.02, 1 ],
                    [0.0, -0.07, 0.08, 1 ],
                    [0.0,  0.0, 0.12, 1 ],
                    [0.0,  0.07, 0.08, 1 ],
                    [0.0,  0.05, 0.02, 1 ],
                    [0.0,  0.0, 0.0, 1 ]								
                ],
                [
                    [0.33,  0.0, 0.01, 1 ],
                    [0.33, -0.07, 0.03, 1 ],
                    [0.33, -0.07, 0.09, 1 ],
                    [0.33,  0.0, 0.13, 1 ],
                    [0.33,  0.07, 0.09, 1 ],
                    [0.33,  0.05, 0.03, 1 ],
                    [0.33,  0.0, 0.01, 1 ]								
                ],
                [
                    [0.66,  0.0, 0.1, 1 ],
                    [0.66, -0.045, 0.11, 1 ],
                    [0.66, -0.4, 0.14, 1 ],
                    [0.66,  0.0, 0.16, 1 ],
                    [0.66,  0.4, 0.14, 1 ],
                    [0.66,  0.045, 0.11, 1 ],
                    [0.66,  0.0, 0.1, 1 ]								
                ],
                [
                    [0.92,  0.0, 0.2, 1 ],
                    [0.92, -0.04, 0.22, 1 ],
                    [0.92, -0.3, 0.28, 1 ],
                    [0.92,  0.0, 0.32, 1 ],
                    [0.92,  0.3, 0.28, 1 ],
                    [0.92,  0.04, 0.22, 1 ],
                    [0.92,  0.0, 0.2, 1 ]								
                ]
            ]
        );
        
        this.body = this.makeSurface
            (6, 5, 4, 2,
            [
                [
                    [0.5, -0.5,  1.0, 1],
                    [0.6, -0.5, -0.5, 1],
                    [0.5, -0.5, -1.0, 1]
                ],
                [
                    [0.5, 0.5,  1.0, 1],
                    [0.6, 0.5, -0.5, 1],
                    [0.5, 0.5, -1.0, 1]
                ],
                [
                    [-0.5, 0.5,  1.0, 1],
                    [-0.6, 0.5, -0.5, 1],
                    [-0.5, 0.5, -1.0, 1]
                ],
                [
                    [-0.5, -0.5,  1.0, 1],
                    [-0.6, -0.5, -0.5, 1],
                    -[0.5, -0.5, -1.0, 1]
                ],
                [
                    [0.5, -0.5,  1.0, 1],
                    [0.6, -0.5, -0.5, 1],
                    [0.5, -0.5, -1.0, 1]
                ]
            ]
        );

        this.side_connector = new Cylinder2(this.scene, 0.2, 0.4, 0.7, 32, 3);
        this.torus = new Torus(this.scene, 0.75, 1, 60,60);
    };

    makeSurface(npartsU, npartsV, degree1, degree2, controlvertexes) {
			
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		return new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	};
    
    display()
    {
        this.scene.pushMatrix();            
            this.scene.translate(2,0,2); 
            this.scene.rotate(Math.PI, 0,1,0); 
            this.displayWing();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();       
            this.scene.translate(-2,0,2);  
            this.displayWing();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();            
            this.scene.translate(2,0.5,-2);
            this.scene.rotate(Math.PI, 0,1,0);
            this.scene.scale(1.3,1.3,1.3);
            this.displayWing();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();         
            this.scene.translate(-2,0.5,-2);
            this.scene.scale(1.3,1.3,1.3);
            this.displayWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.25,0,2.0);
            this.scene.rotate(-Math.PI/2.0, 0,1,0);
            this.scene.scale(1,0.15,1);
            this.side_connector.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.25,0,2.0);
            this.scene.rotate(Math.PI/2.0, 0,1,0);
            this.scene.scale(1,0.15,1);
            this.side_connector.display();
        this.scene.popMatrix();
        

        this.scene.pushMatrix();
            this.scene.scale(0.75,1,2);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            // this.torus.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.body.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();

        this.scene.popMatrix();
        
        // Need to be changed
        this.wing_angRot += 0.1;
        this.wing_angRot %= 2*Math.PI;
    };

    displayWing()
    {
        this.scene.pushMatrix();        
            this.scene.scale(0.75,0.75,0.75);

            this.scene.pushMatrix();
                this.scene.pushMatrix();
                    this.scene.rotate(-Math.PI/2.0, 1,0,0);
                    this.scene.translate(0,0,-0.075);
                    this.wing_middle.display();
                this.scene.popMatrix();

                this.scene.translate(0,-0.09,0);            
                this.scene.scale(1,0.5,1);

                this.scene.rotate(Math.PI/2.0, 0,1,0);
                this.wing_part.display();

                this.scene.rotate(120*Math.PI/180.0, 0,1,0);
                this.wing_part.display();
                
                this.scene.rotate(120*Math.PI/180.0, 0,1,0);
                this.wing_part.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.scale(1,2.8,1);
                this.scene.rotate(Math.PI/2.0, 1,0,0);
                this.wing_outter.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0,0.035,0.0);
                
                this.scene.rotate(Math.PI/3.0 + this.wing_angRot, 0,1,0);
                this.wing_propeller.display();

                this.scene.rotate(2*Math.PI/3.0, 0,1,0);
                this.wing_propeller.display();

                this.scene.rotate(2*Math.PI/3.0, 0,1,0);
                this.wing_propeller.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    };

};