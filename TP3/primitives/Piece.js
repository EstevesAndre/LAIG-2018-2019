class Piece extends CGFobject 
{
    constructor(scene, size, texture, textureP1, textureP2, X, Y)
    {
        super(scene);

        this.size = size;
        this.texture = texture;
        this.textureP1 = textureP1;
        this.textureP1 = textureP1;
        this.textureP2 = textureP2;
        this.X = X;
        this.Y = Y;

        this.pins = [[0, 0, 0, 0, 0], 
                     [0, 0, 1, 0, 0],
                     [0, 0, 2, 0, 0],
                     [0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0]];

        this.pinSpaces = [];

        this.struct = new Box(scene, this.size, this.size, 0.2);

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.texture);

        this.createPins();

    };

    createPins()
    {
        var tmhX = this.size * 0.9/5;
        var tmhY = this.size * 0.9/5;

        let space = 0.0;
        var edgeX = space * 5;
        var edgeY = space * 5;
        
        for(let i = -this.size * 0.9 / 2.0 - edgeY; i < this.size * 0.9 / 2.0 + edgeY -0.0005; i += tmhY + space)
        {
            let line = [];
            for(let j = -this.size * 0.9 / 2.0 - edgeX; j < this.size * 0.9 / 2.0 + edgeX - 0.0005; j+= tmhX + space)
            {                
                line.push(new Rectangle(this.scene,j,i,j+tmhX,i+tmhY));
            }
            this.pinSpaces.push(line);
        }
        console.log(this.pinSpaces);
    };
    
    display()
    {
        this.scene.pushMatrix();
            this.scene.translate(this.size/2.0, this.size/2.0, 0.21);
            for(let i = 0; i < this.pinSpaces.length; i++)
            {                   
                for(let j = 0; j < this.pinSpaces[i].length; j++)
                {   
                    if(this.pins[i][j] == 0)
                        this.def.setTexture(this.textureP1);
                    else if (this.pins[i][j] == 1)
                        this.def.setTexture(this.textureP2);
                    else
                        this.def.setTexture(this.texture);
                    this.def.apply();
                    this.pinSpaces[i][j].display();
                }            
            }
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.def.setTexture(this.texture);
            this.def.apply();
            this.struct.display();
        this.scene.popMatrix();
    };
        
};