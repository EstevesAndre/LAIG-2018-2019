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
		
		var inc = 0;
		var mult = 1;

		for(let k = 0; k <= this.stacks; k++)
		{
			for(let i = 0; i <= this.slices; i++)
			{	
				this.vertices.push(	Math.cos(i * angleSlices) * (this.radius * Math.cos(k * angleStacks)),
									Math.sin(i * angleSlices) * (this.radius * Math.cos(k * angleStacks)),
									mult * this.radius * Math.sin(k * angleStacks));				
				
				this.normals.push( 	Math.cos(i * angleSlices),
									Math.sin(i * angleSlices),
									Math.sin(k * angleStacks));
				
				
				mult == 1 ? this.texCoords.push(Math.cos(i * angleSlices) / 2.0 + 0.5, Math.sin(k * angleStacks) / 2.0 + 0.5) : 
							this.texCoords.push(Math.cos(i * angleSlices) / 2.0 + 0.5, -Math.sin(k * angleStacks) / 2.0 + 0.5);
				
				/*console.log("k = " + k + ", i = "+ i);
				mult == 1 ? 
					console.log(Math.cos(i * angleSlices) / 2.0 + 0.5, Math.sin(k * angleStacks) / 2.0 + 0.5) : 
					console.log(Math.cos(i * angleSlices) / 2.0 + 0.5, -Math.sin(k * angleStacks) / 2.0 + 0.5);
				
				console.log("");*/

				if(k != 0 && i != 0)
				{					
					this.indices.push(	(this.slices+1)*k + i - 1 + inc, 
										(this.slices+1)*(k-1) + i - 1 + inc, 
										(this.slices+1)*(k-1) + i + inc);

					this.indices.push(	(this.slices+1)*k + i - 1 + inc, 
										(this.slices+1)*(k-1) + i + inc, 
										(this.slices+1)*k + i + inc);					
				}
			}

			if(k == this.stacks / 2.0 && mult == 1)
			{
				inc = this.slices + 1;					
				mult = -1;
				k--;
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};