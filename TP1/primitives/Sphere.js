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

		var angle = (2* Math.PI) / this.slices;
		var division = 1.0 / this.stacks;

		for(let k = 0; k <= this.stacks; k++)
		{
			// last stack
			if(k == this.stacks)
			{
				this.vertices.push(	this.radius * Math.cos((this.slices-1) * angle)*Math.cos(Math.asin(1)), 
									this.radius * Math.sin((this.slices-1) * angle)*Math.cos(Math.asin(1)), 
									this.radius * 1);
				this.normals.push(	Math.cos((this.slices-1) * angle), 
									Math.sin((this.slices-1) * angle), 
									Math.cos(Math.asin(1)) );
				this.texCoords.push(0.5,0.5);
					
				for(let i = 0; i <= this.slices; i++)
				{
					this.indices.push((this.slices+1)*k,(this.slices+1)*(k-1) + i, (this.slices+1)*(k-1) + i + 1);				
				}	
			}
			else
			{
				for(let i = 0; i <= this.slices; i++)
				{
					this.vertices.push(	this.radius * Math.cos(i * angle)*Math.cos(Math.asin(division*(k))), 
										this.radius * Math.sin(i * angle)*Math.cos(Math.asin(division*(k))), 
										this.radius * k * division);
					this.normals.push(	Math.cos(i * angle), 
										Math.sin(i * angle), 
										Math.cos(Math.asin(division*(k))) ) ;
									
					this.texCoords.push( (Math.cos(i * angle)*Math.cos(Math.asin(division*(k))) ) / 2.0 + 0.5, 
										-(Math.sin(i * angle)*Math.cos(Math.asin(division*(k))) ) / 2.0 + 0.5);					
				
					if(k != 0 && i != 0)
					{
						this.indices.push(	(this.slices+1)*k + i - 1, 
											(this.slices+1)*(k-1) + i - 1, 
											(this.slices+1)*(k-1) + i);

						this.indices.push(	(this.slices+1)*k + i - 1, 
											(this.slices+1)*(k-1) + i , 
											(this.slices+1)*k + i);
						
					}
				}
			}
		}
		var numVertices = this.vertices.length / 3;
		for(let k = 0; k <= this.stacks; k++)
		{
			// last stack
			if(k == this.stacks)
			{
				this.vertices.push(	this.radius * Math.cos((this.slices-1) * angle)*Math.cos(Math.asin(1)), 
									this.radius * Math.sin((this.slices-1) * angle)*Math.cos(Math.asin(1)), 
									this.radius * -1);
				this.normals.push(	Math.cos((this.slices-1) * angle), 
									Math.sin((this.slices-1) * angle), 
									-Math.cos(Math.asin(1)) );
				this.texCoords.push(0.5,0.5);
					
				for(let i = 0; i <= this.slices; i++)
				{
					this.indices.push(	numVertices + (this.slices+1)*k,
										numVertices + (this.slices+1)*(k-1) + i + 1,
										numVertices + (this.slices+1)*(k-1) + i
									);				
				}	
			}
			else
			{
				for(let i = 0; i <= this.slices; i++)
				{
					this.vertices.push(	this.radius * Math.cos(i * angle)*Math.cos(Math.asin(division*(k))), 
										this.radius * Math.sin(i * angle)*Math.cos(Math.asin(division*(k))), 
										this.radius * -k * division);
					this.normals.push(	Math.cos(i * angle), 
										Math.sin(i * angle), 
										-Math.cos(Math.asin(division*(k))) ) ;
									
					this.texCoords.push( (Math.cos(i * angle)*Math.cos(Math.asin(division*(k))) ) / 2.0 + 0.5, 
										-(Math.sin(i * angle)*Math.cos(Math.asin(division*(k))) ) / 2.0 + 0.5);					
				
					if(k != 0 && i != 0)
					{
						this.indices.push(	numVertices + (this.slices+1)*k + i - 1, 
											numVertices + (this.slices+1)*(k-1) + i,											
											numVertices + (this.slices+1)*(k-1) + i - 1
											);

						this.indices.push(	numVertices + (this.slices+1)*k + i - 1, 
											numVertices + (this.slices+1)*k + i,
											numVertices + (this.slices+1)*(k-1) + i
											);
						
					}
				}
			}
		}
		

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};