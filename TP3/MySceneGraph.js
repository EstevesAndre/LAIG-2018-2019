var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;

        this.nodes = [];

        this.name = filename.replace(/\.[^/.]+$/, "");

        this.idRoot = null;                    // The id of the root element.
        this.rootElem = new Object();

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.lights = [];

        this.referenceLength = 1.0;

        this.def = new CGFappearance(this.scene);
        this.def.setEmission(0.0,0.0,0.0,1.0);
        this.def.setAmbient(0.0,0.2,0.0,1.0);
        this.def.setDiffuse(0.0,0.2,0.0,1.0);
        this.def.setSpecular(0.0,0.2,0.0,1.0);
        this.def.setShininess(1.0);

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        this.scene.graphs.push(this);
        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas") return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) nodeNames.push(nodes[i].nodeName);

        var error;

        // Processes each node, verifying errors.
        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else 
        {
            if (index != SCENE_INDEX) this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null) return error;
        }

        // <views>
        var index;
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else 
        {
            if (index != VIEWS_INDEX) this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null) return error;
        }

        // <ambient>
        var index;
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else 
        {
            if (index != AMBIENT_INDEX) this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null) return error;
        }

        // <lights>
        var index;
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else 
        {
            if (index != LIGHTS_INDEX) this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null) return error;
        }

        // <textures>
        var index;
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else 
        {
            if (index != TEXTURES_INDEX) this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null) return error;
        }

        // <materials>
        var index;
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else 
        {
            if (index != MATERIALS_INDEX) this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null) return error;
        }

        // <transformations>
        var index;
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else 
        {
            if (index != TRANSFORMATIONS_INDEX) this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null) return error;
        }

        // <animations>
        var index;
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else 
        {
            if (index != ANIMATIONS_INDEX) this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null) return error;
        }

        // <primitives>
        var index;
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else 
        {
            if (index != PRIMITIVES_INDEX) this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null) return error;
        }

        // <components>
        var index;
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else 
        {
            if (index != COMPONENTS_INDEX) this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null) return error;
        }
    }

     /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        var children = sceneNode.children;

        if(children.size != null) return "no children allowed for tag <scene>"

        //Get id of the root element.
        this.idRoot = this.reader.getString(sceneNode, 'root');
        
        if (this.idRoot == null) return "no root element defined for <scene>";

        //Get axis length.
        this.referenceLength = this.reader.getString(sceneNode, 'axis_length');
        if(!(this.referenceLength != null && !isNaN(this.referenceLength)))
        {
            this.onXMLMinorError("no axis length defined for <scene>; assuming 'axis_length=1.0'");
            this.referenceLength = 1.0;
        }        
        console.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block. 
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

        this.views = [];
        this.defaultView;
        var viewsId = [];

        if(viewsNode.nodeName != "views") return "invalid tag, <view> - <" + viewsNode.nodeName + ">";

        var viewDefault = this.reader.getString(viewsNode,'default');
        if(viewDefault == null) return "no Default name for view";

        var children = viewsNode.children;

        if(children.length == 0) return "Scene must have at least one view";

        var defaultFound = false;

        for(var i = 0; i < children.length; i++)
        {
            var view = new Object();

            if(children[i].nodeName != "perspective" && children[i].nodeName != "ortho") return "invalid child tag, must be \"perspective\" or \"ortho\" on views tag";
            view.type = children[i].nodeName;

            let viewId = this.reader.getString(children[i], 'id');
            if(viewId == null) return "no ID defined for " + children[i].nodeName + " view";
            view.id = viewId;

            // Checks for repeated IDs.
            if (viewsId[viewId] != null) return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            var isDefaultView = false;

            if(viewId == viewDefault)
            {
                defaultFound = true;
                isDefaultView = true;
            }

            let viewNear = this.reader.getFloat(children[i], 'near');
            if(!(viewNear != null && !isNaN(viewNear))) return "unable to parse near component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.near = viewNear;
            
            let viewFar = this.reader.getFloat(children[i], 'far');
            if(!(viewFar != null && !isNaN(viewFar))) return "unable to parse far component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.far = viewFar;
            
            if(children[i].nodeName == "ortho")
            {
                let viewLeft = this.reader.getFloat(children[i], 'left');
                if(!(viewLeft != null && !isNaN(viewLeft))) return "unable to parse left component of the " + children[i].nodeName + " view with ID = " + viewId;
                view.left = viewLeft;

                let viewRight = this.reader.getFloat(children[i], 'right');
                if(!(viewRight != null && !isNaN(viewRight))) return "unable to parse right component of the " + children[i].nodeName + " view with ID = " + viewId;
                view.right = viewRight;

                let viewTop = this.reader.getFloat(children[i], 'top');
                if(!(viewTop != null && !isNaN(viewTop))) return "unable to parse top component of the " + children[i].nodeName + " view with ID = " + viewId;
                view.top = viewTop;

                let viewBottom = this.reader.getFloat(children[i], 'bottom');
                if(!(viewBottom != null && !isNaN(viewBottom))) return "unable to parse bottom component of the " + children[i].nodeName + " view with ID = " + viewId;
                view.bottom = viewBottom;
            }
            else
            {
                let viewAngle = this.reader.getFloat(children[i], 'angle');
                if(!(viewAngle != null && !isNaN(viewAngle))) return "unable to parse angle component of the " + children[i].nodeName + " view with ID = " + viewId;
                view.angle = viewAngle;
            }
            
            var grandChildren = children[i].children;
            
            if(grandChildren.length != 2) return "no \"from\" and \"to\" tags defined";

            var fromPos = [];
            var toPos = [];

            if(grandChildren[0].nodeName == "from") this.parseXYZw(grandChildren,fromPos,0,"perspective","from","none");
            else return "wrong tag to perspective view for ID = " + viewId + ", must be \"from\"";
            
            if(grandChildren[1].nodeName == "to") this.parseXYZw(grandChildren,toPos,1,"perspective","to","none");
            else return "wrong tag to perspective view for ID = " + viewId + ", must be \"to\"";

            view.from = vec3.fromValues(fromPos[0],fromPos[1], fromPos[2]);
            view.to = vec3.fromValues(toPos[0],toPos[1], toPos[2]);

            viewsId[viewId] = viewId;            
            this.views.push(view);

            if(isDefaultView)
            {
                this.defaultView = view;
            }
        }
        
        if(!defaultFound) return "default view with ID = " + viewDefault + " not found";
        
        console.log("Parsed views");        

        return null;
    }

     /**
     * Parses the <ambient> block. 
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        
        var children = ambientNode.children;

        var AMB_INDEX = 0;
        var BCK_INDEX = 1;

        this.ambient = [];
        this.background = [];

        var error;

        if(children.length != 2) return "wrong number of child tags for ambient";

        // Retrieves the global ambient component.
        if (children[AMB_INDEX].nodeName == "ambient") 
        {   
            var d1 = [];     
            if((error = this.parseRGBA(children, d1, AMB_INDEX, "ambient", "ambient light", "none")) != null) return error;                
            this.ambient.r = d1[0];
            this.ambient.g = d1[1];
            this.ambient.b = d1[2];
            this.ambient.a = d1[3];
        }       
        else 
            return "unexpected child tag of <ambient> - <"+ children[AMB_INDEX].nodeName + ">";

        // Retrieves the background clear color component.
        if (children[BCK_INDEX].nodeName == "background")
        {
            var d2 = [];
            if((error = this.parseRGBA(children, d2, BCK_INDEX, "background clear color", "background color", "none")) != null) return error;                
            this.background.r = d2[0];
            this.background.g = d2[1];
            this.background.b = d2[2];
            this.background.a = d2[3];
        }
        else 
            return "unexpected child tag of <background> - <"+ children[BCK_INDEX].nodeName + ">";
  
        console.log("Parsed ambient");

        return null;
    }

     /**
     * Parses the <ligts> block. 
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) 
    {
        var children = lightsNode.children;

        var lightIds = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];
        
        for(var i = 0; i < children.length; i++) 
        {
            var light = new Object();

            // verifies the type of the light.
            if(children[i].nodeName != "omni" && children[i].nodeName != "spot")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }  
            
            // Get id of the current light.
            let lightId = this.reader.getString(children[i], 'id');
            if(lightId == null) return "no ID defined for light";
            light.id = lightId;
            
            // Checks for repeated IDs.
            if (lightIds[lightId] != null) return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            
            // Specifications for the current light.
            grandChildren = children[i].children;

            nodeNames = [];            
            for(var j = 0; j < grandChildren.length; j++) nodeNames.push(grandChildren[j].nodeName);

            // Gets indices of each element.          
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
    
            // Omni/Spot
            var enableIndex = this.reader.getString(children[i], 'enabled');
            if(!(enableIndex != null && !isNaN(enableIndex) && (enableIndex == 0 || enableIndex == 1)))
            {         
                this.onXMLMinorError("no enable index defined for light ID = " + lightId + "; assuming true(1)"); 
                light.enableLight = true;
            }
            else 
                light.enable = ((enableIndex == 0) ? false : true);
            
            var error;

            // Retrieves the light position.
            var locationLight = [];
            if((error = this.parseXYZw(grandChildren, locationLight, locationIndex, "lights", "location", lightId, true)) != null) return error;
            else
            {
                light.location = new Object();
                light.location.x = locationLight[1];
                light.location.y = locationLight[2];
                light.location.z = locationLight[3];
                light.location.w = locationLight[4];
            }
                  
            // Retrieves the ambient component.
            var ambientIllumination = [];      
            if((error = this.parseRGBA(grandChildren, ambientIllumination, ambientIndex, "lights", "ambient", lightId)) != null) return error;
            else
            {
                light.ambient = new Object();
                light.ambient.r = ambientIllumination[1];
                light.ambient.g = ambientIllumination[2];
                light.ambient.b = ambientIllumination[3];
                light.ambient.a = ambientIllumination[4];
            }

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            if((error = this.parseRGBA(grandChildren, diffuseIllumination, diffuseIndex, "lights", "diffuse", lightId)) != null) return error;
            else
            {
                light.diffuse = new Object();
                light.diffuse.r = diffuseIllumination[1];
                light.diffuse.g = diffuseIllumination[2];
                light.diffuse.b = diffuseIllumination[3];
                light.diffuse.a = diffuseIllumination[4];
            }

            // Retrieves the specular component.
            var specularIllumination = [];
            if((error = this.parseRGBA(grandChildren, specularIllumination, specularIndex, "lights", "specular", lightId)) != null) return error;
            else
            {
                light.specular = new Object();
                light.specular.r = specularIllumination[1];
                light.specular.g = specularIllumination[2];
                light.specular.b = specularIllumination[3];
                light.specular.a = specularIllumination[4];
            }

            if(children[i].nodeName == "spot")
            {     
                light.type = "spot";

                // indices extra of the spot light    
                var angleIndex = this.reader.getString(children[i],'angle');
                var exponentIndex = this.reader.getString(children[i],'exponent');
                var targetIndex = nodeNames.indexOf("target");

                // angle
                if(!(angleIndex != null && !isNaN(angleIndex))) return "unable to parse value component of the 'angle light' field for ID = " + lightId;
                else if(angleIndex < 0 || angleIndex > 360) this.onXMLMinorError("angle of spot light out of range [0, 360] with ID = " + lightId);
                else light.angle = angleIndex;

                // exponent
                if (!(exponentIndex != null && !isNaN(exponentIndex))) return "unable to parse value component of the 'exponent light' field for ID = " + lightId;
                else if(exponentIndex < 0) return "exponent of spot light with ID = " + lightId + " can not be negative";
                else light.exponent = exponentIndex;

                // Retrieves the light target.
                var targetLight = [];
                if((error = this.parseXYZw(grandChildren, targetLight, targetIndex, "lights", "target", lightId, false)) != null) return error;                
                else
                {
                    light.target = new Object();
                    light.target.x = targetLight[1];
                    light.target.y = targetLight[2];
                    light.target.z = targetLight[3];
                }
            }
            else 
                light.type = "omni";

            this.lights.push(light);
            lightIds[lightId] = lightId;
            numLights++;            
        }
        
        if(numLights == 0) return "at least one light must be defined";
        else if(numLights > 8) this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        console.log("Parsed lights");

        return null;
    }

     /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        
        this.textures = [];
        var texturesId = [];
        var numTextures = 0;
        var children = texturesNode.children;
        
        for(var i = 0; i < children.length; i++) 
        {
            var texture = new Object();

            // verifies the type of the texture.
            if(children[i].nodeName != "texture")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }  
            
            // Get id of the current texture.
            let textureId = this.reader.getString(children[i], 'id');
            if(textureId == null || textureId == "") return "no ID defined";
           
            // Checks for repeated IDs.
            if (texturesId[textureId] != null) return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            let fileLink = this.reader.getString(children[i],'file');
            if(fileLink == null || fileLink == "") return "no file location defined for texture with ID = " + textureId;

            texture.id = textureId;
            texture.file = fileLink;

            texture.text = new CGFtexture(this.scene, texture.file);

            this.textures.push(texture);

            texturesId[textureId] = textureId;
            numTextures++;
        }

        if(numTextures == 0) return "at least one texture must be defined";

        console.log("Parsed textures");

        return null;
    }

     /**
     * Parses the <materials> block. 
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;

        this.materials = [];

        var materialsId = [];
        var numMaterials = 0;
        var grandChildren = [];
        var nodeNames = [];
        var paramsMaterial = [];

        for(var i = 0; i < children.length; i++)
        {
            var material = new Object();

            // verifies if it is a material.
            if (children[i].nodeName != "material")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get id of the current material.
            let materialId = this.reader.getString(children[i],'id');
            if(materialId == null || materialId == "") return "no ID defined for material";

            // verification of multiple ID's.
            if(materialsId[materialId] != null) return "ID must be unique for each material (conflict: ID = " + materialId + ")"; 

            // get shininess of the current material.
            let shininess = this.reader.getFloat(children[i],'shininess');
            if(shininess == null || shininess == "") return "no shininess defined for material with ID = " + shininess;

            // Specification for the current material.
            grandChildren = children[i].children;
            nodeNames = [];

            if(grandChildren.length != 4) return "wrong number of tags for a material with ID = " + materialId + ". It must have 4 tags [\"emission\", \"ambient\", \"diffuse\", \"specular\"]";
            

            for(var j = 0; j < grandChildren.length; j++)  nodeNames.push(grandChildren[j].nodeName);
            
            let emissionIndex = nodeNames.indexOf("emission");
            let ambientIndex = nodeNames.indexOf("ambient");
            let diffuseIndex = nodeNames.indexOf("diffuse");
            let specularIndex = nodeNames.indexOf("specular");
                        
            // auxiliar structure to store one material
            paramsMaterial = [];
            var error;

            // retrieves the material's emission
            var emission = [];
            if((error = this.parseRGBA(grandChildren, emission, emissionIndex, "material", "emission", materialId)) != null) return error;
            else paramsMaterial.push(emission);

            // retrieves the material's ambient            
            var ambient = [];
            if((error = this.parseRGBA(grandChildren, ambient, ambientIndex, "material", "ambient", materialId)) != null) return error;
            else paramsMaterial.push(ambient);
            
            // retrieves the material's diffuse
            var diffuse = [];
            if((error = this.parseRGBA(grandChildren, diffuse, diffuseIndex, "material", "diffuse", materialId)) != null) return error;
            else paramsMaterial.push(diffuse);

            // retrieves the material's specular
            var specular = [];
            if((error = this.parseRGBA(grandChildren, specular, specularIndex, "material", "specular", materialId)) != null) return error;
            else paramsMaterial.push(specular);

            material.id = materialId;
            material.shininess = shininess;

            material.emission = new Object();
            material.emission.r = paramsMaterial[0][1];
            material.emission.g = paramsMaterial[0][2];
            material.emission.b = paramsMaterial[0][3];
            material.emission.a = paramsMaterial[0][4];

            material.ambient = new Object();
            material.ambient.r = paramsMaterial[1][1];
            material.ambient.g = paramsMaterial[1][2];
            material.ambient.b = paramsMaterial[1][3];
            material.ambient.a = paramsMaterial[1][4];

            material.diffuse = new Object();
            material.diffuse.r = paramsMaterial[2][1];
            material.diffuse.g = paramsMaterial[2][2];
            material.diffuse.b = paramsMaterial[2][3];
            material.diffuse.a = paramsMaterial[2][4];

            material.specular = new Object();
            material.specular.r = paramsMaterial[3][1];
            material.specular.g = paramsMaterial[3][2];
            material.specular.b = paramsMaterial[3][3];
            material.specular.a = paramsMaterial[3][4];

            material.mat = new CGFappearance(this.scene);
            material.mat.setEmission(material.emission.r, material.emission.g, material.emission.b, material.emission.a);
            material.mat.setAmbient(material.ambient.r, material.ambient.g, material.ambient.b, material.ambient.a);
            material.mat.setDiffuse(material.diffuse.r, material.diffuse.g, material.diffuse.b, material.diffuse.a);
            material.mat.setSpecular(material.specular.r, material.specular.g, material.specular.b, material.specular.a);
            material.mat.setShininess(material.shininess);

            // structure to store materials
            this.materials.push(material);            
            // Material with materialId stored correclty
            materialsId[materialId] = materialId;
            numMaterials++;
        }

        if(numMaterials == 0) return "at least one material must be defined";

        console.log("Parsed materials");

        return null;
    }

     /**
     * Parses the <transformations> block. 
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;

        this.transformations = [];

        var transformationsId = [];
        var numTransformations = 0;
        var grandChildren = [];

        for(var i = 0; i < children.length; i++)
        {
            var transformation = new Object();
             
            // verifies if it is a transformation.
            if (children[i].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get id of the current transformation.
            let transformationId = this.reader.getString(children[i],'id');
            if( transformationId == null || transformationId == "") return "no ID defined for transformation";
            transformation.id = transformationId;

            if(transformationsId[transformationId] != null) return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            // Specification for the current transformation
            grandChildren = children[i].children;

            var ret = this.parseTransformation(this.scene, grandChildren, transformationId);

            if(ret != null) return ret;

            transformation.matrix = this.scene.getMatrix();

            this.transformations.push(transformation);

            transformationsId[transformationId] = transformationId;
            numTransformations++;
        }

        if(numTransformations == 0) return "at least one transformation must be defined";

        console.log("Parsed transformations");

        return null;
    }

     /**
     * Parses the <animations> block. 
     * @param {animations block element} animationsNode
     */ 
    parseAnimations(animationsNode) {

        var children = animationsNode.children;

        this.animations = [];
        
        var animationsId = [];      
        var grandChildren = [];

        for(var i = 0; i < children.length; i++)
        {
            var animation = new Object();

            // verifies if it is a possible child tag for animation
            if (children[i].nodeName != "linear" &&
                children[i].nodeName != "circular"
                )
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Must be \"linear\" or \"circular\"");
                continue;
            }

            animation.type = children[i].nodeName;

            //get id of the current animation
            let animationId = this.reader.getString(children[i],'id');
            if(animationId == null || animationId == "") return "no ID defined for animation";
            animation.id = animationId;

            if(animationsId[animationId] != null) return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            // gets span tag
            let span = this.reader.getFloat(children[i],'span');
            if(!(span != null && !isNaN(span))) return "unable to parse span value of the animation with ID = " + animationId;
            else if(span < 0) return "invalid value for span tag, it must be greater than 0, animation with ID = " + animationId;
            else animation.span = span;

            if(children[i].nodeName == "circular")
            {
                // gets the center of the circular animation
                let center = [];
                center = this.reader.getString(children[i], 'center').split(" ").map(Number);
                if(center.length != 3) return "wrong number of center tag of the animation with ID = " + animationId;

                for(let i = 0; i < center.length; i++)
                {
                    if(!(center[i] != null && !isNaN(center[i]))) return "unable to parse center[" + (i == 0 ? "x" : (i == 1 ? "y" : "z") ) + "] value of the animation with ID = " + animationId;
                }
                animation.center = center;
                
                // gets the radius of the animation
                let radius = this.reader.getFloat(children[i],'radius');
                if(!(radius != null && !isNaN(radius))) return "unable to parse radius value of the animation with ID = " + animationId;
                else if(radius < 0) return "wrong value for the radius, it must be greater than 0, animation with ID = " + animationId;
                else animation.radius = radius;

                // gets the start angle of the animation
                let startang = this.reader.getFloat(children[i],'startang');
                if(!(startang != null && !isNaN(startang))) return "unable to parse startang value of the animation with ID = " + animationId;
                else animation.startang = startang;
                
                if(startang > 0 && startang < 2*Math.PI) this.onXMLMinorError("reinforce that startangle is in Degrees, animation with ID = " + animationId);
                
                // gets the rotation angle of the animation
                let rotang = this.reader.getFloat(children[i],'rotang');
                if(!(rotang != null && !isNaN(rotang))) return "unable to parse rotang value of the animation with ID = " + animationId;
                else animation.rotang = rotang;
                
                if(rotang > 0 && rotang < 2*Math.PI) this.onXMLMinorError("reinforce that rotang is in Degrees, animation with ID = " + animationId);
            }
            else
            {
                grandChildren = children[i].children;
                
                var numControlPoints = 0;
                var controlPoints = [];
                var controlPoint = [];

                for(let i = 0; i < grandChildren.length; i++)
                {
                    if(grandChildren[i].nodeName != "controlpoint")
                    {
                        this.onXMLMinorError("wrong child tag <" + grandChildren[i].nodeName + "> for linear animation with ID = " + animationId);
                        continue;
                    }
                    
                    controlPoint = [];

                    var xx = this.reader.getFloat(grandChildren[i],'xx');
                    if(!(xx != null && !isNaN(xx))) return "unable to parse xx value of the controlpoint[" + (i + 1) + "], animation with ID = " + animationId;
                    else controlPoint[0] = xx;

                    var yy = this.reader.getFloat(grandChildren[i],'yy');
                    if(!(yy != null && !isNaN(yy))) return "unable to parse yy value of the controlpoint[" + (i + 1) + "], animation with ID = " + animationId;
                    else controlPoint[1] = yy;

                    var zz = this.reader.getFloat(grandChildren[i],'zz');
                    if(!(zz != null && !isNaN(zz))) return "unable to parse zz value of the controlpoint[" + (i + 1) + "], animation with ID = " + animationId;
                    else controlPoint[2] = zz;
                    
                    controlPoints.push(controlPoint);
                    numControlPoints++;
                }

                if(numControlPoints < 2)
                    return "invalid number of control points (CP), linear animations must have more than 2 CP, animation with ID = " + animationId;

                animation.controlPoints = controlPoints;
            }
            
            if(animation.type == "linear")
            {
               animation.anim = new LinearAnimation(animation.span,animation.controlPoints);
            }
            else
            {
                animation.anim = new CircularAnimation(animation.span, animation.center, animation.radius, animation.startang,animation.rotang);
            }

            this.animations.push(animation);
            animationsId[animationId] = animationId;
        }

        console.log("Parsed animations");

        return null;
    }

     /**
     * Parses the <primitives> block. 
     * @param {primitives block element} primitivesNode
     */ 
    parsePrimitives(primitivesNode) {
        
        var children = primitivesNode.children;

        this.primitives = [];
        
        var primitivesId = [];
        var numPrimitives = 0;     
        var grandChildren = [];

        for(var i = 0; i < children.length; i++)
        {
            var primitive = new Object();

            // verifies if it is primitive.
            if (children[i].nodeName != "primitive")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Must be \"primitive\"");
                continue;
            }
            
            // get id of the current primitive
            var primitiveId = this.reader.getString(children[i],'id');
            if(primitiveId == null || primitiveId == "") return "no ID defined for primitive";
            
            primitive.id = primitiveId;

            if(primitivesId[primitiveId] != null) return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";
        
            // Specification for the current primitive. Verifies if it is one of the primitives.
            grandChildren = children[i].children;

            if(grandChildren.length != 1) return "there is more that one tag for this primitive with id = " + primitiveId;

            if(grandChildren[0].nodeName != "rectangle" &&
                grandChildren[0].nodeName != "triangle" &&
                    grandChildren[0].nodeName != "cylinder" &&
                        grandChildren[0].nodeName != "sphere" &&
                            grandChildren[0].nodeName != "torus" && 
                                grandChildren[0].nodeName != "plane" && 
                                    grandChildren[0].nodeName != "patch" && 
                                        grandChildren[0].nodeName != "vehicle" && 
                                            grandChildren[0].nodeName != "cylinder2" && 
                                                grandChildren[0].nodeName != "terrain" && 
                                                    grandChildren[0].nodeName != "water" &&
                                                        grandChildren[0].nodeName != "board" &&
                                                            grandChildren[0].nodeName != "plant")
            {
                this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + "> with ID = " + primitiveId);
                continue;
            }
            
            primitive.type = grandChildren[0].nodeName;

            // RECTANGLE
            if(primitive.type == "rectangle")
            {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0],'x1');
                if(!(x1 != null && !isNaN(x1))) return "unable to parse x1-coordinate of the rectangle primitive for ID = " + primitiveId;
                else primitive.x1 = x1;
                // y1
                var y1 = this.reader.getFloat(grandChildren[0],'y1');
                if(!(y1 != null && !isNaN(y1))) return "unable to parse y1-coordinate of the rectangle primitive for ID = " + primitiveId;
                else primitive.y1 = y1;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0],'x2');
                if(!(x2 != null && !isNaN(x2))) return "unable to parse x2-coordinate of the rectangle primitive for ID = " + primitiveId;
                else primitive.x2 = x2;
                // y2
                var y2 = this.reader.getFloat(grandChildren[0],'y2');
                if(!(y2 != null && !isNaN(y2))) return "unable to parse y2-coordinate of the rectangle primitive for ID = " + primitiveId;
                else primitive.y2 = y2;
            }
            // TRIANGLE
            else if(primitive.type == "triangle")
            {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0],'x1');
                if(!(x1 != null && !isNaN(x1))) return "unable to parse x1-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.x1 = x1;
                // y1
                var y1 = this.reader.getFloat(grandChildren[0],'y1');
                if(!(y1 != null && !isNaN(y1))) return "unable to parse y1-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.y1 = y1;
                // z1
                var z1 = this.reader.getFloat(grandChildren[0],'z1');
                if(!(z1 != null && !isNaN(z1))) return "unable to parse z1-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.z1 = z1;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0],'x2');
                if(!(x2 != null && !isNaN(x2))) return "unable to parse x2-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.x2 = x2;
                // y2
                var y2 = this.reader.getFloat(grandChildren[0],'y2');
                if(!(y2 != null && !isNaN(y2))) return "unable to parse y2-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.y2 = y2;
                // z2
                var z2 = this.reader.getFloat(grandChildren[0],'z2');
                if(!(z2 != null && !isNaN(z2))) return "unable to parse z2-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.z2 = z2;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0],'x3');
                if(!(x3 != null && !isNaN(x3))) return "unable to parse x3-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.x3 = x3;
                // y3
                var y3 = this.reader.getFloat(grandChildren[0],'y3');
                if(!(y3 != null && !isNaN(y3))) return "unable to parse y3-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.y3 = y3;
                // z3
                var z3 = this.reader.getFloat(grandChildren[0],'z3');
                if(!(z3 != null && !isNaN(z3))) return "unable to parse z3-coordinate of the triangle primitive for ID = " + primitiveId;
                else primitive.z3 = z3; 
            }
            // CYLINDER
            else if(primitive.type == "cylinder")
            {
                // base
                var base = this.reader.getFloat(grandChildren[0],'base');
                if(!(base != null && !isNaN(base))) return "unable to parse base of the Cylinder primitive for ID = " + primitiveId;
                else primitive.base = base;

                // top
                var top = this.reader.getFloat(grandChildren[0],'top');
                if(!(top != null && !isNaN(top))) return "unable to parse top of the Cylinder primitive for ID = " + primitiveId;
                else primitive.top = top;

                // height
                var height = this.reader.getFloat(grandChildren[0],'height');
                if(!(height != null && !isNaN(height))) return "unable to parse height of the Cylinder primitive for ID = " + primitiveId;
                else primitive.height = height;

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices))) return "unable to parse slices of the Cylinder primitive for ID = " + primitiveId;
                else if(slices % 1 != 0) return "slices parameter of Cylinder must be an integer for ID = " + primitiveId;
                else primitive.slices = slices;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0],'stacks');
                if(!(stacks != null && !isNaN(stacks))) return "unable to parse stacks of the Cylinder primitive for ID = " + primitiveId;
                else if(stacks % 1 != 0) return "stacks parameter of Cylinder must be an integer for ID = " + primitiveId;
                else primitive.stacks = stacks;                
            }
            // SPHERE
            else if(primitive.type == "sphere")
            {
                // radius
                var radius = this.reader.getFloat(grandChildren[0],'radius');
                if(!(radius != null && !isNaN(radius))) return "unable to parse radius of the Sphere primitive for ID = " + primitiveId;
                else primitive.radius = radius;

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices))) return "unable to parse slices of the Sphere primitive for ID = " + primitiveId;
                else if(slices % 1 != 0) return "slices parameter of Sphere must be an integer for ID = " + primitiveId;
                else primitive.slices = slices;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0],'stacks');
                if(!(stacks != null && !isNaN(stacks))) return "unable to parse stacks of the Sphere primitive for ID = " + primitiveId;
                else if(stacks % 1 != 0) return "stacks parameter of Sphere must be an integer for ID = " + primitiveId;
                else primitive.stacks = stacks;                
            }
            // TORUS
            else if(primitive.type == "torus")
            {
                // inner
                var inner = this.reader.getFloat(grandChildren[0],'inner');
                if(!(inner != null && !isNaN(inner))) return "unable to parse inner of the Torus primitive for ID = " + primitiveId;
                else primitive.inner = inner;

                // outer
                var outer = this.reader.getFloat(grandChildren[0],'outer');
                if(!(outer != null && !isNaN(outer))) return "unable to parse inner of the Torus primitive for ID = " + primitiveId;
                else primitive.outer = outer;

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices))) return "unable to parse slices of the Torus primitive for ID = " + primitiveId;
                else if(slices % 1 != 0) return "slices parameter of Torus must be an integer for ID = " + primitiveId;
                else primitive.slices = slices;

                // loops
                var loops = this.reader.getFloat(grandChildren[0],'loops');
                if(!(loops != null && !isNaN(loops))) return "unable to parse loops of the Torus primitive for ID = " + primitiveId;
                else if(loops % 1 != 0) return "loops parameter of Torus must be an integer for ID = " + primitiveId;
                else primitive.loops = loops;
            }
            // PLANE
            else if(primitive.type == "plane")
            {       
                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0],'npartsU');
                if(!(npartsU != null && !isNaN(npartsU))) return "unable to parse npartsU of the Plane primitive for ID = " + primitiveId;                
                else if(npartsU % 1 != 0) return "npartsU parameter of Plane must be an integer for ID = " + primitiveId;
                else primitive.npartsU = npartsU;
                
                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0],'npartsV');
                if(!(npartsV != null && !isNaN(npartsV))) return "unable to parse npartsV of the Plane primitive for ID = " + primitiveId;                
                else if(npartsV % 1 != 0) return "npartsV parameter of Plane must be an integer for ID = " + primitiveId;
                else primitive.npartsV = npartsV;
            }
            //PATCH
            else if(primitive.type == "patch")
            {     
                // npointsU
                var npointsU = this.reader.getFloat(grandChildren[0],'npointsU');
                if(!(npointsU != null && !isNaN(npointsU))) return "unable to parse npointsU of the Patch primitive for ID = " + primitiveId;                
                else if(npointsU % 1 != 0) return "npointsU parameter of Patch must be an integer for ID = " + primitiveId;
                else if(npointsU <= 0) return "npointsU parameter of Patch must be greater than 1 for ID = " + primitiveId;
                else primitive.npointsU = npointsU;
                
                // npointsV
                var npointsV = this.reader.getFloat(grandChildren[0],'npointsV');
                if(!(npointsV != null && !isNaN(npointsV))) return "unable to parse npointsV of the Patch primitive for ID = " + primitiveId;                
                else if(npointsV % 1 != 0) return "npointsV parameter of Patch must be an integer for ID = " + primitiveId;
                else if(npointsV <= 0) return "npointsV parameter of Patch must be greater than 1 for ID = " + primitiveId;
                else primitive.npointsV = npointsV;

                // npartsU
                var npartsU = this.reader.getFloat(grandChildren[0],'npartsU');
                if(!(npartsU != null && !isNaN(npartsU))) return "unable to parse npartsU of the Patch primitive for ID = " + primitiveId;                
                else if(npartsU % 1 != 0) return "npartsU parameter of Patch must be an integer for ID = " + primitiveId;
                else primitive.npartsU = npartsU;
                
                // npartsV
                var npartsV = this.reader.getFloat(grandChildren[0],'npartsV');
                if(!(npartsV != null && !isNaN(npartsV))) return "unable to parse npartsV of the Patch primitive for ID = " + primitiveId;                
                else if(npartsV % 1 != 0) return "npartsV parameter of Patch must be an integer for ID = " + primitiveId;
                else primitive.npartsV = npartsV;

                grandChildren = grandChildren[0].children;

                if(grandChildren.length != npointsU * npointsV) return "wrong number of control points of Patch primitive for ID = " + primitiveId;
                
                var numControlPoints = 0;
                var controlPoints = [];
                var controlPoint = [];    

                for(let i = 0; i < grandChildren.length; i++)
                {
                    if(grandChildren[i].nodeName != "controlPoint")
                    {
                        this.onXMLMinorError("wrong child tag <" + grandChildren[i].nodeName + "> for patch primitive with ID = " + primitiveId);
                        continue;
                    }
                    
                    controlPoint = [];

                    var xx = this.reader.getFloat(grandChildren[i],'xx');
                    if(!(xx != null && !isNaN(xx))) return "unable to parse xx value of the controlPoint[" + (i + 1) + "], patch primitive with ID = " + primitiveId;
                    else controlPoint[0] = xx;

                    var yy = this.reader.getFloat(grandChildren[i],'yy');
                    if(!(yy != null && !isNaN(yy))) return "unable to parse yy value of the controlPoint[" + (i + 1) + "], patch primitive with ID = " + primitiveId;
                    else controlPoint[1] = yy;

                    var zz = this.reader.getFloat(grandChildren[i],'zz');
                    if(!(zz != null && !isNaN(zz))) return "unable to parse zz value of the controlPoint[" + (i + 1) + "], patch primitive with ID = " + primitiveId;
                    else controlPoint[2] = zz;

                    controlPoint[3] = 1.0;

                    controlPoints.push(controlPoint);
                    numControlPoints++;                
                }

                if(numControlPoints != npointsU * npointsV) return "wrong number of correct control points of Patch primitive for ID = " + primitiveId;
                
                var cp = [];
                var cpV = [];
                let counter = 0;

                for(let i = 0; i < npointsU; i++)
                {
                    cpV = [];
                    for(let j = 0; j < npointsV; j++)
                    {
                        cpV.push(controlPoints[counter]);
                        counter++;
                    }
                    cp.push(cpV);
                }
                
                primitive.controlPoints = cp;
            }
            //CYLINDER2
            else if(primitive.type == "cylinder2")
            {
                // base
                var base = this.reader.getFloat(grandChildren[0],'base');
                if(!(base != null && !isNaN(base))) return "unable to parse base of the Cylinder2";
                else primitive.base = base;
                
                // top
                var top = this.reader.getFloat(grandChildren[0],'top');
                if(!(top != null && !isNaN(top))) return "unable to parse top of the Cylinder2";
                else primitive.top = top;
                
                // height
                var height = this.reader.getFloat(grandChildren[0],'height');
                if(!(height != null && !isNaN(height))) return "unable to parse height of the Cylinder2";
                else primitive.height = height;
                    
                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices))) return "unable to parse slices of the Cylinder2 primitive";                
                else if(slices % 1 != 0) return "slices parameter of Plane must be an integer";
                else primitive.slices = slices;
                
                // stacks
                var stacks = this.reader.getFloat(grandChildren[0],'stacks');
                if(!(stacks != null && !isNaN(stacks))) return "unable to parse stacks of the Cylinder2 primitive";                
                else if(stacks % 1 != 0) return "stacks parameter of Cylinder2 must be an integer";
                else primitive.stacks = stacks;
            }
            // TERRAIN
            else if(primitive.type == "terrain")
            {
                // idtexture
                var idtexture = this.reader.getString(grandChildren[0],'idtexture');
                if(idtexture == null || idtexture == "") return "unable to parse idtexture of the terrain primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idtexture)
                        {
                            primitive.idtexture = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idtexture, primitive with ID = " + primitiveId;
                
                }

                // idheightmap
                var idheightmap = this.reader.getString(grandChildren[0],'idheightmap');
                if(idheightmap == null || idheightmap == "") return "unable to parse idheightmap of the terrain primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idheightmap)
                        {
                            primitive.idheightmap = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idheightmap, primmitive with ID = " + primitiveId;
                
                }

                // parts
                var parts = this.reader.getFloat(grandChildren[0],'parts');
                if(!(parts != null && !isNaN(parts))) return "unable to parse parts of the terrain primitive for ID = " + primitiveId;               
                else if(parts % 1 != 0) return "parts parameter of Cylinder2 must be an integer";
                else primitive.parts = parts;

                // heightscale
                var heightscale = this.reader.getFloat(grandChildren[0],'heightscale');
                if(!(heightscale != null && !isNaN(heightscale))) return "unable to parse heightscale of the terrain primitive for ID = " + primitiveId;               
                else primitive.heightscale = heightscale;
            }
            // WATER
            else if(primitive.type == "water")
            {
                // idtexture
                var idtexture = this.reader.getString(grandChildren[0],'idtexture');
                if(idtexture == null || idtexture == "") return "unable to parse idtexture of the terrain primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idtexture)
                        {
                            primitive.idtexture = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idtexture, primitive with ID = " + primitiveId;
                
                }

                // idwavemap
                var idwavemap = this.reader.getString(grandChildren[0],'idwavemap');
                if(idwavemap == null || idwavemap == "") return "unable to parse idwavemap of the terrain primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idtexture)
                        {
                            primitive.idwavemap = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idwavemap, primitive with ID = " + primitiveId;
                
                }

                // parts
                var parts = this.reader.getFloat(grandChildren[0],'parts');
                if(!(parts != null && !isNaN(parts))) return "unable to parse parts of the terrain primitive for ID = " + primitiveId;               
                else if(parts % 1 != 0) return "parts parameter of Cylinder2 must be an integer";
                else primitive.parts = parts;

                // heightscale
                var heightscale = this.reader.getFloat(grandChildren[0],'heightscale');
                if(!(heightscale != null && !isNaN(heightscale))) return "unable to parse heightscale of the terrain primitive for ID = " + primitiveId;               
                else primitive.heightscale = heightscale;

                // texscale
                var texscale = this.reader.getFloat(grandChildren[0],'texscale');
                if(!(texscale != null && !isNaN(texscale))) return "unable to parse texscale of the terrain primitive for ID = " + primitiveId;               
                else primitive.texscale = texscale;                
            }
            // BOARD
            else if(primitive.type == "board")
            {
                // npartsX
                var npartsX = this.reader.getFloat(grandChildren[0],'npartsX');
                if(!(npartsX != null && !isNaN(npartsX))) return "unable to parse npartsX of the Board primitive for ID = " + primitiveId;                
                else if(npartsX % 1 != 0) return "npartsX parameter of Board must be an integer for ID = " + primitiveId;
                else if(npartsX < 0) return "npartsX parameter of Board must be greater than zero for ID = " + primitiveId;
                else primitive.npartsX = npartsX;

                // npartsY
                var npartsY = this.reader.getFloat(grandChildren[0],'npartsY');
                if(!(npartsY != null && !isNaN(npartsY))) return "unable to parse npartsY of the Board primitive for ID = " + primitiveId;                
                else if(npartsY % 1 != 0) return "npartsY parameter of Board must be an integer for ID = " + primitiveId;
                else if(npartsY < 0) return "npartsY parameter of Board must be an integer for ID = " + primitiveId;
                else primitive.npartsY = npartsY;

                // textureP1
                var idtextureP1 = this.reader.getString(grandChildren[0],'textureP1');
                if(idtextureP1 == null || idtextureP1 == "") return "unable to parse idtextureP1 of the Board primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idtextureP1)
                        {
                            primitive.idtextureP1 = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idtextureP1, primitive with ID = " + primitiveId;
                
                }

                // textureP2
                var idtextureP2 = this.reader.getString(grandChildren[0],'textureP2');
                if(idtextureP2 == null || idtextureP2 == "") return "unable to parse idtextureP2 of the Board primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == idtextureP2)
                        {
                            primitive.idtextureP2 = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference idtextureP2, primitive with ID = " + primitiveId;
                
                }

                // textureSelected
                var textureSelected = this.reader.getString(grandChildren[0],'textureSelected');
                if(textureSelected == null || textureSelected == "") return "unable to parse textureSelected of the Board primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == textureSelected)
                        {
                            primitive.textureSelected = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference textureSelected, primitive with ID = " + primitiveId;
                
                }

                // texturePiece1
                var texturePiece1 = this.reader.getString(grandChildren[0],'texturePiece1');
                if(texturePiece1 == null || texturePiece1 == "") return "unable to parse texturePiece1 of the Board primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == texturePiece1)
                        {
                            primitive.texturePiece1 = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference texturePiece1, primitive with ID = " + primitiveId;
                
                }

                // texturePiece2
                var texturePiece2 = this.reader.getString(grandChildren[0],'texturePiece2');
                if(texturePiece2 == null || texturePiece2 == "") return "unable to parse texturePiece2 of the Board primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == texturePiece2)
                        {
                            primitive.texturePiece2 = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference texturePiece2, primitive with ID = " + primitiveId;
                
                }
            }
            // PLANT
            else if(primitive.type == "plant")
            {
                // textureLeaves
                var textureLeaves = this.reader.getString(grandChildren[0],'textureLeaves');
                if(textureLeaves == null || textureLeaves == "") return "unable to parse textureLeaves of the Plant primitive for ID = " + primitiveId;
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == textureLeaves)
                        {
                            primitive.textureLeaves = this.textures[l].text;
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference textureLeaves, primitive with ID = " + primitiveId;
                
                }
            }
            
            if(primitive.type == "rectangle") primitive.obj = new Rectangle(this.scene, primitive.x1, primitive.y1, primitive.x2, primitive.y2);
            else if(primitive.type == "triangle") primitive.obj = new Triangle(this.scene, primitive.x1, primitive.y1, primitive.z1, primitive.x2, primitive.y2, primitive.z2, primitive.x3, primitive.y3, primitive.z3);
            else if(primitive.type == "cylinder") primitive.obj = new Cylinder(this.scene, primitive.base, primitive.top, primitive.height, primitive.slices, primitive.stacks);
            else if(primitive.type == "sphere") primitive.obj = new Sphere(this.scene, primitive.radius, primitive.slices, primitive.stacks);
            else if(primitive.type == "torus") primitive.obj = new Torus(this.scene, primitive.inner, primitive.outer, primitive.slices, primitive.loops);
            else if(primitive.type == "plane") primitive.obj = new Plane(this.scene, primitive.npartsU, primitive.npartsV);
            else if(primitive.type == "patch") primitive.obj = new Patch(this.scene, primitive.npointsU, primitive.npointsV, primitive.npartsV, primitive.npartsV, primitive.controlPoints);
            else if(primitive.type == "vehicle") primitive.obj = new Vehicle(this.scene);
            else if(primitive.type == "cylinder2") primitive.obj = new Cylinder2(this.scene, primitive.base, primitive.top, primitive.height, primitive.slices, primitive.stacks);
            else if(primitive.type == "terrain") primitive.obj = new Terrain(this.scene, primitive.idtexture, primitive.idheightmap, primitive.parts, primitive.heightscale);
            else if(primitive.type == "water") primitive.obj = new Water(this.scene, primitive.idtexture, primitive.idwavemap, primitive.parts, primitive.heightscale, primitive.texscale);
            else if(primitive.type == "board") primitive.obj = new Board(this.scene, primitive.npartsX, primitive.npartsY, primitive.idtextureP1, primitive.idtextureP2, primitive.textureSelected, primitive.texturePiece1, primitive.texturePiece2);            
            else if(primitive.type == "plant") primitive.obj = new Plant(this.scene, primitive.textureLeaves);            
            

            this.primitives.push(primitive);
            primitivesId[primitiveId] = primitiveId;
            numPrimitives++;
        }

        if(numPrimitives == 0) return "at least one primitive must be defined";

        console.log("Parsed primitives");

        return null;
    }

     /**
     * Parses the <components> block. 
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];
        
        var componentIds = [];
        var numComponents = 0;        
        var grandChildren = [];

        var root_found = false;

        for(var i = 0; i < children.length; i++)
        {
            var component = new Object();
            component.type = "component";
            
            // verifies if it is a component.
            if (children[i].nodeName != "component")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get id of the current component.
            let componentId = this.reader.getString(children[i],'id');
            if( componentId == null || componentId == "") return "no ID defined for component";
            component.id = componentId;

            if(componentIds[componentId] != null) return "ID must be unique for each component (conflict: ID = " + componentId + ")";

            if(componentId == this.idRoot)
            {
                root_found = true;
                this.rootElem = component;
            }

            this.components.push(component);
            componentIds[componentId] = componentId;
            numComponents++;
        }

        if(!root_found) return "did not find component matching declared root id: " + this.idRoot;

        if(numComponents == 0) return "at least one component must be defined";

        for(var i = 0; i < children.length; i++)
        {
            var COMP_TRANSF_INDEX = 0;
            var COMP_MAT_INDEX = 1;
            var COMP_TEXT_INDEX = 2;
            var COMP_CHLD_INDEX = 3;
            
            let componentId = this.reader.getString(children[i],'id');

            grandChildren = children[i].children;

            if(grandChildren.length == 5) 
            {
                var COMP_ANIM_INDEX = 1;
                var COMP_MAT_INDEX = 2;
                var COMP_TEXT_INDEX = 3;
                var COMP_CHLD_INDEX = 4;
            }
            else if(grandChildren.length != 4) return "invalid number of child tags for component with ID = " + componentId;

            var nodeNames = [];            
            for(var j = 0; j < grandChildren.length; j++) nodeNames.push(grandChildren[j].nodeName);

            // Gets indices of each element.    
            var transformationIndex = nodeNames.indexOf("transformation");
            var animationsIndex = nodeNames.indexOf("animations");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            if(transformationIndex != -1)
            {
                if(transformationIndex != COMP_TRANSF_INDEX) this.onXMLMinorError("tag <transformation> out of order for component with ID = " + componentId);

                if(grandChildren[transformationIndex].children.length != 0)
                {
                    // if transformationref
                    if(grandChildren[transformationIndex].children[0].nodeName == "transformationref")
                    {
                        if(grandChildren[transformationIndex].children.length != 1) return "tag <transformation> must have only one ref, component with ID = " + componentId;

                        let transformationrefId = this.reader.getString(grandChildren[transformationIndex].children[0], 'id');
                        if(transformationrefId == null) return "no ID defined for transformationref, component with ID = " + componentId;

                        var k = 0;

                        for(k; k < this.transformations.length; k++)
                        {
                            if(this.transformations[k].id == transformationrefId)
                            {
                                this.components[i].matrix = this.transformations[k].matrix;
                                break;
                            }
                        }

                        if(this.components[i].matrix == null) return "no matching transformation for tag <transformmationref> id = " + transformationrefId + ", component with ID = " + componentId;
                    }
                    else //if transformation defined "on the fly"
                    {   
                        var ret = this.parseTransformation(this.scene, grandChildren[transformationIndex].children, "undefined");
                        
                        if(ret != null) return ret;

                        this.components[i].matrix = this.scene.getMatrix();
                    }
                }
                else
                {
                    this.scene.loadIdentity();
                    this.components[i].matrix = this.scene.getMatrix();
                }
            }
            else
                return "unable to find transformation tag for component ID = " + componentId;

            if(grandChildren.length == 5 && animationsIndex != -1)
            {
                this.components[i].animations = [];

                if(animationsIndex != COMP_ANIM_INDEX) this.onXMLMinorError("tag <animations> out of order");
                
                if(grandChildren[animationsIndex].children.length >= 1) 
                {
                    for(let c = 0; c < grandChildren[animationsIndex].children.length; c++)
                    {
                        if(grandChildren[animationsIndex].children[c].nodeName != "animationref") return "children <" + grandChildren[animationsIndex].children[c].nodeName + "> not allowed for tag animation, component with ID = " + componentId;
                        
                        let animId = this.reader.getString(grandChildren[animationsIndex].children[c], 'id');
                        if(animId == null || animId == "") return "no ID defined for animation, component with ID = " + componentId;
                        else
                        {
                            var l = 0;
                            var idFound = false;

                            for(l; l < this.animations.length; l++)
                            {
                                if(this.animations[l].id == animId)
                                {
                                    this.components[i].animations[c] = Object.create(this.animations[l].anim);
                                    
                                    idFound = true;
                                    break;
                                }
                            }

                            if(!idFound) return "no animation matches the reference tag <animation> id = " + animId + ", component with ID = " + componentId;
                        }
                    }
                }
                else if(grandChildren[animationsIndex].children.length == 0) this.components[i].animation = null;
            }
            else if(grandChildren.length == 5)
                return "unable to find animations tag for component ID = " + componentId;

            if(materialsIndex != -1)
            {
                this.components[i].materials = [];

                if(materialsIndex != COMP_MAT_INDEX) this.onXMLMinorError("tag <materials> out of order for component with ID = " + componentId);

                if(grandChildren[materialsIndex].children.length == 0) return "tag <materials> must have children, component with ID = " + componentId;

                var k = 0;

                for(k; k < grandChildren[materialsIndex].children.length; k++)
                {
                    let matId = this.reader.getString(grandChildren[materialsIndex].children[k], 'id');
                    if(matId == null) return "no ID defined for material, component with ID = " + componentId;

                    // inheritance
                    if(matId == "inherit" || matId == "none")
                    {
                        var mat = new Object();
                        mat.id = matId;
                        this.components[i].materials.push(mat);
                        continue;
                    }

                    var l = 0;
                    var idFound = false;

                    for(l; l < this.materials.length; l++)
                    {
                        if(this.materials[l].id == matId)
                        {
                            this.components[i].materials.push(this.materials[l]);
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no material matches the reference tag <material> id = " + matId + ", component with ID = " + componentId;
                }
            }
            else   
                return "unable to find materials tag for component ID = " + componentId;
            
            if(textureIndex != -1)
            {
                this.components[i].texture = new Object();

                if(textureIndex != COMP_TEXT_INDEX) this.onXMLMinorError("tag <texture> out of order for component with ID = " + componentId);

                if(grandChildren[textureIndex].children.length != 0) return "no children allowed for tag texture, component with ID = " + componentId;

                let textId = this.reader.getString(grandChildren[textureIndex], 'id');
                if(textId == null) return "no ID defined for texture, component with ID = " + componentId;

                if(textId == "inherit" || textId == "none")
                {
                    var text = new Object();
                    text.id = textId;
                    this.components[i].texture.txt = text;
                }
                else
                {
                    var l = 0;
                    var idFound = false;

                    for(l; l < this.textures.length; l++)
                    {
                        if(this.textures[l].id == textId)
                        {
                            this.components[i].texture.txt = this.textures[l];
                            idFound = true;
                            break;
                        }
                    }

                    if(!idFound) return "no texture matches the reference tag <texture> id = " + textId + ", component with ID = " + componentId;
                
                    let length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                    if(length_s == null) return "no length_s defined for texture, component with ID = " + componentId;
                    this.components[i].texture.length_s = length_s;


                    let length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
                    if(length_t == null) return "no length_t defined for texture, component with ID = " + componentId;
                    this.components[i].texture.length_t = length_t;                    
                }
            }
            else
                return "unable to find texture tag for component ID = " + componentId;
            
            if(childrenIndex != -1)
            {
                if(childrenIndex != COMP_CHLD_INDEX) this.onXMLMinorError("tag <children> out of order for component with ID = " + componentId);

                if(grandChildren[childrenIndex].children.length == 0) return "tag <children> must have children for component with ID = " + componentId;

                var k = 0;
                this.components[i].children = [];

                for(k; k < grandChildren[childrenIndex].children.length; k++)
                {
                    if(grandChildren[childrenIndex].children[k].nodeName == "componentref")
                    {
                        var l = 0;
                        let id = this.reader.getString(grandChildren[childrenIndex].children[k], 'id');
                        if(id == null) return "no ID defined for componentref, component with ID = " + componentId;

                        var componentFound = false;

                        for(l; l < this.components.length; l++)
                        {
                            if(this.components[l].id == id)
                            {
                                this.components[i].children.push(this.components[l]);
                                componentFound = true;
                                break;
                            }
                        }

                        if(!componentFound) return "no component matches the reference tag <componentref> id = " + id + ", component with ID = " + componentId;

                    }
                    else if (grandChildren[childrenIndex].children[k].nodeName == "primitiveref")
                    {
                        var l = 0;
                        let id = this.reader.getString(grandChildren[childrenIndex].children[k], 'id');
                        if(id == null) return "no ID defined for primitiveref, component with ID = " + componentId;

                        var primitiveFound = false;

                        for(l; l < this.primitives.length; l++)
                        {
                            if(this.primitives[l].id == id)
                            {
                                this.components[i].children.push(this.primitives[l]);
                                primitiveFound = true;
                                break;
                            }
                        }

                        if(!primitiveFound) return "no primitive matches the reference tag <primitiveref> id = " + id + ", component with ID = " + componentId;
                    }
                    else
                        return "unexpected child tag of <children> - <"+ grandChildren[childrenIndex].nodeName + ">, component with ID = " + componentId;
                }
            }
            else
                return "chidlren tag undefined for component ID = " + componentId;
            
        }
        console.log("Parsed components");

        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.displayComponent(this.rootElem, null, null);
    }

    displayComponent(comp, material, texture)
    {   
        var m = material;
        var t = texture;

        if(comp.materials[this.scene.Mcnt % comp.materials.length].id != "inherit")
        {
            m = comp.materials[this.scene.Mcnt % comp.materials.length];
        } 

        if(comp.texture.txt.id != "inherit")
        {
            t = comp.texture;
        }

        this.scene.multMatrix(comp.matrix);        

        if(comp.animations != null)
        {
            for(let i = 0; i < comp.animations.length; i++)
            {
                if(comp.animations[i].isAnimationOver())
                    continue;

                comp.animations[i].apply(this.scene);
                break;
            }

            if(comp.animations[comp.animations.length-1].isAnimationOver())
                comp.animations[comp.animations.length-1].applyLast(this.scene);
        }

        var k = 0;

        for(k; k < comp.children.length; k++)
        {
            this.scene.pushMatrix();
                if(comp.children[k].type == "component") this.displayComponent(comp.children[k], m, t);
                else this.displayPrimitive(comp.children[k], m, t);
            this.scene.popMatrix();
        }
    }

    displayPrimitive(prim, mat, text)
    {
        if(prim.type == "terrain" || prim.type == "water")
        {
            prim.obj.display();
            return;
        }

        if(mat == null || mat.id == "none")
        {
            
            if(text.txt.id != "none")
            {
                this.def.setTexture(text.txt.text);   
            }
            else
            {
                this.def.setTexture(null);
            }

            this.def.apply();
        }
        else
        {
            if(mat.id != "none")
            {
                if(text.txt.id != "none")
                {
                    mat.mat.setTexture(text.txt.text);   
                }
                else
                {
                    mat.mat.setTexture(null);
                }
                
                mat.mat.apply();
            }

            if(prim.type == "rectangle" || prim.type == "triangle" || prim.type == "torus")
            {
                prim.obj.updateTexCoords(text.length_s, text.length_t);
            }
        }
    
        prim.obj.display();
    }

    parseValue(values, data, index, block, tag, id, variavel)
    {        
        var k = this.reader.getFloat(values[index],variavel);
        
        if(!(k != null && !isNaN(k)))  
         return "unable to parse " + variavel + " value of the <" + tag + "> for " + block + " ID = " + id;
        else if(k < 0 || k > 1)         return variavel + " value of <" + tag + "> " + block + " out of bounds [0,1] for ID = " + id;
        else                            data.push(k);

        return null;
    }

    parseRGBA(values, data, index, block, tag, id)
    {
        if(index != -1)
        {
            if(id != "none") data.push(tag);

            var error;
            if((error = this.parseValue(values, data, index, block, tag, id, 'r')) != null) return error;      
            if((error = this.parseValue(values, data, index, block, tag, id, 'g')) != null) return error;      
            if((error = this.parseValue(values, data, index, block, tag, id, 'b')) != null) return error;      
            if((error = this.parseValue(values, data, index, block, tag, id, 'a')) != null) return error;      
        }
        else return block + " " + tag + " tag undefined for ID = " + id;

        return null;
    }

    parseCoordinates(values, data, index, block, tag, id, variavel)
    {
        var x = this.reader.getFloat(values[index], variavel);
        if (!(x != null && !isNaN(x)))  return "unable to parse " + variavel + "-coordinate of the " + block + " <" + tag + "> for ID = " + id;
        else data.push(x);

        return null;
    }

    parseXYZw(values, data, index, block, tag, id, w = false)
    {    
        if (index != -1) 
        {
            if(id != "none") data.push(tag);

            var error;
            if((error = this.parseCoordinates(values, data, index, block, tag, id, 'x')) != null)  return error;
            if((error = this.parseCoordinates(values, data, index, block, tag, id, 'y')) != null)  return error;
            if((error = this.parseCoordinates(values, data, index, block, tag, id, 'z')) != null)  return error;            
            if( (w == true) && (error = this.parseCoordinates(values, data, index, block, tag, id, 'w')) != null)  return error;
        }
        else return block + " " + tag + " tag undefined for ID = " + id;
        
        return null;
    }

    parseTransformation(scene, grandChildren, transformationId)
    {
        if(grandChildren.length == 0) return "must be at least one transformation for ID = " + transformationId;

        scene.loadIdentity();

        for(var j = 0; j < grandChildren.length; j++)
        {

            if(grandChildren[j].nodeName == "translate")
            {
                // X
                var x = this.reader.getFloat(grandChildren[j], 'x');
                if(!(x != null && !isNaN(x))) return "unable to parse x-coordinate of the translate transformation with ID = " + transformationId;
                // Y
                var y = this.reader.getFloat(grandChildren[j], 'y');
                if(!(y != null && !isNaN(y))) return "unable to parse y-coordinate of the translate transformation with ID = " + transformationId;
                // Z
                var z = this.reader.getFloat(grandChildren[j], 'z');
                if(!(z != null && !isNaN(z))) return "unable to parse z-coordinate of the translate transformation with ID = " + transformationId;
                
                scene.translate(x, y, z);             
            }
            else if(grandChildren[j].nodeName == "rotate")
            {
                // AXIS
                var axis = this.reader.getString(grandChildren[j],'axis');
                if(axis != "x" && axis != "y" && axis != "z") return "unable to parse the axis-coordinate. Expected: \"x\", \"y\" or \"z\". Given: \"" + axis + "\" for transformation ID = " + transformationId;
                // ANGLE
                var angle = this.reader.getFloat(grandChildren[j],'angle');
                if(!(angle != null && !isNaN(angle))) 
                    return "unable to parse angle parameter of the scale transformation with ID = " + transformationId;
                else
                {
                    var angle_rad = angle * 0.017453;

                    if(axis == "x") scene.rotate(angle_rad, 1, 0, 0);
                    else if (axis == "y") scene.rotate(angle_rad, 0, 1, 0);
                    else scene.rotate(angle_rad, 0, 0, 1);
                }
            }
            else if(grandChildren[j].nodeName == "scale")
            {
                // X
                var x = this.reader.getFloat(grandChildren[j], 'x');
                if(!(x != null && !isNaN(x))) return "unable to parse x-coordinate of the scale transformation with ID = " + transformationId;
                // Y
                var y = this.reader.getFloat(grandChildren[j], 'y');
                if(!(y != null && !isNaN(y))) return "unable to parse y-coordinate of the scale transformation with ID = " + transformationId;
                // Z
                var z = this.reader.getFloat(grandChildren[j], 'z');
                if(!(z != null && !isNaN(z))) return "unable to parse z-coordinate of the scale transformation with ID = " + transformationId;
                
                scene.scale(x, y, z);
            }
            else 
                return "unknown tag with name = \"" + grandChildren[j].nodeName + "\" for ID = " + transformationId;
        }
    }
}