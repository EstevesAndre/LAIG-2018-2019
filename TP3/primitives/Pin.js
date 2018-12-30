class Pin extends Rectangle
{
    constructor(scene, name, x1, y1, x2, y2, pinCode)
    {
        super(scene, x1, y1, x2, y2);
    
        this.name = name;
        this.pinCode = pinCode || '.'; // default

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.isForSelection = false;
        this.selectionAnimation = null;

        this.pinSelected = new SelectedSquare(this.scene, (x2 - x1) * 1.05, (x2 - x1) * 0.8);

        this.windowTexture = new CGFappearance(this.scene);
        this.windowTexture.setAmbient(0,0.2,0.7,1);
    };

    setPinCode(newPinCode)
    {
        if(this.name.charCodeAt(1) >= 65)
            this.pinCode = newPinCode || 'o';
        else
            this.pinCode = newPinCode || 'x';
    };

    unpin()
    {
        this.pinCode = '.';
        this.isForSelection = false;
    };

    setPinSelectable(bool)
    {
        if(this.pinCode == '.')
            this.isForSelection = bool;
    };

    createSelectAnimation()
    {        
        this.selectionAnimation = new ScaleAnimation(2.5, [ [1,1,1], [0.25,0.25,1], [1,1,1] ], true);
    };    

    display()
    {
        this.drawElements(this.scene.gl.TRIANGLES);

        if(this.isForSelection && this.pinCode == '.')
        {
            if(this.selectionAnimation == null)
                this.createSelectAnimation();

            this.scene.pushMatrix();
                this.scene.translate(this.x1 + (this.x2-this.x1)/2,this.y2 + (this.y1-this.y2)/2,0.01);
                this.selectionAnimation.apply(this.scene);
                this.windowTexture.apply();
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