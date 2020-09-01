class CreatorController{
    static listenCreator(){
        // START PAGE
        $(".welcomeScreenButton").click(function(){
            CreatorController.transition("welcomeScreen","motorwayLength");
        });
        
        // MOTORWAY LENGTH
        $(".motorwayLengthButton").click(function(){
            var input = $("#motorwayLengthInputField");
            if(input.val() >= 0.8 && input.val() <= 50){
                params.motorwayLength = input.val();
                CreatorController.transition("motorwayLength","lanesNoSelect");
            } else{
                CreatorController.throwInputError(E.C_MOTORWAY_LENGTH, input);
            }
        });
        
        // LANES NO SELECT
        $(".motorwayLanesNoButton").click(function(){
            var input = $("#motorwayLanesNoInputField");
            if(input.val() >= 2 && input.val() <= 12 && input.val() == Math.floor(input.val())){
                params.lanesNo = input.val();
                CreatorController.transition("lanesNoSelect","junctionsNoSelect");
            } else{
                CreatorController.throwInputError(E.C_MOTORWAY_LANES_NO, input);
            }
        });
        
        // JUNCTIONS NUMBER
        $(".junctionsNoButton").click(function(){
            var input = $("#junctionsNoInputField");
            if(input.val() > 0 && params.motorwayLength/input.val() >= 0.6 && input.val() == Math.floor(input.val())){
                params.junctionsNo = input.val();
                CreatorController.transition("junctionsNoSelect","junctionsPosSelect");
                CreatorController.junctionsPosListener();
            } else if(input.val() == 0){
                params.junctionsNo = 0;
                CreatorController.transition("junctionsNoSelect","distrSelect");
                CreatorController.distrListener();
            } else if(params.motorwayLength/input.val() <= 0.6 && input.val() > 0){
                CreatorController.throwInputError(E.C_JUNCTIONS_NO_NOSPACE, input);
            } else if(input.val() != Math.floor(input.val())){
                CreatorController.throwInputError(E.C_JUNCTIONS_NO_RATIONAL, input);
            } else{
                CreatorController.throwInputError(E.C_JUNCTIONS_NO_NEGATIVE, input);
            }
        });
        
    }
    static throwInputError(message, inputFocus){
        if(typeof inputFocus != "undefined"){
            inputFocus.focus();
        }
        $(".errorMessage p").html(message);
        $(".errorMessage").css("display","flex");
    }
    static transition(from, to){
        $("."+from).hide();
        $(".errorMessage").hide();
        $("."+to).css("display", "flex");
    }
    static junctionsPosListener(){
        var junctionsPos = new Array();
        for(var i=0; i<params.junctionsNo; i++){
            $(".junctionInputs").append('\
            <div class="motorwayLengthInput">\
                <input type="number" class="junctionsPosInputField" id="junctionsPosInputField_'+(i+1)+'" data-junction-id="'+(i+1)+'" min="0" max="'+params.motorwayLength+'" placeholder="J'+(i+1)+'" />\
            </div>\
            ');
        }
        $(".legend .km.end").html("km "+params.motorwayLength);
        $(".junctionsPosInputField").on("change", function(){
            
            var input = parseFloat($(this).val(),10);
            var junctionID = $(this).attr("data-junction-id");
            // Check if in limits
            if(input >= 0.4 && input <= params.motorwayLength-0.4){
                // Check if there is no established other junctions around
                var collision = false;
                for(var i=0; i<junctionsPos.length; i++){
                    //console.log(junctionsPos[i]+" != -1 && ("+(input+0.3)+" > "+(junctionsPos[i]-0.3)+" || "+(input-0.3)+" < "+(junctionsPos[i]+0.3)+") && "+(junctionID-1)+" != "+i);
                    if(junctionsPos[i] != -1 && (input+0.3 > junctionsPos[i]-0.3 && input-0.3 < junctionsPos[i]+0.3) && junctionID-1 != i){
                        collision = true;
                        break;
                    }
                } 
                if(!collision){
                    if(this.value != Math.floor(this.value)){
                        this.value = parseFloat(this.value, 10).toFixed(1);
                    }
                    junctionsPos[junctionID-1] = parseFloat(this.value,10);
                    var pxPos = (this.value*500)/params.motorwayLength;
                    $(".errorMessage").hide();
                    if($("#J"+junctionID).length){
                        var width = $("#J"+junctionID).width();
                        $("#J"+junctionID).css("left", (pxPos-(width/2))+"px");
                    } else{
                        var junc = document.createElement("div");
                        $(junc).attr("id","J"+junctionID);
                        $(junc).attr("data-junction-id", junctionID)
                        $(junc).addClass("j");
                        $(junc).html("J"+junctionID);
                        $(".arrow").append(junc);
                        var width = $("#J"+junctionID).width();
                        $(junc).css("left", (pxPos-(width/2))+"px");
                        //$(".arrow").append('<div class="j" data-junction-id="'+junctionID+'" id="J+'+junctionID+'" style="left: '+(pxPos-25)+"px"+'">J'+junctionID+'</div>');
                    }
                } else{
                    this.value = "";
                    junctionsPos[junctionID-1] = -1;
                    CreatorController.throwInputError(E.C_JUNCTIONS_POS_COLLISION, $("#junctionsPosInputField_"+junctionID));
                    $("#J"+junctionID).remove();
                }
            } else{
                this.value = "";
                junctionsPos[junctionID-1] = -1;
                CreatorController.throwInputError(E.C_JUNCTIONS_POS_OUTSIDE, $("#junctionsPosInputField_"+junctionID));
                $("#J"+junctionID).remove();
            }
        });
        
        $(".junctionsPosButton").click(function(){
            var allJunctions  = true;
            var collision = false;
            var outside = false;
            if(junctionsPos.length == params.junctionsNo){
                for(var i=0; i<junctionsPos.length; i++){
                    var input1 = parseFloat(junctionsPos[i],10);
                    if(junctionsPos[i] >= 0.4 && junctionsPos[i] <= params.motorwayLength-0.4){
                        for(var j=0; j<junctionsPos.length; j++){
                            var input2 = parseFloat(junctionsPos[j],10);
                            if(input2 != -1 && (input1+0.3 > input2-0.3 && input1-0.3 < input2+0.3) && i != j){
                                collision = true;
                                CreatorController.throwInputError(E.C_JUNCTIONS_POS_COLLISION, $("#junctionsPosInputField_"+(i+1)));
                                break;
                            }
                        }
                        if(collision == true){
                            break;
                        }
                    } else{
                        outside = true;
                        CreatorController.throwInputError(E.C_JUNCTIONS_POS_OUTSIDE, $("#junctionsPosInputField_"+(i+1)));
                        break;
                    }
                }
            } else{
                allJunctions = false;
                CreatorController.throwInputError(E.C_JUNCTIONS_POS_NOTALL);
            }
            
            if(allJunctions && !collision && !outside){
                params.junctionsPos = junctionsPos.sort(function(a, b){return a - b});
                console.log(junctionsPos);
                CreatorController.transition("junctionsPosSelect","distrSelect");
                CreatorController.distrListener();
            }

        });
    }
    
    static distrListener(){
        var vehDistrIn = new Array(parseInt(params.junctionsNo,10)+2);
        var vehDistrOut = new Array(parseInt(params.junctionsNo,10)+2);
        for(var i=0; i<parseInt(params.junctionsNo,10)+2; i++){
            vehDistrIn[i] = 0;
            vehDistrOut[i] = 0;
        }
        $(".distrList").append('\
        <div class="distr">\
          <div class="icon"><img src="img/motorway.png" alt="icon" /></div>\
          <div class="forms">\
            <div class="name">Motorway North End</div>\
            <div class="inputs">\
              <input type="number" data-id="0" data-flow="in" class="distrInput dst0_in" placeholder="In" min="0" max="100" />\
              <input type="number" data-id="0" data-flow="out" class="distrInput dst0_out" placeholder="Out" min="0" max="100" />\
            </div>\
          </div>\
        </div>\
        <div class="distr">\
          <div class="icon"><img src="img/motorway.png" alt="icon" /></div>\
          <div class="forms">\
            <div class="name">Motorway South End</div>\
            <div class="inputs">\
              <input type="number" data-id="1" data-flow="in" class="distrInput dst1_in" placeholder="In" min="0" max="100" />\
              <input type="number" data-id="1" data-flow="out" class="distrInput dst1_out" placeholder="Out" min="0" max="100" />\
            </div>\
          </div>\
        </div>');
        for(var i=0; i<parseInt(params.junctionsNo,10); i++){
            $(".distrList").append('\
            <div class="distr">\
              <div class="icon"><img src="img/junctions.png" alt="icon" /></div>\
              <div class="forms">\
                <div class="name">Junction '+(i+1)+' @ '+params.junctionsPos[i]+'km</div>\
                <div class="inputs">\
                  <input type="number" data-id="'+(i+2)+'" data-flow="in" class="distrInput dst'+(i+2)+'_in" placeholder="In" min="0" max="100" />\
                  <input type="number" data-id="'+(i+2)+'" data-flow="out" class="distrInput dst'+(i+2)+'_out" placeholder="Out" min="0" max="100" />\
                </div>\
              </div>\
            </div>\
        ');
        }
        
        $(".distrInput").on("change", function(){
            var input = $(this);
            var inputID = $(this).attr("data-id");
            var flow = $(this).attr("data-flow");
            var distrArray = flow == "in" ? vehDistrIn : vehDistrOut;
            var inputVal = parseInt($(this).val(),10);
            if(inputVal <= 100 && inputVal >= 0){
                // Check if sum under 100
                var sum = 0;
                for(var i=0; i<parseInt(params.junctionsNo,10)+2; i++){
                    if(i != inputID){
                        sum = sum+distrArray[i];
                        $(".errorMessage").hide();
                    }
                }
                if(sum+inputVal <= 100){
                    distrArray[inputID] = inputVal;
                } else{
                    this.value = "";
                    CreatorController.throwInputError(E.C_DISTR_OVER100, input);
                }
            } else{
                this.value = "";
                CreatorController.throwInputError(E.C_DISTR_OUTOFBOUNDS, input);
            }
        });
        
        $(".distrButton").click(function(){
            var empty = false;
            var under100 = false;
            var sumIn = 0;
            var sumOut = 0;
            for(var i=0; i<parseInt(params.junctionsNo,10)+2; i++){
                if($(".dst"+i+"_in").val() == ""){
                    empty = true;
                    CreatorController.throwInputError(E.C_DISTR_NOTALL, $(".dst"+i+"_in"));
                    break;
                }
                if($(".dst"+i+"_out").val() == ""){
                    empty = true;
                    CreatorController.throwInputError(E.C_DISTR_NOTALL, $(".dst"+i+"_out"));
                    break;
                }
                            console.log(sumIn+" "+sumOut);
                sumIn = sumIn+parseInt($(".dst"+i+"_in").val(),10);
                sumOut = sumOut+parseInt($(".dst"+i+"_out").val(),10);
            }
            if(sumIn != 100 || sumOut != 100){
                under100 = true;
                CreatorController.throwInputError(E.C_DISTR_OVER100);
            }
            if(!empty && !under100){
                params.vehDistrIn = vehDistrIn;
                params.vehDistrOut = vehDistrOut;
                $(".motorwayCreator").hide();
                $(".simulator").show();
                initSimulator();
            }
        });
    }
}