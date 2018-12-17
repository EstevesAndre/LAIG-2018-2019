:- use_module(library(lists)).

/* Implements an if-then-else-like decision stucture

    if(Condition)
    {
        Action1
    }
    else
    {
        Action2
    }
*/
if_then_else(Condition, Action1, _) :- Condition, !, Action1.  
if_then_else(_, _, Action2) :- Action2.

/* Verifies if a list of lists (aka Matrix) has a dertermined element

    X - element to be found
    [A|As] - matrix portion yet to be tested
*/
has_element_matrix(X, [A|_]) :-
    has_element(X,A).
has_element_matrix(X, [A|As]) :- 
    \+(has_element(X,A)),
    has_element_matrix(X, As).

/* Verifies if a list has a dertermined element

    X - element to be found
    [_|Ys] - list portion yet to be tested
*/
has_element(X, [X|_]).
has_element(X, [_|Ys]) :-
    has_element(X, Ys).


/* Finds an element in a list of lists (aka Matrix)

    Usage: index(+Matrix, +Row, +Col, -Value) OR
           index(+Matrix, -Row, -Col, +Value)

    Matrix - matrix to be tested
    Row - row of the element
    Col - column of the element
    Value - element to be found
*/
index(Matrix, Row, Col, Value):-
  nth1(Row, Matrix, MatrixRow),
  nth1(Col, MatrixRow, Value).

/* Sets the value of an element of a list of lists (aka matrix)

    Nrow - row of the element
    Ncol - col of the element
    Val - value to be set
    [Elem | Tail1] - original matrix
    [Elem | Out] - return matrix
*/
setElemMatrix(1, 1, Val, [ [_ | Tail1] | Tail2], [ [Val | Tail1] | Tail2]).
setElemMatrix(1, Ncol, Val, [ [Elem | Tail1] | Tail2], [[Elem | Head] | Tail2]) :- 
	Next is Ncol-1,
	setElemMatrix(1, Next, Val, [ Tail1 | Tail2], [Head | Tail2]).
setElemMatrix(Nrow, Ncol, Val, [Elem | Tail1], [Elem | Out]) :- 
	Next is Nrow-1,
	setElemMatrix(Next, Ncol, Val, Tail1, Out).

/* Counts the number of instances of an element in a list

    [_|T] - list to be tested
    X - element to be found
    Z - return count
*/
countElem([],_,0).
countElem([X|T],X,Y):- !, countElem(T,X,Z), Y is 1+Z.
countElem([_|T],X,Z):- countElem(T,X,Z).

/* Counts the number of instances of an element in a list of lists (aka Matrix)

    Usage: countElemMatrix(+Mat, +Elem, 0, -Cnt)

    [Row|M] - matrix to be tested
    Elem - element to be found
    Cnt - auxiliary argument to store current count
    Return - return count
*/
countElemMatrix([], _, Cnt, Cnt).
countElemMatrix([Row|M], Elem, Cnt, Return) :-
    countElem(Row, Elem, RowCnt),
    NewCnt is Cnt + RowCnt,
    countElemMatrix(M, Elem, NewCnt, Return).