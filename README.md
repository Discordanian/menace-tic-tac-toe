Tic Tac Toe AI
==============


I'm hoping to make this a self-learning tic-tac-toe
program.


Ideas
-----

* Use a single integer to describe a board state.  3 states, 9 positions is 3^9 combinations.  for <space>, 'X' or 'O'.
* Translate back and forth from the int to a string to a printing of the board
* Each integer in the array points to an array of 'move' positions
* IFF we want to deal with 'duplicates' and make it faster we can do original board plus 3 rotations, a horizontal reflection, a vertical reflection, and 2 diagonal reflections.  I'm not going to worry about this at first.
* Keep track of win/loss/draw
* Graphically show decision weights on each move.
* At the end of the game, show the consequence of weight changes
* Instead of populating all the weights for each board at the start, leave it blank and populate them as needed.  IE:  If in play you come across a board without weights, create them.  This should save a great deal of RAM for boards that cannot evolve during game play.

* I think I can do rotations at least and that should vastly improve the algorithm.  So I need a function that returns the min Int of the 4 rotations of any game board.  Then I need another that can give the 'distance' to a rotation.  Lastly I need something that will convert a position to a new position based on distance.

Links
-----

* https://opendatascience.com/menace-donald-michie-tic-tac-toe-machine-learning/ 
* https://bulma.io/documentation/layout/section/



