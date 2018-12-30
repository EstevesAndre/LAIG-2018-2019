const P1_CHOOSE_PIECE = 0;
const P1_PIECE_SENT = 1;
const P1_BOARD_SENT = 2;
const P1_VALID_MOVES = 3;
const P1_CHOOSE_MOVE = 4;
const P1_IS_GAME_OVER = 5;
const P1_GAME_OVER_RESPONSE = 50;
const P1_CHOOSE_PIN_1 = 6;
const P1_CHOOSE_PIN_2 = 7;
const P2_CHOOSE_PIECE = 8;
const P2_PIECE_SENT = 9;
const P2_BOARD_SENT = 10;
const P2_VALID_MOVES = 11;
const P2_CHOOSE_MOVE = 12;
const P2_IS_GAME_OVER = 13;
const P2_GAME_OVER_RESPONSE = 130;
const P2_CHOOSE_PIN_1 = 14;
const P2_CHOOSE_PIN_2 = 15;
const AI1_SEND_BOARD = 16;
const AI1_BOARD_SENT = 17;
const AI1_PIECES_SENT = 18;
const AI1_IS_GAME_OVER = 32;
const AI2_SEND_BOARD = 33;
const AI2_BOARD_SENT = 34;
const AI2_PIECES_SENT = 35;
const AI2_IS_GAME_OVER = 49;
const INACTIVE = -1;

class StateMachine
{
    constructor(board)
    {
        this.board = board;
        this.waitingForResponse = false;
        this.currentState = INACTIVE;
        this.idPicked = 0;
        this.message = null;
    }

    update()
    {
        if(!this.board.playing || this.currentState == INACTIVE || this.waitingForResponse) return;
    
        switch(this.currentState)
        {
            //PLAYER 1
            case P1_CHOOSE_PIECE:
            {
                if(this.idPicked == 0)
                    return;
                
                var id = this.idPicked;
                this.idPicked = 0;

                var piece = this.convertToPiece(id);

                if(piece == null || piece.charCodeAt(1) > 60)
                    return;
                
                console.log(this.board.moves);

                this.pieceSelected = piece;

                var piecePins;

                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == piece)
                    {
                        piecePins = this.board.pieces[i].getPiece();
                    }
                }

                this.getPrologRequest("setPiece(" + piece + "," + piecePins + ")");

                this.currentState = P1_PIECE_SENT;
            }
            break;
            case P1_PIECE_SENT:
            {
                if(this.message == null)
                    return;
                
                this.message = null;

                this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");
                
                this.currentState = P1_BOARD_SENT;
            }
            break;
            case P1_BOARD_SENT:
            {
                if(this.message == null)
                    return;
                
                this.message = null;

                this.getPrologRequest("getValidMoves(" + this.pieceSelected + ")");
                
                this.currentState = P1_VALID_MOVES;
            }
            break;
            case P1_VALID_MOVES:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                this.board.setValidMoves(msg);
                
