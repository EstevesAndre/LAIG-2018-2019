:- dynamic board/1.
:- dynamic piece/2.

/* Restarts internal data representation of board and pieces*/
restartData :-
    if_then_else(removeData, setData, setData).

/* Removes all stated data from previous played games */
removeData :-
    board(T),
    retract(board(T)),
    piece(pA, PA),
    retract(piece(pA, PA)),
    piece(pB, PB),
    retract(piece(pB, PB)),
    piece(pC, PC),
    retract(piece(pC, PC)),
    piece(pD, PD),
    retract(piece(pD, PD)),
    piece(pE, PE),
    retract(piece(pE, PE)),
    piece(pF, PF),
    retract(piece(pF, PF)),
    piece(p1, P1),
    retract(piece(p1, P1)),
    piece(p2, P2),
    retract(piece(p2, P2)),
    piece(p3, P3),
    retract(piece(p3, P3)),
    piece(p4, P4),
    retract(piece(p4, P4)),
    piece(p5, P5),
    retract(piece(p5, P5)),
    piece(p6, P6),
    retract(piece(p6, P6)),
    piece(e, E),
    retract(piece(e, E)).

/* Restores stated data with innitial values for game start */
setData :-
assert(board( [ [p1, p2, p3, p4, p5, p6],
        [ e,  e,  e,  e,  e,  e],
        [ e,  e,  e,  e,  e,  e],
        [ e,  e,  e,  e,  e,  e],
        [ e,  e,  e,  e,  e,  e],
        [pA, pB, pC, pD, pE, pF]
    ])),


assert(piece(pA, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'A', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(pB, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'B', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(pC, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'C', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(pD, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'D', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(pE, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'E', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(pF, [ ['.', '.', '.', '.', '.'],
            ['.', '.', 'o', '.', '.'],
            ['.', '.', 'F', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p1, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 1, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p2, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 2, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p3, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 3, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p4, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 4, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p5, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 5, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(p6, [ ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', 6, '.', '.'],
            ['.', '.', 'x', '.', '.'],
            ['.', '.', '.', '.', '.']
        ])),

assert(piece(e, [ ['.', '.', '.', '.', '.'],
           ['.', '.', '.', '.', '.'],
           ['.', '.', '.', '.', '.'],
           ['.', '.', '.', '.', '.'],
           ['.', '.', '.', '.', '.']
        ])).

opPieces([pA | _], [p1, p2, p3, p4, p5, p6]).
opPieces([pB | _], [p1, p2, p3, p4, p5, p6]).
opPieces([pC | _], [p1, p2, p3, p4, p5, p6]).
opPieces([pD | _], [p1, p2, p3, p4, p5, p6]).
opPieces([pE | _], [p1, p2, p3, p4, p5, p6]).
opPieces([pF | _], [p1, p2, p3, p4, p5, p6]).
opPieces([p1 | _], [pA, pB, pC, pD, pE, pF]).
opPieces([p2 | _], [pA, pB, pC, pD, pE, pF]).
opPieces([p3 | _], [pA, pB, pC, pD, pE, pF]).
opPieces([p4 | _], [pA, pB, pC, pD, pE, pF]).
opPieces([p5 | _], [pA, pB, pC, pD, pE, pF]).
opPieces([p6 | _], [pA, pB, pC, pD, pE, pF]).
