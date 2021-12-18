#pragma once

#define WEBCAM

#include "ofMain.h"
#include "ofxGui.h"
#include "ofxMidi.h"
#include "ImageInput.hpp"

#define PADDING 30
#define WW 1280
#define HH 960

//#define WW 640
//#define HH 480

#define CAM_WW 640
#define CAM_HH 480

#define DRAW_FACTOR 1.0

#define DRAW_WW WW*DRAW_FACTOR
#define DRAW_HH HH*DRAW_FACTOR


#define CMM 0   //  rhombic
#define CM  1   //  rhombic
#define P1  2   //  oblique
#define P2  3   //  oblique
#define PM  4   //  rectangular
#define PG  5   //  rectangular
#define PMM 6   //  rectangular
#define PMG 7   //  rectangular
#define PGG 8   //  rectangular
#define P4  9   //  square
#define P4M  10 //  square
#define P4G  11 //  square

//TODO:
#define P3   12 //  hexagonal
#define P3M1 13 //  hexagonal
#define P31M 14 //  hexagonal
#define P6   15 //  hexagonal
#define P6M  16 //  hexagonal

enum LatticeType { rhombic, oblique, rectangular, square, hexagonal };
enum ControlMode { cone, lattice, input };

struct basis_vectors {
    glm::vec2 e1;
    glm::vec2 e2;
};

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
    void handleMidiMessage(ofxMidiMessage &message) ;

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
		
    std::map<LatticeType,std::set<LatticeType>> latticeCompat ;
    
    std::vector<ImageInput> imgs;
    
    
    basis_vectors getLattice();
    
        ofVideoGrabber  vidGrabber;
        ofFbo           fbo;
    ofFbo           feedback;
    ofFbo           filter;
    ofFbo           still_fbo;

    ofShader        luma_scale;
    
    ofShader        camera_filter;
    ofShader        oblique_lattices;
    ofShader        hexagonal_lattices;
    ofShader*        current_shader;
    bool hex_lattice;

    ControlMode control_mode;
    
    bool use_still;
    ofImage still;
    
    unsigned long framecount;
    
    long* counts ;
    unsigned char* pixels ;
    
        glm::vec2 e1 ; //(2.f, 2.f);
        glm::vec2 e2 ; //(2.f, 2.f);
        glm::vec2 origin ; //(2.f, 2.f);
        float theta ;
        glm::mat2x2 skew ;
        glm::mat2x2 unskew ;

    unsigned long framenr;
    unsigned long run_id;

    bool paused;
    bool spin;
    bool hide;

    bool mouseDown;
    
    ofxFloatSlider e1length;
    ofxFloatSlider lattice_aspect_ratio;
    ofxFloatSlider lattice_rotation;
    ofxFloatSlider lattice_angle;
    ofxFloatSlider hue_shift;
    ofxFloatSlider saturation_boost;
    
    ofxFloatSlider value_b;
    ofxFloatSlider value_m;

    ofxToggle checkerboard;
    ofxToggle intrainversion;
    ofxToggle post_checkerboard;
    ofxToggle post_intrainversion;
    ofxToggle lattice_lock;

    
    ofxFloatSlider brightness_boost;
    ofxFloatSlider contrast_boost;
    
    ofxFloatSlider cam_contrast;
    ofxFloatSlider cam_brightness;
    ofxFloatSlider cam_saturation;
    ofxFloatSlider cam_hue;
    
    ofxFloatSlider weight_range;
    ofxFloatSlider mix_f;
    ofxIntSlider iterations;
    ofxIntSlider symmetry_id;
    int active_symmetry_id;
    LatticeType active_lattice;

    ofxIntSlider lattice_range;
    ofxPanel gui;
    
    //3D
    ofCylinderPrimitive cylinder;
    ofVboMesh coneMesh;
    of3dPrimitive cone;
    
    ofLight pointLight;
    ofLight pointLight2;
    ofLight pointLight3;
    ofMaterial material;

    glm::vec2 dragXY;

    LatticeType symmetryGroupLatticeType[17];
    std::string symmetryGroupLabel[17];
    // place to store the sides of the box //
    ofVboMesh boxSides[ofBoxPrimitive::SIDES_TOTAL];
    //ofVboMesh deformPlane;
    ofVboMesh topCap, bottomCap, body;
    vector<ofMeshFace> triangles;

    ofCamera cam;
    ofNode view;
    
    void updateLightPositions();
    void initMesh();
    void updateMesh();
    void imageHistogram();
    //MIDI
    void newMidiMessage(ofxMidiMessage& eventArgs);
    
    ofxMidiIn midiIn;
    std::vector<ofxMidiMessage> midiMessages;
    std::size_t maxMessages = 10; //< max number of messages to keep track of
    ofMutex midiMutex; 
};

