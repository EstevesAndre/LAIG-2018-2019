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
        vector21 = [this.v2[0]-this.v1[0],
                    this.v2[1]-this.v1[1],
                    this.v2[2]-this.v1[2]
                ];
        
                    
        let vector32 = vec3.create();
        vector21 = [this.v3[0]-this.v2[0],
                    this.v3[1]-this.v2[1],
                    this.v3[2]-this.v2[2]
                ];
        
        let normal = vec3.create();
        vec3.cross(normal, vector21, vector32);
        vec3.normalize(normal, normal);
        
		this.normals = [
                normal[0], normal[1], normal[2],
                normal[0], normal[1], normal[2],
                normal[0], normal[1], normal[2]
			];			
					
		this.texCoords = [
                0, 0,
                0, 1,
                1, 0,
			];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};