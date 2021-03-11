#version 120

uniform vec2 mouse;

uniform float width;
uniform float height;
uniform float offset;
uniform sampler2DRect tex0;    
//uniform sampler2DRect vidTex;

uniform vec4 unskew ;

const int sectors[32] = int[32]( 
    8,7,0,0,0,9,0,12,2,0,  // 0 - 9
    3,0,0,0,13,14,5,6,0,0,   // 10-19
    0,10,0,11,1,0,4,0,0,0,   // 20-29
    16,15                     // 30,31
);

#define SECTOR(x, y) sectors[int( int(x<y) + 2*int((x+y)<1) + 4*int(x<0.5) + 8*int(y<0.5) + 16*int( ((x+y)<0.5)||((x+y)>1.5)||(x<(y-0.5))||(x>(y+0.5)) )) ]   

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



    if ( (floor(n) == floor(mouseS.x) ) && 
            (floor(m)==floor(mouseS.y) ) ) { 

        gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;

        if (  fract(n)>0.5 ) {
        gl_FragColor.r = 1.0 - gl_FragColor.r ;
        }

        if (  fract(m)>0.5) {
        gl_FragColor.b = 1.0 - gl_FragColor.b ;
        }

                //
//                gl_FragColor   = vec4(0.0); 
//                gl_FragColor.w = 1.0 ;  
    }

    float ll = length(mouse - gl_TexCoord[0].xy );

    if (SECTOR( fract(mouseS.x), fract(mouseS.y) ) == SECTOR( fract(n),fract(m) )) {
        gl_FragColor.rgb = vec3(0.0);
        gl_FragColor.a = 1.0;
    }

    if ( ll<5.0 ) { gl_FragColor = vec4(1.0); }

}

