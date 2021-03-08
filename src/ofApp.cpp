#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){

    ofEnableAlphaBlending();
    int camWidth          = 640;    // try to grab at this size.
    int camHeight         = 480;

    vidGrabber.setVerbose(true);
    vidGrabber.setup(camWidth,camHeight);

}

//--------------------------------------------------------------
void ofApp::update(){

    vidGrabber.update();

    
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(ofColor::gray);

    ofSetColor(255);
    vidGrabber.draw(5,5,640,480);
    ofSetColor(ofColor::red);
    ofDrawBitmapString("RED", 5+30, 5+30);
    
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
