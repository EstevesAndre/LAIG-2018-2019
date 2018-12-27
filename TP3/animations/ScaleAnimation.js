class ScaleAnimation extends Animation 
{
    constructor(time,controlScales, loop)
    {
        super(time, loop);
        this.controlScales = controlScales;
                
        this.totalScaleDiff = 0.0;
        this.scaleDiffPerVec = [];
        this.timeAtControlScale = [];

        this.updateVariables();
    };

    updateVariables()
    {
        for(let i = 0; i < this.controlScales.length - 1; i++)
        {
            let scaleDiff = Math.sqrt(
                Math.pow(this.controlScales[i+1][0] - this.controlScales[i][0],2) + 
                Math.pow(this.controlScales[i+1][1] - this.controlScales[i][1],2) + 
                Math.pow(this.controlScales[i+1][2] - this.controlScales[i][2],2)
            );

            this.scaleDiffPerVec[i] = scaleDiff;
            this.totalScaleDiff += scaleDiff;
        }
        
        this.timeAtControlScale[0] = 0;

        for(i = 1; i < this.controlScales.length; i++)
        {
            (this.totalScaleDiff != 0 ? 
                this.timeAtControlScale[i] =  this.timeAtControlScale[i-1] + (this.scaleDiffPerVec[i-1] / this.totalScaleDiff) * this.time :
                this.timeAtControlScale[i] =  this.timeAtControlScale[i-1] + this.time / (this.controlScales.length - 1));
        }        
    };

    getCurrentScale()
    {
        var scale = [];
        for(let i = 0; i < this.timeAtControlScale.length; i++)
        {
            if(this.timeAtControlScale[i] > this.timeElapsed)
            {
                let delta = (this.timeElapsed - this.timeAtControlScale[i-1]) / (this.timeAtControlScale[i] - this.timeAtControlScale[i-1]);
                scale[0] = this.controlScales[i-1][0] + (this.controlScales[i][0] - this.controlScales[i-1][0]) * delta;
                scale[1] = this.controlScales[i-1][1] + (this.controlScales[i][1] - this.controlScales[i-1][1]) * delta;
                scale[2] = this.controlScales[i-1][2] + (this.controlScales[i][2] - this.controlScales[i-1][2]) * delta;    
                
                break;                
            }
        }

        return scale;
    };

    apply(scene)
    {   
        let currentScale = this.getCurrentScale();
        scene.scale(currentScale[0],currentScale[1],currentScale[2]);
    };
};