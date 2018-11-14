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
            (12,8, 2,2,
            [
                [
                    [-0.5, 0.0,  1.0, 1.0],
                    [-0.5, 0.7, -0.25, 1.0],
                    [-0.5, 0.4, -2.0, 1.0]
                ],
                [
                    [0.0, -0.5,  2.5, 1.0],
                    [0.0, 0.9,  0.5, 1.0],
                    [0.0, 0.4, -2.5, 1.0]
                ],
                [
                    [0.5, 0.0,  1.0, 1.0],
                    [0.5, 0.7, -0.25, 1.0],
                    [0.5, 0.4, -2.0, 1.0]
                ]
            ]
        );

        this.bodySideRight = this.makeSurface
            (8,8, 2,2,
            [
                [
                    [0.5, 0.0,   1.0, 1.0],
                    [0.5, 0.7, -0.25, 1.0],
                    [0.5, 0.4,  -2.0, 1.0]
                ],
                [
                    [0.5, 0.0,   1.0, 1.0],
                    [1.2, -0.3, -0.25, 1.0],
                    [0.5, 0.4,  -2.0, 1.0]
                ],
                [
                    [0.5, 0.0,  1.0, 1.0],
                    [0.5, -1.0, -0.25, 1.0],
                    [0.5, 0.4, -2.0, 1.0]
                ]
            ]
        );

        this.bodySideLeft = this.makeSurface
            (8,8, 2,2,
            [
                [
                    [-0.5, 0.4,  -2.0, 1.0],
                    [-0.5, 0.7, -0.25, 1.0],
                    [-0.5, 0.0,   1.0, 1.0]
                ],
                [
                    [-0.5, 0.4,  -2.0, 1.0],
                    [-1.2, -0.3, -0.25, 1.0],
                    [-0.5, 0.0,   1.0, 1.0]
                ],
                [
                    [-0.5, 0.4, -2.0, 1.0],
                    [-0.5, -1.0, -0.25, 1.0],
                    [-0.5, 0.0,  1.0, 1.0]
                ]
            ]
        );

        this.bodyDown = this.makeSurface
            (12,8, 2,2,
            [
                [
                    [-0.5, 0.4, -2.0, 1.0],
                    [-0.5, -1.0, -0.25, 1.0],
                    [-0.5, -0.0,  1.0, 1.0]
                ],
                [
                    [0.0, 0.4, -2.5, 1.0],
                    [0.0, -1.2,  0.5, 1.0],
                    [0.0, -0.5,  2.5, 1.0]
                ],
                [
                    [0.5, 0.4, -2.0, 1.0],
                    [0.5, -1.0, -0.25, 1.0],
                    [0.5, 0.0,  1.0, 1.0]
                ]
            ]
        );


        this.supportBars = new Cylinder2(this.scene, 0.04, 0.04, 1.0, 8, 2);
        this.sphere = new Sphere(this.scene, 0.04, 12, 8);
        this.side_connector = new Cylinder2(this.scene, 0.2, 0.4, 0.7, 8, 3);
        
        this.blackTexture = new CGFappearance(this.scene);
        this.blackTexture.loadTexture("scenes/images/black.jpg");
        this.blackTexture.setAmbient(0.75,0.75,0.75,1);

        this.metalTexture = new CGFappearance(this.scene);
        this.metalTexture.loadTexture("scenes/images/propeller.png");
        this.metalTexture.setAmbient(0.25,0.25,0.25,1);
        this.metalTexture.setSpecular(0.7,0.7,0.7,1);

        this.bodyTexture = new CGFappearance(this.scene);
        this.bodyTexture.loadTexture("scenes/images/vehiclebody.jpg");
        this.bodyTexture.setAmbient(0.5,0.5,0.5,1);
        this.bodyTexture.setSpecular(0.7,0.7,0.7,1);
        
        this.windowTexture = new CGFappearance(this.scene);
        this.windowTexture.loadTexture("scenes/images/window.jpg");
        this.windowTexture.setAmbient(0.25,0.25,0.25,1);
        this.windowTexture.setSpecular(0.7,0.7,0.7,1);
    };

    makeSurface(npartsU, npartsV, degree1, degree2, controlvertexes) {
			
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		return new CGFnurbsObject(this.scene, npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	};
    
    display()
    {
        this.scene.pushMatrix();            
            this.scene.translate(2.25,0,1.5); 
            this.scene.rotate(Math.PI, 0,1,0); 
            this.displayWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.5,0,1.5);
            this.scene.rotate(-Math.PI/2.0, 0,1,0);
            this.scene.scale(1,0.15,1);
            this.blackTexture.apply();
            this.side_connector.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();       
            this.scene.translate(-2.25,0,1.5);  
            this.displayWing();
        this.scene.popMatrix();
                
        this.scene.pushMatrix();
            this.scene.translate(-1.5,0,1.5);
            this.scene.rotate(Math.PI/2.0, 0,1,0);
            this.scene.scale(1,0.15,1);
            this.blackTexture.apply();
            this.side_connector.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();            
            this.scene.translate(2.7,0.7,-2.5);
            this.scene.rotate(Math.PI, 0,1,0);
            this.scene.scale(1.3,1.3,1.3);
            this.displayWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.7,0.7,-2.5);
            this.scene.rotate(-Math.PI/2.0, 0,1,0);
            this.scene.scale(1.3,0.195,1.3);
            this.blackTexture.apply();
            this.side_connector.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();         
            this.scene.translate(-2.7,0.7,-2.5);
            this.scene.scale(1.3,1.3,1.3);
            this.displayWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.7,0.7,-2.5);
            this.scene.rotate(Math.PI/2.0, 0,1,0);
            this.scene.scale(1.3,0.195,1.3);
            this.blackTexture.apply();
            this.side_connector.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.scale(2.0,2.0,2.0);
            this.windowTexture.apply();
            this.body.display();
            this.bodyTexture.apply();
            this.bodyDown.display();
            this.bodySideRight.display();
            this.bodySideLeft.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.blackTexture.apply();
            this.displaySupportBars();
        this.scene.popMatrix();
        
        // Need to be changed
        this.wing_angRot += 0.1;
        this.wing_angRot %= 2*Math.PI;
    };

    displaySupportBars()
    {
        this.scene.pushMatrix();
            this.scene.translate(0.6, -0.9, 0.4);
            this.scene.rotate(Math.PI/2.0, 1,0,0);
            this.scene.scale(1,1,0.6);
            this.supportBars.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(-0.6, -0.9, 0.4);
            this.scene.rotate(Math.PI/2.0, 1,0,0);
            this.scene.scale(1,1,0.6);
            this.supportBars.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.6, -0.4, -2);
            this.scene.rotate(Math.PI/2.0, 1,0,0);
            this.scene.scale(1,1,1.1);
            this.supportBars.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(-0.6, -0.4, -2);
            this.scene.rotate(Math.PI/2.0, 1,0,0);
            this.scene.scale(1,1,1.1);
            this.supportBars.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.6, -1.5, -2.5);
            this.scene.scale(1,1,3.5);
            this.supportBars.display();
            this.sphere.display();
            this.scene.translate(0.0, 0.0, 1.0);
            this.sphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.6, -1.5, -2.5);
            this.scene.scale(1,1,3.5);
            this.supportBars.display();
            this.sphere.display();
            this.scene.translate(0.0, 0.0, 1.0);
            this.sphere.display();
        this.scene.popMatrix();
    }

    displayWing()
    {
        this.scene.pushMatrix();        
            this.scene.scale(0.75,0.75,0.75);
            
            this.metalTexture.apply();

            this.scene.pushMatrix();
                this.scene.pushMatrix();
                    this.scene.rotate(-Math.PI/2.0, 1,0,0);
                    this.scene.translate(0,0,-0.075);
                    this.wing_middle.display();
                this.scene.popMatrix();

                this.scene.translate(0,-0.09,0);            
                this.scene.scale(1,0.5,1);

                this.blackTexture.apply();

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
                
                this.metalTexture.apply();

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