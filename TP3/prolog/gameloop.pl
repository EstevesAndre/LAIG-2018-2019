/* Gets all currently available pinning spaces for a certain piece

    For each pin position, verifies if that position is empty

    Usage: getAvailablePinSpaces(+Piece, [], -Spaces, 5, 5)

    Piece - the piece to be checked
    Spaces - auxiliary array to store available spaces
    Return - return array
    PinX - current X coordinate of the pin being tested
    PinY - current Y coordinate of the pin being tested
*/

getAvailablePinSpaces(_, Return, Return, 0, 1).
getAvailablePinSpaces(Piece, Spaces, Return, 0, PinY) :-
    NewY is PinY - 1,
    getAvailablePinSpaces(Piece, Spaces, Return, 5, NewY).
getAvailablePinSpaces(Piece, Spaces, Return, PinX, PinY) :-
    piece(Piece, Mat),
    NewX is PinX - 1,
    index(Mat, PinX, PinY, Val),
    append(Spaces, [[PinX, PinY]], NewSpaces),
    if_then_else(Val = '.',
                getAvailablePinSpaces(Piece, NewSpaces, Return, NewX, PinY),
                getAvailablePinSpaces(Piece, Spaces, Return, NewX, PinY)).

/* Gets all currently available moves for a certain piece

    For each pin position, verifies if the piece can already use it for movement

    Usage: getAvailableMoves(+Piece, [], -Moves, 5, 5)

    Piece - the piece to be checked
    Moves - auxiliary array to store available moves
    Return - return array
    PinX - current X coordinate of the pin being tested
    PinY - current Y coordinate of the pin being tested
*/
getAvailableMoves(_, Return, Return, 0, 1).
getAvailableMoves(Piece, Moves, Return, 0, PinY) :-
    NewY is PinY - 1,
    getAvailableMoves(Piece, Moves, Return, 5, NewY).
