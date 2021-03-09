#version 120

uniform sampler2DRect tex0;    
//uniform sampler2DRect vidTex;

void main(){
  
//	vec4 vidColor = texture2DRect(vidTex, gl_TexCoord[0].xy);
	vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);

    gl_FragColor = vidColor;    
    gl_FragColor.r = 1.0 - vidColor.r;    


}
