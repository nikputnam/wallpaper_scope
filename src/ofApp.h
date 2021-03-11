#pragma once

#define WEBCAM

#include "ofMain.h"

#define PADDING 30
//#define WW 1280
//#define HH 960

#define WW 640
#define HH 480

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);
		
        ofVideoGrabber  vidGrabber;
        ofFbo           fbo;
        //ofFbo           feedback;
        ofShader        shader;
        
        glm::vec2 e1 ; //(2.f, 2.f);
        glm::vec2 e2 ; //(2.f, 2.f);
        glm::vec2 origin ; //(2.f, 2.f);
        float theta ;
        glm::mat2x2 skew ;
        glm::mat2x2 unskew ;

};

