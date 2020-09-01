// Dimensions file (in cm)

// CONSTANTS
const SECTION_SIZE = 10000; // Per kilometre
const SCALE = 3; // 1 pixel per SCALE cm
const VEH_CENTRE_X = 0.8;
const RAMP_SPEED_LIMIT = (40*10)/36;
const VEH_TYPE_NO = 8; // All of the vehicles

// ERROR MESSAGES
const E = {
  "C_MOTORWAY_LENGTH":              'The length of motorway needs to be between 0.8km and 50km',
  "C_MOTORWAY_LANES_NO":            'The number of lanes needs to be between 2 and 12',
  "C_JUNCTIONS_NO_NOSPACE":         'There is not enough space for that many junctions',
  "C_JUNCTIONS_NO_NEGATIVE":        'Junction number cannot be negative!',
  "C_JUNCTIONS_NO_RATIONAL":        'Junction number needs to be an integer',
  "C_JUNCTIONS_POS_OUTSIDE":        'Junction cannot be placed here as there is not enough space for exits',
  "C_JUNCTIONS_POS_COLLISION":      'Junction cannot be placed here as it collides with other junction(s)',
  "C_JUNCTIONS_POS_NOTALL":         'Not all junctions are set',
  "C_DISTR_OUTOFBOUNDS":            'Value needs to be between 0 and 100',
  "C_DISTR_OVER100":                'The sum of the distributions must be equal to 100%',
  'C_DISTR_NOTALL':                 'Not all distributions are set',
  
  'P_LANECLOSURE_LANEOUTOFBOUNDS':  'Chosen lane does not exist',
  'P_LANECLOSURE_INPUTOUTOFBOUNDS': 'Selected position is not on motorway',
  'P_LANECLOSURE_EMPTYFIELDS':      'All fields must be filled in',
  'P_SPEEDLIMIT_SPEEDOUTOFBOUNDS':  'Chosen speed needs to be between 0 and 255km/h',
  'P_SPEEDLIMIT_INPUTOUTOFBOUNDS':  'Selected position is not on motorway',
  'P_SPEEDLIMIT_EMPTYFIELDS':       'All fields must be filled in'
} 
// GLOBAL PARAMETERS
var _inspectorMode = false;
var simulationPause = false;
var simulationSpeed = 1;
var deadCounter = 0;
var debugMode = false;

// Convert centimetres to pixels
function px(cm){
  return cm/SCALE;
}

// m/s to km/h converter
function kph(mps){
  return mps*3.6;
}

// Pixels to metres
function pxToMeter(px){
  return (px*SCALE)/100;
}

function meterToPx(m){
  return px(m*100);
}
var d = { // DIMENSIONS / LENGTHS
    
    // MOTORWAY
    'lane'                          :  px(300),
    'hardShoulder'                  :  px(200),
    
    // JUNCTION
    'lane0Len'                      :  px(10000),
    'exitHardShoulder'              :  px(50),
    'exitExpand'                    :  px(10000),
    
    // LANE CLOSURES
    'laneClosureEntrance'           :  px(5000),
    'laneClosureGap'                :  px(30),
    
    // DISTANCES
    'defFrontDistanceKeeping'       :  1.5 // [sec]
    
};