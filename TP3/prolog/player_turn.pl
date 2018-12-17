/* Gets player move info if is the first player 

    Moves a piece
    Pins two pieces
*/
p1player :-
    chooseMovePiece([pA, pB, pC, pD, pE, pF]),
    \+choosePinPiece([pA, pB, pC, pD, pE, pF]),
    \+choosePinPiece([pA, pB, pC, pD, pE, pF]).

/* Gets player move info if is the sencond player 

    Moves a piece
    Pins two pieces
*/
p2player :-
    chooseMovePiece([p1, p2, p3, p4, p5, p6]),
    \+choosePinPiece([p1, p2, p3, p4, p5, p6]),
    \+choosePinPiece([p1, p2, p3, p4, p5, p6]).

/* Chooses piece to move

    Reads chosen piece from user and loops until piece is valid

    Pieces - the pieces available to choose
*/
chooseMovePiece(Pieces) :-
    write('Choose piece to move (ex. pX): '),
    read(Piece), nl,
    if_then_else(validPieceLoop(Piece, Pieces), chooseMove(Piece), callback_chooseMovePiece(Pieces)).

/* Called only when user chooses invalid piece 

    Pieces - the pieces available to choose
*/
callback_chooseMovePiece(Pieces) :-
    write('Invalid Piece. '),
    chooseMovePiece(Pieces).
    
/* Checks if selected piece is available to be chosen

    Checks if the piece belongs to the the available pieces
    Checks if the piece is still on the board

    Piece - the pieces chosen by user
    Pieces - the pieces available to choose
*/
validPieceLoop(Piece, Pieces) :-
    has_element(Piece, Pieces),
    board(T),
    has_element_matrix(Piece, T).

/* Chooses target square for movement 

    Prints all moves available for the chosen piece
    Gets user input for the target movement square
    Loops while user input is not valid

    Piece - the piece chosen for movement
*/
chooseMove(Piece) :-
    board(T),
    index(T, Row, Col, Piece),
    getAvailableMoves(Piece, [], Moves, 5, 5),
    write('Available moves [row, column]: '),
    write(Moves), nl,
    write('Choose target row: '),
    read(TrgRow),
    write('Choose target column: '),
    read(TrgCol),
    if_then_else(validMoveLoop(Moves, TrgRow, TrgCol), move(Piece, Row, Col, TrgRow, TrgCol), callback_chooseMove(Piece)).

/* Checks if the move chosen by the user is valid

    Moves - all the moves available for the chosen piece
    TrgRow - row chosen by the user
    TrgCol - column chosen by the user
*/
validMoveLoop(Moves, TrgRow, TrgCol) :-
    has_element([TrgRow, TrgCol], Moves).

/* Called only when user chooses invalid move 

    Piece - the piece chosen for movement
*/
callback_chooseMove(Piece) :-
    write('\nInvalid target. '),
    chooseMove(Piece).

/* Chooses piece to pin

    Reads chosen piece from user and loops until piece is valid
    (p0 skips this step)

    Pieces - the pieces available to choose
*/
choosePinPiece(Pieces) :-
    write('\nChoose piece to pin (ex. pX - p0 to skip): '),
    read(Piece),
    if_then_else(Piece = 'p0', fail, true),
    if_then_else(validPieceLoopPin(Piece, Pieces), choosePin(Piece), callback_choosePinPiece(Pieces)),
    fail.

/* Checks if selected piece is available to be chosen

    Checks if the piece belongs to the the available pieces
    Checks if the piece is still on the board
    Checks if the piece has at least one pinning space available

    Piece - the pieces chosen by user
    Pieces - the pieces available to choose
*/
validPieceLoopPin(Piece, Pieces) :-
    has_element(Piece, Pieces),
    board(T),
    has_element_matrix(Piece, T),
    piece(Piece, Mat),
    has_element_matrix('.', Mat).

/* Called only when user chooses invalid piece 

    Pieces - the pieces available to choose
*/
callback_choosePinPiece(Pieces) :-
    write('Invalid Piece. '),
    choosePinPiece(Pieces).

/* Chooses target pin space for pin

    Prints all pin spaces available for the chosen piece
    Gets user input for the target pin space
    Loops while user input is not valid

    Piece - the piece chosen for movement
*/
choosePin(Piece) :-
    getAvailablePinSpaces(Piece, [], Spaces, 5, 5),
    write('Available pins [row, column]: '),
    write(Spaces), nl,
    write('Choose target row: '),
    read(TrgRow),
    write('Choose target column: '),
    read(TrgCol),
    if_then_else(validMoveLoop(Spaces, TrgRow, TrgCol), pin(Piece, TrgRow, TrgCol), callback_choosePin(Piece)).

/* Checks if the pin space chosen by the user is valid

    Spaces - all the pinning spaces available for the chosen piece
    TrgRow - row chosen by the user
    TrgCol - column chosen by the user
*/
validPinLoop(Spaces, TrgRow, TrgCol) :-
    has_element([TrgRow, TrgCol], Spaces).

/* Called only when user chooses invalid pinning space 

    Piece - the piece chosen for pinning
*/
callback_choosePin(Piece) :-
    write('\nInvalid target. '),
    choosePin(Piece).
