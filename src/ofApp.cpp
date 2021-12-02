#include "ofApp.h"
#define STRINGIFY(A) #A

//variables for the midi controllers
float c1=0;
float c2=0;
float c3=0;
float c4=0;
float c5=0;
float c6=0;
float c7=0;
float c8=0;
float c9=0;
float c10=1.0;
float c11=1.0;
float c12=0.7;
float c13=0.7;
float c14=0;
float c15=0;
float c16=0;
float c17=0;
float c18=0;
float c19=0;
float c20=0;
float c21=0;
float c22=0;
float c23=0;
float c24=0;
float c25=0;
float c26=0;
float c27=0;
float c28=0;
float c29=0;
float c30=0;
float c31=0;

//--------------------------------------------------------------
void ofApp::setup(){

    
    symmetryGroupLatticeType[CMM] = rhombic ;
    symmetryGroupLatticeType[CM]  = rhombic ;
    symmetryGroupLatticeType[P1]  = oblique ;
    symmetryGroupLatticeType[P2]  = oblique ;
    symmetryGroupLatticeType[PM]  = rectangular ;
    symmetryGroupLatticeType[PG]  = rectangular ;
    symmetryGroupLatticeType[PMM]  = rectangular ;
    symmetryGroupLatticeType[PMG]  = rectangular ;
    symmetryGroupLatticeType[PGG]  = rectangular ;
    symmetryGroupLatticeType[P4]  = square ;
    symmetryGroupLatticeType[P4M]  = square ;
    symmetryGroupLatticeType[P4G]  = square ;
    symmetryGroupLatticeType[P3]  = hexagonal ;
    symmetryGroupLatticeType[P3M1]  = hexagonal ;
    symmetryGroupLatticeType[P31M]  = hexagonal ;
    symmetryGroupLatticeType[P6]  = hexagonal ;
    symmetryGroupLatticeType[P6M]  = hexagonal ;

    symmetryGroupLabel[CMM] = "CMM" ;
    symmetryGroupLabel[CM]  = "CM" ;
    symmetryGroupLabel[P1]  = "P1" ;
    symmetryGroupLabel[P2]  = "P2" ;
    symmetryGroupLabel[PM]  = "PM" ;
    symmetryGroupLabel[PG]  = "PG" ;
    symmetryGroupLabel[PMM]  = "PMM" ;
    symmetryGroupLabel[PMG]  = "PMG" ;
    symmetryGroupLabel[PGG]  = "PGG" ;
    symmetryGroupLabel[P4]  = "P4" ;
    symmetryGroupLabel[P4M]  = "P4M" ;
    symmetryGroupLabel[P4G]  = "P4G" ;
    symmetryGroupLabel[P3]  = "P3" ;
    symmetryGroupLabel[P3M1]  = "P3M1" ;
    symmetryGroupLabel[P31M]  = "P31M" ;
    symmetryGroupLabel[P6]  = "P6" ;
    symmetryGroupLabel[P6M]  = "P6M" ;
    
    //mix_f = -5.0;
    
    //
    
    paused = false;
    mouseDown = false;
    
    gui.setup();
    gui.add(e1length.setup("lattice scale",200,4,600));
    gui.add(lattice_aspect_ratio.setup("lattice aspect ratio",1.0,0.0,1.0));
    
    gui.add(hue_shift.setup("hue shift",0,-0.001,0.001));
    gui.add(lattice_rotation.setup("lattice rotation",0,0,glm::pi<float>()));
    gui.add(lattice_angle.setup("lattice angle",glm::pi<float>()/3.0,0,glm::pi<float>()));
    gui.add(saturation_boost.setup("log saturation boost",0.0,-3.0,3.0));
    gui.add(brightness_boost.setup("log brightness boost",0.0,-0.5,0.5));
    gui.add(contrast_boost.setup("log contrast boost",0.0,-3.0,3.0));
    
    gui.add(symmetry_id.setup("symmetry group",0,0,11));
    gui.add(checkerboard.setup("checker board",false));
    gui.add(intrainversion.setup("intrainversion",false));

    gui.add(iterations.setup("iterations",1,0,10));
    gui.add(lattice_range.setup("lattice_range",1,0,10));
    gui.add(weight_range.setup("weight_range",500,10,1000));
    gui.add(mix_f.setup("log(mix)",0.0,-3.0,0.0));
 
    gui.add(post_checkerboard.setup("post checker board",false));
    gui.add(post_intrainversion.setup("post intrainversion",false));

    //saturation_boost = 1.0;
    //iterations = 3;
    //lattice_range=1;
    
    ofEnableAlphaBlending();
    int camWidth          = WW;    // try to grab at this size.
    int camHeight         = HH;

    vidGrabber.listDevices();
    vidGrabber.setDeviceID(0);
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

    framenr=0;
    run_id = rand();
    /*
    cout << e1 << "\n";
    cout << e2 << "\n";
    cout << unskew[0] << "\t,\t" << unskew[1] << "\n";
    cout << skew[0] << "\t,\t" << skew[1] << "\n";
    cout << ii[0] << "\t,\t" << ii[1] << "\n";
*/
    
    //3D
    ofSetVerticalSync(true);
    ofBackground(20);

    // GL_REPEAT for texture wrap only works with NON-ARB textures //
    ofDisableArbTex();
    
    //           radius  , height
    cylinder.set(WW*0.1, HH*1.1);
    cylinder.setResolution(20, 13, 4);
    //cylinder.mapTexCoordsFromTexture( fbo.getTexture() );
    ofSetSmoothLighting(true);
    pointLight.setDiffuseColor( ofFloatColor(.85, .85, .55) );
    pointLight.setSpecularColor( ofFloatColor(1.f, 1.f, 1.f));

    pointLight2.setDiffuseColor( ofFloatColor( 238.f/255.f, 57.f/255.f, 135.f/255.f ));
    pointLight2.setSpecularColor(ofFloatColor(.8f, .8f, .9f));

    pointLight3.setDiffuseColor( ofFloatColor(19.f/255.f,94.f/255.f,77.f/255.f) );
    pointLight3.setSpecularColor( ofFloatColor(18.f/255.f,150.f/255.f,135.f/255.f) );
    //updateLightPositions();
    
    pointLight.setPosition(WW, HH, 1500);
    pointLight2.setPosition(0, HH, 1500);
    pointLight3.setPosition(WW, 0, 1500);
    
    
    // shininess is a value between 0 - 128, 128 being the most shiny //
    material.setShininess( 120 );
    // the light highlight of the material //
    material.setSpecularColor(ofColor(255, 255, 255, 255));

    ofSetSphereResolution(24);
    
    //MIDI
    // print input ports to console
    midiIn.listInPorts();

    // open port by number (you may need to change this)
    midiIn.openPort(0);
    //midiIn.openPort("IAC Pure Data In");    // by name
    //midiIn.openVirtualPort("ofxMidiIn Input"); // open a virtual port

    // don't ignore sysex, timing, & active sense messages,
    // these are ignored by default
    midiIn.ignoreTypes(false, false, false);

    // add ofApp as a listener
    midiIn.addListener(this);

    // print received messages to the console
    midiIn.setVerbose(true);

    coneMesh = ofVboMesh();
    coneMesh.enableTextures();
    cone.enableTextures();
    
    view = ofNode();
    cout << "transform" << endl;
    cout << view.getGlobalTransformMatrix() << endl;

    view.rotateDeg( glm::pi<float>()/2.0 , 1.0, 0.0, 0.0);
    view.rotateDeg( glm::pi<float>()/3.0, 0, 1.0, 0.0);
    view.setScale(0.2);
    cout << view.getGlobalTransformMatrix()<< endl;
    
    initMesh();
    
    //coneMesh.getMesh().mapTexCoordsFromTexture( fbo.getTexture() );

    //cone.getMesh().enableTextures();
    
    
}

