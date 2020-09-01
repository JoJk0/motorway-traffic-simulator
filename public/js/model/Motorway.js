/* Motorway Traffic Simulator Motorway class */
function Motorway(lanesNo, mLength, ruleOfWay, distrNorthIn, distrNorthOut, distrSouthIn, distrSouthOut){
  
    this.lanesNo = lanesNo;
    this.mLength = mLength;
    this.ruleOfWay = ruleOfWay;    
    this.distrNorthIn = distrNorthIn;
    this.distrNorthOut = distrNorthOut;
    this.distrSouthIn = distrSouthIn;
    this.distrSouthOut = distrSouthOut;
    this.closedLanes = new Array();
    this.speedLimits = new Array();
    
    this.getWidth = function(){
        return px(2*200+2*this.lanesNo*300+100);
    }
    this.getHeight = function(){
        return px(motorway.mLength*100000);
    }
    this.getCenteredPos = function(){
        return ((window.innerWidth*0.8)/2)-(this.getWidth()/2);
    }
    // Covert lane to road side
    this.laneToRoadSide = function(lane){
        if(lane == 0){
            return 1;
        } else if(lane == this.lanesNo+1){
            return -1;
        } else{
            return (lane <= this.lanesNo ? 1 : -1);
        }
    }
    this.getLaneCenterPos = function(lane){
        var l = this.laneToRoadSide(lane);
        var t = 0;
        var t2 = 0;
        if(l == -1){
            t = this.getWidth();
            t2 = (this.lanesNo*2)+1;
        }
        //console.log("Motorway: "+this.getCenteredPos()+" "+t+" "+l+" "+d["hardShoulder"]+" "+this.lanesNo+" "+lane);
        if(lane == 0){
            return this.getCenteredPos()+d["hardShoulder"]-(d["lane"]/2);
        } else{
            //console.log("Center pos for lane "+lane+" is "+this.getCenteredPos()+t+l*(d["hardShoulder"]-(d["lane"]/2)+(((this.lanesNo*2)+1-lane)*d["lane"])));
            return this.getCenteredPos()+t+l*(d["hardShoulder"]-(d["lane"]/2)+((t2+l*lane)*d["lane"]));
        }
        
    }
    
}