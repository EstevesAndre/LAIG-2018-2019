/* Gets the best move in the position, evaluationg using the determined depth 

    If depth = 1:
        Gets the value of the current test position and checks if it is better that the current best test position
    
    If depth >1:
        Creates a test position by making a possible move, the best opponent move followed by the best player move,
        all calculated using depth-1
        Replaces the best move so far with the possible move if the return evaluation is better

    Usage: choose_move(+Board, +Moves, _, -BestMove, -1000, _, +Pieces, +Depth)

    Board - the current test board. it usually does not match the current playing board
    [M|Moves] -  all the moves yet to be tested
    BestMove - auxiliary argument to store the current best move
    MoveREt - return best move
    BestMoveEval - the evaluation corresponding to the current best move. should be called innitialy with a value
                lower than the minimun evaluation possible (in th example: -1000)
    EvalRet - return best move evaluation
    Pieces - the pieces that correspond to the player from which perspective the board is being evaluated
    Depth - the current depth of move search
*/
choose_move(_, [], MoveRet, MoveRet, EvalRet, EvalRet, _, _).

choose_move(Board, [M|Moves], BestMove, MoveRet, BestMoveEval, EvalRet, Pieces, 1) :-
    makeEvalMove(Board, NewBoard, M),
    value(NewBoard, Pieces, Eval),
    if_then_else(Eval > BestMoveEval,
                choose_move(Board, Moves, M, MoveRet, Eval, EvalRet, Pieces, 1),
                choose_move(Board, Moves, BestMove, MoveRet, BestMoveEval, EvalRet, Pieces, 1)).

choose_move(Board, [M|Moves], BestMove, MoveRet, BestMoveEval, EvalRet, Pieces, Depth) :-
    Depth \= 1, 
    opPieces(Pieces, OpPieces),
    NewDepth is Depth - 1,
    makeEvalMove(Board, NewBoard, M),
    valid_moves(NewBoard, OpPieces, [], OpMoves),
    choose_move(NewBoard, OpMoves, _, BestOpMove, -1000, _, OpPieces, NewDepth),
    makeEvalMove(NewBoard, DepthBoard, BestOpMove),
    valid_moves(DepthBoard, Pieces, [], DepthMoves),
    choose_move(DepthBoard, DepthMoves, _, _, -1000, Eval, Pieces, NewDepth),
    if_then_else(Eval > BestMoveEval,
                choose_move(Board, Moves, M, MoveRet, Eval, EvalRet, Pieces, Depth),
                choose_move(Board, Moves, BestMove, MoveRet, BestMoveEval, EvalRet, Pieces, Depth)).

/* Moves a piece in a test board to a new position

    Gets current piece location
    Replaces current piece lovation with empty (== 'e')
    Replaces new piece lovation with the chose piece

    Board - the test board
    NewBoard - test board return
    Piece - the chosen piece
    TrgRow - row of the piece's new position
    TrgCol - column of the piece's new position
*/
makeEvalMove(Board, NewBoard, [Piece, TrgRow, TrgCol]) :-
    index(Board, Row, Col, Piece),
    setElemMatrix(Row, Col, 'e', Board, AuxBoard),
    setElemMatrix(TrgRow, TrgCol, Piece, AuxBoard, NewBoard).

/* Gets all valid moves for all pieces under evaluation 

    For each piece, gets all available moves on the current test board

    Usage: valid_moves(+Board, +Pieces, [], -Moves)

    Board - current test board
    [P|Pieces] - pieces to still get available moves
    Moves - auxiliary list to store current obtained moves
    Return - moves return
*/
valid_moves(_, [], Moves, Moves).
valid_moves(Board, [P|Pieces], Moves, Return) :-  
    if_then_else(has_element_matrix(P, Board),
                getAvailableEvalMoves(Board, P, [], PieceMoves, 5, 5),
                black(PieceMoves)),
    append(Moves, PieceMoves, NextMoves),
    valid_moves(Board, Pieces, NextMoves, Return).

black([]).

/* Gets all currently available moves for a certain piece on the current test board

    For each pin position, verifies if the piece can already use it for movement

    Usage: getAvailableEvalMoves(+Board, +Piece, [], -Moves, 5, 5)

    Board - the current test board
    Piece - the piece to be checked
    Moves - auxiliary array to store available moves
    Return - return array
    PinX - current X coordinate of the pin being tested
    PinY - current Y coordinate of the pin being tested
*/
getAvailableEvalMoves(_, _, Return, Return, 0, 1).
getAvailableEvalMoves(Board, Piece, Moves, Return, 0, PinY) :-
    NewY is PinY - 1,
    getAvailableEvalMoves(Board, Piece, Moves, Return, 5, NewY).