void ofApp::updateLightPositions() {
    pointLight.setPosition((ofGetWidth()*.5)+ cos(ofGetElapsedTimef()*.5)*(ofGetWidth()*.3), ofGetHeight()/2, 500);
    pointLight2.setPosition((ofGetWidth()*.5)+ cos(ofGetElapsedTimef()*.15)*(ofGetWidth()*.3),
                            ofGetHeight()*.5 + sin(ofGetElapsedTimef()*.7)*(ofGetHeight()), -300);

    pointLight3.setPosition(
                            cos(ofGetElapsedTimef()*1.5) * ofGetWidth()*.5,
                            sin(ofGetElapsedTimef()*1.5f) * ofGetWidth()*.5,
                            cos(ofGetElapsedTimef()*.2) * ofGetWidth()
    );
}

void ofApp::setUniforms() {
    
    glm::vec2 mxy = glm::vec2(mouseX-PADDING,mouseY-PADDING)/DRAW_FACTOR;

    float t = ofGetElapsedTimef()*0.1;
    float phi =float(lattice_rotation) ;//+ t*0.3 ;
    float theta = float(lattice_angle) ; // + (glm::pi<float>() / 4.0)*sin(t*0.2);// + (1.0+0.5*cos(t*0.2)) + glm::pi<float>() / 5.0 ;
    
    e1 = glm::rotate( glm::vec2(float(e1length), 0.0) , float(phi-0.5*theta) ) ;
    
    //e2 = ( 0.5*(sin(t)+2.0) )*glm::rotate(e1,theta);
    
    //TODO
    switch (symmetryGroupLatticeType[int(symmetry_id)]) {
        case rhombic:
            //cout << "rhombic" ;
            e2 =   glm::rotate(e1,theta);   //rhombic
            break;
        case oblique:
            //cout << "oblique" ;
            e2 =   glm::rotate( float(lattice_aspect_ratio) * e1,theta);
            break;

        case rectangular:
            //cout << "rectangular" ;

            e2 =   glm::rotate( float(lattice_aspect_ratio) * e1,glm::half_pi<float>());
            break;

        case square:
            //cout << "square" ;

            e2 =   glm::rotate( e1,glm::half_pi<float>());
            break;

        case hexagonal:
            e2 =   glm::rotate( e1,glm::pi<float>()/3.0f);
    }
        
    
    
    origin = glm::vec2(1.0*WW/2.0,1.0*HH/2.0) ; // + glm::vec2(40.0*sin(t),-50.0*cos(t));
    
    float alpha = glm::dot(e1,e2);

    unskew = glm::inverse( glm::mat2x2( glm::length2(e1) , alpha, alpha, glm::length2(e2) ) ) * glm::mat2x2( e1.x,  e2.x, e1.y, e2.y ) ;
    
    glm::vec2 wrap_ij = floor( unskew * ( glm::vec2( float(WW), 0.0 ) ));
    glm::vec2 closest_wrap = wrap_ij.x * e1 + wrap_ij.y * e2 ;
    float closest_wrap_distance = glm::length( closest_wrap ) ;
    float rescale_fact = float(WW) / closest_wrap_distance  ;
    float sintheta = closest_wrap.y / closest_wrap_distance ;
    float costheta = closest_wrap.x / closest_wrap_distance ;
    auto correction_rotation = glm::mat2x2( costheta,  -sintheta, sintheta, costheta ) ;
    //cout << wrap_ij.x << "\t" << wrap_ij.y << "\t" << sintheta << "\t" << costheta << "\n";

    e1 = rescale_fact * correction_rotation * e1 ;
    e2 = rescale_fact * correction_rotation * e2 ;

    
    alpha = glm::dot(e1,e2);
    unskew = glm::inverse( glm::mat2x2( glm::length2(e1) , alpha, alpha, glm::length2(e2) ) ) * glm::mat2x2( e1.x,  e2.x, e1.y, e2.y ) ;
    skew =glm::inverse( unskew );
    glm::mat2x2 ii = skew*unskew;
    
    /*
    float sboost = exp( saturation_boost/float(iterations) );
    float bboost = exp( brightness_boost/float(iterations) );
    float cboost = exp( contrast_boost/float(iterations) );
*/

    float sboost = exp( saturation_boost );
    float bboost = exp( brightness_boost );
    float cboost = exp( contrast_boost );

    
    //glm::vec2 mxy = glm::vec2(mouseX-PADDING-PADDING-WW,mouseY-PADDING);
    shader.setUniform1f("time", t );
    shader.setUniform2f("mouse", mxy );
    //cout << mxy << " <-- mouse\n";
    shader.setUniform1f("width",float(WW));
    shader.setUniform1f("height",float(HH));
    shader.setUniform1f("mix_f",1.0-exp(float(mix_f)));
    //cout << "mix " << mix_f << "\t" << log(mix_f) <<"\n";
    shader.setUniform1f("hue_shift",float(hue_shift));
    shader.setUniform1f("saturation_boost",sboost);
    shader.setUniform1f("brightness_boost",bboost);
    shader.setUniform1f("contrast_boost",cboost);
    shader.setUniform1f("offset",t * 20.0);

shader.setUniform1i("checkerboard",int(checkerboard));
shader.setUniform1i("intrainversion",int(intrainversion));
shader.setUniform1i("post_checkerboard",0);
shader.setUniform1i("post_intrainversion",0);


    shader.setUniform2f("origin",origin);
    shader.setUniform2f("e1",e1);
    shader.setUniform2f("e2",e2);
shader.setUniform1i("symmetry_id",int(symmetry_id));
shader.setUniform1i("lattice_range",int(lattice_range));
    shader.setUniform1f("weight_range",weight_range);

    glm::vec4 tmp =glm::vec4( unskew[0][0], unskew[0][1], unskew[1][0], unskew[1][1] ) ;
    shader.setUniform4f("unskew", tmp );
    
    glm::vec4 tmp2 =glm::vec4( skew[0][0], skew[0][1], skew[1][0], skew[1][1] ) ;
    shader.setUniform4f("skew", tmp2 );
    //shader.setUniformTexture("last_frame", vidGrabber.getTexture(), 0);
    shader.setUniformTexture("last_frame", feedback.getTexture(), 1); //vidGrabber.getTexture(), 0);
}


