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
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var angleSlices = (2*Math.PI)/this.slices;
		var angleStacks = Math.PI/this.stacks;
		let j = -this.stacks/2.0;

		for(let k = 0; k <= this.stacks; k++, j++)
		{
			for(let i = 0; i <= this.slices; i++)
			{	
				this.vertices.push(	Math.cos(i * angleSlices) * (this.radius * Math.cos(j * angleStacks)),
									Math.sin(i * angleSlices) * (this.radius * Math.cos(j * angleStacks)),
									this.radius * Math.sin(j * angleStacks));				
				
				this.normals.push( 	Math.cos(i * angleSlices),
									Math.sin(i * angleSlices),
									Math.sin(j * angleStacks));				
				
				this.texCoords.push(1-i/this.slices, 
									k/this.stacks);

				if(k != 0 && i != 0)
				{					
					this.indices.push(	(this.slices+1)*k + i - 1, 
										(this.slices+1)*(k-1) + i - 1, 
										(this.slices+1)*(k-1) + i);

					this.indices.push(	(this.slices+1)*k + i - 1, 
										(this.slices+1)*(k-1) + i, 
										(this.slices+1)*k + i);					
				}
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};