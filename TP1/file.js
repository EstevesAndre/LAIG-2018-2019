/**
 * Parses the <views> block. 
 * @param {views block element} viewsNode
 */
parseViews(viewsNode) {

    this.views = [];
    var viewsId = [];

    if(viewsNode.nodeName != "views") return "invalid tag, <view> - <" + viewsNode.nodeName + ">";

    var viewDefault = this.reader.getString(viewsNode,'default');
    if(viewDefault == null) return "no Default name for view";

    var children = viewsNode.children;

    if(children.length == 0) return "Scene must have at least one view";

    var defaultFound = false;

    for(var i = 0; i < children.length; i++)
    {
        var view = new Object();

        if(children[i].nodeName != "perspective" && children[i].nodeName != "ortho") return "invalid child tag, must be \"perspective\" or \"ortho\" on views tag";
        view.type = children[i].nodeName;

        let viewId = this.reader.getString(children[i], 'id');
        if(viewId == null) return "no ID defined for " + children[i].nodeName + " view";
        view.id = viewId;

        // Checks for repeated IDs.
        if (viewsId[viewId] != null) return "ID must be unique for each view (conflict: ID = " + viewId + ")";

        if(viewId == viewDefault) defaultFound = true;

        let viewNear = this.reader.getFloat(children[i], 'near');
        if(!(viewNear != null && !isNaN(viewNear))) return "unable to parse near component of the " + children[i].nodeName + " view with ID = " + viewId;
        view.near = viewNear;
        
        let viewFar = this.reader.getFloat(children[i], 'far');
        if(!(viewFar != null && !isNaN(viewFar))) return "unable to parse far component of the " + children[i].nodeName + " view with ID = " + viewId;
        view.far = viewFar;
        
        if(children[i].nodeName == "ortho")
        {
            let viewLeft = this.reader.getFloat(children[i], 'left');
            if(!(viewLeft != null && !isNaN(viewLeft))) return "unable to parse left component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.left = viewLeft;

            let viewRight = this.reader.getFloat(children[i], 'right');
            if(!(viewRight != null && !isNaN(viewRight))) return "unable to parse right component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.right = viewRight;

            let viewTop = this.reader.getFloat(children[i], 'top');
            if(!(viewTop != null && !isNaN(viewTop))) return "unable to parse top component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.top = viewTop;

            let viewBottom = this.reader.getFloat(children[i], 'bottom');
            if(!(viewBottom != null && !isNaN(viewBottom))) return "unable to parse bottom component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.bottom = viewBottom;
        }
        else
        {
            let viewAngle = this.reader.getFloat(children[i], 'angle');
            if(!(viewAngle != null && !isNaN(viewAngle))) return "unable to parse angle component of the " + children[i].nodeName + " view with ID = " + viewId;
            view.angle = viewAngle;

            var grandChildren = children[i].children;
            
            if(grandChildren.length != 2) return "no \"from\" and \"to\" tags defined";

            var fromPos = [];
            var toPos = [];

            if(grandChildren[0].nodeName == "from") this.parseXYZw(grandChildren,fromPos,0,"perspective","from","none");
            else return "wrong tag to perspective view for ID = " + viewId + ", must be \"from\"";
            
            if(grandChildren[1].nodeName == "to") this.parseXYZw(grandChildren,toPos,1,"perspective","to","none");
            else return "wrong tag to perspective view for ID = " + viewId + ", must be \"to\"";

            let from = new Object();
            let to = new Object();
            
            from.x = fromPos[0];
            from.y = fromPos[1];
            from.z = fromPos[2];
            to.x = toPos[0];
            to.y = toPos[1];
            to.z = toPos[2];
            
            view.from = from;
            view.to = to;                
        }   
        viewsId[viewId] = viewId;            
        this.views.push(view);
    }
    
    if(!defaultFound) return "default view with ID = " + viewDefault + " not found";
    
    console.log("Parsed views");        

    return null;
}