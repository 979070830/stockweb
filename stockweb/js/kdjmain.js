/**
 * Created by Administrator on 2016/4/15.
 */
define(function(require, exports, module){

    var util=require("../js/util/Util.js");
    var kdj=require("../js/extend/kdj.js");
    var stage=null;
    var container=null;

    //初始化函数
    exports.initialize=function(){
        var canvas=document.getElementById("kdj_canvas");
        stage=new createjs.Stage(canvas);
        createjs.Touch.enable(stage);//舞台启动触摸交互设置
        console.log("Touch="+createjs.Touch.isSupported());//当前浏览器是否支持
        container=new createjs.Container();
        stage.addChild(container);
        //初始化自适应舞台大小
        initStageSize();
        //设置舞台和容器
        stage.setBounds(0,0,canvas.width,canvas.height);
        container.setBounds(0,0,canvas.width,canvas.height);
        //初始化
        kdj.KDJ(canvas.width,canvas.height);
        //KDJ线对象添加到容器
        container.addChild(kdj.getContainer());
    }
    //KDJ绘图初始化
    exports.drawInit=function(xData){
        kdj.drawInit(xData);
        //更新KDJ线对象
        stage.update(kdj.getContainer());
    }
    //绘制KDJ线
    exports.drawKDJ=function(KDJ_,visibleStart,visibleCount){
        kdj.drawKDJ(KDJ_,visibleStart,visibleCount);
        stage.update(kdj.getContainer());
    }
    //绘制左右移动线
    exports.drawMoveLine=function(mDate){
        kdj.drawMoveLine(mDate);
        stage.update(kdj.getContainer());
    }
    //清除移动十字线
    exports.cleanDrawMoveLine=function(){
        kdj.cleanDrawMoveLine();
        stage.update(kdj.getContainer());
    }
    //清理所有绘制的数据
    exports.clean = function () {
        kdj.clean();
    }
    //初始化自适应舞台大小
    var initStageSize = function() {
        //获取canvas容器div动态宽度
        var width = document.getElementById("kdj-div").offsetWidth;
        var proportion=util.toDecimal(width/600);//计算比例
        var height=Math.round(proportion*120);
        //console.log("width="+width+",height="+height+","+proportion);
        $('#kdj_canvas').attr('width', width);
        $('#kdj_canvas').attr('height', height);
        stage.update();
        //更新文本
        var cw=$('#kdj_canvas').attr("width");
        var ch=$('#kdj_canvas').attr("height");
        console.log("KDJ舞台："+cw+","+ch);
        //舞台更新
        stage.update();
    }
});