#define N_SECTORS 32
#define N_LAYERS 5


void ofApp::updateMesh(){
    //Change vertices
    
    int n_sectors = N_SECTORS;
    int n_layers = N_LAYERS;

//    cylinder.set(WW*c10, HH*c11);

    int vid=0;
    for (int j = 0; j<n_layers; j++) {
        for (int i=0; i<=n_sectors; i++ ) {
            ofPoint p = cone.getMesh().getVertex(vid );

            float x = float(i)*2.0f*glm::pi<float>()/float(n_sectors);
            float r = (WW*c10+ (float(j)*250.0*c12));
            p = glm::vec3( r*cos(x)  ,r*sin(x), j*4.5*HH*c11/float(n_layers) );
            
            cone.getMesh().setVertex( vid, p );
            cone.getMesh().setTexCoord(vid, (glm::vec2(
                                                 (float(i)/n_sectors)*WW,
                                                 (float(j)/(n_layers))*HH*c13)  )
                                       );
            vid++;
        }
    }
    cout << "rebuilt mesh" << endl;
    //cone = of3dPrimitive();
    //cone.enableTextures();
    //cone.getMesh().append( coneMesh );
    //cone.getTexCoords().append( coneMesh.getTexCoords()  );

    //cone.setParent(view);
}

void ofApp::initMesh(){
    
    int n_sectors = N_SECTORS;
    int n_layers = N_LAYERS;

//    cylinder.set(WW*c10, HH*c11);

    for (int j = 0; j<n_layers; j++) {
        //float y = float(j)*
    //for (float y = 0; y < n_layers; y+=1.0){
       // for (float x = 0; x< 2.0f*glm::pi<float>(); x+=2.0f*glm::pi<float>()/float(n_sectors)){
        for (int i=0; i<=n_sectors; i++ ) {
            float x = float(i)*2.0f*glm::pi<float>()/float(n_sectors);
            float r = (WW*c10+ (float(j)*250.0*c12));
            auto p = glm::vec3( r*cos(x)  ,r*sin(x), j*4.5*HH*c11/float(n_layers) );
            //auto p = glm::vec3( (WW*c10+ (float(j)*250.0*c12))*cos(x)  ,(WW*c10+ (float(j)*250.0*c12))*sin(x), j*4.5*HH*c11/float(n_layers) );
            coneMesh.addVertex(p);    // mesh index = x + y*width
                        // this replicates the pixel array within the camera bitmap...
            //mainMesh.addColor(ofFloatColor(0,0,0));  // placeholder for colour data, we'll get this from the camera
            //coneMesh.addTexCoord( glm::vec2(float(i)*float(WW)/n_sectors, float(j)*float(HH)/n_layers) );
            coneMesh.addTexCoord( (glm::vec2(
                                             (float(i)/n_sectors)*WW,
                                           // (float(j*j)/(n_layers*n_layers))*HH*0.8)  )
                                             (float(j)/(n_layers))*HH*c13)  )
                                 
                                             );
            coneMesh.addColor(ofColor(255, 255, 255));
        }
    }
    
    for (int j = 0; j<n_layers-1; j++) {
        for (int i=0; i<n_sectors; i++ ) {
            
            coneMesh.addTriangle(
                                 i + (n_sectors+1)*j ,
                                 i + (n_sectors+1)*(j+1),
                                 (i+1) + (n_sectors+1)*j
                                 );
            //coneMesh.addIndex( i + n_sectors*j );
            //coneMesh.addIndex( i + n_sectors*(j+1) );
            //coneMesh.addIndex( (i+1)%n_sectors + n_sectors*j );

            coneMesh.addTriangle(
                                 (i+1) + (n_sectors+1)*j  ,
                                 i + (n_sectors+1)*(j+1),
                                 (i+1) + (n_sectors+1)*(j+1)
                                 );
            //coneMesh.addIndex( (i+1)%n_sectors + n_sectors*j );
            //coneMesh.addIndex( i + n_sectors*(j+1) );
            //coneMesh.addIndex( (i+1)%n_sectors + n_sectors*(j+1) );

        }
    }
    //cone = of3dPrimitive();
    cone.enableTextures();
    cone.getMesh().append( coneMesh );
    //cone.getTexCoords().append( coneMesh.getTexCoords()  );

    cone.setParent(view);
    //cone.mapTexCoordsFromTexture( fbo.getTexture() );
}



