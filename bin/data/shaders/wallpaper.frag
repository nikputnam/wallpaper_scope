#version 120

uniform vec2 mouse;
uniform vec2 origin;

uniform vec2 e1;
uniform vec2 e2;

uniform float width;
uniform float height;
uniform float offset;
uniform sampler2DRect tex0;    
//uniform sampler2DRect vidTex;

uniform vec4 unskew ;
uniform vec4   skew ;

const mat3 id            = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
const mat3 transMhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 transPhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 reflectY      = mat3( 1.0, 0.0, 0.0, 0.0, -1.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectSlash  = mat3( 0.0, 1.0, 0.0, 1.0,  0.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectBSlash =  transPhalf * reflectY * reflectSlash * reflectY * transMhalf ;

const mat3 tD[8] = mat3[8](
      id,
     reflectBSlash,
     reflectSlash * reflectBSlash,
     reflectSlash ,
     id,
     id,
     id,
     id
); 

const mat3 tDinverse[8] = mat3[8](
     id,
     reflectBSlash,
     reflectSlash * reflectBSlash,
     reflectSlash ,
     id,
     id,
     id,
     id
); 
               // mat3 M = tD[domain1] * tDinverse[domain0]


const int sectors[32] = int[32]( 
    8,7,0,0,0,9,0,12,2,0,  // 0 - 9
    3,0,0,0,13,14,5,6,0,0,   // 10-19
    0,10,0,11,1,0,4,0,0,0,   // 20-29
    16,15                     // 30,31
);

// cmm
const int domain[17] = int[17](
    0,
    2,2,3,3,   // 1,2,3,4
    2,1,1,2,   // 5,6,7,8
    1,1,0,0,   // 9,10,11,12
    3,0,0,3    // 13,14,15,16
);

#define SECTOR(x, y) sectors[int( int(x<y) + 2*int((x+y)<1) + 4*int(x<0.5) + 8*int(y<0.5) + 16*int( ((x+y)<0.5)||((x+y)>1.5)||(x<(y-0.5))||(x>(y+0.5)) )) ]
#define DOMAIN( s ) domain[SECTOR(s.x,s.y)]

void main(){

//	vec4 vidColor = texture2DRect(vidTex, gl_TexCoord[0].xy);
//vec2 yx = gl_TexCoord[0].xy

//mat2 unskewTest = mat2( unskew[0], unskew[1], unskew[2], unskew[3] );
mat2 unskewM = mat2( unskew );
mat2 skewM = mat2( skew );

vec2 xyS = unskewM * ( gl_TexCoord[0].xy  - origin);
vec2 oij = floor(xyS);
vec2 nm  = fract(xyS);
vec2 mouseS = unskewM * (mouse-origin);
//vec2 xyS = unskew * (gl_TexCoord[0].xy - offset) ;
//vec2 xyS = (gl_TexCoord[0].xy - offset) ;

float n = xyS.x ;// /200.0; 
float m = xyS.y ; ///200.0;

float x = gl_TexCoord[0].x ;
float y = gl_TexCoord[0].y ;
vec2 xy = vec2(width-x,y)  ;

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = texture2DRect(tex0, xy);

int lattice_range = 3;
int n_domains = 4;

    gl_FragColor = vidColor;    


/*    // hilight the corrent cell and domain...
    if ( (oij == floor(mouseS) )  ) { 

        gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;

        if (  nm.x>0.5 ) {
        gl_FragColor.r = 1.0 - gl_FragColor.r ;
        }

        if (  nm.y>0.5) {
        gl_FragColor.b = 1.0 - gl_FragColor.b ;
        }

                //
//                gl_FragColor   = vec4(0.0); 
//                gl_FragColor.w = 1.0 ;  
    }



    if (DOMAIN( fract(mouseS) ) == DOMAIN( nm )) {
        gl_FragColor.rgb = vec3(0.0);
        gl_FragColor.a = 1.0;
    }
*/


    float ll = length(mouse - gl_TexCoord[0].xy );

    // translate
//    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.25, 0.25, 1.0);
    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);



    if ( ll<5.0 ) { gl_FragColor = vec4(1.0); }

    int domain0 = DOMAIN( fract(mouseS) );

    for(int i=-lattice_range;i<=lattice_range;++i) {
        for(int j=-lattice_range;j<=lattice_range;++j) {
            for(int domain1=0;domain1<n_domains;++domain1) {
                //vec2 new_xy = origin + float(i)*e1 + float(j)*e2 + skewM*( oij + nm );
                mat3 M = tD[domain1] * tDinverse[domain0];
                vec2 new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*( floor(mouseS) + vec2( M * vec3( fract(mouseS),1.0) )) ;
                float lla = length(gl_TexCoord[0].xy - new_xy );
                if ( lla<3.0 ) { gl_FragColor = vec4(1.0); }

            }
        }   
    }


}

