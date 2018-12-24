const P1_CHOOSE_PIECE = 0;
const P1_PIECE_SENT = 1;
const P1_BOARD_SENT = 2;
const P1_VALID_MOVES = 3;
const P1_CHOOSE_MOVE = 4;
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
            case P1_CHOOSE_PIECE:
            {
                if(this.idPicked == 0)
                    return;
                
                var id = this.idPicked;
                this.idPicked = 0;

                var piece = this.convertToPiece(id);

                if(piece == null || piece.charCodeAt(1) > 60)
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
                    this.currentState = P1_CHOOSE_PIN_1;
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

        request.onerror = function () { console.log("Server error."); this.waitingForResponse = false; this.board.playing = false;};

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