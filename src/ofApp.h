#pragma once

#define WEBCAM

#include "ofMain.h"
#include "ofxGui.h"
#include "ofxMidi.h"


#define PADDING 30
//#define WW 1280
//#define HH 960

#define WW 640
#define HH 480

#define DRAW_FACTOR 1.5

#define DRAW_WW 640*DRAW_FACTOR
#define DRAW_HH 480*DRAW_FACTOR

#define CMM 0
#define CM  1
#define P1  2
#define P2  3


class ofApp : public ofBaseApp , public ofxMidiListener {

	public:
		void setup();
		void update();
    void draw();
    void setUniforms();
    void grabScreen() ;
    void listMidiEventQueue() ;
    void processMidiEvents() ;
    void processMidiEvent() ;

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
        ofFbo           feedback;
        ofShader        shader;
        
        glm::vec2 e1 ; //(2.f, 2.f);
        glm::vec2 e2 ; //(2.f, 2.f);
        glm::vec2 origin ; //(2.f, 2.f);
        float theta ;
        glm::mat2x2 skew ;
        glm::mat2x2 unskew ;

    unsigned long framenr;
    unsigned long run_id;

    bool paused;
    
    ofxFloatSlider e1length;
    ofxFloatSlider lattice_rotation;
    ofxFloatSlider lattice_angle;
    ofxFloatSlider hue_shift;
    ofxFloatSlider saturation_boost;
    
    ofxToggle checkerboard;
    ofxToggle intrainversion;
    ofxToggle post_checkerboard;
    ofxToggle post_intrainversion;

    ofxFloatSlider brightness_boost;
    ofxFloatSlider contrast_boost;
    ofxFloatSlider weight_range;
    ofxFloatSlider mix_f;
    ofxIntSlider iterations;
    ofxIntSlider symmetry_id;
    ofxIntSlider lattice_range;
    ofxPanel gui;
    
    
    
    void newMidiMessage(ofxMidiMessage& eventArgs);
    
    ofxMidiIn midiIn;
    std::vector<ofxMidiMessage> midiMessages;
    std::size_t maxMessages = 10; //< max number of messages to keep track of
    ofMutex midiMutex; 
};

