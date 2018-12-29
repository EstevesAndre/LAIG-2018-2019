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

        this.clock = new Clock(scene, this);

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
        

        this.createPieceHolder();
        this.createSpaces();
    };

    newGame(mode, difficulty, time_per_move)
    {
        this.playing = true;
        this.pieces = [];
        this.createPieces();
        
        this.difficulty = difficulty;
        this.resetValidMoves();

        this.stateMachine.getPrologRequest("handshake");

        this.clock.enable(time_per_move);
        this.clock.start();

        switch(mode)
        {
            case 'Player vs Player':
                this.Player1 = HUMAN;
                this.Player2 = HUMAN;
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 10, 0), vec3.fromValues(-1.0, 0.0, 0.0));
                break;
            case 'Player vs AI':
                this.Player1 = HUMAN;
                this.Player2 = AI;
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 10, 0), vec3.fromValues(-1.0, 0.0, 0.0));
                break;
            case 'AI vs Player':
                this.Player1 = AI;
                this.Player2 = HUMAN;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(-5, 10, 0), vec3.fromValues(1.0, 0.0, 0.0));
                break;
            case 'AI vs AI':
                this.Player1 = AI;
                this.Player2 = AI;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(-5, 10, 0), vec3.fromValues(1.0, 0.0, 0.0));
                break;
            default:
                this.playing = false;
                console.log("THAT WAS NOT SUPOSSED TO ENTER HERE!");
                break;
        }
    };

    createPieceHolder()
    {
        this.pieceHolder = new Box(this.scene,0.2,1,0.075);        
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
        this.scene.pushMatrix();
            this.scene.translate(0,0.1,0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.displayBoard();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.1,0);
            this.displayPieces();
            this.clock.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5,-0.65,0);
            this.scene.rotate(Math.PI/2.0, 0,0,1);
            this.pieceHolder.display();
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

    preCaptureAnimation()
    {

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
                this.pieces[i].setAnimation(oldX, oldY);
                break;
            }
        }
    };   

    setPieceSelectable(type, bool = true)
    {
        if(type.charCodeAt(1) >= 65)
        {
            this.pieces.forEach(function(piece) {
                if(!piece.captured && piece.name.charCodeAt(1) >= 65)
                    piece.setPieceSelectable(bool);
            });
        }
        else
        {
            this.pieces.forEach(function(piece) {
                if(!piece.captured && piece.name.charCodeAt(1) < 65)
                    piece.setPieceSelectable(bool);
            });
        }        
    }

    setPinsSelectable(type, bool = true)
    {
        if(type == 'o')
        {
            this.pieces.forEach(function(piece) {
                if(!piece.captured && piece.name.charCodeAt(1) >= 65)
                    piece.setPinsSelectable(bool);
            });
        }
        else if(type == 'x')
        {
            this.pieces.forEach(function(piece) {
                if(!piece.captured && piece.name.charCodeAt(1) < 65)
                    piece.setPinsSelectable(bool);
            });
        }   
    }

    update(time)
    {
        this.pieces.forEach(function(piece) {
            piece.update(time);
        });
         
        this.stateMachine.update();  
        this.clock.update(time);
    };
};