getAvailableMoves(Piece, Moves, Return, PinX, PinY) :-
    NewX is PinX - 1,
    board(T),
    index(T, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is 3-PinY,
    Xpos is PieceX+Xdiff,
    Ypos is PieceY-Ydiff,
    append(Moves, [[Xpos, Ypos]], NewMoves),
    if_then_else(checkPin(Piece, PinX, PinY),
                 getAvailableMoves(Piece, NewMoves, Return, NewX, PinY),
                 getAvailableMoves(Piece, Moves, Return, NewX, PinY)) , !.


/* Checks if a certain pin space in a piece is pinned and if it leads to an avalable move currently

    Checks if the piece data has that space pinned
    Checks if the pin is not currently pointing beyond the edge of the board

    Piece - the chosen piece
    PinX - the X coordinate of the pin's position
    PinY - the Y coordinate of the pin's position
*/
checkPin(Piece, PinX, PinY) :-
    piece(Piece, Mat),
    index(Mat, PinX, PinY, 'o'),
    board(T),
    index(T, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is PinY-3,
    PieceX+Xdiff > 0,
    PieceX+Xdiff < 7,
    PieceY+Ydiff > 0,
    PieceY+Ydiff < 7.

checkPin(Piece, PinX, PinY) :-
    piece(Piece, Mat),
    index(Mat, PinX, PinY, 'x'),
    board(T),
    index(T, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is PinY-3,
    PieceX+Xdiff > 0,
    PieceX+Xdiff < 7,
    PieceY+Ydiff > 0,
    PieceY+Ydiff < 7.

/* Moves a piece in the board from its current position to a new position

    Gets board data
    Replaces current piece lovation with empty (== 'e')
    Replaces new piece lovation with the chose piece
    Saves new board data

    Piece - the chosen piece
    Row - current piece's position row
    Col - current piece's position column
    TrgRow - row of the piece's new position
    TrgCol - column of the piece's new position
*/
move(Piece, Row, Col, TrgRow, TrgCol) :-
    board(T),
    setElemMatrix(Row, Col, 'e', T, NewBoard),
    setElemMatrix(TrgRow, TrgCol, Piece, NewBoard, FinalBoard),
    retract(board(T)),
    assert(board(FinalBoard)).

/* Pins a certaing pinning space from a piece 

    Gets piece data
    Replaces target pinning space with the correct pin (== 'o' or 'x')
    Saves new piece data

    Piece - the chosen piece
    TrgRow - row of the pinning space to be pinned
    TrgCol - column of the pinning space to be pinned
*/
pin(Piece, TrgRow, TrgCol) :-
    piece(Piece, Mat),
    index(Mat, 3, 3, Val),
    if_then_else(has_element(Val, ['A', 'B', 'C', 'D', 'E', 'F']),
                setElemMatrix(TrgRow, TrgCol, 'o', Mat, NewMat),
                setElemMatrix(TrgRow, TrgCol, 'x', Mat, NewMat)),
    retract(piece(Piece, Mat)),
    assert(piece(Piece, NewMat)).

/* Unpins a certaing pinning space from a piece 

    Gets piece data
    Replaces target pinning space with empty (== '.')
    Saves new piece data

    Piece - the chosen piece
    TrgRow - row of the pinning space to be unpinned
    TrgCol - column of the pinning space to be unpinned
*/
unpin(Piece, TrgRow, TrgCol) :-
    piece(Piece, Mat),
    setElemMatrix(TrgRow, TrgCol, '.', Mat, NewMat),
    retract(piece(Piece, Mat)),
    assert(piece(Piece, NewMat)).

/* Player 1 turn - Player vs Computer Game */
p1Turn('Player', _) :- 
    !, nl, write('Player - your turn:'), nl,
    p1player.

/* Player 1 turn - Player vs Player Game */
p1Turn('Player 1', _) :-
    !, nl, write('Player 1 - your turn:'), nl,
    p1player.

/* Player 1 turn - Computer vs Computer Game */
p1Turn('Computer 1', Depth) :-
    !, nl, write('Computer 1 - your turn:'), nl,
    p1computer(Depth),
    nl, write('Computer 1 - Move made.'), nl.

/* Player 2 turn - Player vs Player Game */
p2Turn('Player 2', _) :-
    !, nl, write('Player 2 - your turn:'), nl,
    p2player.

/* Player 2 turn - Player vs Computer Game */
p2Turn('Computer', Depth) :- 
    !, nl, write('Computer - your turn:'), nl,
    p2computer(Depth),
    nl, write('Computer - Move made.'), nl.

/* Player 2 turn - Computer vs Computer Game */
p2Turn('Computer 2', Depth) :-
    !, nl, write('Computer 2 - your turn:'), nl,
    p2computer(Depth),
    nl, write('Computer 2 - Move made.'), nl.


/* Game loop 

    Calls for player 1 move
    Displays board after move
    Checks for game over conditions
    This process for player 2
    Loops

    Loops ends when game_over fails (meaning that one or more game ending conditions have benn met)

    Player1 - the first player
    Player2 - the second player
    Difficulty - the difficulty chosen for the game (== Depth; only useful when games involve computer play)
*/
gameloop(Player1, Player2, Difficulty) :-
    p1Turn(Player1, Difficulty),
    board(T),
    display_board(T,Player1),
    game_over(Player1, Player2),
    p2Turn(Player2, Difficulty), 
    board(NewT),
    display_board(NewT, Player2),
    game_over(Player1, Player2),
    gameloop(Player1, Player2, Difficulty).

/* Starts game

    Displays initial board
    Starts game loop

    Player1 - the first player
    Player2 - the second player
    Difficulty - the difficulty chosen for the game (== Depth; only useful when games involve computer play)
 */  
startGame(Player1, Player2, Difficulty) :-
    board(T),
    display_board(T,Player1),
    gameloop(Player1, Player2, Difficulty).
