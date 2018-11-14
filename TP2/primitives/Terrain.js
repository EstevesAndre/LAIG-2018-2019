class Terrain extends CGFobject {

    constructor(scene, idtexture, idheightmap, parts, heightscale)
    {
        super(scene);

        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.parts = parts;
        this.heightscale = heightscale;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/vertexShader.vert", "shaders/fragShader.frag");
        this.shader.setUniformsValues({text: 1});
        this.shader.setUniformsValues({height: 2});
        this.shader.setUniformsValues({scale: heightscale});
        
        this.texture = new CGFtexture(this.scene, this.idtexture);
        this.height = new CGFtexture(this.scene, this.idheightmap);
        console.log(parts);
        this.plane = new Plane(this.scene, parts,parts);
    };

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(1);
        this.height.bind(2);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    };
};