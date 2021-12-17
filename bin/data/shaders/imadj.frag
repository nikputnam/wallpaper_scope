#version 120


uniform float hue_shift;
uniform float saturation_boost;
uniform float brightness_boost;
uniform float contrast_boost;

uniform float width;
uniform float height;
uniform float angle;
uniform float scale;
uniform float radius;
uniform float w;


mat2 rot = mat2( sin(angle), cos(angle), -cos(angle), sin(angle) );

uniform sampler2DRect tex0;    

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

void main(){

    //vec4 vidColor =  texture2DRect(tex0, 2.0*gl_TexCoord[0].xy);
    vec2 xy = (scale * rot * (gl_TexCoord[0].xy - 0.5*vec2(width,height))) + 0.5*vec2(width,height) ;
    float r = length( gl_TexCoord[0].xy - 0.5*vec2(width,height) );
    vec4 vidColor =  texture2DRect(tex0, xy);

    /*
    //if (xy.x<0)      { vidColor.w = 0.0; } 
    //if (xy.y<0)      { vidColor.w = 0.0; } 
    //if (xy.x>width)  { vidColor.w = 0.0; } 
    //if (xy.y>height) { vidColor.w = 0.0; } 
    vec3 rgb1 = vidColor.rgb;
    vec3 hsv1 = rgb2hsv(rgb1);

    //hsv1  = vec3( hsv1.x, hsv1.y, clamp( brightness_boost*hsv1.z, 0,1)  ) ;
 //   hsv1  = vec3( hsv1.x, hsv1.y, clamp( hsv1.z, 0,1)  ) ;
    hsv1  = vec3( hsv1.x, clamp( saturation_boost* hsv1.y,0,1), hsv1.z  ) ;

    //hsv1  = vec3( fract(hsv1.x+hue_shift),          hsv1.y, hsv1.y < 0.5 ? smoothstep(0,1,0.5+clamp( contrast_boost* (hsv1.z-0.5),-0.5,0.5)) : hsv1.z ) ;    
    hsv1  = vec3( hsv1.x,          hsv1.y,  clamp(  smoothstep( brightness_boost - contrast_boost , brightness_boost + contrast_boost, hsv1.z )  ,0.0,1.0)  ) ;    

    vec3 rgb2 = hsv2rgb(hsv1);
    
//    gl_FragColor = vec4(1.0) - vidColor ; //vec4(rgb2,1.0) ; // 
//    gl_FragColor.a=1.0;

gl_FragColor = vec4(rgb2, (r>(radius*width))? exp(-(r-(radius*width))/w) : 1.0 ); 
*/

    gl_FragColor = vec4(vidColor.rgb,(r>(radius*width))? vidColor.a*exp(-(r-(radius*width))/w) : vidColor.a )  ;
    //gl_FragColor = vec4(vidColor.rgb,(r>(radius*width))? 0.0 : vidColor.a )  ;

    //gl_FragColor = vec4(0,1,1,1.0) ; // 
//    gl_FragColor = vec4(1.0,0,0,1.0);

}