getAvailableEvalMoves(Board, Piece, Moves, Return, PinX, PinY) :-
    NewX is PinX - 1,
    index(Board, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is 3-PinY,
    Xpos is PieceX+Xdiff,
    Ypos is PieceY-Ydiff,
    append(Moves, [[Piece, Xpos, Ypos]], NewMoves),
    if_then_else(checkPinEval(Board, Piece, PinX, PinY),
                 getAvailableEvalMoves(Board, Piece, NewMoves, Return, NewX, PinY),
                 getAvailableEvalMoves(Board, Piece, Moves, Return, NewX, PinY)) , !.

/* Checks if a certain pin space in a piece is pinned and if it leads to an avalable move on the test board

    Checks if the piece data has that space pinned
    Checks if the pin is not currently pointing beyond the edge of the test board

    Board - the current test board
    Piece - the chosen piece
    PinX - the X coordinate of the pin's position
    PinY - the Y coordinate of the pin's position
*/
checkPinEval(Board, Piece, PinX, PinY) :-
    piece(Piece, Mat),
    index(Mat, PinX, PinY, 'o'),
    index(Board, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is PinY-3,
    PieceX+Xdiff > 0,
    PieceX+Xdiff < 7,
    PieceY+Ydiff > 0,
    PieceY+Ydiff < 7.

checkPinEval(Board, Piece, PinX, PinY) :-
    piece(Piece, Mat),
    index(Mat, PinX, PinY, 'x'),
    index(Board, PieceX, PieceY, Piece),
    Xdiff is PinX-3,
    Ydiff is PinY-3,
    PieceX+Xdiff > 0,
    PieceX+Xdiff < 7,
    PieceY+Ydiff > 0,
    PieceY+Ydiff < 7.

/* Evaluates the position from the prespective of the player with the chosen pieces 

    Uses four metrics to evaluate a position:
        number of pieces on the board
        number of pins on the board
        number of available moves
        number of pieces under the threat of being captured

    Board - the current test board
    Pieces - the pieces that correspond to the player from which perspective the board is being evaluated
    Eval - return evaluation
*/
value(Board, Pieces, Eval) :-
    opPieces(Pieces, OpPieces),
    calculatePieceVal(Board, Pieces, OpPieces, 0, Val1),
    calculatePinVal(Board, Pieces, OpPieces, 0, Val2),
    calculateTotalMovesVal(Board, Pieces, OpPieces, Val3),
    calculatePieceCaptureVal(Board, Pieces, OpPieces, Val4),
    Eval is Val1 + Val2 + Val3 + Val4.

/* Calculates value of the position using number of pieces
    - +10 for every piece player has on the board
    - -10 for every piece opponent has on the board */

calculatePieceVal(_, [], [], Val, Val).

calculatePieceVal(Board, [], [P|OpPieces], Val, Return) :-
    NextVal is Val - 10,
    if_then_else(has_element_matrix(P, Board),
                calculatePieceVal(Board, [], OpPieces, NextVal, Return),
                calculatePieceVal(Board, [], OpPieces, Val, Return)).

calculatePieceVal(Board, [P|Pieces], OpPieces, Val, Return) :-
    NextVal is Val + 10,
    if_then_else(has_element_matrix(P, Board),
                calculatePieceVal(Board, Pieces, OpPieces, NextVal, Return),
                calculatePieceVal(Board, Pieces, OpPieces, Val, Return)).

/* Calculates value of the position using number of pins
    - +1 for every pin on a piece player has on the board
    - -1 for every pin on a piece opponent has on the board */

calculatePinVal(_, [], [], Val, Val).

calculatePinVal(Board, [], [P|OpPieces], Val, Return) :-
    piece(P, Mat),
    countElemMatrix(Mat, 'o', 0, Cnt1),
    countElemMatrix(Mat, 'x', 0, Cnt2),
    TotalCnt is Cnt1 + Cnt2,
    NextVal is Val - TotalCnt,
    if_then_else(has_element_matrix(P, Board),
                calculatePinVal(Board, [], OpPieces, NextVal, Return),
                calculatePinVal(Board, [], OpPieces, Val, Return)).

calculatePinVal(Board, [P|Pieces], OpPieces, Val, Return) :-
    piece(P, Mat),
    countElemMatrix(Mat, 'o', 0, Cnt1),
    countElemMatrix(Mat, 'x', 0, Cnt2),
    TotalCnt is Cnt1 + Cnt2,
    NextVal is Val + TotalCnt,
    if_then_else(has_element_matrix(P, Board),
                calculatePinVal(Board, Pieces, OpPieces, NextVal, Return),
                calculatePinVal(Board, Pieces, OpPieces, Val, Return)).

/* Calculates value of the position using number of moves available
    - +1 for every move player has available
    - -1 for every move opponent has available */

calculateTotalMovesVal(Board, Pieces, OpPieces, Val) :-
    valid_moves(Board, Pieces, [], PlayerMoves),
    length(PlayerMoves, Val1),
    valid_moves(Board, OpPieces, [], OppMoves),
    length(OppMoves, Val2),
    Val is Val1 - Val2.
/* Calculates value of the position using number of pieces available for capture
    - +3 for every move player has available
    - -8 for every move opponent has available */

calculatePieceCaptureVal(Board, Pieces, OpPieces, Val) :-
    valid_moves(Board, Pieces, [], PlayerMoves),
    valid_moves(Board, OpPieces, [], OpMoves),
    moves_into_op_piece(Board, PlayerMoves, OpPieces, 0, Val1),
    moves_into_op_piece(Board, OpMoves, Pieces, 0, Val2),
    Val is (3 * Val1) - (8 * Val2).

moves_into_op_piece(_, [], _, Val, Val).
moves_into_op_piece(Board, [[_, TrgRow, TrgCol]|Moves], OpPieces, Val, Return) :-
       NextVal is Val + 1,
       index(Board, TrgRow, TrgCol, Elem),
       if_then_else(has_element(Elem, OpPieces),
                    moves_into_op_piece(Board, Moves, OpPieces, NextVal, Return),
                    moves_into_op_piece(Board, Moves, OpPieces, Val, Return)).