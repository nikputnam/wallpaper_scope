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

uniform float value_b;
uniform float value_m;

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

uniform int range_mode ; 

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

const mat3 hexSkew    = mat3(  1.0, 0.0, 0.0, 0.5, sqrt(3.0)/2.0, 0.0,  0.0, 0.0, 1.0 );
const mat3 hexUnSkew    = mat3(  1.0, 0.0, 0.0, -1.0/sqrt(3.0), 2.0/sqrt(3.0), 0.0,  0.0, 0.0, 1.0 );
//const mat3 hexUnSkew    = mat3(  1.0, -1.0/sqrt(3.0), 0.0, 0.0, 2.0/sqrt(3.0), 0.0,    0.0, 0.0, 1.0 );


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

float luma(vec3 c) {
    return (0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
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

const int n_color_domains = 3;

const int v1_color_rot_fact =  1;
const int v2_color_rot_fact =  2;

const mat4 id4 = mat4(
            1.0, 0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 0.0, 
            0.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 0.0, 1.0
         );

const mat4 black2red = mat4(
            -1.0, 0.0, 0.0, 0.0, 
             0.0, 0.0, 1.0, 0.0, 
             0.0, 1.0, 0.0, 0.0, 
             1.0, 0.0, 0.0, 1.0
         );

const mat4 invert = mat4(
            -1.0,  0.0,  0.0, 0.0, 
             0.0, -1.0,  0.0, 0.0, 
             0.0,  0.0, -1.0, 0.0, 
             1.0,  1.0,  1.0, 1.0
         );

const mat4 color_transf[3] = mat4[3](
    id4,
    black2red,
    invert
);

const mat4 color_transfI[3] = mat4[3](
    id4,
    black2red,
    invert
);

#define MODMOD(x,m) ( ((x)>=0) ? (mod((x),(m))) : ((m)-mod((-x),(m))) )
//#define COLOR_DOMAIN(v1n,v2n,)
//#define colorTransf(i,j) (  )

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

const int domains[N_SYMMETRIES]=int[N_SYMMETRIES](3,6,6,6,12);

const int domain[N_SYMMETRIES*N_SECTORS_PLUS_ONE] = int[N_SYMMETRIES*N_SECTORS_PLUS_ONE](
    // p3
    0,
    1,1,0,0,   // 1,2,3,4
    2,2,1,1,   // 5,6,7,8
    0,0,2,2,   // 9,10,11,12

    //p3m1
    0,
    2,3,1,1,   // 1,2,3,4
    4,5,3,2,   // 5,6,7,8
    0,0,5,4,   // 9,10,11,12

    //p31m
    0,
    0,0,1,3,   // 1,2,3,4
    4,4,5,5,   // 5,6,7,8
    3,1,2,2,   // 9,10,11,12

    //p6
    0,
    0,0,1,3,   // 1,2,3,4
    4,4,5,5,   // 5,6,7,8
    3,1,2,2,   // 9,10,11,12

        //p6m
    0,
    1,2,3,4,   // 1,2,3,4
    5,6,7,8,   // 5,6,7,8
    9,10,11,0   // 9,10,11,12

);

/*
const int color_region[N_SYMMETRIES*N_SECTORS_PLUS_ONE ] = int[N_SYMMETRIES*N_SECTORS_PLUS_ONE ]( 
//p3  
        0,   0,0,0,0,    1,1,    -1,-1,    0,0,0,0,

//p3m1  
        0,   0,0,0,0,    1,1,    -1,-1,    0,0,0,0,

//p31m 
        0,   0,0,0,0,    1,1,    -1,-1,    0,0,0,0,

//p6 
        0,   0,0,0,0,    1,1,    -1,-1,    0,0,0,0,

//p6m 
        0,   0,0,0,0,    1,1,    -1,-1,    0,0,0,0
);
*/

const int color_region[N_SYMMETRIES*N_SECTORS_PLUS_ONE ] = int[N_SYMMETRIES*N_SECTORS_PLUS_ONE ]( 
//p3  
        0,   0,1,1,1,    1,0,    0,-1,    -1,-1,-1,0,

//p3m1  
        0,   0,1,1,1,    1,0,    0,-1,    -1,-1,-1,0,

//p31m 
        0,   0,1,1,1,    1,0,    0,-1,    -1,-1,-1,0,

//p6 
        0,   0,1,1,1,    1,0,    0,-1,    -1,-1,-1,0,

//p6m 
        0,   0,1,1,1,    1,0,    0,-1,    -1,-1,-1,0
);

const mat3 tD[N_SYMMETRIES*MATRICES_PER_SYMMETRY] = mat3[N_SYMMETRIES*MATRICES_PER_SYMMETRY]( //id,
//p3  
     id,        // 0
     V*S,       // 1
     S*V,   // 2
     null, // id ,       // 3
     null, //id ,       // 4
     null, //B*S*V*S*V*B,       // 5 
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*S*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null,       // 11

//p3m1  
     id,       // 12 = 0
     S,       // 1
     S*V*S,   // 2
     S*V*S*V ,       // 3
     S*V ,       // 4
     V,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

     //p31m 
     id,       // 12 = 0
     V*S*V*S,       // 1
     V*S,   // 2
     V*S*V*S*B ,       // 3
     B ,       // 4
     V*S*B,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

          //p6 
     id,       // 12 = 0
     V*S*V*S,       // 1
     V*S,   // 2
     V*S*V*B ,       // 3
     V*B ,       // 4
     V*S*V*S*V*B,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

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
     id,        // 0
     S*V,       // 1
     V*S,   // 2
     null, // id ,       // 3
     null, //id ,       // 4
     null, //B*S*V*S*V*B,       // 5 
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*S*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null,       // 11

// the rest sill need to be flipped
//p3m1  
     id,       // 12 = 0
     S,       // 1
     S*V*S,   // 2
     V*S*V*S ,       // 3
     V*S ,       // 4
     V,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

     //p31m 
     id,       // 12 = 0
     S*V*S*V,       // 1
     S*V,   // 2
     B*S*V*S*V ,       // 3
     B ,       // 4
    B*S*V,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

          //p6 
        id,       // 12 = 0
     S*V*S*V,       // 1
     S*V,   // 2
     B*V*S*V ,       // 3
     B*V ,       // 4
     B*V*S*V*S*V,       // 5
     null, //B*S*V*S*B,       // 6
     null, //B*S*V*B,       // 7
     null, //B*V*B,       // 8
     null, //id,       // 9 
     null, //id,       // 10
     null, //V,       // 11

          //p6m 
     V,       // 12 = 0
     S*V,       // 1
     V*S*V,   // 2
     id ,       // 3
     B ,       // 4
     B*V*S*V,       // 5
     B*S*V,       // 6
     B*V,       // 7
     B*V*S,       // 8
     B*S,       // 9 
     S,       // 10
     V*S       // 11
); 
               // mat3 M = tD[domain1] * tDinverse[domain0]




//vec2 one_wrap = vec2(  )
vec2 boxwh = vec2(width,0);

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
vec2 mouseIJ = floor(mouseS);
//vec2 xyS = unskew * (gl_TexCoord[0].xy - offset) ;
//vec2 xyS = (gl_TexCoord[0].xy - offset) ;

//if ( mouseIJ == oij ) { gl_FragColor = vec4(1.0,0,0,1.0); return ; }

float n = xyS.x ;// /200.0; 
float m = xyS.y ; ///200.0;

float x = gl_TexCoord[0].x ;
float y = gl_TexCoord[0].y ;
vec2 xy =  gl_TexCoord[0].xy;
//vec2 xy = vec2(width-x,y)  ;

vec2 fractXY = fract(xyS);

int domain0 = DOMAIN(symmetry_id,fractXY);
int sector0 = SECTOR(fractXY.x, fractXY.y);
 
if ( sector0 == 0 ) {  // for debugging:  signals an error;
    gl_FragColor = vec4(1.0,0,0,1.0);

} else { 

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = mix( texture2DRect(tex0, gl_TexCoord[0].xy)  ,texture2DRect(last_frame, gl_TexCoord[0].xy), mix_f ); // texture2DRect(tex0, xy);

//int lattice_range = 1;
int n_domains = domains[(symmetry_id-ID_OFFSET)];

    //gl_FragColor = vidColor;    


    //float ll_mouse = length(mouse - gl_TexCoord[0].xy );

    // translate
//    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.25, 0.25, 1.0);
    mat3 oi = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);

//vec4 merge( vec4 s, vec4 d ) {
//    float a = s.a + d.a*(1.0-s.a);
//    return vec4(  (s.rgb*s.a + d.rgb*d.a*(1.0-s.a))/a , a );
//}

//float alpha_merge(float s, float d) { 
//    return s + d*(1.0-s);
//}

#define AMERGE(S,D) ((S)+(D)*(1.0-(S)))


    vec2 new_xy = vec2(0);
    float w = 0.0;

    vec4 averaged_vidcolor = vec4(0.0);
    float new_alpha = 0.0;

    int sec_cf = color_region[((symmetry_id-ID_OFFSET)*N_SECTORS_PLUS_ONE)+sector0];
    int v1_cf =  (30+(int(oij.x))*v1_color_rot_fact) ;
    int v2_cf =  (30+(int(oij.y))*v2_color_rot_fact) ;
    v1_cf = int(MODMOD( v1_cf , n_color_domains)) ;
    v2_cf = int(MODMOD( v2_cf , n_color_domains)) ;
    int color_domain0 = sec_cf + v1_cf  + v2_cf;
    color_domain0 = int(MODMOD( float(color_domain0) ,float(n_color_domains)));

    //if (color_domain0 < 0 || color_domain0 >2 ) {  gl_FragColor = vec4(0.0,1.0,1.0,1.0); return ;  }

    int sector1 = 0;

//    vec2 xySp = xyS + vec2(0.1,0.1);
    for(int i=-lattice_range;i<=lattice_range;++i) {
        for(int j=-lattice_range;j<=lattice_range;++j) {
            for(int domain1=0;domain1<n_domains;++domain1) {
                //vec2 new_xy = origin + float(i)*e1 + float(j)*e2 + skewM*( oij + nm );
                mat3 M = tD[((symmetry_id-ID_OFFSET)*MATRICES_PER_SYMMETRY)+domain1] * tDinverse[((symmetry_id-ID_OFFSET)*MATRICES_PER_SYMMETRY)+domain0];

                vec2 fract_new_xyS =  vec2( M * vec3( fract(xyS),1.0) ) ;
                if (range_mode == 0) {
                    
                    new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*( floor(xyS) + fract_new_xyS ) ;
                } else {
                    new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*(  fract_new_xyS) ;
                }
                fract_new_xyS = fract( fract_new_xyS );
                sector1 = SECTOR(fract_new_xyS.x, fract_new_xyS.y);

                vec2 new_xyS = unskewM * ( new_xy - origin);
                vec2 new_ij = floor(new_xyS);
//                new_xy = vec2( mod((new_xy.x + width), width ), new_xy.y );

                //TODO:  turn back on
                // cylindrical wrapping
                //new_xy.x = mod(new_xy.x + 5.0*(boxwh.x), boxwh.x);
                
                //new_xy.x = mod(new_xy.x , boxwh.x);    

                if ( (new_xy.y >= 0.0) && (new_xy.y < height) 
                // TODO:  turn off
                && ( (new_xy.x >= 0.0) && (new_xy.x < width) )
                ) {
                
                    if (range_mode == 0) {
                        float ll = DISTANCE(new_xy,xy); // length(new_xy  - xy);
                        float ll_mouse2 = DISTANCE(new_xy, mouse); //length(new_xy  - mouse);
                        float mm = ll / weight_range;

                        w = clamp(1-mm,0,1)  ;
                    } else {
                            w = 1.0;
                    }

                    vec4 camera_color = texture2DRect(tex0, new_xy) ;
                    vec4 feedback_color = texture2DRect(last_frame, new_xy);
                    //new_alpha = max( camera_color.a, new_alpha );
                    //new_alpha = max( feedback_color.a, new_alpha );
  
                    new_alpha = AMERGE(w*(mix_f)*feedback_color.a ,new_alpha);
                    new_alpha = AMERGE(w*(1.0-mix_f)*camera_color.a,new_alpha);

                    if ((checkerboard==1)) { //  && (mod(i+j,2)==1))               { 
                        //lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb; 
                        //camera_color.rgb = vec3(1.0) - camera_color.rgb;
                        //int sector1 = SECTOR(new_xy.x, new_xy.y);

                        sec_cf = color_region[((symmetry_id-ID_OFFSET)*N_SECTORS_PLUS_ONE)+sector1];

                        //v1_cf = int(MODMOD( (30+(int(oij.x)+i)*v1_color_rot_fact), n_color_domatins)) ;
                        //v2_cf = int(MODMOD( (30+(int(oij.y)+j)*v2_color_rot_fact), n_color_domatins)) ;

                        v1_cf = 30+(int(new_ij.x))*v1_color_rot_fact ;
                        v2_cf = 30+(int(new_ij.y))*v2_color_rot_fact ;
                        
                        v1_cf = int(MODMOD( v1_cf , n_color_domains) );
                        v2_cf = int(MODMOD( v2_cf , n_color_domains) );

                        int color_domain1 = sec_cf + v1_cf  + v2_cf;
                        color_domain1 = int(MODMOD( float(color_domain1) ,float(n_color_domains)));

                        //if (color_domain1 < 0 || color_domain1 >2 ) {  gl_FragColor = vec4(0.0,0.0,1.0,1.0); return ;  }

                        mat4 colorM = color_transf[color_domain0 ] * color_transfI[color_domain1 ];
                        //if ( color_domain0 != color_domain1 ) { 
                            vec4 flipped_color = (colorM*vec4(feedback_color.rgb,1)) ; //vec3(1.0) - feedback_color.rgb;
                            feedback_color.rgb = flipped_color.rgb;
                        //}
                        camera_color.rgb = (color_transf[color_domain0 ]*vec4(camera_color.rgb,1)).rgb ; //vec3(1.0) - feedback_color.rgb;

                    }
                    if ((intrainversion==1) && (mod(domain0+domain1,2)==1)) { 
                        //lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb; 
                        camera_color.rgb = vec3(1.0) - camera_color.rgb;
                        feedback_color.rgb = vec3(1.0) - feedback_color.rgb;
                    }
                    
                    averaged_vidcolor.rgb =  averaged_vidcolor.rgb + w*(1.0-mix_f)*camera_color.a*camera_color.rgb ;
                    averaged_vidcolor.rgb =  averaged_vidcolor.rgb + w*(mix_f)*feedback_color.a*feedback_color.rgb ;

                    averaged_vidcolor.a = averaged_vidcolor.a + w*( (1.0-mix_f)*camera_color.a + (mix_f)*feedback_color.a ) ;
               }
            }
        }   
    }


    averaged_vidcolor  = averaged_vidcolor * (1.0 / averaged_vidcolor.a );

    vec3 rgb1 = averaged_vidcolor.rgb;

    if ((post_checkerboard==1)) { 
    //    rgb2 = vec3(1.0) - rgb2; 
        rgb1.rgb = (color_transf[color_domain0 ]*vec4(rgb1.rgb,1)).rgb;
    }
    

    vec3 hsv1 = rgb2hsv(rgb1);
    //vec3 hsv2  = vec3( fract(hsv1.x+0.5*time+hue_shift), hsv1.y, hsv1.y < 0.5 ? smoothstep(0,1,clamp( brightness_boost* hsv1.z,0,1)) : hsv1.z ) ;

    hsv1  = vec3( hsv1.x, hsv1.y, clamp( brightness_boost + hsv1.z, 0,1)  ) ;
    hsv1  = vec3( hsv1.x, clamp( saturation_boost* hsv1.y,0,1), hsv1.z  ) ;

    vec3 hsv2  = vec3( fract(hsv1.x+hue_shift),          hsv1.y,  clamp(  smoothstep( value_m , value_b, hsv1.z )  ,0.0,1.0)  ) ;    

    vec3 rgb2 = hsv2rgb(hsv2);

    vec2 ij = floor(xyS) ;
    //if ((post_checkerboard==1) && (mod(ij.x+ij.y,2)==1)) { rgb2 = vec3(1.0) - rgb2; }
    
    /*
    if ((post_checkerboard==1)) { 
    //    rgb2 = vec3(1.0) - rgb2; 
        rgb2.rgb = (color_transf[color_domain0 ]*vec4(rgb2.rgb,1)).rgb;
    }
    */
    
    if ((post_intrainversion==1) && (mod(domain0,2)==1)) { rgb2 = vec3(1.0) - rgb2; }


    gl_FragColor = vec4(rgb2,new_alpha) ; 

}


}

