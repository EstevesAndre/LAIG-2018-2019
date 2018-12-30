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
        this.capturedCount = 0;

        this.validMoves = [[false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false],
                            [false, false, false, false, false, false] ];
        
        this.playing = false;
        this.videoPlaying = true;
        this.initializeVideo();

        this.moves = [
            {type: "piece", name: "p3", X: 2, Y: 3},
            {type: "pin", name: "p2", X: 0, Y: 4},
            {type: "pin", name: "p2", X: 0, Y: 3},
            {type: "piece", name: "pC", X: 5, Y: 3},
            {type: "pin", name: "pD", X: 1, Y: 0},
            {type: "pin", name: "pB", X: 1, Y: 2}
        ];

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
        this.videoPlaying = false;
        this.moves = [];
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
        this.pieceHolder = new Box(this.scene,0.35,1.05,0.075);        
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
            this.scene.translate(0,0.175,0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.displayBoard();
        this.scene.popMatrix();

        if(!this.videoPlaying)
        {
            this.scene.pushMatrix();
                this.scene.translate(0,0.175,0);
                this.displayPieces();
                this.clock.display();
            this.scene.popMatrix();
        }
        else 
        {            
            this.scene.pushMatrix();
                this.scene.translate(0,0.175,0);
                this.videoDisplay();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
            this.scene.translate(0.525,-0.7,0);
            this.scene.rotate(Math.PI/2.0, 0,0,1);            
            this.def.setTexture(this.textureP2);
            this.def.apply();
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
            this.scene.pushMatrix();
                if(this.pieces[i].isMoving) 
                    this.pieces[i].animation.apply(this.scene, false);                    
                
                if(!this.pieces[i].captured)
                {
                    this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 0);                    
                    this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
                }
                else 
                {
                    this.scene.translate(this.pieces[i].X, this.pieces[i].Y, 0.075);
                    this.pieces[i].isMoving ?   this.scene.rotate(-Math.PI / (2.0 + this.pieces[i].animation.timeElapsed / this.pieces[i].animation.time * 10), 0, 0, 1) : 
                                                this.scene.rotate(-Math.PI / 12.0, 0, 0, 1);                    
                }
                
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
                let oldX = 0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize;
                let oldY = -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize;                
                this.pieces[i].X = 0.35 - (this.capturedCount % (this.pieces.length / 2)) * this.squareSize - (this.capturedCount >= this.pieces.length/2 ?  0.0 : 0.03);
                this.pieces[i].Y = (this.capturedCount >= this.pieces.length/2 ?  0.075 : -0.06) - 0.75;

                this.pieces[i].setAnimation(oldX, oldY, true);
                this.capturedCount++;
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
        if(validCoords == null)
            return;
        
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
                let oldX = 0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize;
                let oldY = -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize;                
                this.pieces[i].X = 0.35 - (this.capturedCount % (this.pieces.length / 2)) * this.squareSize - (this.capturedCount >= this.pieces.length/2 ?  0.0 : 0.03);
                this.pieces[i].Y = (this.capturedCount >= this.pieces.length/2 ?  0.075 : -0.06) - 0.75;
                this.pieces[i].setAnimation(oldX, oldY, true);

                if(!this.videoPlaying) this.insertNewMove('capture', this.pieces[i].name, square[0], square[1]);
                this.capturedCount++;
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
                this.pieces[i].setAnimation(oldX, oldY);
                if(!this.videoPlaying) this.insertNewMove('piece', piece, square[0], square[1]);
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
    
    setPinCode(pieceIndex, pinX, pinY)
    {
        this.pieces[pieceIndex].pins[pinX][pinY].setPinCode();                    
        if(!this.videoPlaying) this.insertNewMove('pin', this.pieces[pieceIndex].name, pinX, pinY);
    };

    insertNewMove(type, pieceName, newX, newY)
    {
        let move = {
            'type' : type,
            'name' : pieceName,
            'X' : newX,
            'Y' : newY
        };

        this.moves.push(move);
    };

    initializeVideo()
    {
        this.pieces = [];
        this.createPieces();
    };

    videoDisplay()
    {
        //console.log(this.moves);
        //console.log(this.pieces);
        for(let i = 0; i < this.pieces.length; i++)
        {
            this.scene.pushMatrix();
                if(this.pieces[i].isMoving) 
                    this.pieces[i].animation.apply(this.scene, false);                    
                
                if(!this.pieces[i].captured)
                {
                    this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 0);                    
                    this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
                }
                else 
                {
                    this.scene.translate(this.pieces[i].X, this.pieces[i].Y, 0.075);
                    this.pieces[i].isMoving ?   this.scene.rotate(-Math.PI / (2.0 + this.pieces[i].animation.timeElapsed / this.pieces[i].animation.time * 10), 0, 0, 1) : 
                                                this.scene.rotate(-Math.PI / 12.0, 0, 0, 1);                    
                }
                
                this.pieces[i].display();
            this.scene.popMatrix();
        }
    };

};