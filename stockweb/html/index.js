/**
 * Created by Administrator on 2016/3/31.
 */
define(function(require, exports, module){

    var util=require("../js/util/Util.js");
    var jsonData=require("../js/kdata.js");
    var move=require("../js/kmain.js");
    var stage=null;
    var container=null;

    //初始化函数
    exports.initialize=function(){
        var canvas=document.getElementById("k_canvas");
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
        //console.log(stage.getBounds()+""+container.getBounds());
        //var stock= JSON.parse(jsonData.stockStr1);
        //var stock= JSON.parse(jsonData.stockStr3);
        //var stock= JSON.parse(jsonData.stockStr5);
        //var stock= JSON.parse(jsonData.stockStr14);
        //var stock= JSON.parse(jsonData.stockStr16);
        //var stock= JSON.parse(jsonData.stockStr59);
        //var stock= JSON.parse(jsonData.stockStr60);
        var stock= JSON.parse(jsonData.stockStrAll);
        //初始化K移动
        move.initialize(stock,canvas,stage,container);


        //var day_=stock.DAY;
        //var k_=stock.K;
        //var close_=new Array();
        //for(var i=0;i<k_.length;i++){
        //    close_.push(k_[i][3]);
        //}
        ////console.log(day_);
        ////console.log(k_);
        ////console.log(close_);
        //var MA5_=getAverage(close_,5);
        //var MA10_=getAverage(close_,10);
        //var MA20_=getAverage(close_,20);
        //var MA30_=getAverage(close_,30);
        //var MA60_=getAverage(close_,60);
        //var MA120_=getAverage(close_,120);
        //var a5="";
        //var a10="";
        //var a20="";
        //var a30="";
        //var a60="";
        //var a120="";
        //for(var j5=0;j5<MA5_.length;j5++){
        //    a5+="\""+MA5_[j5]+"\",";
        //}
        //for(var j10=0;j10<MA10_.length;j10++){
        //    a10+="\""+MA10_[j10]+"\",";
        //}
        //for(var j20=0;j20<MA20_.length;j20++){
        //    a20+="\""+MA20_[j20]+"\",";
        //}
        //for(var j30=0;j30<MA30_.length;j30++){
        //    a30+="\""+MA30_[j30]+"\",";
        //}
        //for(var j60=0;j60<MA60_.length;j60++){
        //    a60+="\""+MA60_[j60]+"\",";
        //}
        //for(var j120=0;j120<MA120_.length;j120++){
        //    a120+="\""+MA120_[j120]+"\",";
        //}
        //console.log(a5);
        //console.log(a10);
        //console.log(a20);
        //console.log(a30);
        //console.log(a60);
        //console.log(a120);
        //console.log(a250);

        //console.log(k_);
        //var KDJArray=getKDJ(9,3,3,k_);
        //var aa="";
        //for(var i=0;i<KDJArray.length;i++){
        //    var KDJ=KDJArray[i];
        //    aa+="[\""+KDJ.K+"\",\""+KDJ.D+"\",\""+KDJ.J+"\"],";
        //}
        //console.log(aa);
    }
    //初始化自适应舞台大小
    var initStageSize = function() {
        //获取canvas容器div动态宽度
        var width = document.getElementById("k-div").offsetWidth;
        var proportion=util.toDecimal(width/600);//计算比例
        var height=Math.round(proportion*350);
        //console.log("width="+width+",height="+height+","+proportion);
        $('#k_canvas').attr('width', width);
        $('#k_canvas').attr('height', height);
        stage.update();
        //更新
        var cw=$('#k_canvas').attr("width");
        var ch=$('#k_canvas').attr("height");
        console.log("K舞台："+cw+","+ch);
        //舞台更新
        stage.update();
    }

    /**
     * [服务端计算获取]
     * 统计学分析公式，指数平滑移动平均线
     * 移动平均线，Moving Average，简称MA，原本的意思是移动平均。
     * 由于我们将其制作成线形，所以一般称之为移动平均线，简称均线。
     * 它是将某一段时间的收盘价之和除以该周期。 比如日线MA5指5天内的收盘价除以5 。
     * 从5日指数平滑移动平均线为例，计算方式是首先以算术移动平均线计算出第一移动平均线，
     * 第二个移动平均线为：（第6日收盘价×1/5）+（前一日移动平均线×4/5）
     * 公式EMA=C6*1/5+EMA5*4/5
     * */
    /*
     var getAverage = function (close_, day) {
     if (day <= close_.length) {
     var average = new Array(close_.length);
     if (close_.length > 0) {
     var index = 0;
     var aveIndex = 0;
     while (index < close_.length) {
     var add = 0;
     if (aveIndex == 0) {
     for (var i = 0; i < day; i++) {
     if ((i + index) <= close_.length - 1) {
     //console.log(close_[i + index]);
     add += Number(close_[i + index]);
     }
     }
     try {
     //第一个移动平均线计算
     average[aveIndex] = util.toDecimal(add / day).toFixed(2);
     //console.log("第一个："+average[aveIndex]);
     } catch (e) {
     return null;
     }
     } else {
     //第N个移动平均线计算公式为EMA=C6*1/5+EMA5*4/5
     average[aveIndex] = (close_[index] * 1) / day + (average[aveIndex - 1] * (day - 1)) / day;
     }
     average[aveIndex] =util.toDecimal(average[aveIndex]).toFixed(2);
     ++index;
     aveIndex += 1;
     }
     }
     return average;
     } else {
     return null;
     }
     }
     */
    /**
     * [服务端计算获取]
     * KDJ算法
     * N        9
     * M1       3
     * M2       3
     * yData    K线数据
     * */
    /*
     var getKDJ=function(N,M1,M2,k_){
     //console.log(k_);
     var KDJArray=new Array();
     for(var i=0;i< k_.length;i++){
     var open = k_[i][0];//开
     var high = k_[i][1];//高
     var low = k_[i][2];//低
     var close = k_[i][3];//收
     //console.log(open+"-"+high+"-"+low+"-"+close);
     if(open<1 && high<1 && low<1 && close<1){
     continue;
     }
     var price=getPrice(i,N,k_);
     var KDJ=new Object();
     var Cn=price.Cn;//Cn为N日的收盘价
     var Ln=price.Ln;//Hn为i日内的最低价
     var Hn=price.Hn;//Ln为i日内的最高价
     var RSV=(Cn-Ln)/(Hn-Ln)*100;//未成熟随机指标值
     //console.log("Cn="+Cn+",Ln="+Ln+",Hn="+Hn+",RSV="+RSV+","+isNaN(RSV));
     RSV=isNaN(RSV)?100:RSV;
     RSV=util.toDecimal(RSV).toFixed(2);
     if(i==0){
     KDJ.K=0;
     KDJ.D=0;
     KDJ.J=3*KDJ.K-2*KDJ.D;
     }else{
     var preKDJ=KDJArray[i-1];
     KDJ.K=(2/M1*preKDJ.K)+(1/M1*RSV);
     KDJ.D=(2/M2*preKDJ.D)+(1/M2*KDJ.K);
     KDJ.J=3*KDJ.K-2*KDJ.D;
     }
     KDJ.J=isNaN(KDJ.J)?100:KDJ.J;
     if (KDJ.K < 0) KDJ.K = 0;
     if (KDJ.K > 100) KDJ.K = 100;
     if (KDJ.D < 0) KDJ.D = 0;
     if (KDJ.D > 100) KDJ.D = 100;
     if (KDJ.J < 0) KDJ.J = 0;
     if (KDJ.J > 100) KDJ.J = 100;
     KDJ.K=util.toDecimal(KDJ.K).toFixed(2);
     KDJ.D=util.toDecimal(KDJ.D).toFixed(2);
     KDJ.J=util.toDecimal(KDJ.J).toFixed(2);
     //console.log("Cn="+Cn+",Ln="+Ln+",Hn="+Hn+",RSV="+RSV+","+isNaN(RSV)+",K="+KDJ.K+",D="+KDJ.D+",J="+KDJ.J);
     KDJArray.push(KDJ);
     lh=null;
     }
     return KDJArray;
     }
     */
    /**
     * 从index日开始获得N日内的：
     * 最高价(high)。
     * 最低价(low)。
     * 第N日的收盘价，如果N是9，则返回9日内的第9日的收盘价。
     * */
    /*
     var getPrice=function(index,N,k_){
     var len=k_.length;
     var Ln=k_[index][2];//低
     var Hn=k_[index][1];//高
     var Cn=0;//收
     for(var i=0;i<N;i++){
     var k=index+i;
     if(k<len){
     var open = k_[k][0];//开
     var high = k_[k][1];//高
     var low = k_[k][2];//低
     var close = k_[k][3];//收
     //console.log(k+","+index+"-"+i+"-"+open+"-"+high+"-"+low+"-"+close);
     //填充数据跳过
     if(open==0 && high==0 && low==0 && close==0){
     continue;
     }
     //最低价(low)
     var nLn=low;
     if(Ln>nLn){
     Ln=nLn;
     }
     //最高价(high)
     var nHn=high;
     if(Hn<nHn){
     Hn=nHn;
     }
     //第N日的收盘价
     Cn=close;//收
     }else{
     break;
     }
     }
     //console.log("Ln="+Ln+",Hn="+Hn+",Cn="+Cn);
     var price=new Object();
     price.Ln=Ln;
     price.Hn=Hn;
     price.Cn=Cn;
     return price;
     }*/
});