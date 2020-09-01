/*global PIXI*/
/*global app*/
/*global px*/
/*global d*/
/* Motorway Traffic Simulator View drawer */
function View(SECTION_SIZE, SCALE){
    
    this.SECTION_SIZE = SECTION_SIZE;
    let motorwayContainer = new PIXI.Container();
    let laneClosureContainer = new PIXI.Container();
    let speedLimitContainer = new PIXI.Container();
    
    // Draws the motorway after giving the motorway and sections
    this.drawMotorway = function(motorway){
        
        // Draw the asphalt
        let asphalt = new PIXI.Graphics();
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        var motorwayHeight = px(motorway.mLength*100000);
        var motorwayCenteredPos = ((window.innerWidth*0.8)/2)-(motorwayWidth/2);
        asphalt.beginFill(0x51515e);
        asphalt.drawRect(motorwayCenteredPos, 0, motorwayWidth, motorwayHeight);
        motorwayContainer.addChild(asphalt);
        
        // Draw the outer lines
        let line = new PIXI.Graphics();
        motorwayContainer.addChild(line);
        line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+px(200), 0).lineTo(motorwayCenteredPos+px(200), motorwayHeight);
        line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+px(motorway.lanesNo*300+200), 0).lineTo(motorwayCenteredPos+px(motorway.lanesNo*300+200), motorwayHeight);
        line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+motorwayWidth-px(200)-px(motorway.lanesNo*300), 0).lineTo(motorwayCenteredPos+motorwayWidth-px(200)-px(motorway.lanesNo*300), motorwayHeight);
        line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+motorwayWidth-px(200), 0).lineTo(motorwayCenteredPos+motorwayWidth-px(200), motorwayHeight);
        
        // Draw the inner lines
        for(var i=1; i<motorway.lanesNo; i++){
            for(var j=0; j<motorwayHeight; j=j+150){
                line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+px(200+300*i), j).lineTo(motorwayCenteredPos+px(200+300*i), j+75);
                line.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+motorwayWidth-px(200+300*i), j).lineTo(motorwayCenteredPos+motorwayWidth-px(200+300*i), j+75);
            }
        }
        
    }
    
    // Draws the vehicle
    this.drawVehicle = function(vehicle, motorway){
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        var motorwayHeight = px(10*motorway.mLength*SECTION_SIZE);
        var motorwayCenteredPos = ((window.innerWidth*0.8)/2)-(motorwayWidth/2);
        
        var res;
        
        var veh;
        if(vehicle.view == 0){
            
            res = this.getTexture(vehicle.type);
            
            veh = new Sprite(resources[res].texture);
            veh.interactive = true;
            veh.buttonMode = true;
            vehicle.view = veh;
            veh.model = vehicle;
            panelController.listenVehicle(veh); // Init controller for this vehicle
        } else{
            veh = vehicle.view;
        }
        veh.vx = px(vehicle.height);
        veh.vy = px(vehicle.width);
        veh.width = px(vehicle.width);
        veh.height = px(vehicle.height);
        var vehRot = (veh.model.roadSide == 1) ? 0 : 180;
        veh.rotation = (vehRot+vehicle.angle)*Math.PI/180;
        veh.anchor.set(0.5,VEH_CENTRE_X);
        //var posX = motorwayCenteredPos+px(200+(vehicle.lane-1)*300+(300/2)-(vehicle.width/2));
        var posY = px(vehicle.section);
        veh.position.set(vehicle.x,posY);
        //Add the vehicle to the stage
        motorwayContainer.addChild(veh);
        
        // Tracer
        var tracer = false;
        if(tracer){
            var trace = new PIXI.Graphics();
            trace.beginFill(0x00ff00);
            trace.drawRect(vehicle.x, px(vehicle.section), 5, 5);
            motorwayContainer.addChild(trace);
            //trace.lineStyle(3, 0xff00ff).moveTo(vehicle.x, vehicle.section).lineTo(vehicle.x+1, vehicle.section+1);
        }
        
        return veh;
    }
    
    this.getTexture = function(type){
        var res;
        if(type == "Sunday Driver"){
              res = "img/sprites/sunday-driver.png";
            } else if(type == "Tailgater"){
              res = "img/sprites/tailgater.png";
            } else if(type == "Boy Racer"){
              res = "img/sprites/boy-racer.png";
            } else if(type == "Careful Driver"){
              res = "img/sprites/car.png";
            } else if(type == "Lorry"){
              res = "img/sprites/lorry.png";
            } else if(type == "Police"){
              res = "img/sprites/police-car.png";
            } else if(type == "Ambulance"){
              res = "img/sprites/ambulance.png";
            } else if(type == "Fire Brigade"){
              res = "img/sprites/fire.png";
            } else{
                console.log("ERROR: Unrecognized vehicle type: "+type)
            }
        return res;
    }
    
    this.deleteVehicle = function(view){
        motorwayContainer.removeChild(view);
    }
    
    // Draws the position
    this.drawIndicators = function(motorway){
        var motorwayHeight = motorway.mLength*100000;
        for(var i=10000; i<motorwayHeight; i=i+10000){
            this.drawKm(motorway, px(i), 0);
            this.drawKm(motorway, px(i), 1);
        }
    }
    
    this.drawKm = function(motorway, position, side){
        
        let bg = new PIXI.Graphics();
        let kmLabel = new PIXI.Text("km", {fontWeight: 300, fontFamily: "Roboto, Segoe UI, Open Sans, Arial", align: "center"});
        let km = new PIXI.Text((position*SCALE/100000).toFixed(1), {fontWeight: 100, fontFamily: "Roboto, Segoe UI, Open Sans, Arial", fontSize: "64px", fill: 0x1eb980, align: "center"});
        let arrow = new PIXI.Graphics();
        
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        var motorwayCenteredPos = ((window.innerWidth*0.8)/2)-(motorwayWidth/2);
        var rectWidth = px(150)+km.width;
        var rectHeight = km.height+kmLabel.height+px(50);
        var rectPosX;
        if(side == 1){
            rectPosX = motorwayCenteredPos+motorwayWidth+px(200);
        } else{
            rectPosX = motorwayCenteredPos-rectWidth-px(200);
        }
        var rectPosY = position-rectHeight/2;
        var rectRadius = px(50);
        
        bg.beginFill(0xffffff);
        bg.drawRoundedRect(rectPosX,rectPosY,rectWidth,rectHeight,rectRadius);
        kmLabel.anchor.set(0.5);
        kmLabel.setParent(bg);
        kmLabel.setTransform(rectPosX+(rectWidth/2),rectPosY+rectHeight*0.2);
        km.anchor.set(0.5);
        km.setParent(bg);
        km.setTransform(rectPosX+(rectWidth/2),rectPosY+rectHeight*0.6);
        
        // Draw arrow
        arrow.beginFill(0xffffff);
        if(side == 1){
            arrow.drawShape(new PIXI.Polygon(rectPosX+rectRadius*0.085,rectPosY+rectRadius*0.5,rectPosX+rectRadius*0.085,rectPosY+rectHeight-rectRadius*0.5,rectPosX-px(50),rectPosY+(rectHeight/2)));
        } else{
            arrow.drawShape(new PIXI.Polygon(rectPosX+rectWidth-rectRadius*0.085,rectPosY+rectRadius*0.5,rectPosX+rectWidth-rectRadius*0.085,rectPosY+rectHeight-rectRadius*0.5,rectPosX+rectWidth+px(50),rectPosY+(rectHeight/2)));
        }
        bg.addChild(arrow);
        
        motorwayContainer.addChild(bg);
        
    }
    
    // Draws the junction
    this.drawJunction = function(junction, motorway){
        
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        
        this.drawExit(junction,motorway,0,1,1,0);
        this.drawExit(junction,motorway,0,1,-1,1);
        this.drawExit(junction,motorway,motorwayWidth,-1,-1,2);
        this.drawExit(junction,motorway,motorwayWidth,-1,1,3);
        
    }
    
    this.drawExit = function(junction, motorway, tF, xR, yR, circleR){
        
        // X positions
        var motorwayWidth = px(2*200+2*motorway.lanesNo*300+100);
        var motorwayCenteredPos = ((window.innerWidth*0.8)/2)-(motorwayWidth/2);
        var motorwayRightEnd = motorwayCenteredPos+motorwayWidth;
        var junctionExitWidth = d['lane']+d['exitHardShoulder']*2;
        var junctionExitRadiusX = junction.getCircleCenterX(tF, xR);
        
        // Y positions
        var motorwayHeight = px(motorway.mLength*100000);
        var junctionPos = px(junction.position*100000)+yR*(d['lane']+2*d['exitHardShoulder'])/2;
        var junctionExitRadiusY = junction.getCircleCenterY(yR);
        
        var junctionStartAngle = junction.getStartAngle(circleR);
        var junctionEndAngle = junction.getEndAngle(circleR);
        
        // Draw exits
        // Draw an exit lane
        let asphaltLane = new PIXI.Graphics();
        asphaltLane.lineStyle(junctionExitWidth, 0x51515e);
        asphaltLane.arc(junctionExitRadiusX, junctionExitRadiusY,d['lane0Len'],junctionStartAngle,junctionEndAngle);
        asphaltLane.beginFill(0x51515a);
        asphaltLane.drawRect(motorwayCenteredPos+tF+xR*d['exitHardShoulder'], junctionExitRadiusY, xR*px(100), yR*d['lane0Len']);
        // Draw enterings 
        asphaltLane.moveTo(motorwayCenteredPos+tF-xR*(d['lane']-px(350)),junctionPos+yR*(d['lane0Len']*2)).quadraticCurveTo(motorwayCenteredPos+tF-xR*(d['lane']-px(350)),junctionPos+yR*(d['lane0Len']*2),motorwayCenteredPos+tF+xR*px(200),junctionPos+yR*(d['lane0Len']*2+d['exitExpand']));
        
        // Draw lines
        let asphaltLine = new PIXI.Graphics();
        let asphaltLine2 = new PIXI.Graphics();
        asphaltLine.lineStyle(3, 0xffffff);
        asphaltLine2.lineStyle(3, 0xffffff);
        asphaltLine.arc(junctionExitRadiusX, junctionExitRadiusY,d['lane0Len']-d['lane']/2,junctionStartAngle,junctionEndAngle);
        asphaltLine2.arc(junctionExitRadiusX, junctionExitRadiusY,d['lane0Len']+d['lane']/2,junctionStartAngle,junctionEndAngle);
        asphaltLine.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+tF-xR*px(100), junctionPos+yR*d['lane0Len']).lineTo(motorwayCenteredPos+tF-xR*px(100), junctionPos+yR*2*d['lane0Len']);
        asphaltLine.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+tF-xR*px(100), junctionPos+yR*d['lane0Len']*2).quadraticCurveTo(motorwayCenteredPos+tF-xR*px(100), junctionPos+yR*(d['lane0Len']*2+d['exitExpand']*0.25),motorwayCenteredPos+tF+xR*px(50), junctionPos+yR*(2*d['lane0Len']+d['exitExpand']/2));
        asphaltLine.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+tF+xR*px(50), junctionPos+yR*(2*d['lane0Len']+d['exitExpand']/2)).quadraticCurveTo(motorwayCenteredPos+tF+xR*px(200), junctionPos+yR*(2*d['lane0Len']+d['exitExpand']*0.75),motorwayCenteredPos+tF+xR*px(200), junctionPos+yR*(2*d['lane0Len']+d['exitExpand']));

        
        let asphaltStrippedLine = new PIXI.Graphics();
        for(var i=0; i<d['lane0Len']*SCALE+d['exitExpand']*SCALE;i = i+150){
            asphaltStrippedLine.lineStyle(3, 0xffffff).moveTo(motorwayCenteredPos+tF+xR*px(200), junctionPos+yR*(px(i)+d['lane0Len'])).lineTo(motorwayCenteredPos+tF+xR*px(200), junctionPos+yR*(px(i+75)+d['lane0Len']));
        }
        
        motorwayContainer.addChild(asphaltLane);
        motorwayContainer.addChild(asphaltLine);
        motorwayContainer.addChild(asphaltLine2);
        motorwayContainer.addChild(asphaltStrippedLine);
        
    }
    
    // Draws speed limits (needs to be adapted)
    this.drawSpeedLimits = function(){
        while(speedLimitContainer.children.length != 0){
            speedLimitContainer.removeChild(speedLimitContainer.children[0]);
        }
        motorwayContainer.removeChild(speedLimitContainer);
        // Find clusters
        var currentFrom = 0;
        var currentTo = -1;
        var currentSpeed = sections[0].speedLimit;
        for(var i=1; i<motorway.mLength*SECTION_SIZE; i++){
            var section = sections[i];
            if(section.speedLimit != currentSpeed){
                currentTo = i-1;
                if(currentSpeed != 0){
                    this.drawEndOfSpeedLimit(motorway.getCenteredPos()-px(900), px((currentFrom*10)+300), currentSpeed);
                    this.drawSpeedLimit(motorway.getCenteredPos()+motorway.getWidth()+px(900), px((currentFrom*10)+300), currentSpeed);
                    this.drawSpeedLimit(motorway.getCenteredPos()-px(900), px((currentTo*10)-300), currentSpeed);
                    this.drawEndOfSpeedLimit(motorway.getCenteredPos()+motorway.getWidth()+px(900), px((currentTo*10)-300), currentSpeed);
                }
                currentFrom = i;
                currentSpeed = section.speedLimit;
            } else{
                currentTo = i;
            }
        }
        if(currentSpeed != 0){
                    this.drawEndOfSpeedLimit(motorway.getCenteredPos()-px(900), px((currentFrom*10)+300), currentSpeed);
                    this.drawSpeedLimit(motorway.getCenteredPos()+motorway.getWidth()+px(900), px((currentFrom*10)+300), currentSpeed);
                    this.drawSpeedLimit(motorway.getCenteredPos()-px(900), px((currentTo*10)-300), currentSpeed);
                    this.drawEndOfSpeedLimit(motorway.getCenteredPos()+motorway.getWidth()+px(900), px((currentTo*10)-300), currentSpeed);
        }
        motorwayContainer.addChild(speedLimitContainer);
    }
    
    this.drawSpeedLimit = function(x, y, speed){
        var limit = new PIXI.Container;
        var circle = new PIXI.Graphics();
        var text = new PIXI.Text(speed, {fontWeight: 300, fontFamily: "Roboto, Segoe UI, Open Sans, Arial", align: "center", fontSize: "48px"});
        text.anchor.set(0.5);
        text.setTransform(x,y);
        circle.lineStyle(15, 0xef5350);
        circle.beginFill(0xffffff);
        circle.drawCircle(x,y,px(150));
        limit.addChild(circle);
        limit.addChild(text);
        speedLimitContainer.addChild(limit);
    }
    this.drawEndOfSpeedLimit = function(x, y, speed){
        var limit = new PIXI.Container;
        var circle = new PIXI.Graphics();
        var text = new PIXI.Text(speed, {fontWeight: 300, fontFamily: "Roboto, Segoe UI, Open Sans, Arial", align: "center", fontSize: "48px", fill: 0x909090});
        text.anchor.set(0.5);
        text.setTransform(x,y);
        circle.lineStyle(15, 0x909090);
        circle.beginFill(0xffffff);
        circle.drawCircle(x,y,px(150));
        limit.addChild(circle);
        limit.addChild(text);
        speedLimitContainer.addChild(limit);
    }
    // Draw lane closures
    this.drawLaneClosures = function(){
        
        for(var i=0; i<laneClosureContainer.children.length; i++){
            laneClosureContainer.removeChild(laneClosureContainer.children[i]);
        }
        motorwayContainer.removeChild(laneClosureContainer);
        //console.log(laneClosureContainer);
        var from = -1;
        var to = -1;
        //console.log(motorway.closedLanes);
        for(var i=0; i<motorway.closedLanes.length; i++){
            if(motorway.closedLanes[i] != -1){
                this.drawClosure(motorway.closedLanes[i].lane, motorway.closedLanes[i].from, motorway.closedLanes[i].to);
            }
            
        }
        motorwayContainer.addChild(laneClosureContainer);
        
    }
    this.drawClosure = function(lane, from, to){
        
        var getbX = function(t, p0X, p1X, p2X){
            return Math.pow(1-t,2)*p0X+2*(1-t)*t*p1X+Math.pow(t,2)*p2X;
        }
        
        let line = new PIXI.Graphics();
        let closure = new PIXI.Container();
        let rS = motorway.laneToRoadSide(lane);
        let dT = rS == 1 ? 0 : px(100);
        
        let closureLaneStartPosX = motorway.getCenteredPos()-px(100)+lane*d["lane"]+dT;
        let closureNextLaneStartPosX = motorway.getCenteredPos()-px(100)+(lane+1)*d["lane"]+dT;
        closure.addChild(line);
        
        // Find the side
        var side;
        if(motorway.laneToRoadSide(lane) == 1){
            side = -1;
        } else{
            side = 1;
        }
        //var side = 1; // -1 = right 1 = left
        var sideRight = side == 1 ? 0 : d["laneClosureEntrance"];
        var sideLeft = side == 1 ? d["laneClosureEntrance"] : 0;
        var curveLeft = side == 1 ? closureNextLaneStartPosX : closureLaneStartPosX;
        var curveRight = side == 1 ? closureLaneStartPosX : closureNextLaneStartPosX;
        
        // Main lines
        line.lineStyle(3, 0xFFC107).moveTo(closureLaneStartPosX, px(from)-sideLeft).lineTo(closureLaneStartPosX, px(to)+sideLeft);
        line.lineStyle(3, 0xFFC107).moveTo(closureNextLaneStartPosX, px(from)-sideRight).lineTo(closureNextLaneStartPosX, px(to)+sideRight);
        
        // Draw the top stripes
        var i = 0;
        while(i <= d["laneClosureEntrance"]/2){
            var tr = side == 1 ? 0 : px(400);
            var bX = getbX((i-tr)/(d["laneClosureEntrance"]/2), curveLeft, curveLeft, curveLeft-side*(d["lane"]/2));
            var cX = getbX(1-((i-tr)/(d["laneClosureEntrance"]/2)), curveRight, curveRight, curveLeft-side*(d["lane"]/2));
            var str = side*(curveRight+side*d["laneClosureGap"]) < side*(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX)) ? curveRight+side*d["laneClosureGap"] : curveLeft-side*d["laneClosureGap"]-(curveLeft-cX);
            var str2 = side*(curveRight+side*d["laneClosureGap"]) < side*(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX)) ? px(from)+px(100)-i+d["lane"]-(curveLeft-cX)-dd2-(d["laneClosureEntrance"]/2) : px(from)+px(100)-i+d["lane"]-(curveLeft-cX)-(d["laneClosureEntrance"]/2);
            
            var dd = curveRight+side*d["laneClosureGap"]-(curveLeft-side*d["laneClosureGap"]-(curveLeft-bX));
            var dd2 = curveRight+side*d["laneClosureGap"]-(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX));
            
            line.lineStyle(3, 0xFFC107).moveTo(curveLeft-side*d["laneClosureGap"]-(curveLeft-bX), px(from)-i+d["lane"]-(curveLeft-bX)).lineTo(curveRight+side*d["laneClosureGap"], px(from)-i+d["lane"]-(curveLeft-bX)-dd);
            line.lineStyle(3, 0xFFC107).moveTo(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX), px(from)+px(100)-i+d["lane"]-(curveLeft-cX)-(d["laneClosureEntrance"]/2)).lineTo(str, str2);

            i = i+px(100);
        }
        
        // Draw the mid stripes
        i = 0;
        while(i <= px(to-from)){
            i = i+px(100);
            var td = side == 1 ? 2*d["lane"] : 0;
            line.lineStyle(3, 0xFFC107).moveTo(curveLeft-side*d["laneClosureGap"], px(from)+i+side*d["laneClosureGap"]+d["lane"]).lineTo(curveRight+side*d["laneClosureGap"], px(from)+i-side*d["laneClosureGap"]+td);
        }
        //line.lineStyle(3, 0xFFC107).moveTo(closureLaneStartPosX+d["laneClosureGap"], px(from)).lineTo(closureNextLaneStartPosX-d["laneClosureGap"], px(from)+d["lane"]);
        
        // Draw the end stripes
        i = 0;
        while(i <= d["laneClosureEntrance"]/2){
            var tr = side == 1 ? px(300) : px(400);
            var bX = getbX(1-((i-tr)/(d["laneClosureEntrance"]/2)), curveLeft, curveLeft, curveLeft-side*(d["lane"]/2));
            var cX = getbX(((i-tr)/(d["laneClosureEntrance"]/2)), curveRight, curveRight, curveLeft-side*(d["lane"]/2));
            var str = side*(curveRight+side*d["laneClosureGap"]) < side*(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX)) ? curveRight+side*d["laneClosureGap"] : curveLeft-side*d["laneClosureGap"]-(curveLeft-cX);
            var str2 = side*(curveRight+side*d["laneClosureGap"]) < side*(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX)) ? px(to)+px(100)+(d["laneClosureEntrance"]/2)-i+d["lane"]-(curveLeft-cX)-dd2-(d["laneClosureEntrance"]/2) : px(to)+px(100)+(d["laneClosureEntrance"]/2)-i+d["lane"]-(curveLeft-cX)-(d["laneClosureEntrance"]/2);
            
            var dd = curveRight+side*d["laneClosureGap"]-(curveLeft-side*d["laneClosureGap"]-(curveLeft-bX));
            var dd2 = curveRight+side*d["laneClosureGap"]-(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX));
            
            line.lineStyle(3, 0xFFC107).moveTo(curveLeft-side*d["laneClosureGap"]-(curveLeft-bX), px(to)+(d["laneClosureEntrance"]/2)-i+d["lane"]-(curveLeft-bX)).lineTo(curveRight+side*d["laneClosureGap"], px(to)+(d["laneClosureEntrance"]/2)-i+d["lane"]-(curveLeft-bX)-dd);
            //line.lineStyle(3, 0xFFC107).moveTo(curveLeft-side*d["laneClosureGap"]-(curveLeft-cX), px(to)+px(100)+(d["laneClosureEntrance"]/2)-i+d["lane"]-(curveLeft-cX)-(d["laneClosureEntrance"]/2)).lineTo(str, str2);

            i = i+px(100);
        }
        
        // Top Ending lane curves
        line.lineStyle(3, 0xFFC107).moveTo(curveLeft, px(from)).quadraticCurveTo(curveLeft,  (px(from)-(d["laneClosureEntrance"]/4)), curveLeft-side*(d["lane"]/2), (px(from)-(d["laneClosureEntrance"]/2)));
        line.lineStyle(3, 0xFFC107).moveTo(curveRight, px(from)-d["laneClosureEntrance"]).quadraticCurveTo(curveRight,  (px(from)-(d[ "laneClosureEntrance"]*3/4)), curveLeft-side*(d["lane"]/2), (px(from)-(d["laneClosureEntrance"]/2)));
        
        line.lineStyle(3, 0xFFC107).moveTo(curveLeft, px(to)).quadraticCurveTo(curveLeft,  (px(to)+(d["laneClosureEntrance"]/4)), curveLeft-side*(d["lane"]/2), (px(to)+(d["laneClosureEntrance"]/2)));
        line.lineStyle(3, 0xFFC107).moveTo(curveRight, px(to)+d["laneClosureEntrance"]).quadraticCurveTo(curveRight,  (px(to)+(d[ "laneClosureEntrance"]*3/4)), curveLeft-side*(d["lane"]/2), (px(to)+(d["laneClosureEntrance"]/2)));
        

        //line.lineStyle(3, 0xFFC107).moveTo(closureLaneStartPosX, px(from)).quadraticCurveTo(200, 500, 300, 600);
        
        laneClosureContainer.addChild(closure);
        
    }
    
    this.testLine = function(finalPos){
                var line = new PIXI.Graphics();
                line.lineStyle(3, 0x0000ff).moveTo(motorway.getCenteredPos()+px(200), finalPos).lineTo(motorway.getCenteredPos()+motorway.getWidth()+px(200), finalPos);
                motorwayContainer.addChild(line);
    }
    this.testLine2 = function(finalPos){
                var line = new PIXI.Graphics();
                line.lineStyle(3, 0xff0000).moveTo(motorway.getCenteredPos()+px(200), finalPos).lineTo(motorway.getCenteredPos()+motorway.getWidth()+px(200), finalPos);
                motorwayContainer.addChild(line);
    }
    // Publish frame
    this.publish = function(){
        viewport.addChild(motorwayContainer);
    }
    
}
