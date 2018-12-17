/* Starts app

    Removes default prompt
    Restarts internal data of the game
    Prints main menu
    Reads and parses menu option
    Loops

    Game ends with fail, so the line 
        \+parseInput(Input)
    will lead to play to be called again.

    play will end with fail when option 0 is selected in menu
    (and, therefore, \+parseInput(Input) returns false)
 */
play :- 
    prompt(_, ''),
    restartData,
    printMainMenu,
    write('--> Insert your option: '),
    read(Input),
    \+parseInput(Input),
    play.

/* Prints main menu */
printMainMenu :-
    write('___________________________________________________________________'),nl,
    write('|                                                                 |'),nl,
    write('|                                                                 |'),nl,
    write('|         __ ___  __   __         __  _____  ___  _____  __       |'),nl,
    write('|        |    |  |    |   |\\   | |      |   |   |   |   |         |'),nl,
    write('|        |_   |  | __ |_  | \\  | |__    |   |___|   |   |_        |'),nl,
    write('|        |    |  |  | |   |  \\ |    |   |   |   |   |   |         |'),nl,
    write('|        |__ _|_ |__| |__ |   \\| ___|   |   |   |   |   |__       |'),nl,
    write('|                                                                 |'),nl,
    write('|                                                                 |'),nl,
    write('|                   ___________________________                   |'),nl,
    write('|                   |                         |                   |'),nl,
    write('|                   |   1. Player vs Player   |                   |'),nl,
    write('|                   |_________________________|                   |'),nl,
    write('|                   |                         |                   |'),nl,
    write('|                   |  2. Player vs Computer  |                   |'),nl,
    write('|                   |_________________________|                   |'),nl,
    write('|                   |                         |                   |'),nl,
    write('|                   | 3. Computer vs Computer |                   |'),nl,
    write('|                   |_________________________|                   |'),nl,
    write('|                   |                         |                   |'),nl,
    write('|                   |         0. Exit         |                   |'),nl,
    write('|                   |_________________________|                   |'),nl,
    write('|                                                                 |'),nl,
    write('|                                                                 |'),nl,
    write('|        Developers:                                              |'),nl,
    write('|                                                                 |'),nl,
    write('|        Andre Esteves ------------------------- Luis Silva       |'),nl,
    write('|_________________________________________________________________|'),nl.

/* Menu option 1 - Player vs Player game */
parseInput(1) :-    
    !, startGame('Player 1', 'Player 2', _).

/* Menu option 2 - Player vs Computer game 

    Prints difficulty menu
    Gets difficulty for the game
*/
parseInput(2) :-
    !, printDifficulty,
    read(Difficulty),
    parseDifficulty(Difficulty, 2),
    startGame('Player', 'Computer', Difficulty).

/* Menu option 3 - Computer vs Computer game 

    Prints difficulty menu
    Gets difficulty for the game
*/
parseInput(3) :-
    !, printDifficulty,
    read(Difficulty),
    parseDifficulty(Difficulty, 3),
    startGame('Computer 1', 'Computer 2', Difficulty).

/* Menu option 0 - Game exit */
parseInput(0) :-
    !, write('Exiting...\n').

/* Menu option other

    Loops until user inserts a valid menu option
*/
parseInput(_Other) :-
    write('\nERROR: invalid option, choose one of the options.\n'),    
    write('--> Insert your option: '),
    read(Input),
    parseInput(Input).

/* Prints difficuty menu */
printDifficulty :-
    write('_____________________________________'),nl,
    write('|                                   |'),nl,
    write('|        Select Difficulty:         |'),nl,
    write('|                                   |'),nl,
    write('|           (1) Easy                |'),nl,
    write('|           (2) Medium              |'),nl,
    write('|           (3) Hard                |'),nl,
    write('|                                   |'),nl,
    write('|___________________________________|'),nl,
    write('--> Insert your option: ').

/* Parses difficulty  - Menu Option 2 - Difficulty 1 */
parseDifficulty(1, 2) :-    
    !, startGame('Player', 'Computer', 1).

/* Parses difficulty  - Menu Option 3 - Difficulty 1 */
parseDifficulty(1, 3) :-    
    !, startGame('Computer 1', 'Computer 2', 1).

/* Parses difficulty  - Menu Option 2 - Difficulty 2 */
parseDifficulty(2, 2) :-    
    !, startGame('Player', 'Computer', 2).

/* Parses difficulty  - Menu Option 3 - Difficulty 2 */
parseDifficulty(2, 3) :-    
    !, startGame('Computer 1', 'Computer 2', 2).

/* Parses difficulty  - Menu Option 2 - Difficulty 3 */
parseDifficulty(3, 2) :-    
    !, startGame('Player', 'Computer', 3).

/* Parses difficulty  - Menu Option 3 - Difficulty 3 */
parseDifficulty(3, 3) :-    
    !, startGame('Computer 1', 'Computer 2', 3).

/* Difficulty other option

    Loops until user inserts a valid difficulty option
*/
parseDifficulty(_Other, Op) :-
    write('\nERROR: invalid option, choose one of the options.\n'),    
    write('--> Insert your option: '),
    read(Difficulty),
    parseDifficulty(Difficulty, Op).