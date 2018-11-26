/**
 * Cylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Cylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks) 
	{
		super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
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
		var division = this.height / this.stacks;		
		var radiusStack = (this.top - this.base) / this.stacks;

        // Here we do 1 division per iteration so it's k <= this.stacks.
		// We actually do k + 1 divisions to have exactly the right number of stacks
		for(let k = 0; k <= this.stacks; k++)
		{
			for(let i = 0; i <= this.slices; i++)
			{
				this.vertices.push(Math.cos(i * angle) * (this.base + radiusStack * k), 
								   Math.sin(i * angle) * (this.base + radiusStack * k),
								   k * division);
				 
				this.normals.push(Math.cos(i * angle),
								  Math.sin(i * angle),
								  0);
			
				// Place to texCoords				
				this.texCoords.push(1-i/this.slices, k * division / this.height);
				
				if(k != 0 && i != 0)
				{
					this.indices.push((this.slices+1)*k + i - 1, 
									  (this.slices+1)*(k-1) + i - 1, 
									  (this.slices+1)*(k-1) + i);
									  
					this.indices.push((this.slices+1)*k + i - 1, 
									  (this.slices+1)*(k-1) + i,
									  (this.slices+1)*k + i);
				}
			}
		}
		
		// Center
		this.vertices.push(0,0,0);
		this.normals.push(0,0,-1);
		this.texCoords.push(0.5,0.5);		
		let indiceRef = this.vertices.length / 3 -  1;
		
		for(let k = 1; k <= 2; k++)
		{
			if(k == 2) indiceRef += this.slices + 2;

			for(let i = 0; i <= this.slices; i++)
			{
				this.vertices.push(	Math.cos(i* angle) * (k == 1 ? this.base : this.top),
									Math.sin(i * angle) * (k == 1 ? this.base : this.top),
									(k == 1 ? 0 : this.height));
				
				k == 1 ? this.normals.push(0,0,-1) : this.normals.push(0,0,1);
				
				this.texCoords.push(0.5 + Math.cos(i * angle) / 2, 0.5 - Math.sin(i * angle) / 2);

				if(i != 0)
				{
					if(i == this.slices-1)
					{
						k == 1 ? this.indices.push(indiceRef,indiceRef + 1,indiceRef + i+1)
								: this.indices.push(indiceRef,indiceRef + i+1,indiceRef + 1);
					}
					
					k == 1 ? this.indices.push(indiceRef,indiceRef + i+1,indiceRef + i)
							: this.indices.push(indiceRef,indiceRef + i,indiceRef + i+1);
				}
			}				
			this.vertices.push(0,0,this.height);
			this.normals.push(0,0,1);
			this.texCoords.push(0.5,0.5);
		}
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };

};