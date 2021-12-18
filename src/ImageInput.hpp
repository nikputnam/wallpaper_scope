//
//  ImageInput.hpp
//  wallpaper_scope
//
//  Created by Nicholas Putnam on 12/17/21.
//

#ifndef ImageInput_hpp
#define ImageInput_hpp

//#include <stdio.h>


#include "ofParameterGroup.h"
#include "ofParameter.h"
#include "ofMain.h"

class ImageInput;

template<typename ParameterType>
class ofImageInputParam: public ofReadOnlyParameter<ParameterType,ImageInput>{
    friend class ImageInput;
};

class ImageInput {
public:
    ImageInput();
    //void setup( string name );
    void setup( string name,ofShader* shader, ofVideoGrabber* grabber ) ;

    void draw();
//    string name;
    ofParameterGroup parameters;
    
    ofParameter<float> opacity;
    ofParameter<float> angle;
    ofParameter<float> x;
    ofParameter<float> y;
    ofParameter<float> scale;
    ofParameter<float> spotlight;
    ofParameter<float> spotlight_margin;
    ofParameter<bool> useCamera;
    ofParameter<bool> active;

   // bool useCamera;
   // bool active;
    ofShader* img_shader;
    ofVideoGrabber* vidGrabber;

    ofImage img;
    ofFbo fbo;
    
};

#endif /* ImageInput_hpp */
