/*global PIXI*/
/*global Motorway*/
/*global View*/
/*global ViewController*/
/*global Vehicle*/
/*global Junction*/
/*global loadApp*/
/*global Section*/

let type = "WebGL"
let cat;
let state;
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

// GLOBAL MODEL
var motorway;
var sections = [];
var junctions = [];
var spout;
var vehicles = [];
var vehiclesDist = [];
var allowedVehicles;
let app;
var viewport;
var view;
var panelController;
var elapsedTime;
var timer = 0;
var params = {};

// LISTEN TO MOTORWAY CREATOR
if(debugMode == false){
  CreatorController.listenCreator();
} else{
  $(".motorwayCreator").hide();
  $(".simulator").show();
  params = {
    motorwayLength: 2,
    lanesNo: 3,
    junctionsNo: 2,
    junctionsPos: [0.4,1.1],
    vehDistrIn: [20,20,30,30],
    vehDistrOut: [20,20,30,30]
  }
  initSimulator();
}

// MODEL DEFINITION
function initSimulator(){
  
  // Create a motorway
  //motorway = new Motorway(3,2,0, 0.2, 0.2, 0.2, 0.2);
  motorway = new Motorway(params.lanesNo,params.motorwayLength,0, params.vehDistrIn[0]/100, params.vehDistrOut[0]/100, params.vehDistrIn[1]/100, params.vehDistrOut[1]/100);
  sections = [];
  for(var i=0; i<motorway.mLength*SECTION_SIZE; i++){ // 10cm granularity
    sections[i] = new Section(0,0);
    if(i >= 1000 && i <= 5000){
      //sections[i].speedLimit = 120; // Change it to mph!!!
    }
    if(i >= 9000 && i <= 19000){
      //sections[i].speedLimit = 120;
    }
  }
  // motorway.closedLanes = [
  //   {
  //     lane: 1,
  //     from: 6000,
  //     to: 15000
  //   },
  //   {
  //     lane: 6,
  //     from: 14000,
  //     to: 20000
  //   }
  // ];
  // Create junction
  for(i=0; i<params.junctionsNo; i++){
    junctions[i] = new Junction(params.junctionsPos[i], (params.vehDistrIn[(i+2)]/200), (params.vehDistrOut[(i+2)]/200), (params.vehDistrIn[(i+2)]/200), (params.vehDistrOut[(i+2)]/200));
  }
  //junctions[0] = new Junction(0.4, 0.15, 0.15, 0.15, 0.15);
  //junctions[1] = new Junction(1.1, 0.15, 0.15, 0.15, 0.15);
  
  // Create Vehicle Spout
  spout = new Spout(0);
  
  // Create vehicle
  
  allowedVehicles = [
    {
      name: "Sunday Driver"
    },
    {
      name: "Tailgater"
    },
    {
      name: "Boy Racer"
    },
    {
      name: "Careful Driver"
    },
    {
      name: "Lorry"
    }
  ];
  
  //vehicles[0] = new Vehicle("Sunday Driver", 0,0,6);
  
  //vehicles[1] = new Vehicle("Tailgater", 1,2,7);
  //vehicles[1].dead = true;
  
  //vehicles[2] = new Vehicle("Sunday Driver", 1,0,0);
  //vehicles[2].dead = true;
  
  //vehicles[3] = new Vehicle("Tailgater", 0,2,1);
  //vehicles[3].dead = true;
  
  //vehicles[4] = new Vehicle("Sunday Driver", 0,2,6);
  //vehicles[0].dead = true;
  
  
  //Create a Pixi Application
  app = new Application({ 
      width: window.innerWidth*0.8, 
      height: window.innerHeight,                       
      antialias: true, 
      transparent: false, 
      resolution: 1,
      sharedTicker: false,
      autoStart: false,
      backgroundColor: 0x424250
    }
  );
  
  // create viewport
  viewport = new PIXI.extras.Viewport({
      screenWidth: window.innerWidth*0.8,
      screenHeight: window.innerHeight,
      worldWidth: window.innerWidth*0.8,
      worldHeight: px(motorway.mLength*100000),
  
      interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
  });
  
    // Create the View
    view = new View(SECTION_SIZE, SCALE);
    
    // Create controllers
    panelController = new PanelController();
    panelController.listenPanel();
    ViewController();
    
    elapsedTime = 0;
    
  // add the viewport to the stage
  app.stage.addChild(viewport);
  
  // activate plugins
  viewport
      .pinch()
      .wheel()
      .clamp({
        direction: "all"
      })
      .clampZoom({
        minWidth: 300,
        minHeight: 300,
        maxWidth: 7000,
        maxHeight: 7000
      })
      .drag({
        clampWheel: true
      })
      .decelerate();
  
  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);
  
  // Load sprites
  loadApp();
}
//initSimulator();
function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  //console.log("loading: " + resource.url); 

  //Display the percentage of files currently loaded
  //console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

