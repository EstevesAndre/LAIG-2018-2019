:- use_module(library(random)).

/* Gets computer move info if is the first player 
    
    Randomly sorts computer pieces for move tiebreaks
    Removes from contetion pieces already removed from board
    Gets all valid moves for the computer
    Chooses best move
    Makes best move
    Pins 2 pieces

    Depth - the number of moves calculated while choosing the best move 
*/
p1computer(Depth) :-
    random_permutation([pA, pB, pC, pD, pE, pF], Pieces), 
    removeExtraPieces(Pieces, [], NewPieces),
    board(T),
    valid_moves(T, NewPieces, [], Moves),
    choose_move(T, Moves, _, BestMove, -1000, _, NewPieces, Depth),
    moveAI(BestMove),
    pinAI(NewPieces),
    pinAI(NewPieces).

/* Gets computer move info if is the second player 
    
    Randomly sorts computer pieces for move tiebreaks
    Removes from contetion pieces already removed from board
    Gets all valid moves for the computer
    Chooses best move
    Makes best move
    Pins 2 pieces

    Depth - the number of moves calculated while choosing the best move 
*/
p2computer(Depth) :-
    random_permutation([p1, p2, p3, p4, p5, p6], Pieces), 
    removeExtraPieces(Pieces, [], NewPieces),
    board(T),
    valid_moves(T, NewPieces, [], Moves),
    choose_move(T, Moves, _, BestMove, -1000, _, NewPieces, Depth),
    moveAI(BestMove),
    pinAI(NewPieces),
    pinAI(NewPieces).

/* Removes pieces that are no longer on the board 

    Finds if a piece is still on the board

    Usage: removeExtraPieces(+Pieces, +[], -NewPieces)

    [P|Pieces] - array with the pieces to be tested
    NewPieces - array for storage of the pieces that are still on the board
    Ret - Return array
*/
removeExtraPieces([], Ret, Ret).
removeExtraPieces([P|Pieces], NewPieces, Ret) :-
    board(T),
    if_then_else(has_element_matrix(P, T),
                removeExtraPieces(Pieces, [P|NewPieces], Ret),
                removeExtraPieces(Pieces, NewPieces, Ret)).


/* Makes a computer piece move 

    Moves a Computer piece in the board

    Piece - the Piece to be moved
    TrgRow - the row of the target movement square
    TrgCol - the column of the target movement square
*/
moveAI([Piece, TrgRow, TrgCol]) :-
    board(T),
    index(T, Row, Col, Piece),
    move(Piece, Row, Col, TrgRow, TrgCol).

/* Gets best pin for computer 

    Chooses the piece with the least amount of available movements(uses predetermined order for tiebreaks)
    Chooses the best unpinned spot in that piece
    Pins the piece in the chosen spot

    Pieces - the pieces available for pin
*/
pinAI(Pieces) :-
    choosePinPiece(Pieces, _, Piece, 1000),
    chooseBestPin(Piece, Row, Col),
    pin(Piece, Row, Col).

/* Gets the piece with the least moves available 

    Gets available moves for a piece and replaces the current chosen piece if it has less moves available

    Usage: choosePinPiece(+Pieces, _, -Piece, +1000)

    [P|Pieces] - the pieces to be tested
    Piece - Auxilary argument for storage of the current best piece to pin
    PieceRet - return piece
    PieceMoves - the number of moves of the current chosen piece. should be called innitialy with a value
                greater than the maximun number of possible moves for a piece (in th example: 1000)
*/
choosePinPiece([], PieceRet, PieceRet, _).

choosePinPiece([P|Pieces], Piece, PieceRet, PieceMoves) :-
    getAvailableMoves(P, [], Moves, 5, 5),
    length(Moves, NMoves),
    if_then_else(NMoves < PieceMoves,
                choosePinPiece(Pieces, P, PieceRet, NMoves),
                choosePinPiece(Pieces, Piece, PieceRet, PieceMoves)).

/* Gets best pin for piece 

    Gets all the moves unnavailable to the piece
    Gets all the moves available to the piece
    Gets the number ov available moves to the piece
    Gets the best pin

    Piece - the piece to be pinned
    Row - return row
    Col - return column
*/
chooseBestPin(Piece, Row, Col) :-
    getUnvailableMoves(Piece, [], UnMoves, 5, 5),
    getAvailableMoves(Piece, [], Moves, 5, 5),
    length(Moves, NMoves),
    testBestPin(Piece, UnMoves, NMoves, _, [Row|Col], 0).

/* Gets all unnavailable moves to the piece

    For each pin position, verifies if the piece can already use it for movemet

    Usage: getUnvailableMoves(+Piece, [], -Moves, 5, 5)

    Piece - the piece to be checked
    Moves - auxiliary array to store unnavailable moves
    Return - return array
    PinX - current X coordinate of the pin being tested
    PinY - current Y coordinate of the pin being tested
*/
getUnvailableMoves(_, Return, Return, 0, 1).
getUnvailableMoves(Piece, Moves, Return, 0, PinY) :-
    NewY is PinY - 1,
    getUnvailableMoves(Piece, Moves, Return, 5, NewY).
getUnvailableMoves(Piece, Moves, Return, PinX, PinY) :-
    NewX is PinX - 1,
    append(Moves, [[PinX, PinY]], NewMoves),
    if_then_else(checkEmptyPin(Piece, PinX, PinY),
                 getUnvailableMoves(Piece, NewMoves, Return, NewX, PinY),
                 getUnvailableMoves(Piece, Moves, Return, NewX, PinY)) , !.


/* Checks if the current pin position is empty

    Verifies if the current position is empty and if it would translate into an extra move if pinned

    Piece - the piece to be checked
    PinX - X coordinate of the pin being tested
    PinY - Y coordinate of the pin being tested
*/
checkEmptyPin(Piece, PinX, PinY) :-
    piece(Piece, Mat),
    index(Mat, PinX, PinY, '.'),
    board(T),
    index(T, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is PinY-3,
    PieceX+Xdiff > 0,
    PieceX+Xdiff < 7,
    PieceY+Ydiff > 0,
    PieceY+Ydiff < 7.

/* Gets best pin for piece

    For each move unnavailable for the piece, makes it available by pinning
    Gets the new number of available moves
    Unpins the temporary pin
    If the number of available moves increases with the pin, this pin is chosen

    Usage: testBestPin(+Piece, +UnMoves, +NMoves, _, Move, 0)

    Piece - the piece to be pinned
    [[Row|[Col|_]]|Pins] - all the unnavailable moves for the piece
    NMoves - number of moves currently available for the piece
    Move - auxilary argument used to store the current best pin
    Ret - return pin position
    0/1 - termination flag
*/
testBestPin(_, _, _, Ret, Ret, 1).
testBestPin(Piece, [[Row|[Col|_]]|Pins], NMoves, Move, Ret, 0) :-
    pin(Piece, Row, Col),
    getAvailableMoves(Piece, [], Moves, 5, 5),
    unpin(Piece, Row, Col),
    length(Moves, N),
    if_then_else(N > NMoves,
                testBestPin(_, _, _, [Row|Col], Ret, 1),
                testBestPin(Piece, Pins, NMoves, Move, Ret, 0)).
