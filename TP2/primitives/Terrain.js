class Terrain extends CGFobject {

    constructor(scene, texture, heightmap, parts, heightscale)
    {
        super(scene);

        console.log(texture);

        this.texture = texture;
        this.heightmap = heightmap;
        this.parts = parts;
        this.heightscale = heightscale;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/vertexShader.vert", "shaders/fragShader.frag");
        this.shader.setUniformsValues({text: 1});
        this.shader.setUniformsValues({height: 2});
        this.shader.setUniformsValues({scale: heightscale});
        
        this.plane = new Plane(this.scene, parts,parts);
    };

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(1);
        this.heightmap.bind(2);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    };
};