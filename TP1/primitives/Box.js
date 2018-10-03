/**
 * Box
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Box extends CGFobject
{
	constructor(scene, width, height, depth) 
	{
		super(scene);

        this.width = width;
        this.height = height;
        this.depth = depth;

		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [];

        this.indices = [];

        this.normals = [];

        this.texCoords = [];

        for(let i = 0; i < 3; i++)
        {
            this.vertices.push(0,0,0);
            this.vertices.push(this.width,0,0);
            this.vertices.push(this.width,this.height,0);
            this.vertices.push(0,this.height,0);
            
            this.vertices.push(0,0,this.depth);
            this.vertices.push(this.width,0,this.depth);
            this.vertices.push(this.width,this.height,this.depth);
            this.vertices.push(0,this.height,this.depth);
        }

        this.indices.push(0,3,2,    2,1,0);         // back
        this.indices.push(4,5,6,    6,7,4);         // front   
        this.indices.push(13,9,10,  10,14,13);    // right  
        this.indices.push(12,15,11, 11,8,12);    // left
        this.indices.push(18,19,23, 23,22,18);   // top
        this.indices.push(17,21,20, 20,16,17);   // down

        this.normals.push(  0,0,-1,   0,0,-1,   0,0,-1, 0,0,-1);
        this.normals.push(  0,0,1,    0,0,1,    0,0,1,  0,0,1);
        this.normals.push(  1,0,0,    1,0,0,    1,0,0,  1,0,0);
        this.normals.push(  -1,0,0,   -1,0,0,   -1,0,0, -1,0,0);
        this.normals.push(  0,1,0,    0,1,0,    0,1,0,  0,1,0);
        this.normals.push(  0,-1,0,   0,-1,0,   0,-1,0, 0,-1,0);
        
        this.texCoords = [
            0,1,
            1,1,
            1,0,
            0,0,
            0,1,
            1,1,
            1,0,
            0,0,
            0,1,
            1,1,
            1,0,
            0,0,
            1,1,
            0,1,
            0,0,
            1,0,
            0,0,
            0,1,
            1,1,
            1,0,
            1,0,
            1,1,
            0,1,
            0,0
        ];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};