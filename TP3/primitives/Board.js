const HUMAN = 0;
const AI = 1;

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
        this.piecePicked = null;
        this.validMoves = [[false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false] ];
        
        this.playing = false;

        this.squareSize = (1.0/this.npartsX);
        this.pieceSize = (1.0/this.npartsX) * 0.8;

        this.stateMachine = new StateMachine(this);

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.textureP1);
                
        this.createSpaces();
    };

    newGame(mode, difficulty)
    {
        this.playing = true;
        this.pieces = [];
        this.createPieces();
        
        this.difficulty = difficulty;
        this.resetValidMoves();

        this.stateMachine.getPrologRequest("handshake");

        switch(mode)
        {
            case 'Player vs Player':
                this.Player1 = HUMAN;
                this.Player2 = HUMAN;
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                break;
            case 'Player vs AI':
                this.Player1 = HUMAN;
                this.Player2 = AI;
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                break;
            case 'AI vs Player':
                this.Player1 = AI;
                this.Player2 = HUMAN;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                break;
            case 'AI vs AI':
                this.Player1 = AI;
                this.Player2 = AI;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                break;
            default:
                this.playing = false;
                console.log("THAT WAS NOT SUPOSSED TO ENTER HERE!");
                break;
        }
    };

    createSpaces()
    {
        var tmhX = 1.0/this.npartsX;
        var tmhY = 1.0/this.npartsY;

        for(let i = -0.5; i < 0.5 - 0.0005; i += tmhY)
        {
            let line = [];
            for(let j = -0.5; j < 0.5 - 0.0005; j += tmhX)
            {                
                line.push(new Rectangle(this.scene,j,i,j+tmhX,i+tmhY));
            }
            this.spaces.push(line);
        }
    };

    createPieces()
    {
        for(let i = 0; i < this.npartsX * 2; i++)
        {
            if(i < this.npartsX)
                this.pieces.push(new Piece(this.scene, "p" + (i+1), this.pieceSize, this.texturePiece1, this.textureP1, this.textureP2, 1, i+1));
            else
                this.pieces.push(new Piece(this.scene, "p" + String.fromCharCode(65 - this.npartsX + i), this.pieceSize, this.texturePiece2, this.textureP1, this.textureP2, this.npartsY, i+1-this.npartsX));
        }
    };

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
                if(this.validMoves[i][j])
                    this.def.setTexture(this.textureSelected);  
                else if((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0))
                    this.def.setTexture(this.textureP1);
                else                
                    this.def.setTexture(this.textureP2);

                this.def.apply();
                this.scene.registerForPick(100 * (i + 1) + 10 * (j + 1), this.spaces[i][j]);
            
                this.spaces[i][j].display();
            }            
        }
    };

    displayPieces()
    {
        for(let i = 0; i < this.pieces.length; i++)
        {      
            if(this.pieces[i].captured)
                continue;

            this.scene.pushMatrix();
                if(this.pieces[i].isMoving) 
                    this.pieces[i].animation.apply(this.scene, false);                    
                
                this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 0);
                this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);                
                
                this.pieces[i].display();
            this.scene.popMatrix(); 
        }
    };

    getBoard()
    {
        var board = new Array(this.npartsY);
        
        for(var i = 0; i < this.npartsY; i++)
        {
            board[i] = new Array(this.npartsX).fill("e");
        }

        for(var i = 0; i < this.pieces.length; i++)
        {
            if(!this.pieces[i].captured)
                board[this.pieces[i].X - 1][this.pieces[i].Y - 1] = this.pieces[i].name;
        }

        return JSON.stringify(board).replace(/"/g, '');
    };

    setBoard(board)
    {
        var board_str = "<" + board.replace(/\[/g, '').replace(/\]/g, '') + ">";
        board_str = board_str.replace(/,/g, "><");
        board_str = (board_str.match(/<(.*?)>/g).map(function(val){ return val.replace(/>/g, '');})).map(function(val){ return val.replace(/</g, '');});;
        
        for(var i = 0; i < this.pieces.length; i++)
        {
            if(board_str.indexOf(this.pieces[i].name) == -1)
            {
                this.pieces[i].X = -1;
                this.pieces[i].Y = -1;
                this.pieces[i].captured = true;
            }
        }

        for(var i = 0; i < board_str.length; i++)
        {
            if(board_str[i] != "e")
            {
                for(var j = 0; j < this.pieces.length; j++)
                {
                    if(this.pieces[j].name == board_str[i])
                    {
                        this.pieces[j].X = Math.floor(i / this.npartsY) + 1;
                        this.pieces[j].Y = (i % this.npartsY) + 1;
                        break; 
                    }
                }
            }
        }
    };

    setValidMoves(validCoords)
    {
        validCoords = validCoords.substring(1,validCoords.length - 1);        
        let points = (validCoords.match(/\[(.*?)\]/g).map(function(val){ return val.replace(/\[/g, '');})).map(function(val){ return val.replace(/\]/g, '');});

        let validMoves = new Array(this.npartsY);        
        for(var i = 0; i < this.npartsY; i++) validMoves[i] = new Array(this.npartsX).fill(false);
        
        points.forEach(element => {
            let coords = element.split(',').map(function(item) { return parseInt(item, 10); });
            validMoves[coords[0] - 1][coords[1] - 1] = true;
        });

       this.validMoves = validMoves;
    };

    resetValidMoves()
    {
        this.validMoves = [[false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false] ];
    };

    capturePiece(square)
    {
        for(let i = 0; i < this.pieces.length; i++)
        {                     
            if(this.pieces[i].X == square[0] && this.pieces[i].Y == square[1])
            {
                this.pieces[i].X = 0;
                this.pieces[i].Y = 0;
                this.pieces[i].captured = true;
                break;
            }
        }
    };

    movePiece(piece, square)
    {
        for(let i = 0; i < this.pieces.length; i++)
        {                     
            if(this.pieces[i].name == piece)
            {
                let oldX = this.pieces[i].X;
                let oldY = this.pieces[i].Y;
                this.pieces[i].X = square[0];
                this.pieces[i].Y = square[1];

                this.stateMachine.isPieceMoving = true;
                this.pieces[i].setAnimation(oldX, oldY, this.squareSize, this.pieceSize);
                break;
            }
        }
    };   

    update(time)
    {
        this.pieces.forEach(function(piece) {
            piece.update(time);
        });
         
        this.stateMachine.update();        
    };
};