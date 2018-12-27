class SelectedSquare extends CGFobject
{
	constructor(scene, size, holeSize) 
	{
		super(scene);

		this.size = size;
		
		if(holeSize > size || holeSize <= 0)
			this.holeSize = size * 0.8;
		else
			this.holeSize = holeSize;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
				-this.size/2, -this.size/2, 0,
				 this.size/2, -this.size/2, 0,
				 this.size/2,  this.size/2, 0,
				-this.size/2,  this.size/2, 0,

				-this.holeSize/2, -this.holeSize/2, 0,
				 this.holeSize/2, -this.holeSize/2, 0,
				 this.holeSize/2,  this.holeSize/2, 0,
				-this.holeSize/2,  this.holeSize/2, 0,

				-this.size/2, -this.size/2, 0,
				 this.size/2, -this.size/2, 0,
				 this.size/2,  this.size/2, 0,
				-this.size/2,  this.size/2, 0,

				-this.holeSize/2, -this.holeSize/2, 0,
				 this.holeSize/2, -this.holeSize/2, 0,
				 this.holeSize/2,  this.holeSize/2, 0,
				-this.holeSize/2,  this.holeSize/2, 0,
			];

		this.indices = [
				0, 1, 4,
				1, 5, 4,
				1, 6, 5,
				2, 6, 1,
				2, 7, 6,
				3, 7, 2,
				3, 4, 7,
				0, 4, 3,

				 8, 12,  9,
				 9, 12, 13,
				 9, 13, 14,
				 9, 13, 10,
				10, 13, 14,
				10, 14, 15,
				11, 14, 15,
				11, 15, 12,
				 8, 11, 12
			];

		this.normals = [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,

				0, 0,-1,
				0, 0,-1,
				0, 0,-1,
				0, 0,-1,
				0, 0,-1,
				0, 0,-1,
				0, 0,-1,
				0, 0,-1
			];			

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};