/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    addLookGroup(graphs) {

        var group = this.gui.addFolder("Look");
        group.open();

        var names = [];

        for (var key in graphs) {
            if (graphs.hasOwnProperty(key)) {
                names[key] = graphs[key].name;
            }
        }

        group.add(this.scene, 'Current_Graph', names).name("Theme");
    }

    addPlayOptionsGroup()
    {
        this.group = this.gui.addFolder("Options");
        this.group.open();

        var names = ["Player vs Player", "Player vs AI", "AI vs Player", "AI vs AI"];

        this.group.add(this.scene, 'Mode', names);
        this.group.add(this.scene, 'Difficulty', 1, 3).step(1);
        this.group.add(this.scene, 'time_to_play', 30, 900).step(5).name("Time to Move");
    }

    addNewGameButton()
    {
        this.gui.add(this.scene, 'New_Game').name("(N) New Game");
    }

    addUndoButton()
    {
        this.gui.add(this.scene, 'Undo').name("(U) Undo");
    }

    addFilmButton()
    {
        this.gui.add(this.scene, 'game_film').name("(V) Game Film");
    }

    initKeys()
	{
		this.processKeyboard = function() {};
	};
	
	processKeyUp(event)
	{        
        if(event.code == "KeyM")
            this.scene.Mcnt++;
        else if(event.code == "KeyV")
            this.scene.playVideo();
        else if(event.code == "KeyU")
            this.scene.Undo();
        else if(event.code == "KeyN")
            this.scene.New_Game();
        else if(event.code == "KeyQ")
            this.scene.Quit_Game();
        else if(event.code == "Digit1" || event.code == "Numpad1")
            this.scene.Current_Graph = this.scene.graphs[0].name;
        else if(event.code == "Digit2" || event.code == "Numpad2")
            this.scene.Current_Graph = this.scene.graphs[1].name;
	};
}