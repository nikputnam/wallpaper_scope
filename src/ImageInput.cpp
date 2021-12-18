//
//  ImageInput.cpp
//  wallpaper_scope
//
//  Created by Nicholas Putnam on 12/17/21.
//


#include <stdio.h>
#include "ImageInput.hpp"



ImageInput::ImageInput() {}

/*
ofParameter<float> opacity;
ofParameter<float> angle;
ofParameter<float> x;
ofParameter<float> y;
ofParameter<float> scale;
ofParameter<float> spotlight;
ofParameter<float> spotlight_margin;
*/

#define WW 1280
#define HH 960

//#define WW 640
//#define HH 480

#define CAM_WW 640
#define CAM_HH 480

void ImageInput::draw() {
    if (active) {
     
        
        
        img_shader->begin();
            
      //  img_shader->setUniform1f("hue_shift",       float(exp( float( cam_hue ) )) );
      ////  img_shader->setUniform1f("saturation_boost",float(exp( float( cam_saturation ) )) );
      //  img_shader->setUniform1f("brightness_boost",float( cam_brightness ) );
      //  img_shader->setUniform1f("contrast_boost", float( cam_contrast ) );
                
                if (useCamera) {
                    img_shader->setUniform1f("width",float(CAM_WW ));
                    img_shader->setUniform1f("height",float(CAM_HH));
                } else {
                    img_shader->setUniform1f("width",float(img.getWidth()));
                    img_shader->setUniform1f("height",float(img.getHeight()));
                }
                img_shader->setUniform1f("angle",float( angle));
                img_shader->setUniform1f("scale",float( 1.0/scale ));
                img_shader->setUniform1f("radius",float( spotlight ));
                img_shader->setUniform1f("w",float( 100.0*spotlight_margin ));
                if (useCamera) {
                    vidGrabber->draw(0,0,WW,HH);
                } else {
                    fbo.draw(int(x*WW),int(y*HH));
                }
        
        img_shader->end();
      
        
    }
}

void ImageInput::setup( string name,ofShader* shader, ofVideoGrabber* grabber ) {
    parameters.setName(name);
    
    img_shader = shader;
    vidGrabber = grabber;
    
    opacity.set("opacity",1.0,0,1);   parameters.add(opacity);
    angle.set("angle",0,0,2.0*glm::pi<float>());   parameters.add(angle);
    x.set("x",0,0,1);   parameters.add(x);
    y.set("y",0,0,1);   parameters.add(y);
    scale.set("scale",1,0.01,20.0);   parameters.add(scale);
    spotlight.set("spotlight",1,0.1,3.0);   parameters.add(spotlight);
    spotlight_margin.set("spotlight margin",1,0.01,20.0);   parameters.add(spotlight_margin);

    useCamera.set("use camera", false, false, true);  parameters.add(useCamera);
    active.set("active", false, false, true);         parameters.add(active);
    fbo.allocate(WW,HH);

//    active = false;
}
