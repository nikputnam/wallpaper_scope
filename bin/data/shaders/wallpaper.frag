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
const mat3 id            = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
const mat3 transMhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5, -0.5, 1.0 );
const mat3 transPhalf    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.5,  0.5, 1.0 );
const mat3 transMhalfX    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -0.5,  0.0, 1.0 );
const mat3 transPhalfX    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.5,  0.0, 1.0 );
const mat3 transMhalfY    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.5, 1.0 );
const mat3 transPhalfY    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.0,  0.5, 1.0 );
const mat3 reflectY      = mat3( 1.0, 0.0, 0.0, 0.0, -1.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectX      = mat3( -1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.0,  0.0, 1.0 );
const mat3 reflectSlash  = mat3( 0.0, 1.0, 0.0, 1.0,  0.0, 0.0,  0.0,  0.0, 1.0 );

const mat3 transM34Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.75, 1.0 );
const mat3 transM14Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.25, 1.0 );
const mat3 transP34Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  0.75, 1.0 );
const mat3 transP14Y    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,  0.25, 1.0 );

const mat3 transP14X    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.25, 0.0, 1.0 );
const mat3 transM14X    = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,  0.25, 0.0, 1.0 );

const mat3 reflectBSlash =  transPhalf * reflectY * reflectSlash * reflectY * transMhalf ;
const mat3 rot2          =  transPhalf * reflectY * reflectX * transMhalf ;

const mat3 rot14          =  transPhalf * reflectX * reflectSlash * transMhalf ;
const mat3 rot34          =  transPhalf * reflectY * reflectSlash * transMhalf ;

const mat3 mirrorX       =  transPhalfX * reflectX * transMhalfX ;
const mat3 mirrorY       =  transPhalfY * reflectY * transMhalfY ;

const mat3 glideX        =  transPhalfY * reflectY * transMhalf ;
const mat3 unglideX      =  transPhalf * reflectY * transMhalfY ;

const mat3 glideX34p      =  transP34Y * reflectY * transPhalfX * transM34Y ;
const mat3 glideX34m      =  transP34Y * reflectY * transMhalfX * transM34Y ;
const mat3 glideX14p      =  transP14Y * reflectY * transPhalfX * transM14Y ;
const mat3 glideX14m      =  transP14Y * reflectY * transMhalfX * transM14Y ;

const mat3 reflectBSlashQ = transP14Y * transP14X * reflectY * reflectSlash * reflectY * transM14X * transM14Y ;

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

#define N_SYMMETRIES 12
#define MATRICES_PER_SYMMETRY 8

const int sectors[32] = int[32]( 
    8,7,0,0,0,9,0,12,2,0,  // 0 - 9
    3,0,0,0,13,14,5,6,0,0,   // 10-19
    0,10,0,11,1,0,4,0,0,0,   // 20-29
    16,15                     // 30,31
);

#define CMM 0
#define CM  1
#define P1  2
#define P2  3
#define PM  4
#define PG  5
#define PMM 6
#define PMG 7
#define PGG 8
#define P4  9
#define P4M  10
#define P4G  11


const int domains[N_SYMMETRIES]=int[N_SYMMETRIES](4,2,1,2,2,2,4,4,6,4,8,8);

const int domain[N_SYMMETRIES*17] = int[N_SYMMETRIES*17](
    // cmm
    0,
    2,2,3,3,   // 1,2,3,4
    2,1,1,2,   // 5,6,7,8
    1,1,0,0,   // 9,10,11,12
    3,0,0,3,    // 13,14,15,16
    //cm
        0,
    1,1,1,1,   // 1,2,3,4
    1,0,0,1,   // 5,6,7,8
    0,0,0,0,   // 9,10,11,12
    1,0,0,1,    // 13,14,15,16

    //p1
        0,
    0,0,0,0,   // 1,2,3,4
    0,0,0,0,   // 5,6,7,8
    0,0,0,0,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

    //p2
        0,
    1,1,1,1,   // 1,2,3,4
    1,1,1,1,   // 5,6,7,8
    0,0,0,0,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

        //pm
        0,
    1,1,1,1,   // 1,2,3,4
    1,1,1,1,   // 5,6,7,8
    0,0,0,0,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

            //pg
        0,
    1,1,1,1,   // 1,2,3,4
    1,1,1,1,   // 5,6,7,8
    0,0,0,0,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16


            //pmm
        0,
    1,1,1,1,   // 1,2,3,4
    2,2,2,2,   // 5,6,7,8
    3,3,3,3,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

     //pmg
        0,
    1,1,1,1,   // 1,2,3,4
    2,2,2,2,   // 5,6,7,8
    3,3,3,3,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

         //pgg
        0,
    2,0,0,2,   // 1,2,3,4
    3,3,1,1,   // 5,6,7,8
    1,4,4,1,   // 9,10,11,12
    0,0,5,5,    // 13,14,15,16

    //p4
       0,
    1,1,1,1,   // 1,2,3,4
    2,2,2,2,   // 5,6,7,8
    3,3,3,3,   // 9,10,11,12
    0,0,0,0,    // 13,14,15,16

     //p4m
       0,
    2,2,1,1,   // 1,2,3,4
    3,4,4,3,   // 5,6,7,8
    5,5,6,6,   // 9,10,11,12
    0,7,7,0,    // 13,14,15,16

      //p4g
       0,
    2,2,3,1,   // 1,2,3,4
    4,4,5,5,   // 5,6,7,8
    7,6,6,7,   // 9,10,11,12
    1,1,0,0    // 13,14,15,16

);

