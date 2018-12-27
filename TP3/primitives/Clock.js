class Clock extends CGFobject {

    constructor(scene)
    {
        super(scene)

        this.active = false;

        this.clockTexture = new CGFappearance(this.scene);
        this.clockTexture.loadTexture("images/clock.png");
        this.clockTexture.setAmbient(1,1,1,1);

        this.texture0 = new CGFappearance(this.scene);
        this.texture0.loadTexture("images/0.png");
        this.texture0.setAmbient(1,1,1,1);

        this.texture1 = new CGFappearance(this.scene);
        this.texture1.loadTexture("images/1.png");
        this.texture1.setAmbient(1,1,1,1);

        this.texture2 = new CGFappearance(this.scene);
        this.texture2.loadTexture("images/2.png");
        this.texture2.setAmbient(1,1,1,1);

        this.texture3 = new CGFappearance(this.scene);
        this.texture3.loadTexture("images/3.png");
        this.texture3.setAmbient(1,1,1,1);

        this.texture4 = new CGFappearance(this.scene);
        this.texture4.loadTexture("images/4.png");
        this.texture4.setAmbient(1,1,1,1);

        this.texture5 = new CGFappearance(this.scene);
        this.texture5.loadTexture("images/5.png");
        this.texture5.setAmbient(1,1,1,1);

        this.texture6 = new CGFappearance(this.scene);
        this.texture6.loadTexture("images/6.png");
        this.texture6.setAmbient(1,1,1,1);

        this.texture7 = new CGFappearance(this.scene);
        this.texture7.loadTexture("images/7.png");
        this.texture7.setAmbient(1,1,1,1);

        this.texture8 = new CGFappearance(this.scene);
        this.texture8.loadTexture("images/8.png");
        this.texture8.setAmbient(1,1,1,1);

        this.texture9 = new CGFappearance(this.scene);
        this.texture9.loadTexture("images/9.png");
        this.texture9.setAmbient(1,1,1,1);

        this.clockPlane = new Rectangle(scene, 0, 0, 8.49, 2.56);

        this.digit = new Rectangle(scene, 0, 0, 1.40, 2.56);
    };

    activate(time)
    {
        this.active = true;

        this.plays = 0;
        this.playClock = time;
    }

    display()
    {
        this.scene.pushMatrix();
            this.clockTexture.apply();
            this.scene.scale(0.03, 0.03, 0.03);
            this.scene.translate(-4.2, 16.6, 0.1);
            this.clockPlane.display();      
        this.scene.popMatrix();  
    };
   
};