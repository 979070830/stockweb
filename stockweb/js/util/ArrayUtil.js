/**
 * Created by Administrator on 2016/3/20.
 * 数组工具类
 */
define(function(require, exports, module){

    //二维数组转一维数组
    exports.toOneArray=function (data) {
        //console.log(data);
        var result=new Array();
        for(var i=0;i<data.length;i++){
            var arr=data[i];
            for(var j=0;j<arr.length;j++){
                if(arr[j]>0){//数据必须大于0
                    result.push(arr[j]);
                }
            }
        }
        return result;
    }

    //去除数组重复元素
    exports.uniqueArray=function (data) {
        data = data || [];
        var a = {};
        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            if (typeof(a[v]) == "undefined") {
                a[v] = 1;
            }
        }
        data.length = 0;
        for (var i in a) {
            data[data.length] = i;
        }
        return data;
    }

    // 按照数字顺序排序的排序函数
    exports.numberOrder=function (a,b) {
        return a-b;
    }

    /**
     * 获取一个1-100填充的数组
     * value    填充数据
     * */
    exports.pushArray=function(value){
        var arr=new Array();
        var util=require("../util/Util.js");
        var min=1;
        var max=100;
        //js小数相加会出现精度问题，比如：1.1300000000000001，只有放大100倍来计算
        min*=100;
        value*=100;
        while(min/100<=max){
            //显示小数点后两位
            arr.push(util.toDecimal(min/100).toFixed(2));
            min+=value;
        }
        util=null;
        return arr;
    }

    /**
     * 数组内容数据填充，填充范围0.1-1
     * arr      填充数组
     * value    填充数据
     * range    +-范围
     * */
    exports.pushRangeArray=function(arr,value,range){
        //底部减少range个范围
        var minK=Math.round(arr[0])-range;
        //顶部扩大range个范围
        var maxK=Math.round(arr[arr.length-1])+range;
        var util=require("../util/Util.js");
        //js小数相加会出现精度问题，比如：1.1300000000000001，只有放大100倍来计算
        minK*=100;
        value*=100;
        while(minK/100<=maxK){
            //显示小数点后两位
            arr.push(util.toDecimal(minK/100).toFixed(2));
            minK+=value;
        }
        util=null;
        //去重
        arr=this.uniqueArray(arr);
        //排序
        arr.sort(this.numberOrder);
        return arr;
    }

    //如果少于最大显示数量，则填充日期数据
    exports.pushForDate=function(max,xData){
        var dateUtil=require("../util/DateUtil.js");
        if(xData.length<max){
            var count=max-xData.length;
            var date=dateUtil.format("yyyy/MM/dd",new Date());
            for(var i=0;i<count;i++){
                xData.push(date);
            }
        }
        dateUtil=null;
        return xData;
    }
    //如果少于最大显示数量，则填充K线数据
    exports.pushForK=function(max,yData){
        if(yData.length<max){
            var count=max-yData.length;
            for(var i=0;i<count;i++){
                yData.push(["0","0","0","0"]);
            }
        }
        return yData;
    }
});