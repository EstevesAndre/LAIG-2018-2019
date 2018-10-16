/**
 * Rectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Rectangle extends CGFobject
{
	constructor(scene, x1, y1, x2, y2) 
	{
		super(scene);

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
				this.x1, this.y1, 0,
				this.x1, this.y2, 0,
				this.x2, this.y2, 0,
				this.x2, this.y1, 0
			];

		this.indices = [
				2, 1, 0,
				2, 0, 3
			];

		this.normals = [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1
			];			
					
		this.updateTexCoords(1,1);

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(s,t)
	{
		this.texCoords = [
			0, Math.abs(this.y1 / t),
			0, 0,
			Math.abs(this.x2 / s), 0,
			Math.abs(this.x2 / s), Math.abs(this.y1 / t)
		];

		this.updateTexCoordsGLBuffers();
	};
	
};