/**
 * Created by Administrator on 2016/3/18.
 */
define(function(require, exports, module){

    var util=require("../util/Util.js");
    var conatinerWidth=0;//容器宽
    var conatinerHeight=0;//容器高
    var xCalibrationArray = null;//x刻度数组
    var yCalibrationArray = null;//y刻度数组
    var xAxisArray = null;//x方向坐标数组
    var countX = 0;//x方向计数
    var countY = 0;//y方向计数
    var calibrationCountY = 5;//y方向刻度线条绘制数量
    var calibrationX = 0;//x方向刻度
    var calibrationY = 0;//y方向刻度
    var calibrationLineY = 0;//y方向线条刻度
    var zeroX = 0; //0坐标点的x位置
    var zeroY = 0; //0坐标点的y位置
    var upColor = "#ff4433";//上涨颜色
    var downColor = "#54fcfc";//下跌颜色
    var backgroundColor = "#171616";//背景颜色
    var axisColor = "#ff0000";//坐标系线条颜色
    var yText = "14px Arial";//y刻度字体
    var yTextColor = "#777777";//y刻度颜色
    var yLineColor = "#404040";//y刻度线条颜色
    var moveLineColor = "#eeebeb";//十字移动线条颜色
    var recordClose=0;//全局记录收盘价用于：(开盘涨停/开盘跌停)判断
    var container=null;//当前主容器
    var moveLine=null;//左右移动十字线

    /**
     * 返回容器对象
     * */
    exports.getContainer=function(){
        return container;
    }

    /**
     * 构造函数
     * */
    exports.K=function(width, height){
        conatinerWidth = width;
        conatinerHeight = height;
        zeroY=height;
        container= new createjs.Container();
    }

    /**
     * 绘画初始化
     * */
    exports.drawInit = function (xData, yData) {
        //绘制背景
        var background = new createjs.Shape();
        background.graphics.beginFill(backgroundColor);
        background.graphics.drawRect(0, 0, conatinerWidth, conatinerHeight);
        background.graphics.endFill();
        container.addChild(background);
        //初始化参数
        xCalibrationArray = xData;
        yCalibrationArray = yData;
        xAxisArray=new Array();
        countX = xCalibrationArray.length;
        countY = yCalibrationArray.length;
        calibrationX = util.toDecimal(conatinerWidth / countX);
        calibrationY = util.toDecimal(conatinerHeight / countY);
        calibrationLineY = util.toDecimal(conatinerHeight / calibrationCountY);
        //build();
        buildCoordinate();
    }

    /**
     * 构建坐标系
     * */
    var build = function () {
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(3);
        line.graphics.beginStroke(axisColor);
        line.graphics.moveTo(zeroX, 0);
        line.graphics.lineTo(zeroX, zeroY);
        line.graphics.lineTo(conatinerWidth, zeroY);
        container.addChild(line);
    }

    /**
     * 构建坐标系中的刻度和数字(第一象限)
     * */
    var buildCoordinate = function () {
        //辅助线条
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke(yLineColor);
        //绘制x方向刻度
        for (var x = 0; x < countX; x++) {
            var moveX = util.toDecimal(calibrationX * x);//移动位置
            //绘制文字
            //var text = new createjs.Text(xCalibrationArray[x], "14px Arial", "#ff0000");
            //text.x = moveX;
            //text.y = zeroY - 15;
            //container.addChild(text);
            //绘制X方向线条
            //line.graphics.moveTo(moveX, zeroY);
            //line.graphics.lineTo(moveX, 0);
            //添加x坐标
            xAxisArray.push(moveX);
        }
        //console.log("moveX="+xAxisArray);
        //绘制y方向刻度，只绘制中间5个刻度
        for (var y = 0; y <= calibrationCountY; y++) {
            var pointY = calibrationLineY * y;//计算坐标y点
            var moveY = util.toDecimal(zeroY - pointY);//计算实际y点
            var indexY = Math.round(countY / calibrationCountY) * y;//计算y数组索引
            if (y == calibrationCountY) {//如果是最后一个y数组索引
                indexY = countY - 1;
            }
            var text = new createjs.Text(yCalibrationArray[indexY], yText, yTextColor);
            text.x = zeroX + 5;
            if (y == calibrationCountY) {//如果是最后一个y数组索引
                text.y = moveY;
            } else {
                text.y = moveY - 15;
            }
            //绘制实线
            if(y==0){
                //第一根线
                line.graphics.moveTo(zeroX, moveY-1);
                line.graphics.lineTo(conatinerWidth, moveY-1);
            }else if(y== calibrationCountY){
                //最后一根线
                line.graphics.moveTo(zeroX, moveY+1);
                line.graphics.lineTo(conatinerWidth, moveY+1);
            } else{
                line.graphics.moveTo(zeroX, moveY);
                line.graphics.lineTo(conatinerWidth, moveY);
            }
            container.addChild(text);
            text = null;
        }
        container.addChild(line);
    }

    /**
     * 绘制K线(开，高，低，收)
     * */
    exports.drawK = function (xData, yData,alpha,index) {
        var open = yData[0];//开
        var high = yData[1];//高
        var low = yData[2];//低
        var close = yData[3];//收
        //console.log(open + "," + close + "," + low + "," + high);
        if(open==high && open==low && open==close){//开盘涨停/开盘跌停
            drawRectLine(xData, yData,alpha);
        }else{
            if(open==close){
                //console.log(open+"--"+close);
                drawRectLine(xData, yData,alpha);
            }else{
                //绘制K线的方块（开，收）
                var rect = new createjs.Shape();
                var w = calibrationX / 2 + (calibrationX / 4);//绘制宽度(x方向刻度1/2宽度)
                var h = Math.abs(objectToY(open) - objectToY(close));//绘制高度
                var x = objectToX(xData) - w - (calibrationX / 8);//x位置居中
                var y = 0;//y位置
                if (open > close) {//开盘大于收盘
                    //下跌
                    y = objectToY(open);
                    rect.graphics.beginFill(downColor);
                    rect.graphics.drawRect(x, y, w, h);
                    rect.graphics.endFill();
                } else {
                    //上涨
                    y = objectToY(close);
                    //console.log("x="+x+",y="+y+",w="+w+",h="+h);
                    rect.graphics.setStrokeStyle(1);
                    rect.graphics.beginStroke(upColor);
                    rect.graphics.moveTo(x,y);
                    rect.graphics.lineTo(x+w,y);
                    rect.graphics.lineTo(x+w,y+h);
                    rect.graphics.lineTo(x,y+h);
                    rect.graphics.lineTo(x,y);
                }
                rect.alpha=alpha;
                container.addChild(rect);
                //显示索引值，测试用
                var text = new createjs.Text(index, "14px Arial", "#ffffff");
                text.x=x;
                text.y=y;
                //container.addChild(text);
                //绘制K线的线
                drawKLine(xData,yData,alpha);
            }
        }
        recordClose=close;
    }
    /**
     * 绘制K线的线
     * */
    var drawKLine=function(xData,yData,alpha){
        var open = yData[0];//开
        var high = yData[1];//高
        var low = yData[2];//低
        var close = yData[3];//收
        //绘制K线的线(低，高)
        var line = new createjs.Shape();
        var mx = objectToX(xData) - calibrationX / 2;//x位置居中
        var my = objectToY(high);
        line.graphics.setStrokeStyle(1);
        if (open > close) {//开盘大于收盘
            //下跌
            line.graphics.beginStroke(downColor);
            line.graphics.moveTo(mx, my);
            my = objectToY(open);
            line.graphics.lineTo(mx, my);
            my = objectToY(close);
            line.graphics.moveTo(mx, my);
            my = objectToY(low);
            line.graphics.lineTo(mx, my);
        } else {
            //上涨
            line.graphics.beginStroke(upColor);
            line.graphics.moveTo(mx, my);
            my = objectToY(close);
            line.graphics.lineTo(mx, my);
            my = objectToY(open);
            line.graphics.moveTo(mx, my);
            my = objectToY(low);
            line.graphics.lineTo(mx, my);
        }
        line.alpha=alpha;
        container.addChild(line);
    }
    /**
     * 绘制K线为一根线，如果“开==收”，或者“开==高==低==收”
     * */
    var drawRectLine= function(xData, yData,alpha){
        var open = yData[0];//开
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        var w = calibrationX / 2 + (calibrationX / 4);//绘制宽度(x方向刻度1/2宽度)
        var mx = objectToX(xData) - w - (calibrationX / 8);//x位置居中
        var my = objectToY(open);//y位置
        if (open < recordClose) {//开盘小于前日收盘价
            line.graphics.beginStroke(downColor);
        } else {
            line.graphics.beginStroke(upColor);
        }
        //console.log(mx+"-"+my);
        line.graphics.moveTo(mx, my);
        mx+=w;
        //console.log(mx+"-"+my);
        line.graphics.lineTo(mx, my);
        line.alpha=alpha;
        container.addChild(line);
    }


    /**
     * 绘制均线
     * average          MA5,MA10
     * day              5,10
     * visibleStart     显示起点
     * visibleCount     显示数量
     * */
    exports.drawMA = function (average,day,visibleStart,visibleCount) {
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(1);
        line.graphics.beginStroke(util.getMAColor(day));
        var index=visibleStart;
        //console.log(yCalibrationArray);
        for(var i=0;i<visibleCount;i++){
            var mx=i* calibrationX+calibrationX / 2;//x位置居中
            var my=objectToY(average[index]);
            if(my!=-1){
                //console.log(i+"="+mx+","+my+","+average[index]);
                if(i==0){
                    line.graphics.moveTo(mx, my);
                }
                line.graphics.lineTo(mx, my);
            }
            index++;
        }
        container.addChild(line);
        line=null;
    }
    /**
     * 绘制左右移动十字线
     * */
    exports.drawMoveLine=function(date, k){
        var close = k[3];//收
        if(moveLine==null){
            moveLine = new createjs.Shape();
            container.addChild(moveLine);
        }else{
            moveLine.graphics.clear();
        }
        moveLine.graphics.setStrokeStyle(1);
        moveLine.graphics.beginStroke(moveLineColor);
        //绘制X
        var mx = conatinerWidth;
        var my = objectToY(close);
        moveLine.graphics.moveTo(zeroX, my);
        moveLine.graphics.lineTo(mx, my);
        //绘制Y
        mx = objectToX(date) - calibrationX / 2;//x位置居中
        my=conatinerHeight;
        moveLine.graphics.moveTo(mx, 0);
        moveLine.graphics.lineTo(mx, my);
        //console.log(date+","+objectToX(date)+","+mx+"-"+my);
    }
    /**
     * 绘制垂直线
     * */
    exports.drawVerticalLine=function(){

    }
    /**
     * 清除移动十字线
     * */
    exports.cleanDrawMoveLine=function(){
        if(moveLine!=null){
            container.addChild(moveLine);
            moveLine.graphics.clear();
            moveLine=null;
        }
    }
    /**
     * X轴屏幕坐标转X轴索引
     * */
    exports.XScreenToXIndex=function(x){
        var index=0;
        var len=xAxisArray.length;
        for(var i=0;i<len;i++){
            var a1=xAxisArray[i];
            var a2=0;
            if(i<len-1){
                a2=xAxisArray[i+1];
            }else{
                a2=conatinerWidth;
            }
            if(x>=a1 && x<=a2){
                index=i;
                break;
            }else{
                //console.log(x+","+a1+","+a2+","+i);
            }
        }
        return index;
    }

    /**
     * 清理所有绘制的数据
     * */
    exports.clean = function () {
        var list=container.children ;
        for(var i=0;i<list.length;i++){
            if(list[i] instanceof createjs.Shape){
                var shape=list[i];
                shape.graphics.clear();
            }
        }
        container.removeAllChildren();
        moveLine=null;
        xAxisArray=null;
    }

    /**
     * 对象转笛卡尔X坐标
     * */
    var objectToX = function (value) {
        var index = indexOf(value, xCalibrationArray);
        if(index==-1){//数组中未找到
            return index;
        }
        return  util.toDecimal((index + 1) * calibrationX).toFixed(2);
        var result=util.toDecimal((index + 1) * calibrationX).toFixed(2);
        return Number(result);
    }

    /**
     * 对象转笛卡尔Y坐标
     * */
    var objectToY = function (value) {
        var index = indexOf(value, yCalibrationArray);
        if(index==-1){//数组中未找到
            return index;
        }
        var result=util.toDecimal(relativeToAbsoluteY(index * calibrationY)).toFixed(2);
        return Number(result);
    }

    /**
     * 屏幕Y轴坐标转笛卡尔Y轴坐标(X轴忽略)
     * */
    var relativeToAbsoluteY = function (y) {
        return Math.abs(zeroY - y);
    }

    /**
     * 返回指定位置
     * */
    var indexOf = function (value, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    }

});