//--------------------------------------------------------------
void ofApp::update(){
    
    //updateMesh();
    //updateLightPositions();
    symmetry_id.setName( symmetryGroupLabel[int(symmetry_id)] );
    
    if (!paused) {
    framenr++;
    vidGrabber.update();

    
    
    /*
    feedback.begin();
//    ofClear(0,0,0,255);
    vidGrabber.draw(0,0);
    feedback.end();
*/
    
    //for (int i=0; i<int(iterations); i++ ) {
    fbo.begin();
        shader.begin();
        
            setUniforms();
            //shader.setUniform1f("mix_f",i==0 ? exp(float(mix_f)): 0);

            vidGrabber.draw(0,0);
        //feedback.draw(0,0);
        shader.end();
    fbo.end();
     
        
    feedback.begin();
        fbo.draw(0,0);
    feedback.end();
     
    //}
    
    if (post_checkerboard || post_intrainversion) {
        fbo.begin();
            shader.begin();
        
                setUniforms();
                shader.setUniform1f("mix_f", 0);
                shader.setUniform1i("post_checkerboard",int(post_checkerboard));
                shader.setUniform1i("post_intrainversion",int(post_intrainversion));
                shader.setUniform1i("lattice_range",0);

                //vidGrabber.draw(0,0);
                feedback.draw(0,0);
            shader.end();
        fbo.end();
    }
    }
    processMidiEvents();
}

