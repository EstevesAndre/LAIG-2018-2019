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
        var rCenter = (this.outer - this.inner) / 2.0;


        for(let k = 0; k <= this.loops; k++)
        {
            for(let i = 0; i <= this.slices; i++)
            {
                this.vertices.push( Math.cos(i * angleSlice) * rCenter * Math.cos(k * angleloop) + (this.inner + rCenter) * Math.cos(k * angleloop),
                                    Math.sin(i * angleSlice) * rCenter,
                                    Math.cos(i * angleSlice) * rCenter * Math.sin(k * angleloop) + (this.inner + rCenter) * Math.sin(k * angleloop)
                                    );


                this.normals.push(  Math.cos(i * angleSlice),
                                    Math.sin(i * angleSlice),
                                    -Math.cos(i * angleSlice)
                                    );
                
                this.texCoords.push(1-i/this.slices,k*angleloop);

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
};