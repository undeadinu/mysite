//     Sprite-Ani.js
//     (c) 2016 Fangye Xu
//     Freely distributed 

var FrameRange = function ( start, end ) {
    this.start = start;
    this.end = end;
}
var Action = function ( type, data, framerange ) {
    this.type = type;
    this.data = data;
    this.framerange = framerange;
}

var Sprite = function ( params ) {
    this.type           = params.type;

    this._pos           = params.pos || pos(0,0),   this.pos_track;
    this._alpha         = params.alpha || 1,        this.alp_track;

    this.outline        = params.outline;
    this.img            = new Image();
    this.img.src        = params.imgSource;
    this.takeWidth      = params.imgTakeWidth || 0;
    this.takeHeight     = params.imgTakeHeight || 0;
    this.coreX          = params.imgCoreX || 0;
    this.coreY          = params.imgCoreY || 0;
    this.drawingWidth   = params.imgDrawingWidth || 0;
    this.drawingHeight  = params.imgDrawingHeight || 0;

    this.compOperation  = params.compOperation || 'source-over';
    this.fillColor      = params.fillColor;
    this.strokeColor    = params.strokeColor;
    this.lineWidth      = params.lineWidth || 10;
    this.lineCap        = params.lineCap || 'butt'; // butt / round / square
    this.lineJoin       = params.lineJoin || 'miter'; // miter / round / bevel

    this.rangeAnime     = new FrameRange(); // 
    this.frameAnime     = 0;
    this.isAnimeLoop    = false;

    if( params.endOnStage ) {
        this.rangeOnStage   = framerange( params.startOnStage, params.endOnStage );
    }else{
        this.rangeOnStage   = framerange( params.startOnStage, params.startOnStage + 300 );
    }

    this.frame          = 0;
    this.flow           = params.flow || [];

    this.setTransformTrack();

}

Sprite.prototype = {
    setTransformTrack : function () {

        this.pos_track = getPosTrackPermanent ( this._pos.x, this._pos.y, STAGE_RANGE );
        this.alp_track = getArrNumber( this._alpha, STAGE_RANGE );

        for( var i=0; i<this.flow.length; ++i ) {
            var action = this.flow[i];
            switch( action.type ) {
                case 'moveToPos' :
                    var duration = action.framerange.end - action.framerange.start;
                    var stepx = ( action.data.x - this.pos_track[ action.framerange.start ].x )/duration;
                    var stepy = ( action.data.y - this.pos_track[ action.framerange.start ].y )/duration;
                    for( var j=0; j<=duration; ++j ) { 
                        this.pos_track[ action.framerange.start + j ].x += stepx*j ;
                        this.pos_track[ action.framerange.start + j ].y += stepy*j ;
                    }
                    for( var k=action.framerange.end; k<STAGE_RANGE; ++k ) {
                        this.pos_track[k].x = this.pos_track[ action.framerange.end ].x;
                        this.pos_track[k].y = this.pos_track[ action.framerange.end ].y;
                    }
                    break;
                case 'moveByDistance' :
                    break;
                case 'moveByPosTrack' :
                    break;
                case 'moveBySVG' :
                    break;
                case 'alphaToNumber' :
                    var duration = action.framerange.end - action.framerange.start;
                    var step = ( action.data - this.alp_track[ action.framerange.start ] )/duration;
                    for( var j=0; j<=duration; ++j ) {
                        this.alp_track[ action.framerange.start + j ] += step*j ;
                    }
                    for( var k=action.framerange.end; k<STAGE_RANGE; ++k ) {
                        this.alp_track[k] = this.alp_track[ action.framerange.end ];
                    }                    
                    break;
                case 'play' :
                    this.rangeAnime.start = action.framerange.start;
                    this.rangeAnime.end = action.framerange.end;
                    if( action.data == 0 ) {
                        this.isAnimeLoop = true;
                    }
                    break;
            }
        }
    },
    update : function () {
        this.frame++;
        switch ( this.type ) {
            case 'Snake' :
                if( this.frame >= this.rangeAnime.start && this.frame <= this.rangeAnime.end ) {
                    this.frameAnime = this.frame - this.rangeAnime.start;
                    if( this.frameAnime == this.rangeAnime.end && this.isAnimeLoop ) {
                        this.frame = 0;
                        this.frameAnime = 0;
                    }
                }
                break;
        }
    },
    draw : function ( ctx ) {
        ctx.save();

        ctx.translate( this.pos_track[this.frame].x, this.pos_track[this.frame].y );
        ctx.globalAlpha = this.alp_track[this.frame];

        switch ( this.type ) {
            case 'Snake' :
                for( var i=0; i<this.frameAnime; ++i ) {
                    ctx.beginPath();
                    ctx.globalCompositeOperation = this.compOperation;
                    if( i == this.frameAnime-1 ) {
                        break;
                    }
                    ctx.moveTo( this.outline[i].x, this.outline[i].y );
                    ctx.lineTo( this.outline[i+1].x, this.outline[i+1].y );
                    ctx.strokeStyle = this.strokeColor;
                    ctx.lineWidth = this.lineWidth;
                    ctx.lineCap = this.lineCap;
                    ctx.lineJoin = this.lineJoin;
                    ctx.stroke();
                    ctx.closePath();
                }
                break;
            case 'Image' :
                ctx.drawImage( 
                    this.img, 0,0,
                    this.takeWidth, this.takeHeight, 
                    this.coreX, this.coreY, 
                    this.drawingWidth, this.drawingHeight 
                );
                break;
            default :
                ctx.fillRect( 0, 0, 30,30 );
                break;
        }

        ctx.restore();
    },
    reset : function () {
        this.frame = 0;
        this.frameAnime = 0;
        this.setTransformTrack();
    },
    test : function (ctx) {
        ctx.save();
        ctx.translate( -canvasW/2, -canvasH/2+100 );
        // ctx.beginPath();
        for( var i=0; i<STAGE_RANGE; ++i ) {
            ctx.fillRect( i*3, this.alp_track[i]*10, 2, 2 );
        }
        // ctx.closePath();
        ctx.restore();
    }

}

function pos ( x, y ) {
    return new Pos( x, y );
}
function framerange ( start, end ) {
    return new FrameRange( start, end );
}
function action ( type, data, framerange ) {
    return new Action( type, data, framerange );
}