void ofApp::processMidiEvent() {
    if ( midiMessages.size() > 0 ) {
        ofxMidiMessage &message = midiMessages[0];
        
        if(message.status < MIDI_SYSEX) {
            if(message.status == MIDI_CONTROL_CHANGE) {
                
                cout << "message.control "<< message.control<< endl;
                cout << "message.value" << message.value<< endl;
                cout << "messages " <<  midiMessages.size() << endl;
                
                
                if(message.control==9){
                    
                    mix_f    = mix_f.getMin() + (message.value/127.0f)*(mix_f.getMax()-mix_f.getMin()); }
                
                
                if(message.control==23  && message.value == 127){ checkerboard = !checkerboard; }
                if(message.control==24  && message.value == 127){ intrainversion = !intrainversion; }
                if(message.control==25  && message.value == 127){ post_checkerboard = !post_checkerboard; }
                if(message.control==26  && message.value == 127){ post_intrainversion = !post_intrainversion; }

                
                if(message.control==14){c3=(message.value-63.0f)/63.0f;
                    e1length    = e1length.getMin() + (message.value/127.0f)*(e1length.getMax()-e1length.getMin()); }
                
                if(message.control==15){c1=(message.value-63.0f)/63.0f;  lattice_rotation = (message.value/127.0f)*glm::pi<float>(); }
                if(message.control==16){c2=(message.value-63.0f)/63.0f;  lattice_angle    = (message.value/127.0f)*glm::pi<float>(); }
                
                if(message.control==17){
                    saturation_boost = saturation_boost.getMin() + (message.value/127.0f)*(saturation_boost.getMax()-saturation_boost.getMin()); }
                if(message.control==18){
                    brightness_boost = brightness_boost.getMin() + (message.value/127.0f)*(brightness_boost.getMax()-brightness_boost.getMin()); }
                if(message.control==19){
                        contrast_boost = contrast_boost.getMin() + (message.value/127.0f)*(contrast_boost.getMax()-contrast_boost.getMin()); }
                if(message.control==20){
                    c7=(message.value)/64.0f;
                    lattice_aspect_ratio = c7;
                }
                if(message.control==21){c8=(message.value-63.0f)/63.0f;}
                if(message.control==22){c9=(message.value-63.0f)/63.0f;}
                
                if(message.control==3){
                    c10=(message.value)/128.0f;
                    //cylinder.set(WW*c10, HH*c11);
                    //cylinder.mapTexCoordsFromTexture( fbo.getTexture() );
                    updateMesh();
                }
                if(message.control==4){
                    c11=(message.value)/128.0f;
                    //cylinder.set(WW*c10, HH*c11);
                    //cylinder.mapTexCoordsFromTexture( fbo.getTexture() );
                    
                    
                    for( int i = 0 ; i<  cylinder.getMesh().getNumTexCoords(); i++ ) {
                        cout << "cylinder texcoord" << i <<" " << cylinder.getMesh().getTexCoord(i) << endl;
                    }
                    
                    for( int i = 0 ; i<  coneMesh.getNumTexCoords(); i++ ) {
                        cout << "coneMesh texcoord" << i <<" " << coneMesh.getTexCoord(i) << endl;
                    }
                    
                    for( int i = 0 ; i<  cone.getMesh().getNumTexCoords(); i++ ) {
                        cout << "cone texcoord" << i <<" " << cone.getMesh().getTexCoord(i) << endl;
                    }
                    cout << "c10,11,12: " << c10 << " " << c11 << " " << c12 << endl;
                    updateMesh();
                    
                }
                if(message.control==5){c12=(message.value)/123.0f; updateMesh();}
                if(message.control==6){c13=(message.value)/63.0f; updateMesh();}
                if(message.control==7){c14=(message.value-63.0f)/63.0f;}
                if(message.control==8){c15=(message.value-63.0f)/63.0f;}
                if(message.control==9){c16=(message.value-63.0f)/63.0f;}
                if(message.control==10){c17=(message.value-63.0f)/63.0f;}
                if(message.control==11){c18=(message.value-63.0f)/63.0f;}
            }
        }
        
    }
}

