#version 120

uniform vec2 mouse;
uniform vec2 origin;

uniform vec2 e1;
uniform vec2 e2;

uniform int checkerboard;
uniform int intrainversion;

uniform int post_checkerboard;
uniform int post_intrainversion;


uniform float hue_shift;
uniform float saturation_boost;
uniform float brightness_boost;
uniform float contrast_boost;
uniform int lattice_range;
uniform int symmetry_id;
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

const mat3 nil           = mat3(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
const mat3 null           = mat3(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
const mat3 id            = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);

const mat3 S  = mat3( 0.0, 1.0, 0.0, 1.0,  0.0, 0.0,  0.0,  0.0, 1.0 );


const mat3 transMhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 transPhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.5,  0.5, 1.0 );
const mat3 transMhalfX    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5,  0.0, 1.0 );
const mat3 transPhalfX    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.5,  0.0, 1.0 );
const mat3 transMhalfY    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.5, 1.0 );
const mat3 transM1Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 1.0 );
const mat3 transP1Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  1.0, 1.0 );

const mat3 transPhalfY    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.0,  0.5, 1.0 );
const mat3 reflectY      = mat3( 1.0, 0.0, 0.0, 0.0, -1.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectX      = mat3( -1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.0,  0.0, 1.0 );

const mat3 transM34Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.75, 1.0 );
const mat3 transM14Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.25, 1.0 );
const mat3 transP34Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  0.75, 1.0 );
const mat3 transP14Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  0.25, 1.0 );

const mat3 transP14X    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.25, 0.0, 1.0 );
const mat3 transM14X    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.25, 0.0, 1.0 );

const mat3 rotMt    = mat3( 2.0/sqrt(5.0),  1.0/sqrt(5.0),   0.0,    -1.0/sqrt(5.0), 2.0/sqrt(5.0),   0.0,    0.0, 0.0, 1.0 );
const mat3 rotPt    = mat3( 2.0/sqrt(5.0), -1.0/sqrt(5.0),   0.0,     1.0/sqrt(5.0), 2.0/sqrt(5.0),   0.0,    0.0, 0.0, 1.0 );
//const mat3 rotPt    = mat3( 1.0, 0.0,   0.0,    0.0, 1.0,   0.0,    0.0, 0.0, 1.0 );

const mat3 hexSkew    = mat3(  1.0, 0.5, 0.0, 0.0, sqrt(3.0)/2.0, 0.0,    0.0, 0.0, 1.0 );
const mat3 hexUnSkew    = mat3(  1.0, -1.0/sqrt(3.0), 0.0, 0.0, 2.0/sqrt(3.0), 0.0,    0.0, 0.0, 1.0 );


const mat3 B =  transPhalf * reflectY * S * reflectY * transMhalf ;

const mat3 V =  hexUnSkew * transPhalfX * reflectX * transMhalfX * hexSkew ;


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

#define N_SYMMETRIES 5
#define MATRICES_PER_SYMMETRY 12
#define N_SECTORS_PLUS_ONE 13

const int sectors[64] = int[64]( 
    1,12,0,0,2,0,0,0, //  0 -  7
    0,0,0,0,0,0,0,0, //  8 - 15
    0,11,0,0,3,10,4,9, // 16 - 23
    0,0,0,0,0,0,0,8, // 24 - 31
    0,0,0,0,0,0,0,0, // 32 - 39
    0,0,0,0,0,0,0,0, // 40 - 47
    0,0,0,0,0,0,5,0, // 48 - 55
    0,0,0,0,0,0,6,7  // 56 - 63
);

//the the other shader for these:
//#define CMM 0   //  rhombic  
//#define CM  1   //  rhombic
//#define P1  2   //  oblique
//#define P2  3   //  oblique
//#define PM  4   //  rectangular
//#define PG  5   //  rectangular
//#define PMM 6   //  rectangular
//#define PMG 7   //  rectangular
//#define PGG 8   //  rectangular
//#define P4  9   //  square
//#define P4M  10 //  square
//#define P4G  11 //  square

#define ID_OFFSET 12
//the hexagonal lattice symetries: 
#define P3   12 //  hexagonal
#define P3M1 13 //  hexagonal
#define P31M 14 //  hexagonal
#define P6   15 //  hexagonal
#define P6M  16 //  hexagonal

