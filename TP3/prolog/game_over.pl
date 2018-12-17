/* Checks for game over conditions. If fail, game is over 

    Player1 - first player name
    Player2 - second player name
*/
game_over(Player1, Player2) :-
    winnerP1(Player1),
    winnerP2(Player2).

/* Checks for player 1 win

    Checks for insufficient pieces in player 2 side and for possible seondary win condition - (piece full of pins)
    If any condition fails, player 1 wins.
    
    Player1 - first player name
*/
winnerP1(_) :-
    checkPlayerPieces([p1, p2, p3, p4, p5, p6], 0),
    checkP1Pins, !.

winnerP1(Player1) :-
    printWin(Player1), nl, nl,
    fail.

/* Checks for player 2 win

    Checks for insufficient pieces in player 1 side and for possible seondary win condition - (piece full of pins)
    If any condition fails, player 2 wins.
    
    Player2 - second player name
*/
winnerP2(_) :-
    checkPlayerPieces([pA, pB, pC, pD, pE, pF], 0),
    checkP2Pins, !.

winnerP2(Player2) :-
    printWin(Player2), nl, nl,
    fail.


/* Prints win menu */
printWin(Player) :-    
    write('-------------------------------------------'), nl,
    write('                 '),
    write(Player),nl,
    write('|                                          |'),nl,
    write('|                  _____         ___       |'),nl,
    write('|     \\          /   |   |\\   | |          |'),nl,
    write('|      \\        /    |   | \\  | |__        |'),nl,
    write('|       \\  /\\  /     |   |  \\ |    |       |'),nl,
    write('|        \\/  \\/    __|__ |   \\| ___|       |'),nl,
    write('|                                          |'),nl,
    write('|__________________________________________|').

/* Checks for isufficient number of pieces present in the board

    Counts the number of pieces of the chosen lot in the board
    If the number of pieces is one, the game is over (i.e. it fails)

    Usage: checkPayerPieces(+Pieces, 0)

    [P|Ps] - Pieces yet to be tested
    Cnt - number of pieces already successfully found on the board
*/
checkPlayerPieces([], Cnt) :- Cnt \= 1. 

checkPlayerPieces([P|Ps], Cnt) :-
    Inc is Cnt+1,
    board(T),
    if_then_else(has_element_matrix(P, T), checkPlayerPieces(Ps, Inc), checkPlayerPieces(Ps, Cnt)).

/* Checks if player 1 has a piece full of pins (in which case, it fails)*/
checkP1Pins :-
    checkFullPins(pA),
    checkFullPins(pB),
    checkFullPins(pC),
    checkFullPins(pD),
    checkFullPins(pE),
    checkFullPins(pF).

/* Checks if player 2 has a piece full of pins (in which case, it fails)*/
checkP2Pins :-
    checkFullPins(p1),
    checkFullPins(p2),
    checkFullPins(p3),
    checkFullPins(p4),
    checkFullPins(p5),
    checkFullPins(p6).

/* Checks if a piece still has unpinned spaces
    (i.e. it fails if a piece is full)

    Piece, the piece to be tested
*/
checkFullPins(Piece) :-
    piece(Piece, Mat),
    has_element_matrix('.', Mat).
