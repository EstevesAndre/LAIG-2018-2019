class Pin extends CGFobject
{
    constructor(scene, objSelected, objNotSelected, name, x1, y1, x2, y2, pinCode)
    {
        super(scene);
    
        this.name = name;
        this.pinCode = pinCode || '.'; // default

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        
        this.size = 2*(this.x2-this.x1);

        this.isForSelection = false;
        this.selectionAnimation = null;

        this.blended = objSelected ? true: false;
        this.objSelected = objSelected;
        this.objNotSelected = objNotSelected;

        this.objDefault = new Rectangle(scene, x1, y1, x2, y2);
        
        this.pinSelected = new SelectedSquare(this.scene, (x2 - x1) * 1.05, (x2 - x1) * 0.8);

        this.texture = new CGFappearance(this.scene);
        this.texture.setAmbient(0.2,0.2,0.7,1);
        this.texture.setSpecular(0.7,0.7,0.9,1);
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
        this.selectionAnimation = new ScaleAnimation(5, [ [1,1,1], [0.25,0.25,0.25], [1,1,1] ], true);
    };    

    display()
    {
        if(this.blended && this.objSelected.loaded && this.objNotSelected.loaded)
        {
            this.scene.pushMatrix();
                this.scene.translate(this.x1 + (this.x2-this.x1)/2,this.y2 + (this.y1-this.y2)/2,0);
                this.scene.scale(this.size,this.size,this.size*3);
                this.scene.rotate(Math.PI/2.0,1,0,0);
                if(this.pinCode == '.') this.objNotSelected.display();
                else this.objSelected.display();
            this.scene.popMatrix();
        }
        else this.objDefault.drawElements(this.scene.gl.TRIANGLES);
            

        if(this.isForSelection && this.pinCode == '.')
        {
            if(this.selectionAnimation == null)
                this.createSelectAnimation();

            this.scene.pushMatrix();
                this.scene.translate(this.x1 + (this.x2-this.x1)/2,
                                    this.y2 + (this.y1-this.y2)/2,
                                    0.1);
                this.selectionAnimation.apply(this.scene);
                this.texture.apply();
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