                this.currentState = P1_CHOOSE_MOVE;
            }
            break;
            case P1_CHOOSE_MOVE:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var square = this.convertToSquare(id);

                if(this.board.validMoves[square[0] - 1][square[1] - 1])
                {
                    this.board.resetValidMoves(msg);
                    this.board.capturePiece(square);
                    this.board.movePiece(this.pieceSelected, square);
                    this.pieceSelected = null;

                    this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");

                    this.currentState = P1_IS_GAME_OVER;
                }
                else
                {
                    var piece = this.convertToPiece(id);
                    if(piece == null || piece.charCodeAt(1) > 60)
                        return;
                    else
                    {
                        this.board.resetValidMoves(msg);
                        this.pieceSelected = piece;
                        
                        var piecePins;

                        for(var i = 0; i < this.board.pieces.length; i++)
                        {
                            if(this.board.pieces[i].name == piece)
                            {
                                piecePins = this.board.pieces[i].getPiece();
                            }
                        }

                        this.getPrologRequest("setPiece(" + piece + "," + piecePins + ")");

                        this.currentState = P1_PIECE_SENT;
                    }
                }               
            }
            break;
            case P1_IS_GAME_OVER:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                this.getPrologRequest("isGameOver");
                
                this.currentState = P1_GAME_OVER_RESPONSE;
            }
            break;
            case P1_GAME_OVER_RESPONSE:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                if(msg != "0")
                {
                    alert("Player " + msg + " wins!");
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));

                    this.board.playing = false;
                    return;
                }
                
                this.board.setPieceSelectable('p1', false);
                this.board.setPinsSelectable('x');

                this.currentState = P1_CHOOSE_PIN_1;                
            }
            break;
            case P1_CHOOSE_PIN_1:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var pin = this.convertToPin(id);

                if(pin == null)
                    return;

                if(pin[0].charCodeAt(1) > 60 || (pin[1] == 3 && pin[2] == 3))
                {
                    return;
                }
                
                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == pin[0])
                    {
                        piecePins = this.board.setPinCode(i, pin[1]-1, pin[2]-1);;
                        this.board.pieces[i].pins[pin[1] - 1][pin[2] - 1].setPinSelectable(false);
                    }
                }

                this.currentState = P1_CHOOSE_PIN_2;
            }
            break;
            case P1_CHOOSE_PIN_2:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var pin = this.convertToPin(id);

                if(pin == null)
                    return;

                if(pin[0].charCodeAt(1) > 60 || (pin[1] == 3 && pin[2] == 3))
                {
                    return;
                }
                
                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == pin[0])
                    {
                        piecePins = this.board.setPinCode(i, pin[1]-1, pin[2]-1);;
                        this.board.pieces[i].pins[pin[1] - 1][pin[2] - 1].setPinSelectable(false);
                    }
                }
                
                this.board.clock.start();
                this.board.clock.addPlay();

                if(this.board.Player2 == HUMAN)
                {
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, Math.PI);
                    this.currentState = P2_CHOOSE_PIECE;
                    this.board.setPieceSelectable('pA');                    
                }
                else
                    this.currentState = AI2_SEND_BOARD;
                                
                this.board.setPinsSelectable('x', false);
            }
            break;

            //PLAYER 2
            case P2_CHOOSE_PIECE:
            {
                if(this.idPicked == 0)
                    return;
                
                var id = this.idPicked;
                this.idPicked = 0;

                var piece = this.convertToPiece(id);

                if(piece == null || piece.charCodeAt(1) < 60)
                    return;
                
                this.pieceSelected = piece;

                var piecePins;

                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == piece)
                    {
                        piecePins = this.board.pieces[i].getPiece();
                    }
                }

                this.getPrologRequest("setPiece(" + piece + "," + piecePins + ")");

                this.currentState = P2_PIECE_SENT;
            }
            break;
            case P2_PIECE_SENT:
            {
                if(this.message == null)
                    return;
                
                this.message = null;

                this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");
                
                this.currentState = P2_BOARD_SENT;
            }
            break;
            case P2_BOARD_SENT:
            {
                if(this.message == null)
                    return;
                
                this.message = null;

                this.getPrologRequest("getValidMoves(" + this.pieceSelected + ")");
                
                this.currentState = P2_VALID_MOVES;
            }
            break;
            case P2_VALID_MOVES:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                this.board.setValidMoves(msg);
                
                this.currentState = P2_CHOOSE_MOVE;
            }
            break;
            case P2_CHOOSE_MOVE:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var square = this.convertToSquare(id);

                if(this.board.validMoves[square[0] - 1][square[1] - 1])
                {
                    this.board.resetValidMoves(msg);
                    this.board.capturePiece(square);
                    this.board.movePiece(this.pieceSelected, square);
                    this.pieceSelected = null;

                    this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");

                    this.currentState = P2_IS_GAME_OVER;
                }
                else
                {
                    var piece = this.convertToPiece(id);
                    if(piece == null || piece.charCodeAt(1) < 60)
                        return;
                    else
                    {
                        this.board.resetValidMoves(msg);
                        this.pieceSelected = piece;
                        
                        var piecePins;

                        for(var i = 0; i < this.board.pieces.length; i++)
                        {
                            if(this.board.pieces[i].name == piece)
                            {
                                piecePins = this.board.pieces[i].getPiece();
                            }
                        }

                        this.getPrologRequest("setPiece(" + piece + "," + piecePins + ")");

                        this.currentState = P2_PIECE_SENT;
                    }
                }
               
            }
            break;
            case P2_IS_GAME_OVER:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                this.getPrologRequest("isGameOver");
                
                this.currentState = P2_GAME_OVER_RESPONSE;
            }
            break;
            case P2_GAME_OVER_RESPONSE:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                if(msg != "0")
                {
                    alert("Player " + msg + " wins!");
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
                    this.board.playing = false;
                    return;
                }
                         
                this.board.setPieceSelectable('pA', false);
                this.board.setPinsSelectable('o');

                this.currentState = P2_CHOOSE_PIN_1;       
            }
            break;
            case P2_CHOOSE_PIN_1:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var pin = this.convertToPin(id);

                if(pin == null)
                    return;

                if(pin[0].charCodeAt(1) < 60 || (pin[1] == 3 && pin[2] == 3))
                {
                    return;
                }
                
                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == pin[0])
                    {
                        piecePins = this.board.setPinCode(i, pin[1]-1, pin[2]-1);
                        this.board.pieces[i].pins[pin[1] - 1][pin[2] - 1].setPinSelectable(false);
                    }
                }
                this.currentState = P2_CHOOSE_PIN_2;
            }
            break;
            case P2_CHOOSE_PIN_2:
            {
                if(this.idPicked == 0)
                return;
            
                var id = this.idPicked;
                this.idPicked = 0;

                var pin = this.convertToPin(id);

                if(pin == null)
                    return;

                if(pin[0].charCodeAt(1) < 60 || (pin[1] == 3 && pin[2] == 3))
                {
                    return;
                }
                
                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    if(this.board.pieces[i].name == pin[0])
                    {
                        piecePins = this.board.setPinCode(i, pin[1]-1, pin[2]-1);;
                        this.board.pieces[i].pins[pin[1] - 1][pin[2] - 1].setPinSelectable(false);
                    }
                }
                
                this.board.clock.start();
                this.board.clock.addPlay();

                if(this.board.Player1 == HUMAN)
                {
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, Math.PI);
                    this.currentState = P1_CHOOSE_PIECE;
                    this.board.setPieceSelectable('p1');
                }
                else
                    this.currentState = AI1_SEND_BOARD;
            
                this.board.setPinsSelectable('o', false);
            }
            break;
            //AI1
            case AI1_SEND_BOARD:
            {
                this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");
                
                this.currentState = AI1_BOARD_SENT;
            }
            break;
            case AI1_BOARD_SENT:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    this.getPrologRequest("setPiece(" + this.board.pieces[i].name + "," + this.board.pieces[i].getPiece() + ")");
                }

                this.getPrologRequest("computerTurn(1," + this.board.difficulty + ")");
                
                this.currentState = AI1_PIECES_SENT;
            }
            case AI1_PIECES_SENT:
            {
                if(this.message == null || this.message.length < 3)
                    return;

                this.board.makeAIMove(this.message.slice());

                this.message = null;

                this.getPrologRequest("isGameOver");
                
                this.currentState = AI1_IS_GAME_OVER;
            }
            break;
            case AI1_IS_GAME_OVER:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                if(msg != "0")
                {
                    alert("Player " + msg + " wins!");
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
                    this.board.playing = false;
                    return;
                }

                this.board.clock.start();
                this.board.clock.addPlay();

                if(this.board.Player2 == HUMAN)
                {
                    this.currentState = P2_CHOOSE_PIECE;
                    this.board.setPieceSelectable('pA');
                }
                else
                    this.currentState = AI2_SEND_BOARD;
                
                this.board.setPinsSelectable('x', false);
            }
            break;
            //AI2
            case AI2_SEND_BOARD:
            {
                this.getPrologRequest("setBoard(" + this.board.getBoard() + ")");
                
                this.currentState = AI2_BOARD_SENT;
            }
            break;
            case AI2_BOARD_SENT:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                for(var i = 0; i < this.board.pieces.length; i++)
                {
                    this.getPrologRequest("setPiece(" + this.board.pieces[i].name + "," + this.board.pieces[i].getPiece() + ")");
                }

                this.getPrologRequest("computerTurn(2," + this.board.difficulty + ")");
                
                this.currentState = AI2_PIECES_SENT;
            }
            case AI2_PIECES_SENT:
            {
                if(this.message == null || this.message.length < 3)
                    return;

                this.board.makeAIMove(this.message.slice());

                this.message = null;

                this.getPrologRequest("isGameOver");
                
                this.currentState = AI2_IS_GAME_OVER;
            }
            break;
            case AI2_IS_GAME_OVER:
            {
                if(this.message == null)
                    return;
                
                var msg = this.message;
                this.message = null;

                if(msg != "0")
                {
                    alert("Player " + msg + " wins!");
                    this.board.scene.cameraAnimation = new CameraAnimation(1000, this.board.scene.camera, vec3.fromValues(12, 7.5, 12), vec3.fromValues(0.0, 4.0, 0.0));
                    this.board.playing = false;
                    return;
                }

                this.board.clock.start();
                this.board.clock.addPlay();

                if(this.board.Player1 == HUMAN)
                {
                    this.currentState = P1_CHOOSE_PIECE;    
                    this.board.setPieceSelectable('p1');
                }
                else
                    this.currentState = AI1_SEND_BOARD;
                                   
                this.board.setPinsSelectable('o', false);
            }
            break;
        }
    }

    getPrologRequest(requestString) {
        var requestPort = 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        var self = this;

        self.waitingForResponse = true;

        request.onload = function (data) {
            self.message = data.target.response;
            self.waitingForResponse = false;
        };

        request.onerror = function () { alert("Server Error!"); this.waitingForResponse = false; this.board.playing = false;};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    convertToSquare(id)
    {
        if(id < 100)
        {
            var name = "p" + String.fromCharCode(id);
            for(var i = 0; i < this.board.pieces.length; i++)
            {
                if(this.board.pieces[i].name == name)
                {
                    return [this.board.pieces[i].X, this.board.pieces[i].Y];
                }
            }
        }
        else if (id < 1000)
        {
            var x = Math.trunc(id / 100);
            var y = (id % 100) / 10;
            return [x, y];
        }
        else
        {
            var name = "p" + String.fromCharCode(Math.trunc(id / 100));
            for(var i = 0; i < this.board.pieces.length; i++)
            {
                if(this.board.pieces[i].name == name)
                {
                    return [this.board.pieces[i].X, this.board.pieces[i].Y];
                }
            }
        }
    }

    convertToPiece(id)
    {
        if(id < 100)
        {
            return "p" + String.fromCharCode(id);
        }
        else if (id < 1000)
        {
            var x = Math.trunc(id / 100);
            var y = (id % 100) / 10;
            for(var i = 0; i < this.board.pieces.length; i++)
            {
                if(this.board.pieces[i].X == x && this.board.pieces[i].Y == y)
                {
                    return this.board.pieces[i].name;
                }
            }
            return null;
        }
        else
        {
            return "p" + String.fromCharCode(Math.trunc(id / 100));
        }
    }

    convertToPin(id)
    {
        if (id < 1000)
        {
            return null;
        }
        else
        {
            return ["p" + String.fromCharCode(Math.trunc(id / 100)), Math.trunc((id % 100) / 10), id % 10];
        }
    }
};