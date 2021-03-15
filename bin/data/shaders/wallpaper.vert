//#version 150
#version 120

// these come from the programmable pipeline
// uniform mat4 modelViewProjectionMatrix;

//in vec4 position;
//in vec2 texcoord;

// texture coordinates are sent to fragment shader
//out vec2 texCoordVarying;

//void main()//
//{
//    texCoordVarying = texcoord;
//    gl_Position = position ; // modelViewProjectionMatrix * position;
//}


void main(void) {


    gl_TexCoord[0] = gl_MultiTexCoord0;

//    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
 //   gl_Position = position ;

    //barbalksdjf ;

   vec4 pos = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;


   gl_Position = pos;
   
}
