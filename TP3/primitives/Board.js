class Board extends CGFobject 
{
    constructor(scene, npartsX, npartsY, textureP1, textureP2, textureSelected)
    {
        super(scene);

        this.npartsX = npartsX;
        this.npartsY = npartsY;
        this.textureP1 = textureP1;
        this.textureP2 = textureP2;
        this.textureSelected = textureSelected;

        this.spaces = [];

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.textureP1);
                
        this.createSpaces();
        this.createBorder();
    };

    createSpaces()
    {
        var tmhX = 1.0/this.npartsX;
        var tmhY = 1.0/this.npartsY;

        let space = 0.0;
        var edgeX = space * this.npartsX;
        var edgeY = space * this.npartsY;
        
        for(let i = -0.5 - edgeY; i < 0.5 + edgeY -0.0005; i += tmhY + space)
        {
            let line = [];
            for(let j = -0.5 - edgeX; j < 0.5 + edgeX - 0.0005; j+= tmhX + space)
            {                
                line.push(new Rectangle(this.scene,j,i,j+tmhX,i+tmhY));
            }
            this.spaces.push(line);
        }
    };

    createBorder()
    {
       // this.upBorder = new Quadrilateral(this.scene,-0.6,-0.6, 0.6,-0.6, 0.5,-0.5, -0.5,-0.5);
    };

    display()
    {  
        this.displayBoard();
        this.displayBorder();
    };

    displayBoard()
    {
        this.def.apply();
        for(let i = 0; i < this.spaces.length; i++)
        {                     
            for(let j = 0; j < this.spaces[i].length; j++)
            {   
                if((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0))
                    this.def.setTexture(this.textureP1);
                else                
                    this.def.setTexture(this.textureP2);
                this.def.apply();
                this.spaces[i][j].display();
            }            
        }
    };

    displayBorder()
    {
        this.scene.pushMatrix();
            //this.leftBorder.display();
        this.scene.popMatrix();
    };
};