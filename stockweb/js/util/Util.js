/**
 * Created by Administrator on 2016/3/20.
 * 工具类
 */
define(function(require, exports, module){

    /**
     * 将浮点数四舍五入，取小数点后2位
     * */
    exports.toDecimal=function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(x*100)/100;
        return f;
    }

    /**
     * 获取均线颜色
     * */
    exports.getMAColor=function(day){
        var color;
        switch (day){
            case 5:
                color="#ffffff";
                break;
            case 10:
                color="#ffff0b";
                break;
            case 20:
                color="#ff80ff";
                break;
            case 30:
                color="#00e600";
                break;
            case 60:
                color="#02e2f4";
                break;
            case 120:
                color="#ffffb9";
                break;
            case 250:
                color="#818123";
                break;
            default :
                while(true){
                    color=this.randomColor();
                    //console.log("color1="+color);
                    if(color=="#ffffff" ||
                        color=="#ffff0b" ||
                        color=="#ff80ff" ||
                        color=="#00e600"||
                        color=="#02e2f4"){
                        //console.log("color2="+color);
                        continue;
                    }else{
                        break;
                    }
                }
                break;
        }
        return color;
    }

    /**
     * 随机颜色
     * */
    exports.randomColor=function(){
        return "#"+("00000"+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    }

    /**
     * 遍历object对象属性信息
     * */
    exports.info=function(object){
        var attr="";
        for(var i in object){
            attr+="属性名:"+i+",属性参数:"+object[i]+"\n";
        }
        console.log(attr);
    }

    /**
     * 绘制X方向虚线绘(太卡了，建议不要绘制虚线)
     * */
    exports.drawDashedX=function(line,mx,my){
        //绘制虚线
        var i=2;
        line.graphics.moveTo(0, my);
        line.graphics.lineTo(i, my);
        while(i<mx){
            line.graphics.beginStroke("0xff");
            i+=2;
            line.graphics.lineTo(i, my);
            i+=2;
            line.graphics.lineTo(i, my);
            //console.log(i);
        }
    }

    /**
     * 绘制Y方向虚线
     * */
    exports.drawDashedY=function(line,mx,my){
        //绘制虚线
        var i=2;
        line.graphics.moveTo(mx, 0);
        line.graphics.lineTo(mx, i);
        while(i<my){
            line.graphics.beginStroke("0xff");
            i+=2;
            line.graphics.lineTo(mx, i);
            i+=2;
            line.graphics.lineTo(mx, i);
            //console.log(i);
        }
    }

    /**
     * 获取当前程序运行的路径
     * 在线地址：
     * http://localhost:63342/www
     * 离线地址：
     * file:///D:/MyWorkSpace/HTML/www
     * file:///android_asset/www
     * project 工程名称 例如：'www'
     * */
    exports.getPath=function(project){
        var loc = document.location;
        var index = loc.href.indexOf(project);
        var path=loc.href.substring(0, index)+project;
        return path;
    }

    /**
     * 获取HTML标签当前在网页中的x坐标绝对位置
     * */
    exports.pageAbsoluteX=function(label){
        return pageX(label);
    }

    /**
     * 获取HTML标签当前在网页中的y坐标绝对位置
     * */
    exports.pageAbsoluteY=function(label){
        return pageY(label);
    }

    /**
     * 获取当前的x坐标值
     * */
    var pageX=function(label){
        return label.offsetParent?(label.offsetLeft+pageX(label.offsetParent)):label.offsetLeft;
    }

    /**
     * 获取当前的Y坐标值
     * */
    var pageY=function(label){
        return label.offsetParent?(label.offsetTop+pageY(label.offsetParent)):label.offsetTop;
    }

});