const mat3 tD[N_SYMMETRIES*MATRICES_PER_SYMMETRY] = mat3[N_SYMMETRIES*MATRICES_PER_SYMMETRY]( //id,
//CMM  (the first 8)
     id,
     reflectBSlash,
     reflectSlash * reflectBSlash,
     reflectSlash ,
     nil,
     nil,
     nil,
     nil,
// CM   (the second 8)
      id,
     reflectSlash,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,
// P1  
      id,
     nil,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,
// P2  
      id,
     rot2,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,

// PM   
      id,
     mirrorX,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,

// PG   
      id,
     glideX,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil ,

     // PMM
      id,
     mirrorX,
     mirrorX * mirrorY,
     mirrorY ,
     nil,
     nil,
     nil,
     nil ,


     // PMG
      id,
     glideX * mirrorY,
     glideX,
     mirrorY ,
     nil,
     nil,
     nil,
     nil ,


     // PGG
      id,
     rot2,
     glideX14m,
     rot2*glideX34m ,
     rot2*glideX34p ,
     glideX14p,
     nil,
     nil ,

        // P4
      id,
     rot34,
     rot2,
     rot14 ,
     nil,
     nil,
     nil,
     nil ,

    // P4M
      id,    // 0
     rot34 * reflectBSlash,  //1
     rot34,   //2
     rot2 * reflectSlash ,  //3
     rot2,  //4
     rot14 * reflectBSlash,  //5 
     rot14,  //6
     reflectSlash,   //7

         // P4G
      id,    // 0
     reflectBSlashQ,  //1
     rot34,   //2
     reflectBSlashQ * rot34 ,  //3
     rot2,  //4
     reflectBSlashQ * rot2 ,  //5 
     rot14,  //6
     reflectSlash * rot14  //7
); 

const mat3 tDinverse[N_SYMMETRIES*MATRICES_PER_SYMMETRY] = mat3[N_SYMMETRIES*MATRICES_PER_SYMMETRY](
    //CMM  (the first 8)
     id,
     reflectBSlash,
     reflectSlash * reflectBSlash,
     reflectSlash ,
     nil,
     nil,
     nil,
     nil,
// CM   (the second 8)
    id,
     reflectSlash,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,
// P1   (the second 8)
      id,
     nil,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,
// P2   (the second 8)
      id,
     rot2,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,

// PM   
      id,
     mirrorX,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,
// PG   
      id,
     unglideX,
     nil,
     nil ,
     nil,
     nil,
     nil,
     nil,

     // PMM
      id,
     mirrorX,
     mirrorX * mirrorY,
     mirrorY ,
     nil,
     nil,
     nil,
     nil , 
     

     // PMG
      id,
     mirrorY * unglideX,
     unglideX,
     mirrorY ,
     nil,
     nil,
     nil,
     nil ,

     // PGG
      id,
     rot2,
     glideX14p,
     glideX34p*rot2 ,
     glideX34m*rot2 ,
     glideX14m,
     nil,
     nil ,

      // P4
      id,
     rot14,
     rot2,
     rot34 ,
     nil,
     nil,
     nil,
     nil , 

         // P4M
      id,    // 0
     reflectBSlash * rot14,  //1
     rot14,   //2
     reflectSlash * rot2 ,  //3
     rot2,  //4
     reflectBSlash * rot34,  //5 
     rot34,  //6
     reflectSlash,   //7

              // P4G
      id,    // 0
     reflectBSlashQ,  //1
     rot14,   //2
     rot14 * reflectBSlashQ  ,  //3
     rot2,  //4
     rot2 * reflectBSlashQ  ,  //5 
     rot34,  //6
     rot34 * reflectBSlashQ   //7
); 
               // mat3 M = tD[domain1] * tDinverse[domain0]




//vec2 one_wrap = vec2(  )
vec2 boxwh = vec2(width,0.0);


#define SECTOR(x, y) sectors[int( int(x<y) + 2*int((x+y)<1) + 4*int(x<0.5) + 8*int(y<0.5) + 16*int( ((x+y)<0.5)||((x+y)>1.5)||(x<(y-0.5))||(x>(y+0.5)) )) ]
#define DOMAIN(g, s ) domain[g*17+SECTOR(s.x,s.y)]
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

int domain0 = DOMAIN(symmetry_id, fract(xyS) );

//vec4 vidColor = texture2DRect(tex0, gl_TexCoord[0].xy);
vec4 vidColor = mix( texture2DRect(tex0, gl_TexCoord[0].xy)  ,texture2DRect(last_frame, gl_TexCoord[0].xy), mix_f ); // texture2DRect(tex0, xy);

//int lattice_range = 1;
int n_domains = domains[symmetry_id];

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
                mat3 M = tD[(symmetry_id*MATRICES_PER_SYMMETRY)+domain1] * tDinverse[(symmetry_id*MATRICES_PER_SYMMETRY)+domain0];
                vec2 new_xy = float(i)*e1 + float(j)*e2 + origin + skewM*( floor(xyS) + vec2( M * vec3( fract(xyS),1.0) )) ;
//                new_xy = vec2( mod((new_xy.x + width), width ), new_xy.y );
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
                
                if ( (ll_mouse2<6.0)  )  {lattice_vidColor.rgb = vec3(1.0) - lattice_vidColor.rgb;} // { averaged_vidcolor = 1.0-averaged_vidcolor; }

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

