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

    addViewsGroup(views)
    {
        this.group = this.gui.addFolder("Cameras");
        this.group.open();

        var names = [];

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                names[key] = views[key].id;
            }
        }

        this.group.add(this.scene, 'Current_Camera', names).name("Current Camera");
    }

    addPlayOptionsGroup()
    {
        this.group = this.gui.addFolder("Options");
        this.group.open();

        var names = ["Player vs Player", "Player vs AI", "AI vs Player", "AI vs AI"];

        this.group.add(this.scene, 'Mode', names);
        this.group.add(this.scene, 'Difficulty', 1, 3).step(1);
    }

    addNewGameButton()
    {
        this.gui.add(this.scene, 'New_Game').name("New Game");
    }

    initKeys()
	{
		this.processKeyboard = function() {};
	};
	
	processKeyDown(event)
	{        
        if(event.code == "KeyM")
            this.scene.Mcnt++;
	};
}