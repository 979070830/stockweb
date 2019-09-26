/**
 * Created by Administrator on 2016/4/15.
 */
define(function(require, exports, module){

    var util=require("../util/Util.js");
    var conatinerWidth=0;//容器宽
    var conatinerHeight=0;//容器高
    var xCalibrationArray = null;//x刻度数组
    var yCalibrationArray = null;//y刻度数组
    var countX = 0;//x方向计数
    var countY = 0;//y方向计数
    var calibrationX = 0;//x方向刻度
    var calibrationY = 0;//y方向刻度
    var zeroX = 0; //0坐标点的x位置
    var zeroY = 0; //0坐标点的y位置
    var backgroundColor = "#171616";//背景颜色
    var axisColor = "#ff0000";//坐标系线条颜色
    var yText = "14px Arial";//y刻度字体
    var yTextColor = "#777777";//y刻度颜色
    var yLineColor = "#404040";//y刻度线条颜色
    var moveLineColor = "#eeebeb";//十字移动线条颜色
    var centerLineColor = "#404040";//中间线条颜色
    var KColor="#ffffff";
    var DColor="#ff6d33";
    var JColor="#e56397";
    var container=null;//当前主容器
    var moveLine=null;//左右移动线

    //返回容器对象
    exports.getContainer=function(){
        return container;
    }

    //构造函数
    exports.KDJ=function(width, height){
        conatinerWidth = width;
        conatinerHeight = height;
        zeroY=height;
        container= new createjs.Container();
        //初始化参数（yCalibrationArray只初始化一次）
        var arrayUtil=require("../util/ArrayUtil.js");
        yCalibrationArray = arrayUtil.pushArray(1);
        arrayUtil=null;
        countY = yCalibrationArray.length;
        calibrationY = util.toDecimal(conatinerHeight / countY);
    }

    //绘图初始化
    exports.drawInit = function (xData) {
        //绘制背景
        var background = new createjs.Shape();
        background.graphics.beginFill(backgroundColor);
        background.graphics.drawRect(0, 0, conatinerWidth, conatinerHeight);
        background.graphics.endFill();
        container.addChild(background);
        //初始化参数
        xCalibrationArray = xData;
        countX = xCalibrationArray.length;
        calibrationX = util.toDecimal(conatinerWidth / countX);
        //build();
        buildCoordinate();
    }
    //构建坐标系
    var build = function () {
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(3);
        line.graphics.beginStroke(axisColor);
        line.graphics.moveTo(zeroX, 0);
        line.graphics.lineTo(zeroX, zeroY);
        line.graphics.lineTo(conatinerWidth, zeroY);
        container.addChild(line);
    }
    //构建坐标系中的刻度和数字(第一象限)
    var buildCoordinate = function () {
        //辅助线条
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(0.5);
        line.graphics.beginStroke(yLineColor);
        //绘制x方向刻度
        //for (var x = 0; x < countX; x++) {
        //    var moveX = util.toDecimal(calibrationX * x);//移动位置
        //    line.graphics.moveTo(moveX, zeroY);
        //    line.graphics.lineTo(moveX, 0);
        //}
        ////绘制y方向刻度
        //for(var y=0;y<countY;y++){
        //    var moveY=util.toDecimal(calibrationY*y);
        //    line.graphics.moveTo(zeroX, moveY);
        //    line.graphics.lineTo(conatinerWidth, moveY);
        //}
        //container.addChild(line);

        //绘制顶部和底部线条
        var tbLine=new createjs.Shape();
        tbLine.graphics.setStrokeStyle(1);
        tbLine.graphics.beginStroke(centerLineColor);
        //顶部
        tbLine.graphics.moveTo(0, 1);
        tbLine.graphics.lineTo(conatinerWidth, 1);
        //底部
        tbLine.graphics.moveTo(0, conatinerHeight-1);
        tbLine.graphics.lineTo(conatinerWidth, conatinerHeight-1);
        container.addChild(tbLine);
        //绘制中间实线
        var center=new createjs.Shape();
        center.graphics.setStrokeStyle(0.5);
        center.graphics.beginStroke(centerLineColor);
        var mx=conatinerWidth;
        var my=conatinerHeight>>1;
        center.graphics.moveTo(0, my);
        center.graphics.lineTo(conatinerWidth, my);
        container.addChild(center);
        //绘制刻度100 50
        var text_100 = new createjs.Text("100.00", "14px Arial", "#777777");
        text_100.x=conatinerWidth-text_100.getMeasuredWidth();
        text_100.y=2;
        container.addChild(text_100);
        var text_50 = new createjs.Text("50.00", "14px Arial", "#777777");
        text_50.x=conatinerWidth-text_50.getMeasuredWidth();
        text_50.y=my-2;
        container.addChild(text_50);
    }

    /**
     * 绘制KDJ线
     * KDJArray
     * */
    exports.drawKDJ=function(KDJ,visibleStart,visibleCount){
        //K线
        var k_line = new createjs.Shape();
        k_line.graphics.setStrokeStyle(1);
        k_line.graphics.beginStroke(KColor);
        //D线
        var d_line = new createjs.Shape();
        d_line.graphics.setStrokeStyle(1);
        d_line.graphics.beginStroke(DColor);
        //J线
        var j_line = new createjs.Shape();
        j_line.graphics.setStrokeStyle(1);
        j_line.graphics.beginStroke(JColor);
        var index=visibleStart;
        //console.log(KDJ+","+visibleStart+","+visibleCount);
        for(var i=0;i<visibleCount;i++){
            if(index>=KDJ.length){
                break;
            }
            var mx=i* calibrationX+calibrationX / 2;//x位置居中
            var K_=util.toDecimal(Math.floor(KDJ[index][0])).toFixed(2);
            var D_=util.toDecimal(Math.floor(KDJ[index][1])).toFixed(2);
            var J_=util.toDecimal(Math.floor(KDJ[index][2])).toFixed(2);
            var my_k=objectToY(K_);
            var my_d=objectToY(D_);
            var my_j=objectToY(J_);
            //console.log(K_+","+D_+","+J_+"--"+my_k+","+my_d+","+my_j);
            if(K_==0 && D_==0 && J_==0){
                k_line.graphics.moveTo(mx,conatinerHeight);
                d_line.graphics.moveTo(mx,conatinerHeight);
                j_line.graphics.moveTo(mx,conatinerHeight);
            }else{
                k_line.graphics.lineTo(mx, my_k);
                d_line.graphics.lineTo(mx, my_d);
                j_line.graphics.lineTo(mx, my_j);
            }
            index++;
        }
        container.addChild(k_line);
        container.addChild(d_line);
        container.addChild(j_line);
    }

    //绘制左右移动线
    exports.drawMoveLine=function(date){
        //移动线
        if(moveLine==null){
            moveLine = new createjs.Shape();
            container.addChild(moveLine);
        }else{
            moveLine.graphics.clear();
        }
        moveLine.graphics.setStrokeStyle(1);
        moveLine.graphics.beginStroke(moveLineColor);
        var mx = Math.round(objectToX(date) - calibrationX / 2);//x位置居中
        var my = conatinerHeight;
        moveLine.graphics.moveTo(mx, 0);
        moveLine.graphics.lineTo(mx, my);
    }
    //清除移动十字线
    exports.cleanDrawMoveLine=function(){
        if(moveLine!=null){
            container.addChild(moveLine);
            moveLine.graphics.clear();
            moveLine=null;
        }
    }
    //清理所有绘制的数据
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
    }
    //对象转笛卡尔X坐标
    var objectToX = function (value) {
        var index = indexOf(value, xCalibrationArray);
        if(index==-1){//数组中未找到
            return index;
        }
        var result=util.toDecimal((index + 1) * calibrationX).toFixed(2);
        return Number(result);
    }
    //对象转笛卡尔Y坐标
    var objectToY = function (value) {
        var index = indexOf(value, yCalibrationArray);
        if(index==-1){//数组中未找到
            //return index;
            index=1;
        }
        var result=util.toDecimal(relativeToAbsoluteY(index * calibrationY)).toFixed(2);
        return Number(result);
    }
    //返回指定位置
    var indexOf = function (value, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    }
    //屏幕Y轴坐标转笛卡尔Y轴坐标(X轴忽略)
    var relativeToAbsoluteY = function (y) {
        return Math.abs(zeroY - y);
    }
});