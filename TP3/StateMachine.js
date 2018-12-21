const P1_CHOOSE_PIECE = 0;
const P1_CHOOSE_MOVE = 1;
const P1_CHOOSE_PIN_1 = 2;
const P1_CHOOSE_PIN_2 = 3;
const P2_CHOOSE_PIECE = 4;
const P2_CHOOSE_MOVE = 5;
const P2_CHOOSE_PIN_1 = 6;
const P2_CHOOSE_PIN_2 = 7;
const INACTIVE = -1;

class StateMachine
{
    constructor(Board)
    {
        this.Board = Board;
        this.currentState = INACTIVE;
    }

    event(idPicked)
    {
        if(!this.Board.playing) return;

        console.log(idPicked);
    
    }
};