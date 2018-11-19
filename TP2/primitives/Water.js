class Water extends CGFobject 
{
    constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
    {
        super(scene);

        this.texture = idtexture;
        this.wavemap = idwavemap;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/waterVertShader.vert", "shaders/waterFragShader.frag");
        this.shader.setUniformsValues({text: 0});
        this.shader.setUniformsValues({height: 1});
        this.shader.setUniformsValues({heightscale: heightscale});
        this.shader.setUniformsValues({texscale: texscale});
        
        this.plane = new Plane(this.scene, parts,parts);
    };

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.wavemap.bind(1);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    };
};