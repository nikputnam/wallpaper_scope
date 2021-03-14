#version 120

uniform vec2 mouse;
uniform vec2 origin;

uniform vec2 e1;
uniform vec2 e2;

uniform float hue_shift;
uniform float saturation_boost;
uniform float brightness_boost;
uniform int lattice_range;
uniform float weight_range;

uniform float width;
uniform float time;
uniform float height;
uniform float offset;
uniform float mix_f;
uniform sampler2DRect tex0;    
uniform sampler2DRect last_frame;    
//uniform sampler2DRect vidTex;

uniform vec4 unskew ;
uniform vec4   skew ;

const mat3 id            = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
const mat3 transMhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 transPhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 reflectY      = mat3( 1.0, 0.0, 0.0, 0.0, -1.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectSlash  = mat3( 0.0, 1.0, 0.0, 1.0,  0.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectBSlash =  transPhalf * reflectY * reflectSlash * reflectY * transMhalf ;

//  from https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl  
//  licence = https://en.wikipedia.org/wiki/WTFPL
// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



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
vec2 xy =  gl_TexCoord[0].xy;
//vec2 xy = vec2(width-x,y)  ;

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = texture2DRect(tex0, xy);

//int lattice_range = 1;
int n_domains = 4;

    //gl_FragColor = vidColor;    


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

    int domain0 = DOMAIN( fract(xyS) );

    vec4 averaged_vidcolor = vec4(0.0);

//    vec2 xySp = xyS + vec2(0.1,0.1);
    for(int i=-lattice_range;i<=lattice_range;++i) {
        for(int j=-lattice_range;j<=lattice_range;++j) {
            for(int domain1=0;domain1<n_domains;++domain1) {
                //vec2 new_xy = origin + float(i)*e1 + float(j)*e2 + skewM*( oij + nm );
                mat3 M = tD[domain1] * tDinverse[domain0];
                vec2 new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*( floor(xyS) + vec2( M * vec3( fract(xyS),1.0) )) ;
                //float ll = length(new_xy + vec2(50,50) - gl_TexCoord[0].xy);
                float ll = length(new_xy  - gl_TexCoord[0].xy);
                float mm = ll / weight_range;
//                float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*exp( -mm*mm)  ;
                float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*clamp(1-mm,0,1)  ;
                //float w=float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height);
                //float w = clamp(1-mm,0,1)  ;
                //float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*1.0  ;

//                vec4 lattice_vidColor = texture2DRect(last_frame, new_xy);
                vec4 lattice_vidColor = texture2DRect(last_frame, new_xy);
                
                averaged_vidcolor.rgb =  averaged_vidcolor.rgb + w*lattice_vidColor.rgb ;
                averaged_vidcolor.a = averaged_vidcolor.a + w*1.0 ;

                //float lla = length(gl_TexCoord[0].xy - new_xy );
                //if ( lla<3.0 ) { gl_FragColor = vec4(1.0); }

            }
        }   
    }

    averaged_vidcolor  = averaged_vidcolor * (1.0 / averaged_vidcolor.a );
    vec3 rgb1 = averaged_vidcolor.rgb;
    vec3 hsv1 = rgb2hsv(rgb1);
    vec3 hsv2  = vec3( fract(hsv1.x+0.5*time+hue_shift), hsv1.y, hsv1.z ) ;

    hsv2  = vec3( hsv2.x, clamp( saturation_boost* hsv2.y,0,1), clamp( brightness_boost*hsv1.z,0,1)  ) ;
   // hsv2  = vec3( hsv2.x, clamp( 3.0* smoothstep(-1.0,1.0, hsv2.y),0,1), hsv1.z  ) ;
   // hsv2  = vec3( hsv2.x, clamp( 3.0* smoothstep(-1.0,1.0, hsv2.y),0,1), hsv1.z  ) ;
//    hsv2  = vec3( hsv2.x, 1.0, smoothstep(0.0,1.0,hsv2.z) ) ;

//    hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
//    hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
 //   hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
    vec3 rgb2 = hsv2rgb(hsv2);

    gl_FragColor = mix( vec4(rgb2,1.0) ,vidColor, mix_f );
    //gl_FragColor = mix( vec4(rgb2,1.0) ,vidColor, 0.00 );

    //gl_FragColor = vec4(rgb2,1.0);

    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );

}

