var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.ambient = [0, 0, 0, 0];
        this.background = [0, 0, 0, 0];

        this.referenceLength = 1.0;

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
     */ // DONE
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

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */ // DONE
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        var index;
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        var index;
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        var index;
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        var index;
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        var index;
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        var index;
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        var index;
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        var index;
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

     /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */ // DONE
    parseScene(sceneNode) {
        var children = sceneNode.children;

        if(children.size != null)
            return "no children allowed for tag <scene>"

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

        if(viewsNode.nodeName != "views") return "invalid tag, <view> - <" + viewsNode.nodeName + ">";

        var viewDefault = this.reader.getString(viewsNode,'default');
        if(viewDefault == null) return "no Default name for view";

        var children = viewsNode.children;

        if(children.length == 0) return "Scene must have at least one view";

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "perspective" && children[i].nodeName != "ortho") return "invalid child tag, must be \"perspective\" or \"ortho\"";

            let viewId = this.reader.getString(children[i], 'id');
            if(viewId == null) return "no ID defined for " + children[i].nodeName + " view";

            let viewNear = this.reader.getFloat(children[i], 'near');
            if(!(viewNear != null && !isNaN(viewNear))) return "unable to parse near component of the " + children[i].nodeName + " view with ID = " + viewId;
            
            let viewFar = this.reader.getFloat(children[i], 'far');
            if(!(viewFar != null && !isNaN(viewFar))) return "unable to parse far component of the " + children[i].nodeName + " view with ID = " + viewId;
            
            if(children[i].nodeName == "ortho")
            {
                let viewLeft = this.reader.getFloat(children[i], 'left');
                if(!(viewLeft != null && !isNaN(viewLeft))) return "unable to parse left component of the " + children[i].nodeName + " view with ID = " + viewId;

                let viewRight = this.reader.getFloat(children[i], 'right');
                if(!(viewRight != null && !isNaN(viewRight))) return "unable to parse right component of the " + children[i].nodeName + " view with ID = " + viewId;

                let viewTop = this.reader.getFloat(children[i], 'top');
                if(!(viewTop != null && !isNaN(viewTop))) return "unable to parse top component of the " + children[i].nodeName + " view with ID = " + viewId;

                let viewBottom = this.reader.getFloat(children[i], 'bottom');
                if(!(viewBottom != null && !isNaN(viewBottom))) return "unable to parse bottom component of the " + children[i].nodeName + " view with ID = " + viewId;
            }
            else
            {
                let viewAngle = this.reader.getFloat(children[i], 'angle');
                if(!(viewAngle != null && !isNaN(viewAngle))) return "unable to parse angle component of the " + children[i].nodeName + " view with ID = " + viewId;

                var grandChildren = children[i].children;
                
                if(grandChildren.length != 2) return "no \"from\" and \"to\" tags defined";

                var fromPos = [];
                var fromTo = [];

                if(grandChildren[0].nodeName == "from") this.parseXYZw(grandChildren,fromPos,0,"perspective","from","none");
                else return "wrong tag to perspective view for ID = " + viewId + ", must be \"from\"";
                
                if(grandChildren[1].nodeName == "to") this.parseXYZw(grandChildren,fromTo,1,"perspective","to","none");
                else return "wrong tag to perspective view for ID = " + viewId + ", must be \"to\"";

            }
            
        }

        console.log("Parsed views");

        return null;
    }

     /**
     * Parses the <ambient> block. 
     * @param {ambient block element} ambientNode
     */ // DONE
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
            if((error = this.parseRGBA(children, this.ambient, AMB_INDEX, "ambient", "ambient light", "none")) != null) return error;                
        }       
        else return "unexpected child tag of <ambient> - <"+ children[AMB_INDEX].nodeName + ">";

        // Retrieves the background clear color component.
        if (children[BCK_INDEX].nodeName == "background")
        {
            if((error = this.parseRGBA(children, this.background, BCK_INDEX, "background clear color", "background color", "none")) != null) return error;                
        }
        else return "unexpected child tag of <background> - <"+ children[BCK_INDEX].nodeName + ">";

        console.log("Parsed ambient");

        return null;
    }

     /**
     * Parses the <ligts> block. 
     * @param {lights block element} lightsNode
     */ // DONE - DATA ESTRUCTURE MISSING
    parseLights(lightsNode) 
    {
        var children = lightsNode.children;

        this.lights = [];

        var lightIds = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];
        
        for(var i = 0; i < children.length; i++) 
        {
            // verifies the type of the light.
            if(children[i].nodeName != "omni" && children[i].nodeName != "spot")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }  
            
            // Get id of the current light.
            let lightId = this.reader.getString(children[i], 'id');
            if(lightId == null) return "no ID defined for light";
            
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

            // Light enable/disable
            var enableLight = true;
    
            // Omni/Spot
            var enableIndex = this.reader.getString(children[i], 'enabled');
            if(!(enableIndex != null && !isNaN(enableIndex) && (enableIndex == 0 || enableIndex == 1)))
            {         
                this.onXMLMinorError("no enable index defined for light ID = " + lightId + "; assuming true(1)"); 
                enableLight = true;
            }
            else enableLight = ((enableIndex == 0) ? false : true);
            
            var error;

            // Retrieves the light position.
            var locationLight = [];
            if((error = this.parseXYZw(grandChildren, locationLight, locationIndex, "lights", "location", lightId, true)) != null) return error;
            else
            {
            //   paramsLights.push(locationLight); // FALTA DEFINIR A ESTRUTURA DE DADOS PARA AS LUZES
            }
                  
            // Retrieves the ambient component.
            var ambientIllumination = [];      
            if((error = this.parseRGBA(grandChildren, ambientIllumination, ambientIndex, "lights", "ambient", lightId)) != null) return error;
            else
            {
            //   paramsLights.push(ambientIllumination);
            }

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            if((error = this.parseRGBA(grandChildren, diffuseIllumination, diffuseIndex, "lights", "diffuse", lightId)) != null) return error;
            else
            {
            //   paramsLights.push(diffuseIllumination);
            }

            // Retrieves the specular component.
            var specularIllumination = [];
            if((error = this.parseRGBA(grandChildren, specularIllumination, specularIndex, "lights", "specular", lightId)) != null) return error;
            else
            {
            //   paramsLights.push(specularIllumination);
            }

            if(children[i].nodeName == "spot")
            {                
                // indices extra of the spot light    
                var angleIndex = this.reader.getString(children[i],'angle');
                var exponentIndex = this.reader.getString(children[i],'exponent');
                var targetIndex = nodeNames.indexOf("target");

                // angle
                var angleLight = 0;
                if(!(angleIndex != null && !isNaN(angleIndex))) return "unable to parse value component of the 'angle light' field for ID = " + lightId;
                else if(angleIndex < 0 || angleIndex > 2*Math.PI) this.onXMLMinorError("angle of spot light out of range [0, 2*PI] with ID = " + lightId);
                else angleLight = angleIndex;

                // exponent
                var exponentLight = 0;
                if (!(exponentIndex != null && !isNaN(exponentIndex))) return "unable to parse value component of the 'exponent light' field for ID = " + lightId;
                else if(exponentIndex < 0) return "exponent of spot light with ID = " + lightId + " can not be negative";
                else exponentLight = exponentIndex;

                // Retrieves the light position.
                var targetLight = [];
                if((error = this.parseXYZw(grandChildren, targetLight, targetIndex, "lights", "target", lightId, false)) != null) return error;                
                else
                {
                //   paramsLights.push(targetLight); // FALTA DEFINIR A ESTRUTURA DE DADOS PARA AS LUZES
                }
            }

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
     */ // DONE
    parseTextures(texturesNode) {
        
        this.textures = [];
        var texturesId = [];
        var numTextures = 0;
        var children = texturesNode.children;
        
        for(var i = 0; i < children.length; i++) 
        {
            // verifies the type of the light.
            if(children[i].nodeName != "texture")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }  
            
            // Get id of the current light.
            let textureId = this.reader.getString(children[i], 'id');
            if(textureId == null || textureId == "") return "no ID defined";
           
            // Checks for repeated IDs.
            if (texturesId[textureId] != null) return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            let fileLink = this.reader.getString(children[i],'file');
            if(fileLink == null || fileLink == "") return "no file location defined for texture with ID = " + textureId;

            this.textures.push([textureId,fileLink]);

            texturesId[textureId] = textureId;
            numTextures++;
        }

        if(numTextures == 0)
        {            
            return "at least one texture must be defined";
        }

        console.log("Parsed textures");

        return null;
    }

     /**
     * Parses the <materials> block. 
     * @param {materials block element} materialsNode
     */ // DONE
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

            if(grandChildren.length != 4) return "wrong number of tags for a material. It must have 4 tags [\"emission\", \"ambient\", \"diffuse\", \"specular\"]";
            

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

            // structure to store materials
            this.materials.push(paramsMaterial);            
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
     */ // DONE
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;

        this.transformations = [];

        var transformationsId = [];
        var numTransformations = 0;
        var grandChildren = [];

        for(var i = 0; i < children.length; i++)
        {
            // verifies if it is a transformation.
            if (children[i].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get id of the current transformation.
            let transformationId = this.reader.getString(children[i],'id');
            if( transformationId == null || transformationId == "")
            {
                return "no ID defined for transformation";
            }

            if(transformationsId[transformationId] != null)
            {
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";
            }

            // Specification for the current transformation
            grandChildren = children[i].children;

            if(grandChildren.length == 0)
            {
                return "must be at least one transformation for ID = " + transformationId;
            }

            var typesTransformation = [];

            for(var j = 0; j < grandChildren.length; j++)
            {
                if(grandChildren[j].nodeName == "translate")
                {
                    typesTransformation.push("translate");
                    // X
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if(!(x != null && !isNaN(x)))
                    {
                        return "unable to parse x-coordinate of the translate transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(x);
                    }
                    // Y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if(!(y != null && !isNaN(y)))
                    {
                        return "unable to parse y-coordinate of the translate transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(y);
                    }
                    // Z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if(!(z != null && !isNaN(z)))
                    {
                        return "unable to parse z-coordinate of the translate transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(z);
                    }
                    
                }
                else if(grandChildren[j].nodeName == "rotate")
                {
                    typesTransformation.push("rotate");
                    // AXIS
                    var axis = this.reader.getString(grandChildren[j],'axis');
                    if(axis != "x" && axis != "y" && axis != "z")
                    {
                        return "unable to parse the axis-coordinate. Expected: \"x\", \"y\" or \"z\". Given: \"" + axis + "\" for transformation ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(axis);
                    }

                    // ANGLE
                    var angle = this.reader.getFloat(grandChildren[j],'angle');
                    if(!(angle != null && !isNaN(angle)))
                    {
                        return "unable to parse angle parameter of the scale transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(angle);
                    }
                }
                else if(grandChildren[j].nodeName == "scale")
                {
                    typesTransformation.push("scale");
                    // X
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if(!(x != null && !isNaN(x)))
                    {
                        return "unable to parse x-coordinate of the scale transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(x);
                    }
                    // Y
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if(!(y != null && !isNaN(y)))
                    {
                        return "unable to parse y-coordinate of the scale transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(y);
                    }
                    // Z
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if(!(z != null && !isNaN(z)))
                    {
                        return "unable to parse z-coordinate of the scale transformation with ID = " + transformationId;
                    }
                    else
                    {
                        typesTransformation.push(z);
                    }
                }
                else
                {
                    return "unknown tag with name = \"" + grandChildren[j].nodeName + "\" for ID = " + transformationId;
                }
            }

            /* Added transformations with syntaxe:
                [TYPE] [VALUES]
                TYPE = {translate, rotate, scale}
                VALUES = {x,y,z}        <- case of translation and scale
                VALUES = {axis, angle}  <- case of rotation
                
                Example: {translate, 1, 2, 3};
                         {rotate, z, 165};
            */
            this.transformations.push(typesTransformation);

            transformationsId[transformationId] = transformationId;
            numTransformations++;
        }

        if(numTransformations == 0)
        {
            return "at least one transformation must be defined";
        }

        console.log("Parsed transformations");

        return null;
    }

     /**
     * Parses the <primitives> block. 
     * @param {primitives block element} primitivesNode
     */  // DONE
    parsePrimitives(primitivesNode) {
        
        var children = primitivesNode.children;

        this.primitives = [];
        
        var primitivesId = [];
        var numPrimitives = 0;        
        var grandChildren = [];

        for(var i = 0; i < children.length; i++)
        {
            // verifies if it is primitive.
            if (children[i].nodeName != "primitive")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">. Must be \"primitive\".");
                continue;
            }

            // get id of the current primitive
            let primitiveId = this.reader.getString(children[i],'id');
            if(primitiveId == null || primitiveId == "")
            {
                return "no ID defined for primitive";
            }

            if(primitivesId[primitiveId] != null)
            {
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";
            }

            // Specification for the current primitive. Verifies if it is one of the primitives.
            grandChildren = children[i].children;

            if(grandChildren.length != 1)
            {
                return "there is more that one tag for this primitive with id = " + primitiveId;
            }

            if(grandChildren[0].nodeName != "rectangle" &&
                grandChildren[0].nodeName != "triangle" &&
                    grandChildren[0].nodeName != "cylinder" &&
                        grandChildren[0].nodeName != "sphere" &&
                            grandChildren[0].nodeName != "torus")
            {
                this.onXMLMinorError("unknown tag <" + grandChildren[0].nodeName + "> with ID = " + primitiveId);
                continue;
            }

            var argRectangle = [];            
            var argTriangle = [];
            var argCylinder = [];
            var argSphere = [];
            var argTorus = [];
            
            // RECTANGLE
            if(grandChildren[0].nodeName == "rectangle")
            {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0],'x1');
                if(!(x1 != null && !isNaN(x1)))
                {
                    return "unable to parse x1-coordinate of the rectangle primitive for ID = " + primitiveId;
                }
                else
                {
                    argRectangle.push(x1);
                }

                // y1
                var y1 = this.reader.getFloat(grandChildren[0],'y1');
                if(!(y1 != null && !isNaN(y1)))
                {
                    return "unable to parse y1-coordinate of the rectangle primitive for ID = " + primitiveId;
                }
                else
                {
                    argRectangle.push(y1);
                }

                // x2
                var x2 = this.reader.getFloat(grandChildren[0],'x2');
                if(!(x2 != null && !isNaN(x2)))
                {
                    return "unable to parse x2-coordinate of the rectangle primitive for ID = " + primitiveId;
                }
                else
                {
                    argRectangle.push(x2);
                }

                // y2
                var y2 = this.reader.getFloat(grandChildren[0],'y2');
                if(!(y2 != null && !isNaN(y2)))
                {
                    return "unable to parse y2-coordinate of the rectangle primitive for ID = " + primitiveId;
                }
                else
                {
                    argRectangle.push(y2);
                }

            }
             // TRIANGLE
            else if(grandChildren[0].nodeName == "triangle")
             {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0],'x1');
                if(!(x1 != null && !isNaN(x1)))
                {
                    return "unable to parse x1-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(x1);
                }

                // y1
                var y1 = this.reader.getFloat(grandChildren[0],'y1');
                if(!(y1 != null && !isNaN(y1)))
                {
                    return "unable to parse y1-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(y1);
                }

                // z1
                var z1 = this.reader.getFloat(grandChildren[0],'z1');
                if(!(z1 != null && !isNaN(z1)))
                {
                    return "unable to parse z1-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(z1);
                }

                // x2
                var x2 = this.reader.getFloat(grandChildren[0],'x2');
                if(!(x2 != null && !isNaN(x2)))
                {
                    return "unable to parse x2-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(x2);
                }

                // y2
                var y2 = this.reader.getFloat(grandChildren[0],'y2');
                if(!(y2 != null && !isNaN(y2)))
                {
                    return "unable to parse y2-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(y2);
                }

                // z2
                var z2 = this.reader.getFloat(grandChildren[0],'z2');
                if(!(z2 != null && !isNaN(z2)))
                {
                    return "unable to parse z2-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(z2);
                }

                // x3
                var x3 = this.reader.getFloat(grandChildren[0],'x3');
                if(!(x3 != null && !isNaN(x3)))
                {
                    return "unable to parse x3-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(x3);
                }

                // y3
                var y3 = this.reader.getFloat(grandChildren[0],'y3');
                if(!(y3 != null && !isNaN(y3)))
                {
                    return "unable to parse y3-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(y3);
                }

                // z3
                var z3 = this.reader.getFloat(grandChildren[0],'z3');
                if(!(z3 != null && !isNaN(z3)))
                {
                    return "unable to parse z3-coordinate of the triangle primitive for ID = " + primitiveId;
                }
                else
                {
                argTriangle.push(z3);
                }
 
            }
             // CYLINDER
            else if(grandChildren[0].nodeName == "cylinder")
            {
                // base
                var base = this.reader.getFloat(grandChildren[0],'base');
                if(!(base != null && !isNaN(base)))
                {
                    return "unable to parse base of the Cylinder primitive for ID = " + primitiveId;
                }
                else
                {
                    argCylinder.push(base);
                }

                // top
                var top = this.reader.getFloat(grandChildren[0],'top');
                if(!(top != null && !isNaN(top)))
                {
                    return "unable to parse top of the Cylinder primitive for ID = " + primitiveId;
                }
                else
                {
                    argCylinder.push(top);
                }

                // height
                var height = this.reader.getFloat(grandChildren[0],'height');
                if(!(height != null && !isNaN(height)))
                {
                    return "unable to parse height of the Cylinder primitive for ID = " + primitiveId;
                }
                else
                {
                    argCylinder.push(height);
                }

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices)))
                {
                    return "unable to parse slices of the Cylinder primitive for ID = " + primitiveId;
                }
                else if(slices % 10 != 0)
                {
                    return "slices parameter of Cylinder must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argCylinder.push(slices);
                }

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0],'stacks');
                if(!(stacks != null && !isNaN(stacks)))
                {
                    return "unable to parse stacks of the Cylinder primitive for ID = " + primitiveId;
                }
                else if(stacks % 10 != 0)
                {
                    return "stacks parameter of Cylinder must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argCylinder.push(stacks);
                }
                
            }
            // SPHERE
            else if(grandChildren[0].nodeName == "sphere")
            {
                // radius
                var radius = this.reader.getFloat(grandChildren[0],'radius');
                if(!(radius != null && !isNaN(radius)))
                {
                    return "unable to parse radius of the Sphere primitive for ID = " + primitiveId;
                }
                else
                {
                    argSphere.push(radius);
                }

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices)))
                {
                    return "unable to parse slices of the Sphere primitive for ID = " + primitiveId;
                }
                else if(slices % 10 != 0)
                {
                    return "slices parameter of Sphere must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argSphere.push(slices);
                }

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0],'stacks');
                if(!(stacks != null && !isNaN(stacks)))
                {
                    return "unable to parse stacks of the Sphere primitive for ID = " + primitiveId;
                }
                else if(loops % 10 != 0)
                {
                    return "loops parameter of Sphere must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argSphere.push(stacks);
                }
                
            }
            // TORUS
            else 
            {
                // inner
                var inner = this.reader.getFloat(grandChildren[0],'inner');
                if(!(inner != null && !isNaN(inner)))
                {
                    return "unable to parse inner of the Torus primitive for ID = " + primitiveId;
                }
                else
                {
                    argTorus.push(inner);
                }

                // outer
                var outer = this.reader.getFloat(grandChildren[0],'outer');
                if(!(outer != null && !isNaN(outer)))
                {
                    return "unable to parse inner of the Torus primitive for ID = " + primitiveId;
                }
                else
                {
                    argTorus.push(outer);
                }

                // slices
                var slices = this.reader.getFloat(grandChildren[0],'slices');
                if(!(slices != null && !isNaN(slices)))
                {
                    return "unable to parse slices of the Torus primitive for ID = " + primitiveId;
                }
                else if(slices % 10 != 0)
                {
                    return "slices parameter of Torus must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argTorus.push(slices);
                }

                // loops
                var loops = this.reader.getFloat(grandChildren[0],'loops');
                if(!(loops != null && !isNaN(loops)))
                {
                    return "unable to parse loops of the Torus primitive for ID = " + primitiveId;
                }
                else if(loops % 10 != 0)
                {
                    return "loops parameter of Torus must be an integer for ID = " + primitiveId;
                }
                else
                {
                    argTorus.push(loops);
                }
            }

            primitivesId[primitiveId] = primitiveId;
            numPrimitives++;
        }

        if(numPrimitives == 0)
        {
            return "at least one primitive must be defined";
        }


        console.log("Parsed primitives");

        return null;
    }

     /**
     * Parses the <components> block. 
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block

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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }

    parseValue(values, data, index, block, tag, id, variavel)
    {        
        var k = this.reader.getFloat(values[index],variavel);
        
        if(!(k != null && !isNaN(k)))   return "unable to parse " + variavel + " value of the <" + tag + "> for " + block + " ID = " + id;
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

}