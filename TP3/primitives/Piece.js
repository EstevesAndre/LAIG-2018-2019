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

        this.pinSpaces = [];

        this.struct = new Box(scene, this.size, this.size, 0.2);

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.texture);

        
        this.createPins();
        this.createPinSpaces();
    };

    createPins()
    {
        if(this.name.charCodeAt(1) >= 65)
        {
            this.pins = [['.', '.', '.', '.', '.'], 
                        ['.', '.', '.', '.', '.'],
                        ['.', '.', this.name, '.', '.'],
                        ['.', '.', 'o', '.', '.'],
                        ['.', '.', '.', '.', '.']];
        }
        else
        {
            this.pins = [['.', '.', '.', '.', '.'], 
                        ['.', '.', 'x', '.', '.'],
                        ['.', '.', this.name, '.', '.'],
                        ['.', '.', '.', '.', '.'],
                        ['.', '.', '.', '.', '.']];
        }
    };

    createPinSpaces()
    {
        let space = this.size * 0.9 / 50;

        var tmhX = this.size * 0.9/5 - space;
        var tmhY = this.size * 0.9/5 - space;

        
        for(let i = -this.size * 0.9 / 2.0; i < this.size * 0.9 / 2.0 - 0.0005; i += tmhY + space)
        {
            let line = [];
            for(let j = this.size * 0.9 / 2.0 - tmhX - space; j >= -this.size * 0.9 / 2.0 + 0.0005 - tmhX - space; j -= (tmhX + space))
            {                
                line.push(new Rectangle(this.scene,j,i,j+tmhX,i+tmhY));
            }
            this.pinSpaces.push(line);
        }
    };
    
    display()
    {
        this.scene.pushMatrix();
            this.scene.translate(this.size/2.0, this.size/2.0, 0.21);
            for(let i = 0; i < this.pinSpaces.length; i++)
            {                   
                for(let j = 0; j < this.pinSpaces[i].length; j++)
                {   
                    if(this.pins[i][j] == '.')
                        this.def.setTexture(this.textureP1);
                    else if (this.pins[i][j] == 'x' || this.pins[i][j] == 'o')
                        this.def.setTexture(this.textureP2);
                    else
                        this.def.setTexture(this.texture);
                    this.def.apply();
                    this.scene.registerForPick(this.name.charCodeAt(1) * 100 + (i + 1) * 10  + j + 1, this.pinSpaces[i][j]);
                    this.pinSpaces[i][j].display();
                }            
            }
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.def.setTexture(this.texture);
            this.def.apply();
            this.scene.registerForPick(this.name.charCodeAt(1), this.struct);
            this.struct.display();
        this.scene.popMatrix();
    };
        
    getPiece()
    {        
        return JSON.stringify(this.pins).replace(/"/g, "'");
    };

    setPiece(listPins)
    {
        listPins = listPins.substring(1,listPins.length - 1);        
        
        let pins = (listPins.match(/\[(.*?)\]/g).map(function(val){ return val.replace(/\[/g, '');})).map(function(val){ return val.replace(/\]/g, '');});


        let newPins = new Array(5); 
        for(var i = 0; i < this.size; i++) 
            newPins[i] = new Array(5);

        let iter_line = 0;
        
        pins.forEach(element => {
            let value = element.split(',').map(function(item) { 
                return item.replace(/'/g, '');}).map(function(item) { 
                    return item.replace(/ /g, '');});
            this.pins[iter_line] = value;
            iter_line++;
        });
    };
};