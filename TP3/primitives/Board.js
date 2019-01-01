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
        this.videoPlaying = false;
        this.moves = [];
        this.undoing = false;

        // this.moves = [
        //     {type: "piece", name: "p3", X: 2, Y: 3, oldX: 1, oldY: 3},
        //     {type: "pin", name: "p4", X: 0, Y: 0, oldX: null, oldY: null},
        //     {type: "pin", name: "p3", X: 0, Y: 2, oldX: null, oldY: null},
        //     {type: "piece", name: "pE", X: 5, Y: 5, oldX: 6, oldY: 5},
        //     {type: "pin", name: "pC", X: 4, Y: 2, oldX: null, oldY: null},
        //     {type: "pin", name: "pD", X: 4, Y: 1, oldX: null, oldY: null},
        //     {type: "piece", name: "p5", X: 2, Y: 5, oldX: 1, oldY: 5},
        //     {type: "pin", name: "p5", X: 0, Y: 2, oldX: null, oldY: null},
        //     {type: "pin", name: "p5", X: 0, Y: 1, oldX: null, oldY: null},
        //     {type: "piece", name: "pE", X: 4, Y: 5, oldX: 5, oldY: 5},
        //     {type: "pin", name: "pD", X: 4, Y: 3, oldX: null, oldY: null},
        //     {type: "pin", name: "pD", X: 4, Y: 2, oldX: null, oldY: null},
        //     {type: "capture", name: "pE", X: 4, Y: 5, oldX: -0.15000000000000002, oldY: 0.3166666},
        //     {type: "piece", name: "p5", X: 4, Y: 5, oldX: 2, oldY: 5},
        //     {type: "pin", name: "p5", X: 2, Y: 0, oldX: null, oldY: null},
        //     {type: "pin", name: "p5", X: 1, Y: 0, oldX: null, oldY: null},
        //     {type: "piece", name: "pD", X: 5, Y: 4, oldX: 6, oldY: 4},
        //     {type: "pin", name: "pD", X: 3, Y: 3, oldX: null, oldY: null},
        //     {type: "pin", name: "pD", X: 2, Y: 0, oldX: null, oldY: null},
        //     {type: "piece", name: "p3", X: 4, Y: 3, oldX: 2, oldY: 3},
        //     {type: "pin", name: "p4", X: 1, Y: 1, oldX: null, oldY: null},
        //     {type: "pin", name: "p4", X: 0, Y: 1, oldX: null, oldY: null},
        //     {type: "capture", name: "p5", X: 4, Y: 5, oldX: -0.15000000000000002, oldY: 0.3166666},
        //     {type: "piece", name: "pD", X: 4, Y: 5, oldX: 5, oldY: 4},
        //     {type: "pin", name: "pF", X: 4, Y: 2, oldX: null, oldY: null},
        //     {type: "pin", name: "pB", X: 4, Y: 2, oldX: null, oldY: null}
        // ];

        this.squareSize = (1.0/this.npartsX);
        this.pieceSize = (1.0/this.npartsX) * 0.8;

        this.stateMachine = new StateMachine(this);

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.textureP1);
        
        this.createPieceHolder();
        this.createSpaces();
        this.createInitialPieces();
    };

    newGame(mode, difficulty, time_per_move)
    {
        this.playing = true;
        this.videoPlaying = false;
        this.moves = [];
        this.resetPieceCoords('initial');

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
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 11, 0), vec3.fromValues(-1.5, 0.0, 0.0));
                this.setPieceSelectable('p1');
                break;
            case 'Player vs AI':
                this.Player1 = HUMAN;
                this.Player2 = AI;
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 11, 0), vec3.fromValues(-1.5, 0.0, 0.0));
                this.setPieceSelectable('p1');
                break;
            case 'AI vs Player':
                this.Player1 = AI;
                this.Player2 = HUMAN;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                this.setPieceSelectable('p1', false);
                this.setPieceSelectable('pA');
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(-5, 11, 0), vec3.fromValues(1.5, 0.0, 0.0));
                break;
            case 'AI vs AI':
                this.Player1 = AI;
                this.Player2 = AI;
                this.stateMachine.currentState = AI1_SEND_BOARD;
                this.setPieceSelectable('p1', false);
                this.setPieceSelectable('pA', false);
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(0, 10, 9), vec3.fromValues(0.0, 0.0, -3.0));
                break;
            default:
                this.playing = false;
                this.clock.disable();
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

    createInitialPieces()
    {
        for(let i = 0; i < this.npartsX * 2; i++)
        {
            if(i < this.npartsX)
                this.pieces.push(new Piece(this.scene, "p" + (i+1), this.pieceSize, this.texturePiece1, this.textureP1, this.textureP2,
                                            0.35 - (this.capturedCount % this.npartsX) * this.squareSize - (this.capturedCount >= this.npartsX ?  0.0 : 0.03), 
                                            (this.capturedCount >= this.npartsX ?  0.075 : -0.06) - 0.75));
            else
                this.pieces.push(new Piece(this.scene, "p" + String.fromCharCode(65 - this.npartsX + i), this.pieceSize, this.texturePiece2, this.textureP1, this.textureP2,                                            
                                            0.35 - (this.capturedCount % this.npartsX) * this.squareSize - (this.capturedCount >= this.npartsX ?  0.0 : 0.03), 
                                            (this.capturedCount >= this.npartsX ?  0.075 : -0.06) - 0.75));
        
            this.capturedCount++;
            this.pieces[i].captured = true;
        }
    };

    resetPieceCoords(place)
    {
        switch(place)
        {
            case 'pieceHolder':
                this.capturedCount = 0;
                for(let i = 0; i < this.pieces.length; i++)
                {
                    this.pieces[i].resetPins();
                    this.pieces[i].captured = true;
                    let newX = 0.35 - (this.capturedCount % this.npartsX) * this.squareSize - (this.capturedCount >= this.npartsX ?  0.0 : 0.03);
                    let newY = (this.capturedCount >= this.npartsX ?  0.075 : -0.06) - 0.75;                    
                    this.capturedCount++;

                    if(this.pieces[i].X == newX && this.pieces[i].Y == newY)
                        continue;
                    else
                    {
                        let oldX = this.pieces[i].X;
                        let oldY = this.pieces[i].Y;
                        this.pieces[i].X = newX;
                        this.pieces[i].Y = newY;
                        this.pieces[i].setAnimation(oldX, oldY);
                    }                    
                }    
                break;
            case 'initial':
                for(let i = 0; i < this.pieces.length; i++)
                {
                    this.pieces[i].resetPins();

                    if(i < this.npartsX)
                    {
                        if(this.pieces[i].X == 1 && this.pieces[i].Y == i + 1)
                            continue;
                        else
                        {
                            let oldX = this.pieces[i].X;
                            let oldY = this.pieces[i].Y;

                            if(this.pieces[i].captured)
                            {
                                oldX = - (this.pieces[i].X - 0.5 - (this.squareSize - this.pieceSize) / 2.0) / this.squareSize;
                                oldY = (this.pieces[i].Y + 0.5 + this.squareSize + (this.squareSize - this.pieceSize) / 2.0) / this.squareSize;
                                this.capturedCount--;
                                this.pieces[i].captured = false;
                            }

                            this.pieces[i].X = 1;
                            this.pieces[i].Y = i + 1;

                            this.pieces[i].setAnimation(oldX, oldY, false, true);
                        }
                    }
                    else
                    {
                        if(this.pieces[i].X == this.npartsY && this.pieces[i].Y == i + 1 - this.npartsX)
                            continue;
                        else
                        {
                            let oldX = this.pieces[i].X;
                            let oldY = this.pieces[i].Y;
                            
                            if(this.pieces[i].captured)
                            {
                                oldX = - (this.pieces[i].X - 0.5 - (this.squareSize - this.pieceSize) / 2.0) / this.squareSize;
                                oldY = (this.pieces[i].Y + 0.5 + this.squareSize + (this.squareSize - this.pieceSize) / 2.0) / this.squareSize;
                                this.capturedCount--;
                                this.pieces[i].captured = false;
                            }
                            
                            this.pieces[i].X = this.npartsY;
                            this.pieces[i].Y = i + 1 - this.npartsX;
                            
                            this.pieces[i].setAnimation(oldX, oldY, false, true);
                        }
                    }
                }                
                break;
            default:
                break;
        }
    };

    display()
    {  
        this.scene.pushMatrix();
            this.scene.translate(0,0.175,0);
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.displayBoard();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.175,0);
            if( this.videoPlaying) this.videoDisplay();
            this.displayPieces();
            this.clock.display();
        this.scene.popMatrix();
        
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
                    this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, 
                                        -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 
                                        0);
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

                if(!this.videoPlaying) this.insertNewMove('capture', this.pieces[i].name, square[0], square[1], oldX, oldY);
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

                this.pieces[i].setAnimation(oldX, oldY);
                
                this.stateMachine.isPieceMoving = true;
                
                if(!this.videoPlaying && !this.undoing) this.insertNewMove('piece', piece, square[0], square[1], oldX, oldY);
                break;
            }
        }
    };   

    makeAIMove(str)
    {
        var array = str.replace(/\[/g, '').replace(/\]/g, '').split(',');
        this.capturePiece([Number(array[1]), Number(array[2])]);
        this.movePiece(array[0], [Number(array[1]), Number(array[2])]);

        for(var i = 0; i < this.pieces.length; i++)
        {
            if(this.pieces[i].name == array[3])
            {
                this.pieces[i].pins[Number(array[4]) - 1][Number(array[5]) - 1].setPinCode();
                this.insertNewMove('pin', array[3], Number(array[4]) - 1, Number(array[5]) - 1);
            }
            else if(this.pieces[i].name == array[6])
            {
                this.pieces[i].pins[Number(array[7]) - 1][Number(array[8]) - 1].setPinCode();
                this.insertNewMove('pin', array[6], Number(array[7]) - 1, Number(array[8]) - 1);                
            }
        }
    }

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
        for(let i = 0; i < this.pieces.length; i++)
        {
            this.pieces[i].update(time);
            if(this.pieces[i].animationOver && !this.videoPlaying)
            {
                this.pieces[i].animationOver = false;
                this.stateMachine.isPieceMoving = false;
            }
        }
         
        this.stateMachine.update();  
        this.clock.update(time);
    };
    
    setPinCode(pieceIndex, pinX, pinY)
    {
        this.pieces[pieceIndex].pins[pinX][pinY].setPinCode();                    
        if(!this.videoPlaying) this.insertNewMove('pin', this.pieces[pieceIndex].name, pinX, pinY);
    };

    insertNewMove(type, pieceName, newX, newY, oldX = null, oldY = null)
    {
        let move = {
            'type' : type,
            'name' : pieceName,
            'X' : newX,
            'Y' : newY,
            'oldX': oldX,
            'oldY': oldY
        };

        this.moves.push(move);
    };

    initializeVideo()
    {
        if(this.moves.length == 0)
        {
            console.log("There are no moves");
            return;
        }

        this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(0, 10, 9), vec3.fromValues(0.0, 0.0, -3.0));

        if(this.videoPlaying)
            return;
     
        this.videoPlaying = true;
     
        if(this.playing)
        {
            this.clock.stop();
            this.playing = false;
            this.wasPlaying = true;
        }
        else this.wasPlaying = false;

        switch(this.stateMachine.currentState)
        {
            case P1_CHOOSE_PIECE:
                this.setPieceSelectable('p1', false);
                break;
            case P2_CHOOSE_PIECE:
                this.setPieceSelectable('pA', false);
                break;
            default:
                break;
        }                

        this.resetPieceCoords('initial');
        if(this.moves.length == 1  || (this.moves.length > 1 && this.moves[0].type != this.moves[1].type))
            this.moves.unshift(this.moves[0]);

        this.indexVideoMoves = 0;
        this.secondIndex = null;
    };

    endGame()
    {        
        this.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
        this.playing = false;
        this.clock.disable();
    };

    videoDisplay()
    {
        if(this.indexVideoMoves >= this.moves.length)
        {
            console.log("Video of the game completed!");
            this.videoPlaying = false;

            if(this.wasPlaying) 
            {
                this.playing = true;
                this.clock.continue();
                this.stateMachine.isPieceMoving = false;

                switch(this.stateMachine.currentState)
                {
                    case P1_CHOOSE_PIECE:
                        this.setPieceSelectable('p1');
                    case P1_PIECE_SENT:
                    case P1_BOARD_SENT:
                    case P1_VALID_MOVES:
                    case P1_CHOOSE_MOVE:
                    case P1_IS_GAME_OVER:
                    case P1_GAME_OVER_RESPONSE:                        
                        this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 10, 0), vec3.fromValues(-1.0, 0.0, 0.0));
                        break;
                    case P1_CHOOSE_PIN_1:
                    case P1_CHOOSE_PIN_2:
                        this.setPinsSelectable('x');
                        this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(5, 10, 0), vec3.fromValues(-1.0, 0.0, 0.0));
                        break;
                    case P2_CHOOSE_PIECE:                        
                        this.setPieceSelectable('pA');                        
                    case P2_PIECE_SENT:
                    case P2_BOARD_SENT:
                    case P2_VALID_MOVES:
                    case P2_CHOOSE_MOVE:
                    case P2_IS_GAME_OVER:
                    case P2_GAME_OVER_RESPONSE:
                        this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(-5, 10, 0), vec3.fromValues(1.0, 0.0, 0.0));
                        break;
                    case P2_CHOOSE_PIN_1:
                    case P2_CHOOSE_PIN_2:
                        this.setPinsSelectable('o');
                        this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(-5, 10, 0), vec3.fromValues(1.0, 0.0, 0.0));
                        break;
                    default:
                        break;
                }
            }
            else
            {
                this.resetPieceCoords('pieceHolder');
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
            }
            return;
        }

        if(this.secondIndex != null)
        {
            let move = this.moves[this.secondIndex];

            for(let i = 0; i < this.pieces.length; i++)
            {
                if(move.name == this.pieces[i].name)
                {
                    if(this.pieces[i].animationOver)
                    {
                        this.secondIndex = null;
                        this.pieces[i].animationOver = false;
                    }
                    break;
                }
            }
        }

        let move = this.moves[this.indexVideoMoves];

        if(move.type != 'pin')
        {
            for(let i = 0; i < this.pieces.length; i++)
            {
                if(move.name == this.pieces[i].name)
                {
                    if(this.pieces[i].animationOver)
                    {
                        this.pieces[i].animationOver = false;
                        
                        if(this.indexVideoMoves == 0)
                        {
                            this.pieces.forEach(function(piece) {
                                piece.animationOver = false;
                            });
                        }
                        
                        this.indexVideoMoves++;                        
                        return;
                    }
                    else if(this.pieces[i].isMoving)
                    {
                        return;
                    }
                    break;
                }
            }
        }

        switch(move.type)
        {
            case 'piece':
                this.movePiece(move.name, [move.X, move.Y]);
                break;
            case 'pin':
                for(var i = 0; i < this.pieces.length; i++)
                {
                    if(this.pieces[i].name == move.name)
                    {
                        this.setPinCode(i, move.X, move.Y);
                        this.indexVideoMoves++;
                        break;
                    }
                }
                break;
            case 'capture':
                this.capturePiece([move.X,move.Y]);
                this.secondIndex = this.indexVideoMoves;
                this.indexVideoMoves++;
                break;
            default:
                break;
        }
    };

    undo(second)
    {
        if(!this.playing || this.moves.length == 0 || (this.stateMachine.currentState != P1_CHOOSE_PIECE && this.stateMachine.currentState != P2_CHOOSE_PIECE))
        {
            console.log("Cannot UNDO");
            return;
        }

        this.undoing = true;

        var move = this.moves.pop();
        
        for(var i = 0; i < this.pieces.length; i++)
        {
            if(this.pieces[i].name == move['name'])
            {
                this.pieces[i].pins[move['X']][move['Y']].unpin();
                break;
            }
        }

        move = this.moves.pop();

        for(var i = 0; i < this.pieces.length; i++)
        {
            if(this.pieces[i].name == move['name'])
            {
                this.pieces[i].pins[move['X']][move['Y']].unpin();
                break;
            }
        }

        move = this.moves.pop();
        
        this.movePiece(move['name'], [move['oldX'], move['oldY']]);

        if(this.moves.length > 0)
        {
            move = this.moves.pop();
            
            if(move['type'] == "capture")
            {
                for(let i = 0; i < this.pieces.length; i++)
                {                     
                    if(this.pieces[i].name == move['name'])
                    {                
                        let oldX = 0.35 - (this.capturedCount % (this.pieces.length / 2)) * this.squareSize - (this.capturedCount >= this.pieces.length/2 ?  0.0 : 0.03);
                        let oldY = (this.capturedCount >= this.pieces.length/2 ?  0.075 : -0.06) - 0.75;

                        this.pieces[i].X = move['X'];
                        this.pieces[i].Y = move['Y'];
                        this.pieces[i].setAnimation(oldX, oldY, true);

                        this.capturedCount--;
                        this.pieces[i].captured = false;
                        break;
                    }
                }
            }
            else
            {
                this.moves.push(move);
            }
        }
        
        if(second)
        {
            this.undoing = false;
            return;
        }
        else if (this.Player1 == AI || this.Player2 == AI)
        {
            this.undo(true);
        }
        else
        {
            this.undoing = false;
            this.clock.start();
            if(this.stateMachine.currentState == P1_CHOOSE_PIECE)
            {
                this.stateMachine.currentState = P2_CHOOSE_PIECE;
                this.setPieceSelectable('pA');
                this.setPinsSelectable('x', false);
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, Math.PI);
            }
            else
            {
                this.stateMachine.currentState = P1_CHOOSE_PIECE;
                this.setPieceSelectable('p1');
                this.setPinsSelectable('o', false);
                this.scene.cameraAnimation = new CameraAnimation(1000, this.scene.camera, Math.PI);
            }
        }
    };
};