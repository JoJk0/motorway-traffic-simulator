function Vehicle(type, origin, destination, lane){
    
    this.type = type;
    this.origin = origin;
    this.destination = destination;
    this.lane = lane;
    this.startLane = lane;
    
    this.speed = 0; //m/s
    this.x = 0;
    this.section = 0;
    this.width = 0;
    this.height = 0;
    this.priviledged = 0;
    this.angle = 0;
    this.preferredSpeed = 0;
    this.turningSharpnessFactor = 0;
    this.accelerationFactor = 0;
    this.speedingFactor = 0;
    this.distanceKeepingFactor = 0;
    this.speedOvertakeFactor = 0;
    this.riskFactor = 0;
    this.dead = false;
    this.states = {};
    this.roadSide = 0;
    
    this.view = 0;
    
    this.notUsed = true;
    this.speedLock = false;
    this.angleLock = false;
    this.speedOverriden = false;
    
    // Change the type of the vehicle
    this.setType = function(newType){
        

        if(newType == "Sunday Driver"){
            
            //this.preferredSpeed = 80;
            this.preferredSpeed = (80*10)/36; // m/s
            this.turningSharpnessFactor = 60;
            this.accelerationFactor = 2.5; // m/s^2
            this.speedingFactor = false;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        } else if(newType == "Tailgater"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (110*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 3;
            this.speedingFactor = false;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        }else if(newType == "Boy Racer"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (130*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 4;
            this.speedingFactor = true;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        } else if(newType == "Careful Driver"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (100*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 2.5;
            this.speedingFactor = false;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        }else if(newType == "Lorry"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (100*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 2;
            this.speedingFactor = false;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        }else if(newType == "Ambulance"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (160*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 3.5;
            this.speedingFactor = true;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        }else if(newType == "Fire Brigade"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (160*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 3;
            this.speedingFactor = true;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        }else if(newType == "Police"){
            
            //this.preferredSpeed = 100;
            this.preferredSpeed = (160*10)/36;
            this.turningSharpnessFactor = 1;
            this.accelerationFactor = 4;
            this.speedingFactor = true;
            this.distanceKeepingFactor = 1;
            this.speedOvertakeFactor = 1.5;
            this.riskFactor = 1;
            this.width = 170;
            this.height = 340;
            this.type = newType;
            
        } else{
            console.log("ERROR: unrecongnized vehicle type: "+newType);
        }

    }
    
    // Change the destination of the vehicle
    this.setDestination = function(){
        
    }
    
    // Get dimensions
    this.getLeftPos = function(){
        return this.x-this.roadSide*(this.width)/2;
    }
    this.getRightPos = function(){
        return this.x+this.roadSide*(this.width)/2;
    }
    this.getTopPos = function(){
        return px(this.section+this.roadSide*this.height*VEH_CENTRE_X);
    }
    this.getBottomPos = function(){
        return px(this.section-this.roadSide*this.height*(1-VEH_CENTRE_X));
    }
    
    // Prepare new vehicle to be on the motorway
    this.initVehicle = function(){
        var yR;
        if(this.origin != 0){
            if(this.lane == (motorway.lanesNo*2)+1){
                this.roadSide = -1;
                yR = -1;
            } else{
                this.roadSide = 1;
                yR = 1;
            }
        } else{
            this.roadSide = (this.lane <= motorway.lanesNo) ? 1 : -1; // 1 = left, -1 = right side of motorway
        }
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        var motorwayCenteredPos = ((window.innerWidth*0.8)/2)-(motorwayWidth/2);
        var dT = (this.roadSide == 1) ? 0 : px(100);
        var mW = (this.roadSide == 1) ? 0 : motorwayWidth;
        this.setType(this.type);
        this.speed = this.preferredSpeed;
        if(this.origin == 0){
            this.x = motorwayCenteredPos+dT+px(200)+this.lane*px(300)-(px(300/2));
            this.section = this.roadSide == 1 ? motorway.mLength*100000-this.height : 0;
        } else{
            var originJunction = this.getOriginJunction();
            this.x = motorwayCenteredPos+mW-this.roadSide*(d["lane0Len"]);
            this.section = (originJunction.position*100000)-yR*SCALE*(d["exitHardShoulder"]+(d["lane"]/2));
            this.angle = 90;
            this.speed = RAMP_SPEED_LIMIT;
            this.enterMotorway();
        }
    }
    
    // Get the lane
    this.getLane = function(){
        return this.lane;
    }
    
    this.getX = function(){
        return this.x;
    }
    
    this.getSection = function(){
        return this.section;
    }
    
    this.getSpeed = function(){
        return this.speed;
    }
    
    this.getAngle = function(){
        return this.angle;
    }
    
    this.getDestinationJunction = function(){
        if(this.destination != 0){
            return junctions[destination-1];
        }
    }
    
    this.getOriginJunction = function(){
        if(this.origin != 0){
            return junctions[this.origin-1];
        }
    }
    
    // BETA Turner
    this.turnBeta = function(deg){
        this.states["TurnBeta"] = {
            'angle': deg,
            'startAngle': this.getAngle(),
        };
    }
    this.turnBetaLoop = function(){
        var turnDegPerFrame = this.states["TurnBeta"].angle/(60*5); // w
        var turnRadius = (this.speed*Math.sin(this.states["TurnBeta"].angle))/turnDegPerFrame;
        var dist = turnRadius*Math.tan(this.states["TurnBeta"].angle);
        //var secondPointY = Math.sqrt(Math.pow(Math.tan(this.states["TurnBeta"].angle),2)-Math.pow(,2))+this.section;
        
        //console.log(turnRadius);
        
    }
    
    // Schedule turning task to task list
    this.turn = function(deg, endpoint){
        this.states["Turn"] = {
            'angle': deg,
            'startAngle': this.getAngle(),
        };
    }
    this.turnLoop = function(delta){
        var turnDegPerFrame = this.states["Turn"].angle/(60*5);
        turnDegPerFrame = turnDegPerFrame*simulationSpeed;
        //var isBreakPointReached = (typeof this.states["Turn"] == "undefined") || (typeof this.states["Turn"] != "undefined" && Math.floor(this.x) != Math.floor(this.states['Turn'].endpoint));
        //if(isBreakPointReached){
            this.angle = this.angle+turnDegPerFrame;
        //} else{
            // Task complete, delete it from scheduled tasks
            //this.angle = this.states["Turn"].startAngle+this.states["Turn"].angle;
            //delete this.states["Turn"];
        //}
    }
    
    // Schedule speed changing to task list
    this.changeSpeed = function(mps, acceleration, delta){

            this.states["ChangeSpeed"] = {
                'speed': mps,
                'startSpeed': this.getSpeed(),
                'acceleration': acceleration
            };
    }
    this.changeSpeedLoop = function(delta){
        var accelerationMPerSecPerFrame = (this.states['ChangeSpeed'].acceleration)/60;
        accelerationMPerSecPerFrame = accelerationMPerSecPerFrame*simulationSpeed;
        var isSpeedingUpOrSlowingDown = this.speed > this.states["ChangeSpeed"].speed ? -1 : 1;
        //console.log("Speed: "+isSpeedingUpOrSlowingDown*(this.speed+accelerationMPerSecPerFrame)+" < "+(this.states["ChangeSpeed"].speed));
        if(isSpeedingUpOrSlowingDown*(this.speed+isSpeedingUpOrSlowingDown*accelerationMPerSecPerFrame) < isSpeedingUpOrSlowingDown*this.states["ChangeSpeed"].speed){
            //this.speed = this.speed+(speedDiff/60*this.states["ChangeSpeed"].acceleration);
            this.speed = this.speed+isSpeedingUpOrSlowingDown*accelerationMPerSecPerFrame;
            
        } else{
            // Round up or down to the desired speed
            this.speed = this.states["ChangeSpeed"].speed;
            // Task complete, delete it from scheduled tasks
            delete this.states["ChangeSpeed"];
            this.speedLock = false;
        }
    }
    
    // Change the lane
    this.changeLane = function(lane, sharpness, maxTurnAngle){
        var turnDir = this.roadSide*lane > this.roadSide*this.lane ? 1 : -1;
        if(lane == 0 && this.lane == 1){
            turnDir = -1;
        } else if(this.lane == 0 && lane == 1){
            turnDir = 1;
        } else if(lane == (motorway.lanesNo*2)+1 && this.lane == motorway.lanesNo*2){
            turnDir = -1;
        } else if(this.lane == (motorway.lanesNo*2)+1 && lane == motorway.lanesNo*2){
            turnDir = 1;
        }
        var turnSharpness = 1;
        if(typeof sharpness != "undefined"){
            turnSharpness = sharpness;
        }
        this.states["ChangeLane"] = {
            'lane': lane,
            'startLane': this.getLane(),
            'newLaneX': motorway.getLaneCenterPos(lane),
            'startPosY': this.getSection(),
            'startPosX': motorway.getLaneCenterPos(this.getLane()),
            'turnDir':  turnDir, // -1 = left; 1 = right
            'sharpness': turnSharpness,
            'startSpeed': this.getSpeed(),
            'state': 0
        };
        //console.log("NewLaneX = "+this.states["ChangeLane"].newLaneX+" for lane "+lane);
        if(typeof maxTurnAngle != "undefined"){
            this.states["ChangeLane"].maxTurnAngle = maxTurnAngle;
        }
        //console.log("ChangeLane: newlanex "+this.states["ChangeLane"].newLaneX+" lane: "+lane+" vs "+this.getLane());
    }
    this.changeLaneLoop = function(delta){
        // Calculate angle
        //var speedDiff = (this.speed/this.states["ChangeLane"].startSpeed);
        //console.log(speedDiff);
        //speedDiff = speedDiff > 1 ? speedDiff : speedDiff*12;
        //var turnAngle = (90/((this.states["ChangeLane"].startSpeed)/this.states["ChangeLane"].sharpness))*this.states["ChangeLane"].turnDir*(-1);
        var turnAngle = (((this.speed)/this.states["ChangeLane"].sharpness))*this.states["ChangeLane"].turnDir;
        //console.log(this.states["ChangeLane"].turnDir*(-1)*this.states['ChangeLane'].maxTurnAngle+" vs "+turnAngle);
        if(typeof this.states['ChangeLane'].maxTurnAngle != "undefined"){
            if(turnAngle < this.states["ChangeLane"].turnDir*this.states['ChangeLane'].maxTurnAngle){
                turnAngle = this.states["ChangeLane"].turnDir*this.states['ChangeLane'].maxTurnAngle;
            }
        }
        var angularVelocity = (this.speed)/((((d["lane0Len"]*SCALE)+550)/100));
        //console.log(this.states["ChangeLane"]);
        //console.log("ChangeLane: Turn angle = "+turnAngle);
        //console.log(this.states["ChangeLane"].startLane);
        var posHalfWayX = (this.states["ChangeLane"].startPosX+this.states["ChangeLane"].newLaneX)/2;
        
        var isStartingTurn = Math.floor(this.x) == Math.floor(this.states['ChangeLane'].startPosX) && this.states["ChangeLane"].state == 0;
        var isInHalfwayPoint = this.x*this.roadSide*this.states["ChangeLane"].turnDir >= this.roadSide*posHalfWayX*this.states["ChangeLane"].turnDir && this.states["ChangeLane"].state == 1;
        var isFinishedTurn = ((this.x*this.roadSide*this.states["ChangeLane"].turnDir >= this.states["ChangeLane"].newLaneX*this.roadSide*this.states["ChangeLane"].turnDir) && this.states["ChangeLane"].state == 2);
        var zeroAngle = this.states["ChangeLane"].state == 2 && (Math.round(this.angle*10000000)/10000000)*this.states["ChangeLane"].turnDir <= 0;
        
        //console.log(this.x+" vs "+posHalfWayX+" vs "+motorway.getLaneCenterPos(this.lane)+" vs "+motorway.getLaneCenterPos(lane)+" lanes: "+this.lane+" vs "+this.states['ChangeLane'].lane);
        if(isStartingTurn){
            this.states["ChangeLane"].state = 1;
            turnAngle = this.turn(turnAngle);
            //console.log("ChangeLane: Start turn");
        } else if(isFinishedTurn || zeroAngle){
            //console.log("ChangeLane: Finished");
            this.states["ChangeLane"].state = 3;
            this.angle = 0;
            this.x = this.states["ChangeLane"].newLaneX;
            delete this.states["ChangeLane"];
            delete this.states["Turn"];
        } else if(isInHalfwayPoint){
            //console.log(this.x+" vs "+posHalfWayX+" roadSide = "+this.roadSide+" turndir = "+this.states["ChangeLane"].turnDir);
            //console.log("ChangeLane: Halfway");
            this.states["ChangeLane"].state = 2;
            var realAngle = this.angle;
            this.lane = this.states["ChangeLane"].lane;
            this.turn(turnAngle*(-1));
        }
    }
    
    // Overtake vehicle(s)
    this.overtake = function(veh, acceleration){
        this.states["Overtake"] = {
            'startLane': this.getLane(),
            'vehicle': veh,
            'state': 0,
            'acceleration': acceleration
        };
    }
    this.overtakeLoop = function(delta){
        
        var oVeh = this.states['Overtake'].vehicle;
        //console.log(oVeh);
        //console.log(oVeh.veh.getBottomPos()*this.roadSide+" vs "+this.getTopPos()*this.roadSide);
        var isOnOtherLane = this.lane != oVeh.veh.lane;
        var isNotStartedYet = oVeh.veh.getBottomPos()*this.roadSide < this.getTopPos()*this.roadSide && this.states["Overtake"].state == 0;
        var isInFrontOnOtherLane = isOnOtherLane && oVeh.veh.getTopPos()*this.roadSide > this.getBottomPos()*this.roadSide && this.states["Overtake"].state == 2;
        var isFinishedOvertaking = !isOnOtherLane && !isNotStartedYet && this.states["Overtake"].state == 3;
        if(isNotStartedYet){
            this.states["Overtake"].state = 1;
            this.changeLane(this.states['Overtake'].startLane+this.roadSide*1, this.states['Overtake'].acceleration);
            //console.log("Overtake: start");
        } else if(isOnOtherLane && !isNotStartedYet && this.states["Overtake"].state == 1){
            this.states["Overtake"].state = 2;
            //console.log("Overtake: On Other lane");
            if(this.speed < oVeh.veh.speed*this.speedOvertakeFactor){
                this.changeSpeed(oVeh.veh.speed*this.speedOvertakeFactor, 1.2*this.accelerationFactor);
            }
        } else if(isInFrontOnOtherLane){
            this.states["Overtake"].state = 3;
            //console.log("Overtake: Going back to original lane");
            this.x = motorway.getLaneCenterPos(this.lane);
            delete this.states["ChangeLane"];
            this.changeLane(this.states["Overtake"].startLane, 2);
        } else if(isFinishedOvertaking){
            delete this.states['Overtake'];
        }
        
    }
    
    // Enter junction
    this.enterJunction = function(){
        //this.changeLane(0,1);
        //console.log("EnterJunction: Start");
        this.states["EnterJunction"] = {
            state: 0,
            junction: this.getDestinationJunction()
        };
    }
    this.enterJunctionLoop = function(){
        var maxTurnAngle = d["lane"]/Math.sqrt(Math.pow(d["exitExpand"],2)+Math.pow(d["lane"],2));
        maxTurnAngle = (maxTurnAngle*180)/Math.PI;
        maxTurnAngle = maxTurnAngle*(SCALE);
        var enterLane = this.roadSide == 1 ? 0 : (motorway.lanesNo*2)+1;
        //console.log(maxTurnAngle);
        var junc = this.states["EnterJunction"].junction;
        if(this.states["EnterJunction"].state == 0){
            this.states["EnterJunction"].state = 1;
            this.changeLane(enterLane,1,maxTurnAngle);
            this.changeSpeed(RAMP_SPEED_LIMIT,this.accelerationFactor);
        } else if(this.states["EnterJunction"].state == 1 && this.roadSide*this.section <= this.roadSide*(junc.position*100000+this.roadSide*20000)){
            this.states["EnterJunction"].state = 2;
        } else if((this.states["EnterJunction"].state == 2 || this.states["EnterJunction"].state == 3) && this.roadSide*this.section <= this.roadSide*(junc.position*100000+this.roadSide*(10000+300)) && this.angle > -90){
            this.states["EnterJunction"].state = 3;
            var angleRad = (45*Math.PI)/(180);
            var angularVelocity = (this.speed)/((((d["lane0Len"]*SCALE)+550)/100));
            angularVelocity = angularVelocity*simulationSpeed;
            //console.log(Math.sin(angleRad)+" "+angularVelocity);
            this.angle = this.angle-angularVelocity;
        } else if(this.angle < -90){
            this.dead = true;
            deadCounter++;
            view.deleteVehicle(this.view);
            delete this.states["EnterJunction"];
        }
    }
    
    // Enter motorway
    this.enterMotorway = function(){
        this.states["EnterMotorway"] = {
            state: 0,
            junction: this.getOriginJunction()
        };
    }
    this.enterMotorwayLoop = function(){
        var junc = this.states["EnterMotorway"].junction;
        var enterLane = this.roadSide == 1 ? 1 : (motorway.lanesNo*2);
        var dT = this.roadSide == 1 ? 0 : motorway.getWidth();
        
        if((this.states["EnterMotorway"].state == 0 || this.states["EnterMotorway"].state == 1) && Math.round(this.angle*10)/10 > 0){
            this.states["EnterMotorway"].state = 1;
            var angleRad = (45*Math.PI)/(180);
            var angularVelocity = (this.speed)/((((d["lane0Len"]*SCALE)+510)/100));
            angularVelocity = angularVelocity*simulationSpeed;
            this.angle = this.angle-angularVelocity;
        } else if(Math.round(this.angle) <= 0 && this.states["EnterMotorway"].state == 1){
            this.angle = 0;
            this.x = motorway.getCenteredPos()+dT+this.roadSide*(d["hardShoulder"]-d["lane"]/2);
            this.changeSpeed(this.preferredSpeed, this.accelerationFactor);
            this.changeLane(enterLane,1,1);
            this.states["EnterMotorway"].state = 2;
        }
    }
    
    // Progress vehicle in time
    this.progress = function(delta){
        
        // Remove out of bounds vehicles
        if(this.section >= motorway.mLength*100000 || this.section < -1*this.height){
            this.dead = true;
            deadCounter++;
            view.deleteVehicle(this.view);
        } else{
            
            var cmPerFrame = (this.speed*100)/(60*SCALE);
            var angleRad = (this.angle*Math.PI)/(180);
            
            // Find nearby vehicles
            var nearbyVehicles = {};
            for(var i=0; i<vehicles.length; i++){
                if(vehicles[i] != this && vehicles[i].dead == false && vehicles[i].roadSide == this.roadSide){
                    var distance = Math.sqrt(Math.pow(this.x*3-vehicles[i].x*3,2)+Math.pow(this.section-vehicles[i].section,2));
                    var distanceLinear = Math.sqrt(Math.pow(this.section-vehicles[i].section,2));
                    var angle = Math.acos(distanceLinear/distance)*180/Math.PI;
                    nearbyVehicles[i] = {
                        'veh': vehicles[i],
                        'distance': distance,
                        'angle': angle
                    };
                }
            }
            this.nearbyVehicles = nearbyVehicles;
            
            // Handle tasks (turns and speed control)
            for(var task in this.states){
                if(task == "ChangeLane"){
                    this.changeLaneLoop(delta);
                }
                if(task == "Turn"){
                    this.turnLoop(delta);
                }
                if(task == "TurnBeta"){
                    this.turnBetaLoop(delta);
                }
                if(task == "ChangeSpeed"){
                    this.changeSpeedLoop(delta);
                }
                if(task == "Overtake"){
                    this.overtakeLoop(delta);
                }
                if(task == "EnterJunction"){
                    this.enterJunctionLoop(delta);
                }
                if(task == "EnterMotorway"){
                    this.enterMotorwayLoop(delta);
                }
            }
            
            // ROAD RULES
            
            // --- Slowing down if vehicle in the front / DISTANCE KEEPING ---
            // Get the vehicle in the front
            var closestDistance = motorway.getHeight();
            var closestVeh;
            for(veh in nearbyVehicles){
                var nearbyVeh = nearbyVehicles[veh];
                var laneFreeSpace = this.roadSide*((d['lane']-px(nearbyVeh.veh.width)));
                var isNearbyVehicleInDangerZone = (nearbyVeh.veh.getLeftPos()-laneFreeSpace <= this.roadSide*this.getRightPos()) || (nearbyVeh.veh.getRightPos()+laneFreeSpace >= this.roadSide*this.getLeftPos());
                var isNearbyVehicleInFront = nearbyVeh.veh.section*this.roadSide < this.section*this.roadSide && this.lane == nearbyVeh.veh.lane;
                if(isNearbyVehicleInDangerZone && isNearbyVehicleInFront){
                    var dist = px(Math.abs(nearbyVeh.veh.section-this.section))
                    if(dist < closestDistance){
                        closestDistance = dist;
                        closestVeh = nearbyVeh;
                    }
                }
            }
            
            if(typeof closestVeh != "undefined"){

                var relativeSpeed = this.speed-closestVeh.veh.speed;

                var startSpeed = this.speed; // V0
                var finalSpeed = closestVeh.veh.speed; // V
                var currentPos = px(this.section);
                var finalPos = closestVeh.veh.getTopPos()+this.roadSide*px(150)+this.roadSide*px(d['defFrontDistanceKeeping']*this.speed*100)*this.distanceKeepingFactor; // 
                var acceleration = this.accelerationFactor; // a
                
                var startPos; // r0
                
                startPos = meterToPx(pxToMeter(finalPos)-this.roadSide*(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*acceleration));
                
                // If too big difference and there is a space in the front and risk factor > 0.5 then overtake
                var isNotOvertaking = typeof this.states["Overtake"] == "undefined";
                if(this.roadSide*currentPos > this.roadSide*startPos){
                    if((!this.speedOverriden && (this.preferredSpeed*3.6 <= sections[Math.floor(this.section/10)].speedLimit || sections[Math.floor(this.section/10)].speedLimit == 0)) || (!this.speedOverriden && this.speedingFactor == true)){
                        this.changeSpeed(this.preferredSpeed, this.accelerationFactor);
                    } else if(this.preferredSpeed*3.6 > sections[Math.floor(this.section/10)].speedLimit){
                        this.changeSpeed((sections[Math.floor(this.section/10)].speedLimit)/3.6, this.accelerationFactor);
                    }

                    //if(this.type == "Tailgater") console.log("Over");
                } else if(this.roadSide*currentPos <= this.roadSide*startPos && this.roadSide*currentPos >= this.roadSide*finalPos){
                    //if(this.type == "Tailgater") console.log("Between");
                    if(isNotOvertaking){
                        // Change acceleration if vehicle cannot make it
                        var predictFinalPos = meterToPx(pxToMeter(currentPos)+this.roadSide*(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*acceleration));
                        if(this.roadSide*predictFinalPos < this.roadSide*finalPos){
                            acceleration = Math.abs(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*Math.abs(pxToMeter(currentPos)-pxToMeter(finalPos)))*(1+Math.abs(this.speed-closestVeh.veh.speed));
                        }
                        finalSpeed = finalSpeed >= 0 ? finalSpeed : 0; 
                        this.changeSpeed(finalSpeed, Math.abs(acceleration));
                        //if(this.speed < 0) console.log("NEGATIVE - BETWEEN");
                    }
                } else{
                    //if(this.type == "Tailgater") console.log("Under");
                    //finalSpeed = Math.sqrt(2*this.accelerationFactor*(Math.abs(pxToMeter(finalPos)-pxToMeter(currentPos)))+Math.pow(this.speed,2));
                    //console.log(currentPos);
                    var predictFinalPos = meterToPx(pxToMeter(currentPos)+this.roadSide*(Math.pow(0,2)-Math.pow(startSpeed,2))/(2*acceleration));
                    finalSpeed = closestVeh.veh.speed;
                    if(this.roadSide*predictFinalPos < this.roadSide*finalPos){
                        acceleration = (Math.abs(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2)))/(2*Math.abs(pxToMeter(currentPos)-pxToMeter(finalPos)))*(1+Math.abs(this.speed-closestVeh.veh.speed));
                        //view.testLine(startPos);
                        //view.testLine2(finalPos);
                    } else{
                        acceleration = this.accelerationFactor;
                    }
                    
                    if(this.roadSide*this.getBottomPos() < this.roadSide*closestVeh.veh.getTopPos()+this.roadSide*px(150)){
                        finalSpeed = finalSpeed-1 >= 0 ? finalSpeed-1 : 0;
                        this.changeSpeed(finalSpeed);
                        //this.section = (this.roadSide*closestVeh.veh.getTopPos()+this.roadSide*px(300))*SCALE;
                    } else{
                        this.changeSpeed(finalSpeed, acceleration);
                    }
                    //if(this.speed < 0) console.log("NEGATIVE - UNDER");
                }
                
                
                
                // if(relativeSpeed < -1){
                //     var veh = this;
                //     setTimeout(function(){
                //         veh.changeSpeed(veh.preferredSpeed, veh.accelerationFactor);
                //     },1000);
                // }
                // if(Math.floor(this.speed/10)*10 == Math.floor(closestVeh.veh.speed/10)*10 && currentPos*this.roadSide < this.roadSide*finalPos){
                //     finalSpeed = Math.sqrt(2*this.accelerationFactor*(pxToMeter(finalPos)-pxToMeter(currentPos))+Math.pow(this.speed,2));
                //     this.changeSpeed(finalSpeed, this.accelerationFactor);
                //     if(isNaN(finalSpeed)){
                //         console.log(pxToMeter(currentPos)+" vs "+pxToMeter(finalPos)+" vs"+this.speed);
                //     }
                // }
            }


            // for(veh in nearbyVehicles){
            //     var nearbyVeh = nearbyVehicles[veh];
            //     var laneFreeSpace = this.roadSide*((d['lane']-px(nearbyVeh.veh.width)));
                
            //     var isNearbyVehicleInDangerZone = (nearbyVeh.veh.getLeftPos()-laneFreeSpace <= this.roadSide*this.getRightPos()) || (nearbyVeh.veh.getRightPos()+laneFreeSpace >= this.roadSide*this.getLeftPos());
            //     var isNearbyVehicleInFront = nearbyVeh.veh.section*this.roadSide < this.section*this.roadSide;
            //     // if(px(nearbyVeh.distance) <= d['defFrontDistanceKeeping']*this.distanceKeepingFactor && nearbyVeh.angle < 10 && nearbyVeh.veh.section*this.roadSide < this.section*this.roadSide && this.speed > 0){
            //     //     this.speed = this.speed-1;
            //     //     console.log("speed changed");
            //     // } else if(this.speed < this.preferredSpeed){
            //     //     this.speed = this.speed+1;
            //     // }
                
            //     // If vehicle of interest (on same lane or while changing the lane)
            //     if(isNearbyVehicleInDangerZone){
            //         var relativeSpeed = this.speed-nearbyVeh.veh.speed;
            //         if(isNearbyVehicleInFront && relativeSpeed > 0){ // If vehicle is on the front and is slower than me
            //             // Do prediction
            //             var startSpeed = this.speed; // V0
            //             var finalSpeed = nearbyVeh.veh.speed; // V
            //             var currentPos = px(this.section);
            //             var finalPos = nearbyVeh.veh.getBottomPos()+this.roadSide*px(d['defFrontDistanceKeeping']*this.speed*100)*this.distanceKeepingFactor; // r
            //             //console.log(finalPos);
            //             //var acceleration = (this.accelerationFactor*1000)/36; // a
            //             var acceleration = this.accelerationFactor; // a
                        
            //             var timeSteps = (((startSpeed-finalSpeed)/acceleration)*60)/simulationSpeed; // t
            //             var startPos; // r0
                        
            //             startPos = meterToPx(pxToMeter(finalPos)-this.roadSide*(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*acceleration));
                        
            //             // If too big difference and there is a space in the front and risk factor > 0.5 then overtake
            //             var isNotOvertaking = typeof this.states["Overtake"] == "undefined";
            //             var isTimeToAct = this.roadSide*Math.floor(startPos) >= this.roadSide*Math.floor(currentPos) && isNotOvertaking;
            //             var isOtherVehTooSlow = this.speed >= this.speedOvertakeFactor*nearbyVeh.veh.speed;
            //             var closestDistance = motorway.getHeight();
            //             var closestVeh;
            //             for(var vv in nearbyVeh.veh.nearbyVehicles){ // For each neighbour of the neighbour
            //                 var vehVeh = nearbyVeh.veh.nearbyVehicles[vv];
            //                 var isInFront = vehVeh.veh.section*this.roadSide < nearbyVeh.veh.section*this.roadSide;
            //                 if(isInFront && vehVeh.lane == nearbyVeh.lane){
            //                     var dist = Math.abs(vehVeh.section-nearbyVeh.section);
            //                     if(dist < closestDistance){
            //                         closestDistance = dist;
            //                         closestVeh = vehVeh;
            //                     }
            //                 }
            //             }
            //             var isThereIsSpaceInFront = closestDistance >= nearbyVeh.veh.getTopPos()+this.roadSide*px(d['defFrontDistanceKeeping']*this.speed*100)*this.distanceKeepingFactor;
            //             //console.log(this.x+" vs "+motorway.getLaneCenterPos(this.lane));
            //             if(isTimeToAct){
            //                 // Change acceleration if vehicle cannot make it
            //                 var predictFinalPos = meterToPx(pxToMeter(currentPos)+this.roadSide*(Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*acceleration));
            //                 if(this.roadSide*predictFinalPos < this.roadSide*finalPos){
            //                     acceleration = (Math.pow(finalSpeed,2)-Math.pow(startSpeed,2))/(2*(pxToMeter(currentPos)-pxToMeter(finalPos)));
            //                     //console.log("not make it, a = "+acceleration);
            //                 }
                            
            //                 // if(isOtherVehTooSlow && isThereIsSpaceInFront && Math.floor(this.x) == Math.floor(motorway.getLaneCenterPos(this.lane)) && this.lane !=motorway.lanesNo && this.lane != motorway.lanesNo+1){
            //                 //     //console.log("ACT NOW OVERTAKE");
            //                 //     if(isNotOvertaking){
            //                 //         //this.overtake(nearbyVeh, Math.abs(acceleration*10));
            //                 //     }
            //                 // } else {
            //                     //console.log("DistanceKeeper: Slowing down");
            //                     // if(this.type == "Boy Racer"){
            //                     //     alert("slowiung down");
            //                     // }
            //                     this.changeSpeed(finalSpeed, Math.abs(acceleration));
            //                 //}
            //             }
            //         }
            //     }
            // }
            
            // Go to junction 
            var isDestinationJunction = this.destination != 0;
            if(isDestinationJunction){
                var destJunction = this.getDestinationJunction();
                var isAtJunctionStart = this.roadSide*this.section <= this.roadSide*(destJunction.position*100000+this.roadSide*(30000));
                var isNotEnteringJunction = typeof this.states['EnterJunction'] == "undefined";
                if(isAtJunctionStart && isNotEnteringJunction){
                    //console.log("ENTERING JUNCTION...");
                    this.enterJunction();
                }
            }
            
            // Progress vehicle
            this.section = this.section-simulationSpeed*(this.roadSide*SCALE*cmPerFrame*Math.cos(angleRad));
            this.x = this.x+simulationSpeed*(this.roadSide*cmPerFrame*Math.sin(angleRad));
        }
    }
     this.initVehicle();   
}