function PanelController(){
    
    this.throwError = function(selector, message){
        $(".error"+selector).css("display","flex");
        $(".error"+selector+" p").html(message);
    }
    
    this.listenPanel = function(){
        
        // Set values
        this.init();
        
        // START / PAUSE SIMULATION
        $(".playPause").click(function(){
            if($(this).children().html() == "pause"){
                $(this).children().html("play_arrow");
                simulationPause = true;
            } else{
                $(this).children().html("pause");
                simulationPause = false;
            }
        });
        
        // STOP SIMULATION
        $(".stop").click(function(){
            simulationPause = true;
            $(".mainPanel").hide();
            $(".statistics").css("display", "flex");
            $(".totalVehNo").html(vehicles.length);
            $(".currentVehNo").html(vehicles.length-deadCounter);
            $(".deadVehNo").html(deadCounter);
        
        });
        
        // RESTART SIMULATION
        $(".replay").click(function(){
            deadCounter = 0;
            for(var i=0; i<vehicles.length; i++){
                view.deleteVehicle(vehicles[i].view);
                delete vehicles[i];
            }
            vehicles.length = 0;
            simulationSpeed = 1;
            motorway.closedLanes.length = 0;
        });
        
        // SPEED SPLIDER
        $(".speedSlider").on("input",function(){
            simulationSpeed = ($(this).val()/16);
            $(".speedSliderCounter").html(Math.round(($(this).val()/16)*100)/100+"x");
        });
        
        // TRAFFIC FLOWS
        $(".inputTraffic").on("input",function(){
            if($(this).val() <= 50000){
                spout.vehsPerHour = $(this).val();
            } else{
                $(this).val(50000);
                spout.vehsPerHour = 50000;
            }
        });
        
        // EMERGENCY TRIGGER
        $(".trig.ambulance").click(function(){
            spout.trigger("Ambulance");
        });
        $(".trig.fire").click(function(){
            spout.trigger("Fire Brigade");
        });
        $(".trig.police").click(function(){
            spout.trigger("Police");
        });
        
        // ALLOWED VEHICLES
        $(".allowedVehiclesEntry").on("click",function(){
            var type = $(this).children(".name").html();
            var isCurrentlyAllowed = $(this).children(".material-icons").html() == "check_box";
            
            if(isCurrentlyAllowed){
                $(this).children(".material-icons").html("check_box_outline_blank");
                var index = allowedVehicles.findIndex(x => x.name == type);
                allowedVehicles.splice(index,1);
            } else{
                $(this).children(".material-icons").html("check_box");
                allowedVehicles.push({
                    name: type
                });
            }
        });
        
        // LANE CLOSURES
        $(".addLaneClosure").click(function(){
            $(".laneClosureAdd").css("display", "flex");
        });
        $(".laneClosureAddCancel").click(function(){
            $(".laneClosureAdd").css("display", "none");
            $(".laneClosureAddInputLane").val("");
            $(".laneClosureAddInputFrom").val("");
            $(".laneClosureAddInputTo").val("");
        });
        $(".laneClosureAddConfirm").click(function(){
            // Check if if range not out of bands
            var inputLane = parseInt($(".laneClosureAddInputLane").val(),10);
            var inputFrom = parseFloat($(".laneClosureAddInputFrom").val(),10);
            var inputTo = parseFloat($(".laneClosureAddInputTo").val(),10);
            
            if($(".laneClosureAddInputFrom").val() != "" && $(".laneClosureAddInputTo").val() != "" && $(".laneClosureAddInputLane").val() != ""){
                console.log({inputFrom, inputTo, inputLane});
                if(inputFrom >= 0 && inputFrom < motorway.mLength && inputTo > 0 && inputTo <= motorway.mLength && inputFrom < inputTo){
                    if(inputLane > 0 && inputLane <= motorway.lanesNo*2){
                        var closedLanesNo = motorway.closedLanes.length;
                        motorway.closedLanes[closedLanesNo] = {
                            lane: inputLane,
                            from: inputFrom*100000,
                            to: inputTo*100000
                        };
                        console.log(motorway.closedLanes);
                        $(".errorLaneClosure").hide();
                        $(".laneClosureAddCancel").click();
                        var closureEntry = document.createElement("div");
                        $(closureEntry).addClass("laneClosureEntry");
                        $(closureEntry).attr("id", "closure"+closedLanesNo);
                        var name = document.createElement("div");
                        $(name).addClass("name");
                        $(name).html('#'+inputLane+' @ '+inputFrom+' - '+inputTo+'km');
                        var materialIcons = document.createElement("i");
                        $(materialIcons).addClass("laneClosureDelete");
                        $(materialIcons).addClass("material-icons");
                        $(materialIcons).attr("id","closureDelete"+closedLanesNo);
                        $(materialIcons).attr("data-id",closedLanesNo);
                        $(materialIcons).html("clear");
                        $(closureEntry).append(name);
                        $(closureEntry).append(materialIcons);
                        $(".laneClosureList").append(closureEntry);
                        panelController.listenNewLaneClosure(materialIcons);
                        view.drawLaneClosures();
                        // $(".laneClosureList").append('\
                        // <div class="laneClosureEntry" id="closure'+closedLanesNo+'">\
                        //   <div class="name">#'+inputLane+' @ '+inputFrom+' - '+inputTo+'km</div>\
                        //   <i class="material-icons" class="laneClosureDelete" id="closureDelete'+closedLanesNo+'" data-id="'+closedLanesNo+'">clear</i>\
                        // </div>\
                        // ');
                    } else{
                        panelController.throwError("LaneClosure", E['P_LANECLOSURE_LANEOUTOFBOUNDS']);
                    }
                } else{
                    panelController.throwError("LaneClosure", E['P_LANECLOSURE_INPUTOUTOFBOUNDS']);
                }
            } else{
                panelController.throwError("LaneClosure", E['P_LANECLOSURE_EMPTYFIELDS']);
            }
        });
        
        // SPEED LIMITS
        $(".addSpeedLimit").click(function(){
            $(".speedLimitAdd").css("display", "flex");
        });
        $(".speedLimitAddCancel").click(function(){
            $(".speedLimitAdd").css("display", "none");
            $(".speedLimitAddInputSpeed").val("");
            $(".speedLimitAddInputFrom").val("");
            $(".speedLimitAddInputTo").val("");
        });
        $(".speedLimitAddConfirm").click(function(){
            // Check if if range not out of bands
            var inputSpeed = parseInt($(".speedLimitAddInputSpeed").val(),10);
            var inputFrom = parseFloat($(".speedLimitAddInputFrom").val(),10);
            var inputTo = parseFloat($(".speedLimitAddInputTo").val(),10);
            
            if($(".speedLimitAddInputFrom").val() != "" && $(".speedLimitAddInputTo").val() != "" && $(".speedLimitAddInputSpeed").val() != ""){
                console.log({inputFrom, inputTo, inputSpeed});
                if(inputFrom >= 0 && inputFrom < motorway.mLength && inputTo > 0 && inputTo <= motorway.mLength && inputFrom < inputTo){
                    if(inputSpeed > 0 && inputSpeed <= 255){
                        console.log(sections);
                        for(i = inputFrom*SECTION_SIZE; i<inputTo*SECTION_SIZE || (i == inputTo*SECTION_SIZE && inputTo*SECTION_SIZE != motorway.mLength*SECTION_SIZE); i++){
                            sections[i].speedLimit = inputSpeed;
                        }
                        $(".errorSpeedLimit").hide();
                        $(".speedLimitAddCancel").click();
                        panelController.listenSpeedLimits();
                        
                    } else{
                        panelController.throwError("SpeedLimit", E['P_SPEEDLIMIT_SPEEDOUTOFBOUNDS']);
                    }
                } else{
                    panelController.throwError("SpeedLimit", E['P_SPEEDLIMIT_INPUTOUTOFBOUNDS']);
                }
            } else{
                panelController.throwError("SpeedLimit", E['P_SPEEDLIMIT_EMPTYFIELDS']);
            }
        });
    }
    
    this.listenNewLaneClosure = function(element){
        $(".laneClosureDelete").click(function(){
            var deleteID = $(element).attr("data-id");
            motorway.closedLanes[deleteID] = -1;
            $("#closure"+deleteID).remove();
            view.drawLaneClosures();
        });
    }
    this.listenSpeedLimits = function(element){
        $(".speeds").html("");
        var currentFrom = 0;
        var currentTo = -1;
        var currentSpeed = sections[0].speedLimit;
        for(var i=1; i<motorway.mLength*SECTION_SIZE; i++){
            var section = sections[i];
            if(section.speedLimit != currentSpeed){
                currentTo = i-1;
                if(currentSpeed != 0){
                    panelController.listenNewSpeedLimit(currentSpeed, currentFrom, currentTo);
                }
                currentFrom = i;
                currentSpeed = section.speedLimit;
            } else{
                currentTo = i;
            }
        }
        if(currentSpeed != 0){
            panelController.listenNewSpeedLimit(currentSpeed, currentFrom, currentTo);
        }
        view.drawSpeedLimits();
    }
    this.listenNewSpeedLimit = function(speed, from, to){
        // $(".speeds").append('\
        // <div class="speedLimitEntry">\
        //   <div class="name">'+speed+'km/h @ '+(Math.round(from)/SECTION_SIZE)+' - '+(Math.round(to)/SECTION_SIZE)+'km</div>\
        //   <i class="material-icons" class="speedLimitDelete" data-from="'+from+'" data-to="'+to+'">clear</i>\
        // </div>\
        // ');
        
        var entry = document.createElement("div");
        $(entry).addClass("speedLimitEntry");
        var name = document.createElement("div");
        $(name).addClass("name");
        $(name).html(speed+'km/h @ '+(Math.round(from)/SECTION_SIZE)+' - '+(Math.round(to)/SECTION_SIZE)+'km');
        var deleter = document.createElement("i");
        $(deleter).addClass("material-icons");
        $(deleter).addClass("speedLimitDelete");
        $(deleter).attr("data-from", from);
        $(deleter).attr("data-to", to)
        $(deleter).html("clear");
        $(entry).append(name);
        $(entry).append(deleter);
        $(".speeds").append(entry);
        
        $(".speedLimitDelete").click(function(){
            var inFrom = $(this).attr("data-from");
            var inTo = $(this).attr("data-to");
            for(var i=inFrom; i<inTo || (i == inTo && inTo != motorway.mLength*SECTION_SIZE); i++){
                sections[i].speedLimit = 0;
            }
            panelController.listenSpeedLimits();
            
        });
    }
    this.listenInspector = function(){
        
    }
    
    this.init = function(){
        
        // TRAFFIC FLOWS
        $(".inputTraffic").val(spout.vehsPerHour);
        
        // ALLOWED VEHICLES
        
    }
    
    this.listenVehicle = function(vehicleSprite){

        vehicleSprite.on('click', (event) => {
            var vehicle = event.target.model;
            _inspectorMode = vehicle;
            this.showVehInfo(vehicle);
            this.listenVehPanel(vehicle);
        });
    }
    
    this.listenVehPanel = function(vehicle){
        $(".typeSelector").on("input",function(){
            vehicle.setType($(".typeSelector").val());
            console.log(vehicle);
            vehicle.view.texture = resources[view.getTexture(vehicle.type)].texture;
        });
        $(".speedChanger").on("input",function(){
            vehicle.speedOverriden = true;
            vehicle.changeSpeed(($(".speedChanger").val())/3.6, vehicle.accelerationFactor);
        });
        $(".backButton").on("click", function(){
            _inspectorMode = false;
            $(".vehInspector").hide();
            $(".mainPanel").css("display","flex");
        });
        $(".deleteButton").on("click", function(){
            view.deleteVehicle(vehicle.view);
            vehicle.dead = true;
            deadCounter++;
            $(".backButton").click();
        })
    }
    
    this.showVehInfo = function(vehicle){
        
        $(".mainPanel").hide();
        $(".vehInspector").css("display","flex");
        
        $(".totalVehNo").html(vehicles.length);
        $(".currentVehNo").html(vehicles.length-deadCounter);
        $(".deadVehNo").html(deadCounter);
        
        if(vehicle.dead == true){
            $(".deleteButton").click();
        }
        
        // Vehicle type
        var typeSelector = $(".typeSelector");
        for(var i=0; i<VEH_TYPE_NO; i++){
            var n = typeSelector.children().eq(i);
            if(n.val() == vehicle.type){
                n.attr("selected","selected");
            } else{
                n.removeAttr("selected");
            }
        }
        
        // Speed
        var speedChanger = $(".speedChanger");
        if(!speedChanger.is(":focus")){
            speedChanger.val(kph(vehicle.speed).toFixed(1));
        }
        
        $(".propOrigin").html(vehicle.origin);
        $(".propDestination").html(vehicle.destination);
        // $(".vehInspector").append("<br>Speed: "+kph(vehicle.speed));
        $(".propLane").html("#"+vehicle.lane);
        $(".propAngle").html(vehicle.angle+"deg");
        $(".propPos").html("km "+((vehicle.section)/100000).toFixed(2));
        $(".propDead").html(vehicle.dead);
        // $(".vehInspector").append("<br><br>new Vehicle(\""+vehicle.type+"\","+vehicle.origin+","+vehicle.destination+","+vehicle.startLane+");<br>");
        // for(veh in vehicle.nearbyVehicles){
        //     $(".vehInspector").append("<br>Nearby Vehicles: "+vehicle.nearbyVehicles[veh].veh.type+" | "+((vehicle.nearbyVehicles[veh].distance)/100).toFixed(2)+"m | "+vehicle.nearbyVehicles[veh].angle.toFixed(1)+"deg");
        //     $(".vehInspector").append("<br>AB: "+((vehicle.nearbyVehicles[veh].distance)/100).toFixed(2)+"m<br>AC: "+(Math.sqrt(Math.pow(vehicle.section-vehicle.nearbyVehicles[veh].veh.section,2))/100).toFixed(2)+"m<br>");
        // }
    }
}