class Plant extends CGFobject 
{
    constructor(scene, textureLeaves)
    {
        super(scene);

        this.textureLeaves = textureLeaves;
        this.textureDirt = textureDirt;
        this.textureVase = textureVase;

        this.leaveTop = new Patch
            (this.scene,3,3, 12,8,
            [
                [
                    [0.0, 0.0,  0.0, 1.0],
                    [0.0, 0.0,  0.0, 1.0],
                    [0.0, 0.0,  0.0, 1.0]
                ],
                [
                    [2.0, 1.2,  0.8, 1.0],
                    [2.3, 1.5,  0.0, 1.0],
                    [2.0, 1.2,  -0.8, 1.0]
                ],
                [
                    [3.0, 0.7,  0.0, 1.0],
                    [3.0, 0.7,  0.0, 1.0],
                    [3.0, 0.7,  0.0, 1.0]
                ]
            ]                
        );

        this.leaveBottom = new Patch
            (this.scene,3,3, 12,8,
            [
                [
                    [0.0, 0.0,  0.0, 1.0],
                    [0.0, 0.0,  0.0, 1.0],
                    [0.0, 0.0,  0.0, 1.0]
                ],
                [
                    [2.0, 1.2,  -0.8, 1.0],
                    [2.3, 1.5,  0.0, 1.0],
                    [2.0, 1.2,  0.8, 1.0]
                ],
                [
                    [3.0, 0.7,  0.0, 1.0],
                    [3.0, 0.7,  0.0, 1.0],
                    [3.0, 0.7,  0.0, 1.0]
                ]
            ]                
        );

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);

        // this.supportBars = new Cylinder(this.scene, 0.04, 0.04, 1.0, 8, 2);
        // this.side_connector = new Cylinder2(this.scene, 0.2, 0.4, 0.7, 8, 3);
    };
    
    display()
    {
        this.def.setTexture(this.textureLeaves);
        this.scene.pushMatrix(); 
            this.def.apply();           
            this.leaveTop.display();
            this.leaveBottom.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix(); 
            this.def.apply();           
            this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
            this.leaveTop.display();
            this.leaveBottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();        
            this.def.apply();           
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.leaveTop.display();
            this.leaveBottom.display();
        this.scene.popMatrix();        

        this.scene.pushMatrix();
            this.def.apply();           
            this.scene.rotate(3 * Math.PI / 2.0, 0, 1, 0);
            this.leaveTop.display();
            this.leaveBottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); 
            this.def.apply();           
            this.scene.rotate(Math.PI / 6.0, 0, 1, 0);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / 8.0, 0, 0, 1);              
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / 8.0, 1, 0, 0);              
                this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / -8.0, 0, 0, 1);              
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / -8.0, 1, 0, 0);              
                this.scene.rotate(3 * Math.PI / 2.0, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix(); 
            this.def.apply();           
            this.scene.rotate(Math.PI / 3.0, 0, 1, 0);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / 4.0, 0, 0, 1);              
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / 4.0, 1, 0, 0);              
                this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / -4.0, 0, 0, 1);              
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI / -4.0, 1, 0, 0);              
                this.scene.rotate(3 * Math.PI / 2.0, 0, 1, 0);
                this.leaveTop.display();
                this.leaveBottom.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    };
};