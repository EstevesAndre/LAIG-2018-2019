class Board extends CGFobject 
{
    constructor(scene, npartsX, npartsY, textureP1, textureP2, textureSelected, texturePiece1, texturePiece2)
    {
        super(scene);

        this.npartsX = npartsX;
        this.npartsY = npartsY;
        this.textureP1 = textureP1;
        this.textureP2 = textureP2;
        this.texturePiece1 = texturePiece1;
        this.texturePiece2 = texturePiece2;
        this.textureSelected = textureSelected;

        this.spaces = [];
        this.pieces = [];

        this.squareSize = (1.0/this.npartsX);
        this.pieceSize = (1.0/this.npartsX) * 0.8;

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.textureP1);
                
        this.createSpaces();
        this.createPieces(scene);
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

    createPieces(scene)
    {
        for(let i = 0; i < this.npartsX * 2; i++)
        {
            if(i < this.npartsX)
            {
                this.pieces.push(new Piece(scene, this.pieceSize, this.texturePiece1, this.textureP1, this.textureP2, 1, i+1));
            }
            else
            {
                this.pieces.push(new Piece(scene, this.pieceSize, this.texturePiece2, this.textureP1, this.textureP2, this.npartsY, i+1-this.npartsX));
            }
        }
    }

    display()
    {  
        this.displayPieces();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.displayBoard();
        this.scene.popMatrix();
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

    displayPieces()
    {
        for(let i = 0; i < this.pieces.length; i++)
        {                     
            this.scene.pushMatrix();
                    this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 0);
                    this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
                this.pieces[i].display();
            this.scene.popMatrix(); 
        }
    };
};