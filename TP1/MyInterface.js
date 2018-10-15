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

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].id;
                group.add(this.scene.lightValues, key);
                group.add(this.scene, 'Light_' + key + "_on");
            }
        }
    }

    addViewsGroup(views)
    {
        var group = this.gui.addFolder("Cameras");
        group.open();

        var names = [];

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                names[key] = views[key].id;
            }
        }

        group.add(this.scene, 'Current_Camera', names);
    }

    initKeys()
	{
		this.processKeyboard = function() {};
	};
	
	processKeyDown(event)
	{        
        if(event.code == "KeyM")
            this.scene.Mcnt++;
        
        console.log(this.scene.Mcnt);
	};

}