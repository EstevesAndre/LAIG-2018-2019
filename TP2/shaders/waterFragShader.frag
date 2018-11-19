#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D text;
uniform float texscale;

void main()
{
    gl_FragColor = texture2D(text, vTextureCoord*texscale);    
}