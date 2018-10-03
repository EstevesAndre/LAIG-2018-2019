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

        this.face = new Circle(scene, this.slices);

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

        // Here we do 1 division per iteration so it's k <= this.stacks.
		// We actually do k + 1 divisions to have exactly the right number of stacks
		for(let k = 0; k <= this.stacks; k++)
		{
			for(let i = 0; i <= this.slices; i++)
			{
				this.vertices.push(Math.cos(i * angle), 
								   Math.sin(i * angle),
								   k * division);
				 
				this.normals.push(Math.cos(i * angle),
								  Math.sin(i * angle),
								  0);
			
				// Place to texCoords				
				this.texCoords.push(1-i/this.slices,k*division);
				
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
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };
    
    display()
    {
		this.scene.pushMatrix();
			this.scene.scale(this.base,this.top,this.height);
			this.drawElements(this.scene.gl.TRIANGLES);
		this.scene.popMatrix();
		
        this.scene.pushMatrix();
        	this.scene.scale(this.top, this.top, 1);
            this.scene.translate(0, 0, this.height);
            this.face.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();            
            this.scene.scale(this.base, this.base, 1);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.face.display();
		this.scene.popMatrix();
		
    };
};