class Pin extends Rectangle
{
    constructor(scene, name, x1, y1, x2, y2)
    {
        super(scene, x1, y1, x2, y2);

        this.name = name;
        this.isForSelection = false;
        this.selectionAnimation = null;
        this.pinSelected = new SelectedSquare(this.scene, (x2 - x1) * 1.05, x2 - x1);       
    };

    setPinSelectable(bool)
    {
        console
        this.isForSelection = bool;
    };

    createSelectAnimation()
    {        
        this.selectionAnimation = new LinearAnimation(3.5, [ [0,0,0], [0,0,0.075], [0,0,0] ], true); //new ScaleAnimation(2.5, [ [1,1,1], [0,0,0], [1,1,1] ], true);
    };    

    display()
    {
        this.drawElements(this.scene.gl.TRIANGLES);

        if(this.isForSelection)
        {
            if(this.selectionAnimation == null)
                this.createSelectAnimation();

            this.scene.pushMatrix();
                this.selectionAnimation.apply(this.scene);
                
                this.pinSelected.display();
            this.scene.popMatrix();
        }
    };

    update(time)
    {
        if(this.isForSelection)
        {
            if(this.selectionAnimation == null)
                this.createSelectAnimation();

            this.selectionAnimation.update(time/1000);
        }
    };
};