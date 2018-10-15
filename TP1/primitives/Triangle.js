/**
 * Triangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Triangle extends CGFobject
{
    constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) 
	{
	    super(scene);

        this.v1 = vec3.fromValues(x1,y1,z1);
        this.v2 = vec3.fromValues(x2,y2,z2);
        this.v3 = vec3.fromValues(x3,y3,z3);

        this.a;
        this.c;
        this.cos_beta;
        this.sin_beta;

		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
            this.v1[0],this.v1[1],this.v1[2],
            this.v2[0],this.v2[1],this.v2[2],
            this.v3[0],this.v3[1],this.v3[2],
        ];

		this.indices = [
            0, 1, 2
        ];

        let vector21 = vec3.create();
        vector21 = [
            this.v2[0]-this.v1[0],
            this.v2[1]-this.v1[1],
            this.v2[2]-this.v1[2]
        ];
      
        let vector32 = vec3.create();
        vector32 = [
            this.v3[0]-this.v2[0],
            this.v3[1]-this.v2[1],
            this.v3[2]-this.v2[2]
        ];

        let vector31 = vec3.create();
        vector31 = [
            this.v3[0]-this.v1[0],
            this.v3[1]-this.v1[1],
            this.v3[2]-this.v1[2]
        ];

        this.a = Math.sqrt( vector31[0]*vector31[0] + vector31[1]*vector31[1] + vector31[2]*vector31[2]);
        this.b = Math.sqrt( vector21[0]*vector21[0] + vector21[1]*vector21[1] + vector21[2]*vector21[2]);
        this.c = Math.sqrt( vector32[0]*vector32[0] + vector32[1]*vector32[1] + vector32[2]*vector32[2]);
    
        this.cos_beta = (+this.a*this.a - this.b*this.b + this.c*this.c) / (2*this.a*this.c);
        this.sin_beta = Math.sqrt( this.a*this.a - (this.a*this.cos_beta)*(this.a*this.cos_beta) ) / this.a;

        let normal = vec3.create();
        vec3.cross(normal, vector21, vector32);
        vec3.normalize(normal, normal);
        
		this.normals = [
            normal[0], normal[1], normal[2],
            normal[0], normal[1], normal[2],
            normal[0], normal[1], normal[2]
        ];			
              
        this.updateTexCoords(1,1);
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };
    
    updateTexCoords(s,t)
	{
		this.texCoords = [
            this.c / s - this.a * this.cos_beta, t - this.a * this.sin_beta,
            0, t,
            this.c / s, t
        ];        

		this.updateTexCoordsGLBuffers();
	};
};