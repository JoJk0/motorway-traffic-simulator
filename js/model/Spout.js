class Spout{
    constructor(vehsPerHour){
        this.vehsPerHour = vehsPerHour;
        this.ticker = 0;
        
        // Get distribution
        this.inDistribution = new Array(junctions.length+1);
        this.outDistribution = new Array(junctions.length+1);
        
        this.inDistribution[0] = motorway.distrNorthIn;
        this.inDistribution[1] = motorway.distrSouthIn;
        this.outDistribution[0] = motorway.distrNorthOut;
        this.outDistribution[1] = motorway.distrSouthOut;
        
        this.lastVeh = new Array(junctions.length+1);
        
        var i,j;
        for(i = 0,j = 2; i<junctions.length; i++,j=j+2){
            this.inDistribution[j] = junctions[i].distrNorthIn;
            this.inDistribution[j+1] = junctions[i].distrSouthIn;
            this.outDistribution[j] = junctions[i].distrNorthOut;
            this.outDistribution[j+1] = junctions[i].distrSouthOut;
        }
    }
    get vehsPerHour(){
        return this._vehsPerHour;
    }
    set vehsPerHour(val){
        this._vehsPerHour = val;
    }
    
    trigger(vehicle){
        
        var vehNo = vehicles.length;
        var vehPoss = this.randomizeVehPos();
        // Decide about the vehicle type
        //console.log("New Vehicle("+vehicle+","+vehPoss.in+","+vehPoss.out+","+vehPoss.lane+")");
        vehicles[(vehNo)] = new Vehicle(vehicle, vehPoss.in, vehPoss.out, vehPoss.lane);

            //vehicles[(vehNo)] = new Vehicle(vehicle, 0, 0, vehPoss.lane);
        
    }
    
    randomizeVehPos(){
         // Choose entrance by picking number from 0 to 100
            var random = (Math.floor(Math.random()*Math.floor(100)))/100;
            var inDecision = 0;
            var pointerFrom = 0;
            var pointerTo = this.inDistribution[0];
            for(var i=0; i<this.inDistribution.length; i++){
                if((random >= pointerFrom && random < pointerTo) || (pointerTo == 1 && random >= pointerFrom && random <= 1)){
                    inDecision = i;
                    break;
                } else{
                    pointerFrom = pointerTo;
                    pointerTo = Math.round((pointerTo+this.inDistribution[i+1])*100)/100;
                }
            }
            
            //Choose allowed exit of the route
            var outDecision = 0;
            var ifNorth = (inDecision%2 == 0 && ((outDecision < inDecision) || outDecision == 0));
            var ifSouth = (inDecision%2 != 0 && ((outDecision > inDecision) || outDecision == 1));
            var limit = 0;
            do{
                random = (Math.floor(Math.random()*Math.floor(100)))/100;
                pointerFrom = 0;
                pointerTo = this.outDistribution[0];
            
                for(var i=0; i<this.outDistribution.length; i++){
                    if((random >= pointerFrom && random < pointerTo) || (pointerTo == 1 && random >= pointerFrom && random <= 1)){
                        outDecision = i;
                        break;
                    } else{
                        pointerFrom = pointerTo;
                        pointerTo = Math.round((pointerTo+this.outDistribution[i+1])*100)/100;
                    }
                }
                limit++;
            } while(limit < 100 && !(inDecision%2 == outDecision%2 && ((inDecision%2 == 0 && ((outDecision < inDecision) || outDecision == 0)) || (inDecision%2 != 0 && ((outDecision > inDecision) || outDecision == 1)))));
            //console.log("Final pair = ("+inDecision+", "+outDecision+")");
            
            // Choose allowed lane if starting on motorway
            var laneDecision = -1;
            if(inDecision == 0 || inDecision == 1){ 
                random = (Math.floor(Math.random()*Math.floor(100)))/100;
                var laneFreq = new Array(); // Generate frequencies with first lane having twice as much traffic as last lane
                var sum = 1;
                laneFreq[motorway.lanesNo-1] = 1;
                for(var j = motorway.lanesNo-2; j>=0; j--){
                    laneFreq[j] = laneFreq[j+1]+(1/(motorway.lanesNo-1));
                    sum = sum+laneFreq[j];
                }
                
                pointerFrom = 0;
                pointerTo = Math.round((laneFreq[0]/sum)*100)/100;
                for(i=0;i<laneFreq.length;i++){
                    if(i == laneFreq.length-1){
                        pointerTo = 1;
                    }
                    //console.log("<"+pointerFrom+","+pointerTo+">");
                    if((random >= pointerFrom && random < pointerTo) || (pointerTo == 1 && random >= pointerFrom && random <= 1)){
                        laneDecision = i+1;
                        //console.log("Lane decided: "+laneDecision+" as "+random+" in <"+pointerFrom+","+pointerTo+">");
                        break;
                    } else{
                        pointerFrom = pointerTo;
                        pointerTo = Math.round((pointerTo+(laneFreq[i+1]/sum))*100)/100;
                    }
                }
                if(inDecision == 1){
                    laneDecision = (motorway.lanesNo*2)+1-laneDecision;
                }
            } else if(inDecision%2 == 0){
                laneDecision = 0;
            } else if(inDecision%2 == 1){
                laneDecision = (motorway.lanesNo*2)+1;
            }
            
            //Convert entrance/exit IDs for junctions/motorways
            inDecision = Math.floor(inDecision/2);
            outDecision = Math.floor(outDecision/2);
            
            return {
                in: inDecision,
                out: outDecision,
                lane: laneDecision
            };
    }
    generateVehiclesLoop(){
        
        var genPeriod = ((3600*60)/this._vehsPerHour)/simulationSpeed;
        
        if(this.ticker >= genPeriod){
            
            this.ticker = 0;
            var vehNo = vehicles.length;
            
            // Generate new vehicle
            var vehPoss = this.randomizeVehPos();
            
            // Decide about the vehicle type
            var vehRandom = Math.round(Math.random()*(allowedVehicles.length-1));
            //console.log("New Vehicle("+allowedVehicles[vehRandom].name+","+vehPoss.in+","+vehPoss.out+","+vehPoss.lane+")");
            if(vehPoss.out != 0 && vehPoss.in == 0){
                if(motorway.laneToRoadSide(vehPoss.lane) == 1){
                    vehPoss.lane = 1;
                } else{
                    vehPoss.lane = 6;
                }
            }
            if(typeof this.lastVeh[vehPoss.in] == "undefined" ||
            (motorway.laneToRoadSide(vehPoss.lane) == 1 && px(this.lastVeh[vehPoss.in].section) < motorway.getHeight()-px(2000)) ||
            (motorway.laneToRoadSide(vehPoss.lane) == -1 && px(this.lastVeh[vehPoss.in].section) > px(2000))){
                vehicles[(vehNo)] = new Vehicle(allowedVehicles[vehRandom].name, vehPoss.in, vehPoss.out, vehPoss.lane);
                this.lastVeh[vehPoss.in] = vehicles[vehNo];
            }

        
        }
        this.ticker++;
    }
}