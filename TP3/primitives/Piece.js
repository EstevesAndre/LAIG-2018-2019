class Piece extends CGFobject 
{
    constructor(scene, name, size, texture, textureP1, textureP2, X, Y)
    {
        super(scene);

        this.name = name;
        this.size = size;
        this.texture = texture;
        this.textureP1 = textureP1;
        this.textureP1 = textureP1;
        this.textureP2 = textureP2;
        this.X = X;
        this.Y = Y;

        this.captured = false;

        this.pins = [];

        this.struct = new Box(scene, this.size, this.size, 0.2);

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.texture);

        this.isMoving = false;
        this.animation = null;
        this.capturedAnimation = null;

        this.selectionAnimations = null;

        this.pieceSelected = new SelectedSquare(this.scene, this.size * 1.05, this.size);
        
        this.isForSelection = false;
        
        this.createPins();
    };

    createSelectAnimations()
    {
        this.selectionAnimations = [new LinearAnimation(3.5, [ [0,0,0], [0,0,0.075], [0,0,0] ], true),
                                    new LinearAnimation(3.5, [ [0,0,0], [0,0,0.075], [0,0,0] ], true, 0.1),
                                    new LinearAnimation(3.5, [ [0,0,0], [0,0,0.075], [0,0,0] ], true, 0.2)
                                    ];
    };

    createPins()
    {        
        let space = this.size * 0.9 / 50;

        var tmhX = this.size * 0.9/5 - space;
        var tmhY = this.size * 0.9/5 - space;    
        
        for(let i = -this.size * 0.9 / 2.0, i_iter = 1; i < this.size * 0.9 / 2.0 - 0.0005; i += tmhY + space, i_iter++)
        {
            let line = [];
            for(let j = this.size * 0.9 / 2.0 - tmhX - space, j_iter = 1; j >= -this.size * 0.9 / 2.0 + 0.0005 - tmhX - space; j -= (tmhX + space), j_iter++)
            {       
                if(i_iter == 3 && j_iter == 3)
                    line.push(new Pin(this.scene,this.name, j,i,j+tmhX,i+tmhY, this.name));     
                else if(this.name.charCodeAt(1) >= 65 && i_iter == 4 && j_iter == 3)
                    line.push(new Pin(this.scene,this.name, j,i,j+tmhX,i+tmhY, 'o')); 
                else if(this.name.charCodeAt(1) < 65 && i_iter == 2 && j_iter == 3)
                    line.push(new Pin(this.scene,this.name, j,i,j+tmhX,i+tmhY, 'x')); 
                else
                    line.push(new Pin(this.scene,this.name, j,i,j+tmhX,i+tmhY)); 
            }
            this.pins.push(line);
        }
    };
    
    display()
    {
        this.scene.pushMatrix();
            this.scene.translate(this.size/2.0, this.size/2.0, 0.21);
            
            for(let i = 0; i < this.pins.length; i++)
            {                   
                for(let j = 0; j < this.pins[i].length; j++)
                {   
                    if(this.pins[i][j].pinCode == '.')
                        this.def.setTexture(this.textureP1);
                    else if (this.pins[i][j].pinCode == 'x' || this.pins[i][j].pinCode == 'o')
                        this.def.setTexture(this.textureP2);
                    else
                        this.def.setTexture(this.texture);

                    this.def.apply();
                    if(!this.captured) this.scene.registerForPick(this.name.charCodeAt(1) * 100 + (i + 1) * 10  + j + 1, this.pins[i][j]);
                    this.pins[i][j].display();
                }            
            }
        this.scene.popMatrix();

        if(this.isForSelection && !this.captured)
        {
            if(this.selectionAnimations == null)
                this.createSelectAnimations();
            this.scene.pushMatrix();    
                this.scene.translate(this.size/2.0, this.size/2.0, 0);

                for(let i = 0; i < this.selectionAnimations.length; i++)
                {
                    this.selectionAnimations[i].apply(this.scene,false);
                    this.pieceSelected.display();
                }
                this.pieceSelected.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
            this.def.setTexture(this.texture);
            this.def.apply();
            if(!this.captured) this.scene.registerForPick(this.name.charCodeAt(1), this.struct);
            this.struct.display();
        this.scene.popMatrix();
    };
        
    getPiece()
    {    
        let listPins = [];
        this.pins.forEach(function(line) {
            let auxLine = [];
            line.forEach(function(pin) {
                auxLine.push(pin.pinCode);
            });
            listPins.push(auxLine);
        });

        return JSON.stringify(listPins.reverse()).replace(/"/g, "'");
    };

    setPiece(listPins)
    {
        listPins = listPins.substring(1,listPins.length - 1);        
        
        let pinsArray = (listPins.match(/\[(.*?)\]/g).map(function(val){ return val.replace(/\[/g, '');})).map(function(val){ return val.replace(/\]/g, '');});
        
        for(let i = 0, iter_line = this.pins.length - 1; i < pinsArray.length; i++, iter_line--)
        {
            let lineElems = pinsArray[i].split(',');
            for(let j = 0; j < lineElems.length; j++)
            {
                this.pins[iter_line][j].setPinCode(lineElems[j]);
            }
        }
    };

    setAnimation(initialX, initialY, capt = false)
    {
        let x = !capt ? (this.X  - initialX) * this.size : initialX - this.X;
        let y = !capt ? (initialY - this.Y) * this.size : initialY - this.Y;
        let span = (Math.abs(x) + Math.abs(y)) * 15;

        this.animation = !capt ? new BezierAnimation(span > 5 ? 5 : span, [ [x,y,0], [-x,-y,2], [x/2,y/2,2], [0,0,0] ], false) :
                                 new BezierAnimation(span > 3 ? 3 : span, [ [x,y,0], [5*x/3,5*y/3,4], [0,0,4], [0,0,0] ], false);

        this.isMoving = true;
    };

    setPieceSelectable(bool)
    {
        this.isForSelection = bool;
    };

    setPinsSelectable(bool)
    {
        for(let i = 0; i < this.pins.length; i++)
        {
            for(let j = 0; j < this.pins[i].length; j++)
            {
                this.pins[i][j].setPinSelectable(bool);
            }
        }
    }

    update(time)
    {
        
        if(this.isMoving)
        {
            this.animation.update(time/1000);
        
            if(this.animation.isAnimationOver())
            {
                this.isMoving = false;
                this.animation = null;
            }
        }

        if(!this.captured)
        {
            if(this.isForSelection)
            {
                if(this.selectionAnimations == null)
                    this.createSelectAnimations();
                
                this.selectionAnimations.forEach(function(animation) {
                    animation.update(time/1000);
                });
            }

            this.pins.forEach(function(line) {
                line.forEach(function(pin) {
                    pin.update(time);
                });
            });
        }
    };
};