//This `setup` function will run when the image has loaded
function setup() {
  
  // Draw motorway
  view.drawMotorway(motorway);
  for(i=0; i<params.junctionsNo; i++){
      view.drawJunction(junctions[i], motorway);
  }
  //view.drawJunction(junctions[0], motorway);
  //view.drawJunction(junctions[1], motorway);
  view.drawLaneClosures();
  view.drawIndicators(motorway);
  view.drawSpeedLimits();
  view.publish();
  
  // Create controllers
  
  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
  //Set the game state
  state = play;
 
  //Start the game loop 
  //console.log(app.ticker);
  
  app.ticker.add(delta => gameLoop(delta));
  app.ticker.start();

  
  // ticker.autoStart = false;
  // ticker.stop();
  // function animate(time) {
  //     gameLoop(time);
  //     ticker.speed = 2;
  //     ticker.update(time);
  //     app.renderer.render(app.stage);
  //     requestAnimationFrame(animate);
  // }
  // animate(performance.now()*2);
  
}

function gameLoop(delta){
      state(play);
}


function play(delta) {
  
  // Call spout
  spout.generateVehiclesLoop();
  
  // if(timer == 1*60){
  //   vehicles[1] = new Vehicle("Tailgater", 0,0,6);
  //   vehicles[2] = new Vehicle("Tailgater", 0,0,5);
  //   //vehicles[2].dead = true;
  // }
  // if(timer == 2*60){
  //   vehicles[3] = new Vehicle("Boy Racer", 0,0,6);
  //   vehicles[4] = new Vehicle("Boy Racer", 0,0,5);
  //   //vehicles[4].dead = true;
  // }
  // if(timer == 3*60){
  //   vehicles[5] = new Vehicle("Ambulance", 0,0,6);
  //   vehicles[6] = new Vehicle("Ambulance", 0,0,5);
  //   //vehicles[5].dead = true;
  //   //vehicles[6].dead = true;
  // }
  // if(timer == 4*60){
  //   vehicles[7] = new Vehicle("Fire Brigade", 0,0,6);
  //   vehicles[8] = new Vehicle("Fire Brigade", 0,0,5);
  //   //vehicles[7].dead = true;
  //   //vehicles[8].dead = true;
  // }
  // if(timer == 5*60){
  //   vehicles[9] = new Vehicle("Careful Driver", 0,0,6);
  //   vehicles[10] = new Vehicle("Careful Driver", 0,0,5);
  //   //vehicles[9].dead = true;
  //   //vehicles[10].dead = true;
  // }
  // if(timer == 6*60){
  //   vehicles[11] = new Vehicle("Police", 0,0,6);
  //   vehicles[12] = new Vehicle("Police", 0,0,5);
  //   //vehicles[11].dead = true;
  //   //vehicles[12].dead = true;
  // }
  if(timer == 7*60){
    //vehicles[0].changeSpeed(0/3.6,vehicles[0].accelerationFactor);
    //vehicles[2].changeSpeed(0/3.6,vehicles[2].accelerationFactor);
  }
  // if(timer == 1*60){
  //   //vehicles[0].changeLane(5,20);
  //   //vehicles[0].changeSpeed(1,2);
  // }
  // if(timer == 40*60){
  // }
  
  // Progress Vehicles
  for(var i=0; i<vehicles.length; i++){
    if(vehicles[i].dead == false && !simulationPause){
      vehicles[i].progress(delta);
      view.drawVehicle(vehicles[i], motorway);
    }
  }
  
  // Update inspector
  if(_inspectorMode != false){
    panelController.showVehInfo(_inspectorMode);
  }
  timer++;
}