const int domains[N_SYMMETRIES]=int[N_SYMMETRIES](12,12,12,12,12);

const int domain[N_SYMMETRIES*N_SECTORS_PLUS_ONE] = int[N_SYMMETRIES*N_SECTORS_PLUS_ONE](
    // p3
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0,   // 9,10,11,12

    //p3m1
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0,   // 9,10,11,12

    //p31m
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0,   // 9,10,11,12

    //p6
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0,   // 9,10,11,12

        //p6m
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0   // 9,10,11,12

);

const mat3 tD[N_SYMMETRIES*MATRICES_PER_SYMMETRY] = mat3[N_SYMMETRIES*MATRICES_PER_SYMMETRY]( //id,
//p3  
     V,       // 12 = 0
     null, // V*S,       // 1
     null, // S*V*S*V,   // 2
     id ,       // 3
     id ,       // 4
     null, // B*S*V*S*V*B,       // 5
     null, // B*S*V*S*B,       // 6
     null, // B*S*V*B,       // 7
     null, // B*S*V*B,       // 8
     id,       // 9 
     id,       // 10
     null, // S*V,       // 11

//p3m1  
     S*V,       // 12 = 0
     S*V*S,       // 1
     S*V*S*V,   // 2
     S ,       // 3
     S ,       // 4
     B*S*V*S*V*B,       // 5
     B*S*V*S*B,       // 6
     B*S*V*B,       // 7
     B*V*B,       // 8
     id,       // 9 
     id,       // 10
     V,       // 11

     //p31m 
     S*V,       // 12 = 0
     V*S,       // 1
     S*V*S*V,   // 2
     id ,       // 3
     B ,       // 4
     S*V*S*V*B,       // 5
     S*V*S*B,       // 6
     S*V*B,       // 7
     S*V*B,       // 8
     B,       // 9 
     id,       // 10
     S*V,       // 11

          //p6 
     S*V,       // 12 = 0
     V*S,       // 1
     S*V*S*V,   // 2
     id ,       // 3
     S*B ,       // 4
     V*S*V*B,       // 5
     V*S*B,       // 6
     V*B,       // 7
     V*B,       // 8
     S*B,       // 9 
     id,       // 10
     S*V,       // 11

          //p6m 
     V,       // 12 = 0
     V*S,       // 1
     V*S*V,   // 2
     id ,       // 3
     B ,       // 4
     V*S*V*B,       // 5
     V*S*B,       // 6
     V*B,       // 7
     S*V*B,       // 8
     S*B,       // 9 
     S,       // 10
     S*V       // 11
); 

const mat3 tDinverse[N_SYMMETRIES*MATRICES_PER_SYMMETRY] = mat3[N_SYMMETRIES*MATRICES_PER_SYMMETRY](
//p3  
     V,       // 12 = 0
     null, // S*V,       // 1
     null, // V*S*V*S,   // 2
     id ,       // 3
     id ,       // 4
     null, // B*V*S*V*S*B,       // 5
     null, // B*S*V*S*B,       // 6
     null, // B*V*S*B,       // 7
     null, // B*V*S*B,       // 8
     id,       // 9 
     id,       // 10
     null, // V*S,       // 11

// the rest sill need to be flipped
//p3m1  
     S*V,       // 12 = 0
     S*V*S,       // 1
     S*V*S*V,   // 2
     S ,       // 3
     S ,       // 4
     B*S*V*S*V*B,       // 5
     B*S*V*S*B,       // 6
     B*S*V*B,       // 7
     B*V*B,       // 8
     id,       // 9 
     id,       // 10
     V,       // 11

     //p31m 
     S*V,       // 12 = 0
     V*S,       // 1
     S*V*S*V,   // 2
     id ,       // 3
     B ,       // 4
     S*V*S*V*B,       // 5
     S*V*S*B,       // 6
     S*V*B,       // 7
     S*V*B,       // 8
     B,       // 9 
     id,       // 10
     S*V,       // 11

          //p6 
     S*V,       // 12 = 0
     V*S,       // 1
     S*V*S*V,   // 2
     id ,       // 3
     S*B ,       // 4
     V*S*V*B,       // 5
     V*S*B,       // 6
     V*B,       // 7
     V*B,       // 8
     S*B,       // 9 
     id,       // 10
     S*V,       // 11

          //p6m 
     V,       // 12 = 0
     V*S,       // 1
     V*S*V,   // 2
     id ,       // 3
     B ,       // 4
     V*S*V*B,       // 5
     V*S*B,       // 6
     V*B,       // 7
     S*V*B,       // 8
     S*B,       // 9 
     S,       // 10
     S*V       // 11
); 
               // mat3 M = tD[domain1] * tDinverse[domain0]




