#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D text;

void main()
{
    //gl_FragColor = vec4(0.0,0.0,0.5,1.0) * uLight[0].diffuse;
    gl_FragColor = texture2D(text, vTextureCoord);    
}