void ofApp::processMidiEvents() {

//while(midiMessages.size() > maxMessages) {
//    midiMessages.erase(midiMessages.begin());
    while( midiMessages.size()>0) {

    processMidiEvent();
    midiMutex.lock();
    midiMessages.erase(midiMessages.begin());
    midiMutex.unlock();
    }
//}
   
    /*
    for(unsigned int i = 0; i < midiMessages.size(); ++i) {

        ofxMidiMessage &message = midiMessages[i];
        int x = 10;
        int y = i*40 + 40;

        // draw the last recieved message contents to the screen,
        // this doesn't print all the data from every status type
        // but you should get the general idea
        stringstream text;
        text << ofxMidiMessage::getStatusString(message.status);
        while(text.str().length() < 16) { // pad status width
            text << " ";
        }

        //ofSetColor(127);
        if(message.status < MIDI_SYSEX) {
            if(message.status == MIDI_CONTROL_CHANGE) {
                
                cout << "message.control"<< message.control<< endl;
                cout << "message.value"<< message.value<< endl;
                
                
            }
        }
    }
//}
     */
}

void ofApp::listMidiEventQueue() {
    //cout << "events\n";
    
    for(unsigned int i = 0; i < midiMessages.size(); ++i) {

        ofxMidiMessage &message = midiMessages[i];
        int x = 10;
        int y = i*40 + 40;

        // draw the last recieved message contents to the screen,
        // this doesn't print all the data from every status type
        // but you should get the general idea
        stringstream text;
        text << ofxMidiMessage::getStatusString(message.status);
        while(text.str().length() < 16) { // pad status width
            text << " ";
        }

        //ofSetColor(127);
        if(message.status < MIDI_SYSEX) {
            text << "chan: " << message.channel;
            if(message.status == MIDI_NOTE_ON ||
               message.status == MIDI_NOTE_OFF) {
                text << "\tpitch: " << message.pitch;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.pitch, 0, 127, 0, ofGetWidth()*0.2), 10);
                text << "\tvel: " << message.velocity;
                ofDrawRectangle(x + (ofGetWidth()*0.2 * 2), y + 12,
                    ofMap(message.velocity, 0, 127, 0, ofGetWidth()*0.2), 10);
            }
            if(message.status == MIDI_CONTROL_CHANGE) {
                text << "\tctl: " << message.control;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.control, 0, 127, 0, ofGetWidth()*0.2), 10);
                text << "\tval: " << message.value;
                ofDrawRectangle(x + ofGetWidth()*0.2 * 2, y + 12,
                    ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
            }
            else if(message.status == MIDI_PROGRAM_CHANGE) {
                text << "\tpgm: " << message.value;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
            }
            else if(message.status == MIDI_PITCH_BEND) {
                text << "\tval: " << message.value;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.value, 0, MIDI_MAX_BEND, 0, ofGetWidth()*0.2), 10);
            }
            else if(message.status == MIDI_AFTERTOUCH) {
                text << "\tval: " << message.value;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
            }
            else if(message.status == MIDI_POLY_AFTERTOUCH) {
                text << "\tpitch: " << message.pitch;
                ofDrawRectangle(x + ofGetWidth()*0.2, y + 12,
                    ofMap(message.pitch, 0, 127, 0, ofGetWidth()*0.2), 10);
                text << "\tval: " << message.value;
                ofDrawRectangle(x + ofGetWidth()*0.2 * 2, y + 12,
                    ofMap(message.value, 0, 127, 0, ofGetWidth()*0.2), 10);
            }
            text << " "; // pad for delta print
        }
        else {
            text << message.bytes.size() << " bytes ";
        }

        text << "delta: " << message.deltatime;
        //text << "\n";
        //ofSetColor(0);
        //ofDrawBitmapString(text.str(), x, y);
        cout << text.str() << "\n";
        text.str(""); // clear
    }
}