//vec2 one_wrap = vec2(  )
vec2 boxwh = vec2(width,0.0);


#define SECTOR(x, y) sectors[int( int(x<y) + 2*int((x+y)>1) + 4*int(y>1.0-2.0*x) + 8*int(y>1.0-0.5*x) + 16*int(y>0.5-0.5*x) + 32*int(y>2.0-2.0*x)) ]
#define DOMAIN(g, s ) domain[((g-ID_OFFSET)*N_SECTORS_PLUS_ONE)+SECTOR(s.x,s.y)]
#define DISTANCE(x,y) (min( length(y+boxwh-x) , min( length(x-y), length( x+boxwh-y  ) )))

void main(){

//	vec4 vidColor = texture2DRect(vidTex, gl_TexCoord[0].xy);
//vec2 yx = gl_TexCoord[0].xy

//mat2 unskewTest = mat2( unskew[0], unskew[1], unskew[2], unskew[3] );
mat2 unskewM = mat2( unskew );
mat2 skewM = mat2( skew );

vec2 xyS = unskewM * ( gl_TexCoord[0].xy  - origin);
vec2 wrap_ij = floor( unskewM * ( boxwh ) );
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

int domain0 = DOMAIN(symmetry_id,fract(xyS));

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = mix( texture2DRect(tex0, gl_TexCoord[0].xy)  ,texture2DRect(last_frame, gl_TexCoord[0].xy), mix_f ); // texture2DRect(tex0, xy);

//int lattice_range = 1;
int n_domains = domains[(symmetry_id-ID_OFFSET)];

    //gl_FragColor = vidColor;    


    //float ll_mouse = length(mouse - gl_TexCoord[0].xy );

    // translate
//    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.25, 0.25, 1.0);
    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);





    vec4 averaged_vidcolor = vec4(0.0);


