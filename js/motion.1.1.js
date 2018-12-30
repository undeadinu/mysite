//     motion.js
//     (c) 2016 Fangye Xu
//     Freely distributed         

    // getArr       : 获得一维数组
    // getPosTrack  : 获得位置数组
    // getAngle     : 获得角度数组

        //
        //
        //
        //
        // GET ARRAY
        function getArrNumber( num, segNum ) {
            var result = [];
            for( var i=0; i<segNum; ++i ) {
                result.push( num );
            }
            result.push( num );
            return result;
        }
        function getArrNumberInLinear ( startNum, endNum, segNum ) { // 获得一维线性数组
            var result = [];
            var pr; // progress
            for( var i=0; i<=segNum; ++i ) {
                pr = i/segNum;
                if( endNum >= startNum ) { 
                    var num = ( endNum - startNum )*pr + startNum;
                }else{
                    var num = ( startNum - ( startNum - endNum )*pr ).toFixed(3);
                }
                result.push( num );
            }
            return result;
        }
        function getArrNumberInMathSin ( low, high, segNum ) { // 获得一维三角函数数组
            var result = [];
            var pr;
            for( var i=0; i<=segNum; ++i ) {
                pr = i/segNum;
                var num = ( high - low ) * Math.sin( pr*Math.PI ) + low;
                result.push(num);
            }
            return result;
        }




        //
        //
        //
        //
        // GET POS TRACK
        var Pos= function ( x, y, index ) {
            this.x = x;
            this.y = y;
            this.index = index;
        }

        function getPosTrackPermanent ( x, y, segNum ) { // 在指定数组中插入N个相同的Pos
            var pos_track = [];
            for( var i=0; i<segNum; ++i ) {
                var pos = new Pos( x, y, i );
                pos_track.push(pos);
            }
            return pos_track;
        }
        function getPosTrackLinear ( x1,y1, x2,y2, segNum, motionCurve ) { // 传入点数组 [ [x0,y0], [xn,yn] ] 获取一段位置序列
            var pos01 = new Pos(x1,y1);
            var pos02 = new Pos(x2,y2);
            var pos_track = [];
            var pr;

            for( var i=0; i<segNum; ++i ) {
                if( motionCurve ){
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var x = ( pos02.x - pos01.x )*pr + pos01.x;
                var y = ( pos02.y - pos01.y )*pr + pos01.y;
                var pos = new Pos(x,y);
                pos_track.push(pos);
            }

            return pos_track;            
        }

        function getPosTrackLinearOffset ( x1,y1, x2,y2, segNum, offsetX, offsetY, motionCurve ) { // 传入点数组 [ [x0,y0], [xn,yn] ] 获取一段位置序列
            var pos01 = new Pos(x1,y1);
            var pos02 = new Pos(x2,y2);
            var pos_track = [];
            var pr;

            for( var i=0; i<segNum; ++i ) {
                if( motionCurve ){
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var x = ( pos02.x - pos01.x )*pr + pos01.x + offsetX*Math.sin(pr*Math.PI);
                var y = ( pos02.y - pos01.y )*pr + pos01.y + offsetY*Math.sin(pr*Math.PI);
                var pos = new Pos(x,y);
                pos_track.push(pos);
            }

            return pos_track;            
        }
        function getPosTrackMultiLinear( points_arr, segNum, motionCurve ) { // 传入点数组 [ [x0,y0], [xn,yn] ] 获取分段位置序列
            var pr; // progress
            var endPoints = [];
            for( var e=0; e<points_arr.length; ++e ) {
                var epx = points_arr[e][0];
                var epy = points_arr[e][1];
                var ep = new Pos(epx,epy);
                endPoints.push(ep);
            }
            var pos_track=[]; 
            for( var i=0; i<endPoints.length-1; ++i ) {
                for( var j=0; j<=segNum; ++j ) {
                    if( motionCurve ){
                        pr = motionCurve[j];
                    }else{
                        pr = j/segNum;
                    }

                    if( j == segNum ){
                        var x = endPoints[i+1].x;
                        var y = endPoints[i+1].y;
                    }else{
                        var x = pr*( endPoints[i+1].x - endPoints[i].x ) + endPoints[i].x;
                        var y = pr*( endPoints[i+1].y - endPoints[i].y ) + endPoints[i].y;
                    }
                    var pos = new Pos(x,y);
                    pos_track.push(pos);
                }
            }
            return pos_track;
        }
        function getPosTrackBezier_4Points( A1, A2, A3, A4, segNum ) { // 传入位置序列 [ pos, pos, pos, pos ]，获取贝塞尔pos序列
            var pos_track = [];
            var pr; // progress
            var B1 = new Pos;
            var B2 = new Pos;
            var B3 = new Pos;
            var C1 = new Pos;
            var C2 = new Pos;
            for( var i=0; i<segNum; ++i ) {
                pr = i/segNum;
                B1.x = ( A2.x-A1.x )*pr + A1.x; B1.y = ( A2.y-A1.y )*pr + A1.y; 
                B2.x = ( A3.x-A2.x )*pr + A2.x; B2.y = ( A3.y-A2.y )*pr + A2.y;
                B3.x = ( A4.x-A3.x )*pr + A3.x; B3.y = ( A4.y-A3.y )*pr + A3.y;
                C1.x = ( B2.x-B1.x )*pr + B1.x; C1.y = ( B2.y-B1.y )*pr + B1.y;
                C2.x = ( B3.x-B2.x )*pr + B2.x; C2.y = ( B3.y-B2.y )*pr + B2.y;

                var D = new Pos;
                D.x = ( C2.x-C1.x )*pr + C1.x; 
                D.y = ( C2.y-C1.y )*pr + C1.y;
                pos_track.push(D);
            }
            return pos_track;
        }
        function getPosTrackBezier( x1,y1, x2,y2, x3,y3, x4,y4, segNum, motionCurve ) { // 传入点数组，获取贝塞尔pos序列
            var pos_track = [];
            var pr;

            var A1 = new Pos( x1,y1 ); 
            var A2 = new Pos( x2,y2 ); 
            var A3 = new Pos( x3,y3 );
            var A4 = new Pos( x4,y4 );

            var B1 = new Pos;
            var B2 = new Pos;
            var B3 = new Pos;
            var C1 = new Pos;
            var C2 = new Pos;

            for( var i=0; i<segNum; ++i ) {
                if( motionCurve ){
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                B1.x = ( A2.x-A1.x )*pr + A1.x; B1.y = ( A2.y-A1.y )*pr + A1.y; 
                B2.x = ( A3.x-A2.x )*pr + A2.x; B2.y = ( A3.y-A2.y )*pr + A2.y;
                B3.x = ( A4.x-A3.x )*pr + A3.x; B3.y = ( A4.y-A3.y )*pr + A3.y;
                C1.x = ( B2.x-B1.x )*pr + B1.x; C1.y = ( B2.y-B1.y )*pr + B1.y;
                C2.x = ( B3.x-B2.x )*pr + B2.x; C2.y = ( B3.y-B2.y )*pr + B2.y;

                var D = new Pos;
                D.x = ( C2.x-C1.x )*pr + C1.x; 
                D.y = ( C2.y-C1.y )*pr + C1.y;
                pos_track.push(D);
            }
            return pos_track;
        }
        function getPosTrackQuadratic( x1,y1, x2,y2, x3,y3, segNum ) { // 传入点数组，获取pos序列
            var pos_track = [];
            var pr;

            var A1 = new Pos( x1,y1 ); 
            var A2 = new Pos( x2,y2 ); 
            var A3 = new Pos( x3,y3 );

            var B1 = new Pos;
            var B2 = new Pos;

            for( var i=0; i<segNum; ++i ) {
                pr = i/segNum;
                B1.x = ( A2.x-A1.x )*pr + A1.x; 
                B1.y = ( A2.y-A1.y )*pr + A1.y; 
                B2.x = ( A3.x-A2.x )*pr + A2.x; 
                B2.y = ( A3.y-A2.y )*pr + A2.y;
                var C1 = new Pos;
                C1.x = ( B2.x-B1.x )*pr + B1.x; 
                C1.y = ( B2.y-B1.y )*pr + B1.y;
                pos_track.push(C1);
            }
            return pos_track;
        }
        function getPosTrackHelix( centerX,centerY,radius,startAngle,endAngle,segNum,offset,motionCurve ) {
            var pos_track = [];
            var pr; 
            if( !offset ) {
                offset =0;
            }
            for( var i=0; i<=(segNum-1); ++i ) {
                if( motionCurve ) {
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var x = centerX + ((segNum-i)/100)*radius*Math.cos( ( startAngle + pr*(endAngle- startAngle) - offset*Math.cos( Math.PI*pr ) )*Math.PI/180 );
                var y = centerY + ((segNum-i)/100)*radius*Math.sin( ( startAngle + pr*(endAngle- startAngle) - offset*Math.cos( Math.PI*pr ) )*Math.PI/180 );
                var pos = new Pos(x,y);
                pos_track.push(pos);
            }
            return pos_track;
        }
        function getPosTrackCircular ( centerX,centerY,radius,startAngle,endAngle,segNum, motionCurve ) {
            var pos_track = [];
            var pr; 
            offset =0;
            for( var i=0; i<=(segNum-1); ++i ) {
                if( motionCurve ) {
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var x = centerX + radius*Math.cos( ( startAngle + pr*(endAngle- startAngle) - offset*Math.cos( Math.PI*pr ) )*Math.PI/180 );
                var y = centerY + radius*Math.sin( ( startAngle + pr*(endAngle- startAngle) - offset*Math.cos( Math.PI*pr ) )*Math.PI/180 );
                var pos = new Pos(x,y,i);
                pos_track.push(pos);
            }
            return pos_track;
        }
        function getPosTrackHalfCircularByConstX ( centerX, centerY, radius, segNum, isUpperLower ) { // 根据恒定的x步进取得一个圆上的坐标
            var pos_track = [];
            var pr;

            var pos0 = new Pos( centerX-radius, centerY, 0 );
            pos_track.push( pos0 );

            for( var i=1; i<=segNum-1; ++i ) {
                pr = i/segNum;
                var x = centerX + (-radius) + pr*radius*2; 
                var angle = Math.acos( x/radius );
                if( isUpperLower == 'upper' ) {
                    var y = centerY - radius*Math.sin( angle );
                }else{
                    var y = centerY + radius*Math.sin( angle );
                }
                var pos = new Pos( x, y, i );
                pos_track.push(pos);
            }

            var posEnd = new Pos( centerX+radius, centerY, segNum );
            pos_track.push( posEnd );

            return pos_track;
        }
        function getPosTrackPolarRadial ( centerX, centerY, angle, dist, segNum, motionCurve ) {
            var pos_track = [];
            var pr;
            for( var i=0; i<=(segNum-1); ++i ) {
                if( motionCurve ) {
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var x = pr*dist*Math.sin(angle*Math.PI/180) + centerX;
                var y = pr*dist*Math.cos(angle*Math.PI/180) + centerY;
                var pos = new Pos(x,y);
                pos_track.push(pos);
            }

            return pos_track;
        }
        function getPosTrackSVG( data, step ) {
            var patternNumber = new RegExp(/[0-9]/);
            var patternLetter = new RegExp(/[A-Za-z]/);
            var tempNum = '';
            var steps = [];
            // 首先读取svg
            for( var i=0; i<=data.length; ++i ) {
                var char = data.charAt(i);
                if( patternNumber.test(char) ){
                    tempNum += char;
                    continue;
                }else{
                    if( tempNum != '' ) {
                        steps[steps.length-1].args.push( parseInt( tempNum ) );
                    }
                    if( patternLetter.test(char) ){
                        tempNum = '';
                        var paintType;
                        switch(char.toLowerCase()) {
                            case 'm':
                                paintType = 'Move';
                                break;
                            case 'c':
                                paintType = 'Curve';
                                break;
                            case 'l':
                                paintType = 'Line';
                                break;
                        }
                        var t = {
                            type : paintType,
                            args : []
                        }
                        steps.push(t);
                    }else if( char==',' ){
                        tempNum = '';
                    }else if( char=='-' ){
                        tempNum = '-';
                    }else{          
                    }
                }
            }
            // 根据svg元信息获取pos_track
            var pos_track = [];
            var lastPos = { 
                x : 0,
                y : 0
            }
            for( var s=0; s<steps.length; ++s ) {
                if( steps[s].type == 'Move' ){
                    lastPos.x += steps[s].args[0];
                    lastPos.y += steps[s].args[1];                 
                }
                if( steps[s].type == 'Curve' ){
                    for( var i=0; i<steps[s].args[4]; ++i ) {
                        var StartDot= new Pos( 0,0 );
                        var handDotA= new Pos( steps[s].args[0],steps[s].args[1] );
                        var handDotB= new Pos( steps[s].args[2],steps[s].args[3] );
                        var EndDot= new Pos( steps[s].args[4],steps[s].args[5] );
                        var y = calcY( i, StartDot, handDotA, handDotB, EndDot, 0.01 );
                        var pos = new Pos( i,y );
                        pos_track.push(pos);
                    }
                }else if( steps[s].type == 'Line' ){
                    for( var i=0; i<steps[s].args[0]; ++i ) {
                        var x = lastPos.x + i;
                        var y = lastPos.y + ( i/steps[s].args[0] )*steps[s].args[1];
                        var pos = new Pos( x,y );
                        pos_track.push(pos);
                    }
                    lastPos.x += steps[s].args[0];
                    lastPos.y += steps[s].args[1];
                }
            }
            return pos_track;
        }



        //
        //
        // 
        //
        // GET ANGLE
        function getAnglesFromCircle ( startAngle,endAngle,segNum,motionCurve ) {
            var angles = [];
            var pr; 
            for( var i=0; i<segNum; ++i ) {
                if( motionCurve ) {
                    pr = motionCurve[i];
                }else{
                    pr = i/segNum;
                }
                var a = ( pr*( endAngle - startAngle ) + startAngle )*Math.PI/180;
                angles.push(a);
            }
            return angles;
        }
        function getAngleTrackPermanent ( angle, segNum ) {
            var result = [];
            for( var i=0; i<segNum; ++i ) {
                result.push(angle);
            }
            return result;
        }
        



        //
        //
        //
        //
        // SUPER GET ARR
        function getMotionArr( type, values ) {  // 返回一个一维数组
            var result = [];
            switch( type ) {
                case 'bezierCurve' : 
                    var posArr = [];
                    for( i=0; i<values.length-1; ++i ) {
                        var anchor0 = new Pos( values[i][0], values[i][1] );
                        var anchor1 = new Pos( (values[i+1][0]+values[i][0])/2, values[i][1] );
                        var anchor2 = new Pos( (values[i+1][0]+values[i][0])/2, values[i+1][1] );
                        var anchor3 = new Pos( values[i+1][0], values[i+1][1] );
                        var num = values[i+1][0] - values[i][0];
                        var posArrTemp = getPosTrackBezier_4Points( anchor0, anchor1, anchor2, anchor3, num );
                        posArr = posArr.concat( posArrTemp );
                    }

                    for( p in posArr ){
                        result.push(posArr[p].y);
                    }
                    break;                    

                case 'linear':
                    var endPoints = [];
                    for( var e=0; e<values.length; ++e ) {
                        var epx = values[e][0];
                        var epy = values[e][1];
                        var ep = new Pos(epx,epy);
                        endPoints.push(ep);
                    }
                    for( var i=0; i<endPoints.length-1; ++i ) {
                        var segNum = endPoints[i+1].x - endPoints[i].x;
                        for( var j=0; j<segNum; ++j ) {
                            pr = j/segNum;
                            if( j == segNum-1 ){
                                var x = endPoints[i+1].x;
                                var y = endPoints[i+1].y;
                            }else{
                                var x = pr*( endPoints[i+1].x - endPoints[i].x ) + endPoints[i].x;
                                var y = pr*( endPoints[i+1].y - endPoints[i].y ) + endPoints[i].y;
                            }
                            result.push(y)
                        }
                    }
                    break;
            }

            return result;
        }





        // 
        // POS TRACK 操作
        // 晃动一个位置列，让每个pos产生随机位置
        function shakenPosTrackByArray ( pos_track, array, isX, isY ) {
            for( var i=0; i<pos_track.length; ++i ) {
                if( isX ) {
                    pos_track[i].x += generateRandom( -array[i], array[i] );
                }
                if( isY ) {
                    pos_track[i].y += generateRandom( -array[i], array[i] );
                }
            }
        }
        function shakenPosTrack ( pos_track, num, isX, isY ) {
            for( var i=0; i<pos_track.length; ++i ) {
                if( isX ) {
                    pos_track[i].x += generateRandom( -num, num );
                }
                if( isY ) {
                    pos_track[i].y += generateRandom( -num, num );
                }
            }
        }
        function getShakenPosTrack ( pos_track, num, isX, isY ) {
            // body...
        }

        //
        // ARRAY 操作
        // 从一个数组中挑选num个随机项，排序后返回
        function pickRandomFromArray ( array, num ) {
            var result = [];
            var random = [];
            var max = array.length-1;
            // generate random array
            for( var i=0; i<num; ++i ){
                random.push( Math.floor( Math.random()*max ) );
            }
            function sortNumber(a,b)
            {
                return a - b
            }
            random.sort(sortNumber);
            // insert result
            for( var j=0; j<num; ++j ){
                result.push( array[ random[j] ] );
            }
            return result;
        }
        // 将一个数组中的每一项除以multiplier
        function convertArray ( array, multiplier ) {
            var result = [];
            for( i in array ) {
                result.push( array[i]/multiplier )
            }
            return result;
        }
        // 偏移一组数组，
        function shiftArray ( array, shiftOffsetNum ) {
            var temp = [];
            var result = [];
            for( var i=0; i<shiftOffsetNum; ++i ) {
                temp.push( array[i] );
            }
            result = array.slice(shiftOffsetNum);
            
            return result.concat(temp);
        }
        // 连接两个数组
        function joinArray ( array01, array02 ) {
            return array01.concat(array02);
        }        

        //
        // 色彩操作
        // 偏振颜色
        function shakenColor( color, mode, Range ) {
            var shakeRange = Range;
            switch( mode ) {
                case '16' :
                    var R = parseInt( color.slice(1,3), 16 ); 
                    var G = parseInt( color.slice(3,5), 16 ); 
                    var B = parseInt( color.slice(5,7), 16 ); 

                    var Rs = R + generateRandom( -shakeRange,shakeRange );
                    var Gs = G + generateRandom( -shakeRange,shakeRange );
                    var Bs = B + generateRandom( -shakeRange,shakeRange );

                    var rgb = 'rgb(' + Rs + ',' +Gs + ',' + Bs + ')';
                    return rgb;
                    break;
                case 'hsl' :
                    var H = color[0];
                    var S = color[1];
                    var L = color[2];

                    var Hs = H + generateRandom( -shakeRange,shakeRange );
                    var Ss = S + generateRandom( -shakeRange,shakeRange ) + '%';
                    var Ls = L + generateRandom( -shakeRange,shakeRange ) + '%';

                    var hsl = 'hsl(' + Hs + ',' + Ss + ',' + Ls + ')';
                    return hsl;
                    break;
            }
        }
        const COLOR_ARR = [ '#60d8b0', '#f4825b', '#efd565' ]


        //
        // 数学方法
        // 生成 m~n 的随机数
        function generateRandom( m,n ){
            return Math.floor( Math.random()*(n-m) + m );
        }
        
        // 二分法求贝塞尔曲线的直角坐标
        function getPosTrackBezierInterval( start, A, B, end, delta ) {
            var pos_track = [];
            for( var i=0; i<end.x; ++i ) {
                var y = calcY( i, start, A, B, end, delta )
                var pos = new Pos( i,y );
                pos_track.push(pos);
            }
            return pos_track;
        }
        function calcY ( i, start, A, B, end, delta ) {
            var low = 0;
            var high = end.x;
            var mid = ( low+high )/2;
            var t = mid/end.x;
            while( (high-low) > delta ) {
                var curve_x =   (start.x)*(1-t)*(1-t)*(1-t) +
                                3*(A.x)*t*(1-t)*(1-t) +
                                3*(B.x)*t*t*(1-t) +
                                (end.x)*t*t*t;

                if( curve_x>i ) high=mid;
                else if( curve_x<i ) low=mid;
                else break;
                mid = ( low+high )/2;
                t = mid/end.x;
            }
            return  (start.y)*(1-t)*(1-t)*(1-t) +
                    3*(A.y)*t*(1-t)*(1-t) +
                    3*(B.y)*t*t*(1-t) +
                    (end.y)*t*t*t;
        }

