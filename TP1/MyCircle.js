/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject
{
	constructor(scene, slices) 
	{
		super(scene);

        this.slices = slices;

		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
            ];

        this.indices = [
            ];

        this.normals = [
            ];

        this.texCoords = [
            ];

        var angle = (2* Math.PI) / this.slices;

        // Center
		this.vertices.push(0,0,0);
		this.texCoords.push(0.5,0.5); // middle
        this.normals.push(0,0,1);

        for(let i = 0; i < this.slices; i++)
		{
			this.vertices.push(Math.cos(i * angle), Math.sin(i * angle), 0);
			this.normals.push(0,0,1);			
			
			// Place to texCoords				
			this.texCoords.push(0.5 + Math.cos(i * angle) / 2, 0.5 - Math.sin(i * angle) / 2);

			if(i != 0)
			{
				if(i == this.slices-1)
				{
					this.indices.push(0,i+1,1);
				}
				
				this.indices.push(0,i,i+1);
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};