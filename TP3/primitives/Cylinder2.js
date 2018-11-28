/**
 * Cylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Cylinder2 extends CGFobject
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
		
    };

};