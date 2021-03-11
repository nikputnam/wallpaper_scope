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

    theta = glm::pi<float>() / 5.0 ;
    e1 = glm::vec2(100.0, 0.0) ;
    e2 = 1.2*glm::rotate(e1,theta);
    origin = glm::vec2(0.0,0.0);
    
    float alpha = glm::dot(e1,e2);
    unskew = glm::inverse( glm::mat2x2( glm::length2(e1) , alpha, alpha, glm::length2(e2) ) ) * glm::mat2x2( e1.x,  e2.x, e1.y, e2.y ) ;
    skew =glm::inverse( unskew );
    glm::mat2x2 ii = skew*unskew;
    cout << e1 << "\n";
    cout << e2 << "\n";
    cout << unskew[0] << "\t,\t" << unskew[1] << "\n";
    cout << skew[0] << "\t,\t" << skew[1] << "\n";
    cout << ii[0] << "\t,\t" << ii[1] << "\n";

}
//--------------------------------------------------------------
void ofApp::update(){

    vidGrabber.update();

    fbo.begin();
    shader.begin();

    glm::vec2 mxy = glm::vec2(mouseX-PADDING-PADDING-WW,mouseY-PADDING);
    shader.setUniform2f("mouse", mxy );
    //cout << mxy << " <-- mouse\n";
    shader.setUniform1f("width",float(WW));
    shader.setUniform1f("height",float(HH));
    shader.setUniform1f("offset",ofGetElapsedTimef() * 20.0);
    glm::vec4 tmp =glm::vec4( unskew[0][0], unskew[0][1], unskew[1][0], unskew[1][1] ) ;
    shader.setUniform4f("unskew", tmp );
    
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