//    vec2 xySp = xyS + vec2(0.1,0.1);
    for(int i=-lattice_range;i<=lattice_range;++i) {
        for(int j=-lattice_range;j<=lattice_range;++j) {
            for(int domain1=0;domain1<n_domains;++domain1) {
                //vec2 new_xy = origin + float(i)*e1 + float(j)*e2 + skewM*( oij + nm );
                mat3 M = tD[((symmetry_id-ID_OFFSET)*MATRICES_PER_SYMMETRY)+domain1] * tDinverse[((symmetry_id-ID_OFFSET)*MATRICES_PER_SYMMETRY)+domain0];
                vec2 new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*( floor(xyS) + vec2( M * vec3( fract(xyS),1.0) )) ;
//                new_xy = vec2( mod((new_xy.x + width), width ), new_xy.y );

                // torroidal wrapping.  (only should do on x?)
                new_xy = mod(new_xy + lattice_range*(boxwh+boxwh), boxwh);
                //float ll = length(new_xy + vec2(50,50) - gl_TexCoord[0].xy);
                float ll = DISTANCE(new_xy,xy); // length(new_xy  - xy);
                float ll_mouse2 = DISTANCE(new_xy, mouse); //length(new_xy  - mouse);
                //float ll_mouse3 = length(xy  - mouse);
                float mm = ll / weight_range;
//                float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*exp( -mm*mm)  ;
                //float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*clamp(1-mm,0,1)  ;
                //float w=float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height);
                float w = clamp(1-mm,0,1)  ;
                //float w = float(new_xy.x>0)*float(new_xy.x<width)*float(new_xy.y>0)*float(new_xy.y<height)*1.0  ;

//                vec4 lattice_vidColor = texture2DRect(last_frame, new_xy);
                //vec4 lattice_vidColor = texture2DRect(last_frame, new_xy);
                //vec4 lattice_vidColor = mix( texture2DRect(tex0, new_xy)  ,texture2DRect(last_frame, new_xy), ll_mouse2 < 100 ? mix_f : 1.0 ); // texture2DRect(tex0, xy);
                
                vec4 lattice_vidColor = mix( texture2DRect(tex0, new_xy)  ,texture2DRect(last_frame, new_xy), mix_f ); // texture2DRect(tex0, xy);
                
                //if ( (ll_mouse2<6.0)  )  {lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb;} // { averaged_vidcolor = 1.0-averaged_vidcolor; }
                
                if ( (ll_mouse2<6.0)  )  {lattice_vidColor.rgb = vec3(1.0,0,0) ;} // { averaged_vidcolor = 1.0-averaged_vidcolor; }

                if ((checkerboard==1) && (mod(i+j,2)==1))               { lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb; }
                if ((intrainversion==1) && (mod(domain0+domain1,2)==1)) { lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb; }
                averaged_vidcolor.rgb =  averaged_vidcolor.rgb + w*lattice_vidColor.rgb ;
                averaged_vidcolor.a = averaged_vidcolor.a + w*1.0 ;

                //float lla = length(gl_TexCoord[0].xy - new_xy );
                //if ( (ll_mouse2<3.0) && (ll_mouse3 < weight_range) ) { averaged_vidcolor = vec4(1.0); }
                //

            }
        }   
    }


    averaged_vidcolor  = averaged_vidcolor * (1.0 / averaged_vidcolor.a );

    vec3 rgb1 = averaged_vidcolor.rgb;
    vec3 hsv1 = rgb2hsv(rgb1);
    //vec3 hsv2  = vec3( fract(hsv1.x+0.5*time+hue_shift), hsv1.y, hsv1.y < 0.5 ? smoothstep(0,1,clamp( brightness_boost* hsv1.z,0,1)) : hsv1.z ) ;

    hsv1  = vec3( hsv1.x, hsv1.y, clamp( brightness_boost*hsv1.z, 0,1)  ) ;
    hsv1  = vec3( hsv1.x, clamp( saturation_boost* hsv1.y,0,1), hsv1.z  ) ;

    // make value more extreme for low saturation pixels
    vec3 hsv2  = vec3( fract(hsv1.x+hue_shift),          hsv1.y, hsv1.y < 0.5 ? smoothstep(0,1,0.5+clamp( contrast_boost* (hsv1.z-0.5),-0.5,0.5)) : hsv1.z ) ;    


    //make value more extreme 
    //vec3 hsv2  = vec3( fract(hsv1.x+hue_shift),          hsv1.y,  smoothstep(0,1,0.5+clamp( contrast_boost* (hsv1.z-0.5),-0.5,0.5))  ) ;    

   // hsv2  = vec3( hsv2.x, clamp( 3.0* smoothstep(-1.0,1.0, hsv2.y),0,1), hsv1.z  ) ;
   // hsv2  = vec3( hsv2.x, clamp( 3.0* smoothstep(-1.0,1.0, hsv2.y),0,1), hsv1.z  ) ;
//    hsv2  = vec3( hsv2.x, 1.0, smoothstep(0.0,1.0,hsv2.z) ) ;

//    hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
//    hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
 //   hsv2  = vec3( hsv2.x, smoothstep(0.0,1.0, hsv2.y), smoothstep(0.0,1.0,hsv2.z) ) ;
    vec3 rgb2 = hsv2rgb(hsv2);

    vec2 ij = floor(xyS) ;
    if ((post_checkerboard==1) && (mod(ij.x+ij.y,2)==1)) { rgb2 = vec3(1.0) - rgb2; }
    if ((post_intrainversion==1) && (mod(domain0,2)==1)) { rgb2 = vec3(1.0) - rgb2; }


    gl_FragColor = vec4(rgb2,1.0) ; //

    if (domain0==1) { gl_FragColor = vec4(vec3(0.0),1.0); };

/*
    // hilight the corrent cell and domain...
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

//    if (DOMAIN(symmetry_id, fract(mouseS) ) == domain0) {
//        gl_FragColor.rgb = vec3(0.0);
//        gl_FragColor.a = 1.0;
//    }


    if ( ll_mouse<5.0 ) { gl_FragColor = vec4(1.0); }
*/

    //gl_FragColor = mix( vec4(rgb2,1.0) ,vidColor, 0.00 );

    //gl_FragColor = vec4(rgb2,1.0);

    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
    //gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );
//    gl_FragColor =  smoothstep( vec4(0.0), vec4(1.0), gl_FragColor );

}
