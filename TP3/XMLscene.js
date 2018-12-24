var DEGREE_TO_RAD = Math.PI / 180;
var FRAMES = 30;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.Mcnt = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.initCameras();

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.graphs = [];

        this.setUpdatePeriod(1000/FRAMES);
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
                this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
                this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
                this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

                if(light.type == "spot")
                {
                    this.lights[i].setSpotCutOff(light.angle);
                    this.lights[i].setSpotExponent(light.exponent);
                    this.lights[i].setSpotDirection(light.target.x - light.location.x, light.target.y - light.location.y, light.target.z - light.location.z);
                }
                
                this.lights[i].setVisible(true);
                if (light.enable)
                {
                    this.lights[i].enable();
                    this['Light_'+this.lights[i].id+"_on"] = true;
                }
                else
                {
                    this.lights[i].disable();
                    this['Light_'+this.lights[i].id+"_on"] = false;
                }

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        if(this.graphs.length == 2) {        
        this.graph = this.graphs[0];
        this.Current_Graph = this.graph.name;
        this.Mode = "Player vs Player";
        this.Difficulty = 1;
        this.New_Game = function() {
            for(let i = 0; i < this.graph.primitives.length; i++)
            {
                if(this.graph.primitives[i].type == "board")
                    this.graph.primitives[i].obj.newGame(this.Mode, this.Difficulty);
            }
        };

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.setGlobalAmbientLight(this.graph.ambient.r, this.graph.ambient.g, this.graph.ambient.b, this.graph.ambient.a);
        this.gl.clearColor(this.graph.background.r, this.graph.background.g, this.graph.background.b, this.graph.background.a);

        var d = this.graph.defaultView;
        if(this.graph.defaultView.type == "perspective")
            this.camera = new CGFcamera(d.angle * Math.PI/180.0, d.near, d.far, d.from, d.to);
        else
            this.camera = new CGFcameraOrtho(d.left, d.right, d.bottom, d.top, d.near, d.far, d.from, d.to, vec3.fromValues(0, 1, 0));
        this.interface.setActiveCamera(this.camera);
        this.Current_Camera = d.id;
        this.prev_camara = this.Current_Camera;

        
        this.initLights();

        this.interface.addPlayOptionsGroup();

        // Adds looks group.
        this.interface.addLookGroup(this.graphs);

        // Adds views group.
        this.interface.addViewsGroup(this.graph.views);
        
        this.interface.addNewGameButton();

        this.sceneInited = true;}
    }


    /**
     * Displays the scene.
     */
    display() {
        // PICKING        
        this.logPicking();
        this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            //changes camera if necessary
            if(this.prev_camara != this.Current_Camera)
            {
                this.prev_camara = this.Current_Camera
                var cc = this.Current_Camera;

                var d = this.graph.views.find(function( element ) {
                    return element.id == cc;
                });
                if(d.type == "perspective")
                    this.camera = new CGFcamera(d.angle * Math.PI/180.0, d.near, d.far, d.from, d.to);
                else
                    this.camera = new CGFcameraOrtho(d.left, d.right, d.bottom, d.top, d.near, d.far, d.from, d.to, vec3.fromValues(0, 1, 0));
                this.interface.setActiveCamera(this.camera);
            }

            //changes graph if necessary
            if(this.prev_graph != this.Current_Graph)
            {
                this.prev_graph = this.Current_Graph;
                
                for(var i = 0; i < this.graphs.length; i++)
                {
                    if(this.graphs[i].name == this.Current_Graph)
                    {
                        this.graph = this.graphs[i];
                        this.initLights();
                    }
                }
            }

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this['Light_' + key + "_on"]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(currTime)
    {
        if(!this.sceneInited) return;

        this.lastTime = this.lastTime || 0;
		this.deltaTime = currTime - this.lastTime;
        this.lastTime = currTime;

        if(this.deltaTime > 1000) return;
        
        for(let i = 0; i < this.graph.components.length; i++)
        {      
            var node = this.graph.components[i]; 

            if(node.animations == null) continue;

            for(let j = 0; j < node.animations.length; j++)
            {
                if(node.animations[j].isAnimationOver())
                    continue;

                if(node.id == 'vehicleAnim' && node.children[0].type == 'vehicle')
                {
                    node.children[0].obj.updateWingMove();
                }

                node.animations[j].update(this.deltaTime / 1000);
                break;
            }
        }

        for(let i = 0; i < this.graph.primitives.length; i++)
        {
            if(this.graph.primitives[i].type == "water" || this.graph.primitives[i].type == "board")
                this.graph.primitives[i].obj.update(this.deltaTime);
        }
    }
    
    logPicking()
    {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {                
                for (let i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        for(let i = 0; i < this.graph.primitives.length; i++)
                        {
                            if(this.graph.primitives[i].type == "board")
                            {
                                    if(this.graph.primitives[i].obj.playing &&
                                        !this.graph.primitives[i].obj.stateMachine.waitingForResponse &&
                                        this.graph.primitives[i].obj.stateMachine.idPicked == 0 )
                                            this.graph.primitives[i].obj.stateMachine.idPicked = customId;
                            }
                        }
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }
}