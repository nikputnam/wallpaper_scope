#include "ofApp.h"
#define STRINGIFY(A) #A

//--------------------------------------------------------------
void ofApp::setup(){

    //mix_f = -5.0;
    
    gui.setup();
    gui.add(e1length.setup("lattice scale",200,4,1200));
    gui.add(hue_shift.setup("hue shift",0,-0.05,0.05));
    gui.add(lattice_rotation.setup("lattice rotation",0,0,glm::pi<float>()));
    gui.add(lattice_angle.setup("lattice angle",glm::pi<float>()/3.0,0,glm::pi<float>()));
    gui.add(saturation_boost.setup("log saturation boost",0.0,-2.0,2.0));
    gui.add(brightness_boost.setup("log brightness boost",0.0,-0.10,0.10));
    gui.add(iterations.setup("iterations",1,0,10));
    gui.add(lattice_range.setup("lattice_range",1,0,10));
    gui.add(weight_range.setup("weight_range",500,10,1000));
    gui.add(mix_f.setup("log(mix)",0.0,-5.0,0.0));

    //saturation_boost = 1.0;
    //iterations = 3;
    //lattice_range=1;
    
    ofEnableAlphaBlending();
    int camWidth          = WW;    // try to grab at this size.
    int camHeight         = HH;

    vidGrabber.setVerbose(true);
    vidGrabber.setup(camWidth,camHeight);

    
    fbo.allocate(camWidth,camHeight);
    feedback.allocate(camWidth,camHeight);

    fbo.begin();
    ofClear(0,0,0,255);
    fbo.end();
     
    vidGrabber.update();

    feedback.begin();
//    ofClear(0,0,0,255);
    vidGrabber.draw(0,0);
    feedback.end();

    
 //   cout << "\n\n\n    ###################################### \n\n\n";

    shader.load("shaders/wallpaper");

  
    /*
    cout << e1 << "\n";
    cout << e2 << "\n";
    cout << unskew[0] << "\t,\t" << unskew[1] << "\n";
    cout << skew[0] << "\t,\t" << skew[1] << "\n";
    cout << ii[0] << "\t,\t" << ii[1] << "\n";
*/
}
//--------------------------------------------------------------
void ofApp::update(){

    
    float t = 0.0; // ofGetElapsedTimef()*0.1;
    float phi =float(lattice_rotation) + t*0.3 ;
    float theta = float(lattice_angle) + (glm::pi<float>() / 4.0)*sin(t*0.2);// + (1.0+0.5*cos(t*0.2)) + glm::pi<float>() / 5.0 ;
    
    e1 = glm::rotate( glm::vec2(float(e1length), 0.0) , float(phi-0.5*theta) ) ;
    
    //e2 = ( 0.5*(sin(t)+2.0) )*glm::rotate(e1,theta);
    e2 =   glm::rotate(e1,theta);   //rhombic
    origin = glm::vec2(1.0*WW/2.0,1.0*HH/2.0) + glm::vec2(40.0*sin(t),-50.0*cos(t));
    
    float alpha = glm::dot(e1,e2);
    unskew = glm::inverse( glm::mat2x2( glm::length2(e1) , alpha, alpha, glm::length2(e2) ) ) * glm::mat2x2( e1.x,  e2.x, e1.y, e2.y ) ;
    skew =glm::inverse( unskew );
    glm::mat2x2 ii = skew*unskew;
    
    
    vidGrabber.update();
    glm::vec2 mxy = glm::vec2(mouseX-PADDING,mouseY-PADDING);

    /*
    feedback.begin();
//    ofClear(0,0,0,255);
    vidGrabber.draw(0,0);
    feedback.end();
*/
    
    float sboost = exp( saturation_boost/float(iterations) );
    float bboost = exp( brightness_boost/float(iterations) );

    for (int i=0; i<int(iterations); i++ ) {
    fbo.begin();
        shader.begin();

            //glm::vec2 mxy = glm::vec2(mouseX-PADDING-PADDING-WW,mouseY-PADDING);
            shader.setUniform1f("time", t );
            shader.setUniform2f("mouse", mxy );
            //cout << mxy << " <-- mouse\n";
            shader.setUniform1f("width",float(WW));
            shader.setUniform1f("height",float(HH));
            //cout << "mix " << mix_f << "\t" << log(mix_f) <<"\n";
            shader.setUniform1f("mix_f",i==0 ? exp(float(mix_f)): 0);
            shader.setUniform1f("hue_shift",float(hue_shift));
        shader.setUniform1f("saturation_boost",sboost);
        shader.setUniform1f("brightness_boost",bboost);
            shader.setUniform1f("offset",t * 20.0);
            shader.setUniform2f("origin",origin);
            shader.setUniform2f("e1",e1);
            shader.setUniform2f("e2",e2);
            shader.setUniform1i("lattice_range",int(lattice_range));
            shader.setUniform1f("weight_range",weight_range);

            glm::vec4 tmp =glm::vec4( unskew[0][0], unskew[0][1], unskew[1][0], unskew[1][1] ) ;
            shader.setUniform4f("unskew", tmp );
            
            glm::vec4 tmp2 =glm::vec4( skew[0][0], skew[0][1], skew[1][0], skew[1][1] ) ;
            shader.setUniform4f("skew", tmp2 );
            shader.setUniformTexture("last_frame", feedback.getTexture(0), 1);
        //shader.setUniformTexture("last_frame", vidGrabber.getTexture(), 0);
            vidGrabber.draw(0,0);
        //feedback.draw(0,0);
        shader.end();
    fbo.end();
     
      
    feedback.begin();
        fbo.draw(0,0);
    feedback.end();
     
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(ofColor::gray);

    ofSetColor(255);
    //vidGrabber.draw(PADDING,PADDING,WW,HH);
    //ofSetColor(ofColor::red);
    //ofDrawBitmapString("RED", 5+30, 5+30);
    fbo.draw(PADDING,PADDING,2*WW,2*HH);
    //fbo.draw(PADDING,PADDING,WW,HH);
    //feedback.draw(PADDING*2+WW,PADDING,WW,HH);
    gui.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
