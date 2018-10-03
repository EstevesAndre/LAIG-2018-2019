/**
 * Sphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Sphere extends CGFobject
{
	constructor(scene, radius, slices, stacks) 
	{
		super(scene);
        
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers() 
	{
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};