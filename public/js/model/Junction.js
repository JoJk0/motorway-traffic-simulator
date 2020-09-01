function Junction(position, distrNorthIn, distrNorthOut, distrSouthIn, distrSouthOut){
    
    this.position = position;
    this.distrNorthIn = distrNorthIn;
    this.distrNorthOut = distrNorthOut;
    this.distrSouthIn = distrSouthIn;
    this.distrSouthOut = distrSouthOut;
    
    this.getCircleCenterX = function(tF, xR){
        return motorway.getCenteredPos()+tF-xR*(d['exitHardShoulder']+d['lane0Len']-px(100));
    }
    this.getCircleCenterY = function(yR){
        var junctionPos = px(this.position*100000)+yR*(d['lane']+2*d['exitHardShoulder'])/2;
        return junctionPos+yR*(d['lane0Len']);
    }
    this.getStartAngle = function(circleR){
        return (3+circleR)/2*Math.PI;
    }
    this.getEndAngle = function(circleR){
        return (circleR)/2*Math.PI;
    }
}