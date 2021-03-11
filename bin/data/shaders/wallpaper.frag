#version 120

uniform vec2 mouse;

uniform float width;
uniform float height;
uniform float offset;
uniform sampler2DRect tex0;    
//uniform sampler2DRect vidTex;

uniform vec4 unskew ;

void main(){

//	vec4 vidColor = texture2DRect(vidTex, gl_TexCoord[0].xy);
//vec2 yx = gl_TexCoord[0].xy

//mat2 unskewTest = mat2( unskew[0], unskew[1], unskew[2], unskew[3] );
mat2 unskewTest = mat2( unskew );

vec2 xyS = unskewTest * gl_TexCoord[0].xy ;
vec2 mouseS = unskewTest * mouse;
//vec2 xyS = unskew * (gl_TexCoord[0].xy - offset) ;
//vec2 xyS = (gl_TexCoord[0].xy - offset) ;

float n = xyS.x ;// /200.0; 
float m = xyS.y ; ///200.0;

float x = gl_TexCoord[0].x ;
float y = gl_TexCoord[0].y ;
vec2 xy = vec2(width-x,y)  ;

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = texture2DRect(tex0, xy);



    gl_FragColor = vidColor;    

    if (  fract(n)>0.5 ) {
        gl_FragColor.r = 1.0 - vidColor.r;    
    }

    if (  fract(m)>0.5) {
        gl_FragColor.b = 1.0 - vidColor.b;    
    }

    float ll = length(mouse - gl_TexCoord[0].xy );

    if ( (floor(n) == floor(mouseS.x) ) && 
            (floor(m)==floor(mouseS.y) ) ) { 
                gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
//                gl_FragColor   = vec4(0.0); 
//                gl_FragColor.w = 1.0 ;  
    }

    if ( ll<5.0 ) { gl_FragColor = vec4(1.0); }

}

