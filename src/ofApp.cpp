#include "ofApp.h"
#define STRINGIFY(A) #A

//--------------------------------------------------------------
void ofApp::setup(){

    ofEnableAlphaBlending();
    int camWidth          = WW;    // try to grab at this size.
    int camHeight         = HH;

    vidGrabber.setVerbose(true);
    vidGrabber.setup(camWidth,camHeight);

    
    fbo.allocate(camWidth,camHeight);
    
    fbo.begin();
    ofClear(0,0,0,255);
    fbo.end();
     
 //   cout << "\n\n\n    ###################################### \n\n\n";

    shader.load("shaders/wallpaper");

}

//--------------------------------------------------------------
void ofApp::update(){

    vidGrabber.update();

    fbo.begin();
    shader.begin();

    vidGrabber.draw(0,0);
    shader.end();
    fbo.end();
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(ofColor::gray);

    ofSetColor(255);
    vidGrabber.draw(PADDING,PADDING,WW,HH);
    //ofSetColor(ofColor::red);
    //ofDrawBitmapString("RED", 5+30, 5+30);
    fbo.draw(2*PADDING+WW,PADDING,WW,HH);

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