void ofApp::grabScreen() {
    cout << "grab screen " << framenr << "\n";
    int w = fbo.getWidth();
    int h = fbo.getHeight();
    unsigned char* pixels = new unsigned char[w*h*3];  ;
    ofImage screenGrab;
    screenGrab.allocate(w,h,OF_IMAGE_COLOR);
    screenGrab.setUseTexture(false);
      
    //copy the pixels from FBO to the pixel array; then set the normal ofImage from those pixels; and use the save method of ofImage
      
    fbo.begin();
    glPixelStorei(GL_PACK_ALIGNMENT, 1);
    glReadPixels(0, 0, fbo.getWidth(), fbo.getHeight(), GL_RGB, GL_UNSIGNED_BYTE, pixels);
    screenGrab.setFromPixels(pixels, fbo.getWidth(), fbo.getHeight(), OF_IMAGE_COLOR);
    screenGrab.saveImage("output_"+ ofToString(run_id) + "_" + ofToString(framenr) + ".jpg", OF_IMAGE_QUALITY_MEDIUM);
    fbo.end();
    ofLog(OF_LOG_VERBOSE, "[DiskOut]  saved frame " + ofToString(framenr) );
}



//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(ofColor::gray);

    ofSetColor(255);
    //vidGrabber.draw(PADDING,PADDING,WW,HH);
    //ofSetColor(ofColor::red);
    //ofDrawBitmapString("RED", 5+30, 5+30);

    //Draw the pattern framebuffer
    fbo.draw(PADDING,PADDING,DRAW_WW,DRAW_HH);
    fbo.draw(PADDING+DRAW_WW,PADDING,DRAW_WW,DRAW_HH);

    
    float spinX = sin(ofGetElapsedTimef()*.05f);
    float spinY = cos(ofGetElapsedTimef()*.045f);
    if (mouseDown) {
        spinX = spinY = 0.0f;
    }

    
    cam.setGlobalPosition({ 0,0,cam.getImagePlaneDistance(ofGetCurrentViewport()) });
    cam.begin();

    //cylinder.mapTexCoordsFromTexture( fbo.getTexture() );

    ofEnableDepthTest();

    ofEnableLighting();
    pointLight.enable();
    pointLight2.enable();
    pointLight3.enable();

    float screenWidth = ofGetWidth();
    float screenHeight = ofGetHeight();

    
    //cylinder.setPosition(  -screenWidth * .5 + screenWidth *  2/4.f, screenHeight * -1.1/6.f, 0);
    
    // Cylinder //
    
    view.rotateDeg(spinX, 1.0, 0.0, 0.0);
    view.rotateDeg(spinY, 0, 1.0, 0.0);
    
    cylinder.rotateDeg(spinX, 1.0, 0.0, 0.0);
    cylinder.rotateDeg(spinY, 0, 1.0, 0.0);
    
    /*
        fbo.getTexture().bind();
            //material.begin();
                //ofFill();
        
                cylinder.draw();
    
            //material.end();
        fbo.getTexture().unbind();
    */
    
    
        //view.transformGL();
