/**
 * Torus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Torus extends CGFobject
{
	constructor(scene, inner, outer, slices, loops) 
	{
		super(scene);
        
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        if(this.inner > this.outer)
        {
            this.outer = inner;
            this.inner = outer;
        }

		this.initBuffers();
	};

	initBuffers() 
	{
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var angleloop = (2 * Math.PI) / this.loops;
        var angleSlice = (2 * Math.PI) / this.slices;

        for(let k = 0; k <= this.loops; k++)
        {
            for(let i = 0; i <= this.slices; i++)
            {
                this.vertices.push( Math.cos(i * angleSlice) * this.inner * Math.cos(k * angleloop) + this.outer * Math.cos(k * angleloop),                                    
                                    Math.cos(i * angleSlice) * this.inner * Math.sin(k * angleloop) + this.outer * Math.sin(k * angleloop),
                                    Math.sin(i * angleSlice) * this.inner);

                this.normals.push(  Math.cos(i * angleSlice),
                                    Math.sin(i * angleSlice),
                                    -Math.cos(i * angleSlice)
                                    );
                
                this.texCoords.push(i/this.slices,k/this.loops);

                if(k != 0 && i != 0)
                {
                    this.indices.push((this.slices+1)*k + i - 1,  
                                      (this.slices+1)*(k-1) + i,                                      
									  (this.slices+1)*(k-1) + i - 1);
									  
					this.indices.push((this.slices+1)*k + i - 1, 
                                      (this.slices+1)*k + i,                                      
									  (this.slices+1)*(k-1) + i);
                }
            }
        }
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };
    
    updateTexCoords(s,t)
	{
        this.texCoords = [];
        
        for(let i = 0; i <= this.loops; i++)
        {
            for(let j = 0; j <= this.slices; j++)
            {
                this.texCoords.push(s * j / this.slices, t * i / this.loops);
            }
        }

		this.updateTexCoordsGLBuffers();
	};
};