class Clock extends CGFobject {

    constructor(scene, board)
    {
        super(scene)

        this.board = board;

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

        this.digit = new Rectangle(scene, 0, 0, 1.40, 2.16);
    };

    enable(time)
    {
        this.active = true;

        this.plays = 0;
        this.playClock = time;
    }

    disable()
    {
        this.active = false;
    }

    display()
    {
        this.scene.pushMatrix();
            this.clockTexture.apply();
            this.scene.scale(0.03, 0.03, 0.03);
            this.scene.translate(-4.2, 16.6, 0.1);
            this.clockPlane.display();      
        this.scene.popMatrix();  

        if(this.active)
        {
            this.scene.pushMatrix();
                this.applyNumberTexture(Math.floor(this.plays / 10));
                this.scene.scale(0.03, 0.03, 0.03);
                this.scene.translate(-3.65, 16.8, 0.15);
                this.digit.display();      
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.applyNumberTexture(Math.floor(this.plays % 10));
                this.scene.scale(0.03, 0.03, 0.03);
                this.scene.translate(-2.25, 16.8, 0.15);
                this.digit.display();      
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.applyNumberTexture(Math.floor(this.counting_clock / 100));
                this.scene.scale(0.03, 0.03, 0.03);
                this.scene.translate(-0.45, 16.8, 0.15);
                this.digit.display();      
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.applyNumberTexture(Math.floor((this.counting_clock % 100) / 10));
                this.scene.scale(0.03, 0.03, 0.03);
                this.scene.translate(0.95, 16.8, 0.15);
                this.digit.display();      
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.applyNumberTexture(Math.floor((this.counting_clock % 100) % 10));                
                this.scene.scale(0.03, 0.03, 0.03);
                this.scene.translate(2.35, 16.8, 0.15);
                this.digit.display();      
            this.scene.popMatrix();  
        }
    };

    addPlay()
    {
        this.plays++;
    }
   
    undoPlay()
    {
        this.plays--;
    }

    start()
    {
        this.counting_clock = this.playClock;
    }

    applyNumberTexture(n)
    {
        switch(n)
        {
            case 0:
            {
                this.texture0.apply();
            }
            break;
            case 1:
            {
                this.texture1.apply();
            }
            break;
            case 2:
            {
                this.texture2.apply();
            }
            break;
            case 3:
            {
                this.texture3.apply();
            }
            break;
            case 4:
            {
                this.texture4.apply();
            }
            break;
            case 5:
            {
                this.texture5.apply();
            }
            break;
            case 6:
            {
                this.texture6.apply();
            }
            break;
            case 7:
            {
                this.texture7.apply();
            }
            break;
            case 8:
            {
                this.texture8.apply();
            }
            break;
            case 9:
            {
                this.texture9.apply();
            }
            break;
        }
    }

    update(time)
    {
        if(!this.active) return;

        this.counting_clock -= time / 1000.0;

        if(this.counting_clock <= 0)
        {
            this.active = false;
            this.board.stateMachine.currentState = INACTIVE;
            this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
            this.board.playing = false;

            alert("Time is up!");
        }
    }
};