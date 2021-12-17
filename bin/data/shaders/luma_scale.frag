#version 120


uniform float t1;
uniform float t2;

uniform sampler2DRect tex0;    

//float luma(vec3 c) {
 //   return (0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
//}

void main(){

    vec4 vidColor =  texture2DRect(tex0, gl_TexCoord[0].xy);

    vec3 rgb1 = vidColor.rgb;
    vec3 rgb2 = smoothstep( vec3(t1), vec3(t2), rgb1 );

    gl_FragColor = vec4(rgb2,vidColor.a) ; 

}

