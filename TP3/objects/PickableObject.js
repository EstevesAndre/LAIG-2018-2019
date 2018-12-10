class PickableObject extends Rectangle 
{
    constructor(scene, x1, y1, x2, y2, texture)
    {
        super(scene,x1, y1, x2, y2);
        
        this.texture = texture;
        this.isPicked = false;

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,0,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.texture);
    }

    applyTexture()
    {
        if(this.isPicked)
        {
            this.def.apply();
        }
    }

    togglePicked()
    {
        this.isPicked = !this.isPicked;
    }
};