//        coneMesh.drawFaces();
        //view.draw();
        fbo.getTexture().bind();
            cone.draw();
        fbo.getTexture().unbind();

        //cone.drawWireframe();

        //view.restoreTransformGL();
    
    
        

        ofDisableLighting();
    
        ofDisableDepthTest();

        ofFill();

        cam.end();
    //ofSetDrawBitmapMode(OF_BITMAPMODE_MODEL_BILLBOARD);

    ofSetDrawBitmapMode(OF_BITMAPMODE_MODEL_BILLBOARD);
    ofDrawBitmapStringHighlight( symmetryGroupLabel[int(symmetry_id)]   , 20, 20 );
    
    //fbo.draw(PADDING,PADDING,WW,HH);
    //feedback.draw(PADDING*2+WW,PADDING,WW,HH);
    gui.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if (key=='g') {
        grabScreen();
    } else if (key == ' ') {
        paused = !paused;
    } else if (key == 'm' ) {
        processMidiEvents();
        cout << "\n.\n";
    }
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
    mouseDown = true;
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    mouseDown = false;
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



//--------------------------------------------------------------
void ofApp::newMidiMessage(ofxMidiMessage& msg) {

    midiMutex.lock();
    // add the latest message to the message queue
    midiMessages.push_back(msg);

    // remove any old messages if we have too many
    while(midiMessages.size() > maxMessages) {
        midiMessages.erase(midiMessages.begin());
    }
    midiMutex.unlock();
}
