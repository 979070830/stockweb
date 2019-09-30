/**
 * Created by 王明凡 on 2016/4/10.
 * 键盘移动事件
 */
define(function (require, exports, module) {

    var util = require("../js/util/Util.js");
    var arrayUtil = require("../js/util/ArrayUtil.js");
    var k = require("../js/extend/k.js");
    var kdj_main = require("../js/kdjmain.js");

    var visibleStart = 0;//默认显示起点
    var visibleEnd = 0;//默认显示终点
    var visibleCount = 0;//显示数量
    var maxVisibleCount = 60;//默认最大显示数量
    var minVisibleCount = 10;//默认最小显示数量
    var moveCount = 10;//每次上下缩放或左右移动的数量
    var push = -1;//是否填充过数据，大于-1则是填充数据的数量
    var indexMoveLine = -1;//移动十字线索引，只初始化一次
    var stage;//舞台对象
    var container;//显示容器
    var isShow=false;//是否显示过（键盘左键，键盘右键，鼠标左键）
    /**********JSON数据***********/
    var DAY_ = null;//日期
    var K_ = null;//k线数据(开，高，低，收)
    var MA5_ = null;//5日均线
    var MA10_ = null;//10日均线
    var MA20_ = null;//20日均线
    var MA30_ = null;//30日均线
    var MA60_ = null;//60日均线
    var MA120_ = null;//120日均线
    var MA250_ = null;//250日均线
    var KDJ_ = null;//KDJ数据

    /**
     * 初始化函数
     * */
    exports.initialize = function (stock_, canvas_, stage_, container_) {
        //获取数据
        DAY_ = stock_.DAY;
        K_ = stock_.K;
        MA5_ = stock_.MA5;
        MA10_ = stock_.MA10;
        MA20_ = stock_.MA20;
        MA30_ = stock_.MA30;
        MA120_ = stock_.MA120;
        MA250_ = stock_.MA250;
        MA60_ = stock_.MA60;
        KDJ_ = stock_.KDJ;
        push = DAY_.length < maxVisibleCount ? DAY_.length : -1;//判断是否填充
        DAY_ = arrayUtil.pushForDate(maxVisibleCount, DAY_);//填充空数据
        K_ = arrayUtil.pushForK(maxVisibleCount, K_);
        //初始化其他数据
        stage = stage_;
        container = container_;
        visibleCount = maxVisibleCount;
        visibleEnd = DAY_.length;
        visibleStart = visibleEnd - visibleCount;
        //创建k线对象
        k.K(canvas_.width, canvas_.height);
        //K线对象添加到容器
        container.addChild(k.getContainer());
        //初始化kdj_main对象
        kdj_main.initialize();
        //显示容器事件
        container.addEventListener("click", clickHandler, true);
        //container.addEventListener("pressmove", pressmoveHandler, true);
        //container.addEventListener("pressup", pressupHandler, true);
        //窗体事件
        window.addEventListener("click", windowClickHandler, true);
        //window.addEventListener("mousemove", windowMousemoveHandler, true);
        window.addEventListener("keydown", windowKeyDownHandler, true);
        window.addEventListener("keyup", windowKeyUpHandler, true);
        //设置显示范围
        show();
        //更新k线对象的容器
        stage.update(k.getContainer());
        //底部显示日期
        showDate();
        showCenterDate();
        showKDJInfo();
        showMAInfo();
    }

    /**
     * 显示K线和KDJ线
     * */
    var show = function () {
        //设置显示范围
        var dayShow = new Array();
        var kShow = new Array();
        var index = visibleStart;
        for (var i = 0; i < visibleCount; i++) {
            dayShow.push(DAY_[index]);
            kShow.push(K_[index]);
            index++;
        }
        //二维数组转一维数组
        var kInit = arrayUtil.toOneArray(kShow);
        //去重
        kInit = arrayUtil.uniqueArray(kInit);
        //排序
        kInit.sort(arrayUtil.numberOrder);
        //数据填充
        kInit = arrayUtil.pushRangeArray(kInit, 0.01, 2);
        //绘图初始化K线
        k.drawInit(dayShow, kInit);
        //显示K线
        for (var i = 0; i < dayShow.length; i++) {
            if (i == 0) {//第一个K线透明，防止遮挡住价格
                k.drawK(dayShow[i], kShow[i], 0.6, visibleStart + i);
            } else {
                k.drawK(dayShow[i], kShow[i], 1, visibleStart + i);
            }
        }
        //显示均线
        if (MA5_ != null) {
            k.drawMA(MA5_, 5, visibleStart, visibleCount);
        }
        if (MA10_ != null) {
            k.drawMA(MA10_, 10, visibleStart, visibleCount);
        }
        if (MA20_ != null) {
            k.drawMA(MA20_, 20, visibleStart, visibleCount);
        }
        if (MA30_ != null) {
            k.drawMA(MA30_, 30, visibleStart, visibleCount);
        }
        if (MA60_ != null) {
            k.drawMA(MA60_, 60, visibleStart, visibleCount);
        }
        if (MA120_ != null) {
            k.drawMA(MA120_, 120, visibleStart, visibleCount);
        }
        if (MA250_ != null) {
            k.drawMA(MA250_, 250, visibleStart, visibleCount);
        }
        //初始化移动十字线索引，只初始化一次
        if (indexMoveLine == -1) {
            indexMoveLine = (visibleStart + visibleCount) - 1;
        }
        //绘图初始化KDJ线
        kdj_main.drawInit(dayShow);
        //显示KDJ线
        kdj_main.drawKDJ(KDJ_, visibleStart, visibleCount);
        dayShow = null;
        kShow = null;
    }

    /**
     * 显示容器单击事件
     * */
    var clickHandler = function (event) {
        //util.info(event);
        //console.log(event);
        var index = k.XScreenToXIndex(event.rawX);
        //console.log(index+","+event.rawX+",y="+event.rawY);
        indexMoveLine = visibleStart + index;
        if (push != -1) {//填充过的数据
            if (indexMoveLine > push - 1) {
                indexMoveLine = push - 1;
            }
        }
        drawMoveLine(DAY_[indexMoveLine], K_[indexMoveLine]);
        //更新k线对象的容器
        stage.update(k.getContainer());
        isShow=true;
    }
    ///**
    // *
    // * */
    //var pressmoveHandler = function (event) {
    //    console.log("pressmoveHandler="+event.stageX+"-"+event.stageY);
    //}
    ///**
    // *
    // * */
    //var pressupHandler = function (event) {
    //    console.log("pressupHandler="+event.stageX+"-"+event.stageY);
    //}
    /**
     * 窗体移动事件
     * */
    //var windowMousemoveHandler=function(event){
    //    if(event.target.id=="k_canvas"){
    //        //console.log(event.target)
    //        var ax=util.pageAbsoluteX(event.target);
    //        var ay=util.pageAbsoluteY(event.target);
    //        var mx=event.clientX-ax;
    //        var my=event.clientY-ay;
    //        console.log(mx+":"+my+","+event.clientX+":"+event.clientY+","+ax+":"+ay);
    //       // startDrawMoveLine(mx);
    //    }
    //}

    /**
     * 绘制左右移动线
     * */
    var drawMoveLine = function (mDate, mK) {
        k.drawMoveLine(mDate, mK);
        kdj_main.drawMoveLine(mDate);
        showCenterDate();
        showKDJInfo();
        showMAInfo();
    }

    /**
     * 清理
     * */
    var clean = function () {
        k.clean();
        kdj_main.clean();
    }

    /**
     * K线底部日期
     * */
    var showDate = function () {
        var startIndex = visibleStart;
        var endIndex = visibleStart + visibleCount - 1;
        $(".k-date-start").text(DAY_[startIndex]);
        $(".k-date-end").text(DAY_[endIndex]);
    }
    /**
     * K线中间日期
     * */
    var showCenterDate = function () {
        $(".k-date-middle").text(DAY_[indexMoveLine]);
    }

    /**
     * 显示KDJ信息
     * */
    var showKDJInfo = function () {
        var kdj=KDJ_[indexMoveLine];
        //console.log("K="+kdj[0]+" "+"D="+kdj[1]+" "+"J="+kdj[2]);
        if(kdj==undefined){
            kdj=KDJ_[KDJ_.length-1];
        }
        $(".kdj-info-div .k").text("K:"+kdj[0]);
        $(".kdj-info-div .d").text("D:"+kdj[1]);
        $(".kdj-info-div .j").text("J:"+kdj[2]);
    }
    /**
     * 显示均线信息
     * */
    var showMAInfo=function(){
        //console.log(MA5_[indexMoveLine])
        //console.log(MA5_+","+MA5_[indexMoveLine]);
        setMAInfo(MA5_,"MA5",indexMoveLine);
        setMAInfo(MA10_,"MA10",indexMoveLine);
        setMAInfo(MA20_,"MA20",indexMoveLine);
        setMAInfo(MA30_,"MA30",indexMoveLine);
        setMAInfo(MA60_,"MA60",indexMoveLine);
        setMAInfo(MA120_,"MA120",indexMoveLine);
        setMAInfo(MA250_,"MA250",indexMoveLine);

    }

    /**
     * 设置显示均线信息
     * */
    var setMAInfo=function(MA,name,index){
        if(MA!=null && MA.length>0){
            if(MA[index]==undefined){
                $(".k-info-text-div ."+name).text(name+":"+MA[MA.length-1]);
            }else{
                $(".k-info-text-div ."+name).text(name+":"+MA[index]);
            }
        }else{
            $(".k-info-text-div ."+name).text(name+":- - - -");
        }
    }
    /**
     * 窗体单击事件
     * */
    var windowClickHandler = function (event) {
        if(event.target.id!="k_canvas"){
            indexMoveLine = (visibleStart + visibleCount) - 1;
            kdj_main.cleanDrawMoveLine();
            k.cleanDrawMoveLine();
            stage.update(k.getContainer());
            showCenterDate();
            showKDJInfo();
            showMAInfo();
            isShow=false;
        }
    }
    /************************************[键盘事件]*************************************/
    /**
     * 键盘按下
     * */
    var windowKeyDownHandler = function (event) {
        if (event.keyCode == "37") {//Left
            if (indexMoveLine > 0) {
                if (push != -1) {//填充过的数据
                    if (indexMoveLine > push - 1) {
                        indexMoveLine = indexMoveLine - (visibleCount - push);
                    } else {
                        indexMoveLine--;
                    }
                } else {
                    indexMoveLine--;
                }
                showCenterDate();
                showKDJInfo();
                showMAInfo();
            }
        } else if (event.keyCode == "38") {//Up +(放大)
            if (push != -1) {//填充过的数据
                if (visibleCount > minVisibleCount) {
                    if (indexMoveLine >= push) {
                        indexMoveLine = push - 1;
                    }
                    upMax();
                } else {
                    console.log("已经是最大了!");
                }
            } else {
                upMax();
            }
            showDate();
        } else if (event.keyCode == "39") {//Right
            if (push != -1) {//填充过的数据
                if (indexMoveLine > push - 1) {
                    indexMoveLine = indexMoveLine - (visibleCount - push);
                } else {
                    if (indexMoveLine < push - 1) {
                        indexMoveLine++;
                    }
                }
            } else {
                if (indexMoveLine < DAY_.length - 1) {
                    indexMoveLine++;
                }
            }
            showCenterDate();
            showKDJInfo();
            showMAInfo();
        } else if (event.keyCode == "40") {//Down -(缩小)
            if (push != -1) {//填充过的数据
                if (push > visibleCount) {
                    downMin();
                } else {
                    if (indexMoveLine >= push) {
                        indexMoveLine = push - 1;
                    } else {
                        downMin();
                    }
                }
            } else {
                downMin();
            }
            showDate();
        } else {
            console.log("keyDown=" + event.keyCode);
        }
    }
    /**
     * 键盘弹起
     * */
    var windowKeyUpHandler = function (event) {
        if (event.keyCode == "37") {//Left
            if (indexMoveLine >= 0) {
                if (indexMoveLine < visibleStart) {
                    var moveCount = visibleStart - indexMoveLine;
                    visibleStart -= moveCount;
                    clean();
                    show();
                }
                drawMoveLine(DAY_[indexMoveLine], K_[indexMoveLine]);
                showDate();
                isShow=true;
            }
        } else if (event.keyCode == "38") {//Up +
            clean();
            show();
            if(isShow){
                drawMoveLine(DAY_[indexMoveLine], K_[indexMoveLine]);
            }
        } else if (event.keyCode == "39") {//Right
            if (indexMoveLine < DAY_.length) {
                if (indexMoveLine >= (visibleStart + visibleCount)) {
                    var moveCount = indexMoveLine - (visibleStart + visibleCount) + 1;
                    visibleStart += moveCount;
                    clean();
                    show();
                }
                drawMoveLine(DAY_[indexMoveLine], K_[indexMoveLine]);
                showDate();
                isShow=true;
            }
        } else if (event.keyCode == "40") {//Down -
            clean();
            show();
            if(isShow){
                drawMoveLine(DAY_[indexMoveLine], K_[indexMoveLine]);
            }
        } else {
            console.log("keyUp=" + event.keyCode);
        }
        //更新k线对象的容器
        stage.update(k.getContainer());
    }
    /**
     * Up放大
     * */
    var upMax = function () {
        //console.log(
        //    "\n visibleStart="+visibleStart
        //    +"\n visibleCount="+visibleCount
        //    +"\n indexMoveLine="+indexMoveLine
        //    +"\n currentVisibleEnd="+currentVisibleEnd
        //    +"\n visibleEnd="+visibleEnd
        //    +"\n push="+push);
        var half = moveCount / 2;
        var currentVisibleEnd = visibleStart + visibleCount - 1;//当前显示结束位置
        //当前显示数量必须大于最小显示数量
        //console.log(currentVisibleEnd+"-"+visibleStart+">"+minVisibleCount)
        if (currentVisibleEnd - visibleStart > minVisibleCount) {
            if (indexMoveLine < visibleStart + half) {//向左
                if (visibleStart > half) {
                    if (visibleStart >= indexMoveLine - half) {
                        visibleStart = indexMoveLine - half;
                    }
                } else {
                    //接近0位置
                    visibleCount -= moveCount;
                    if (visibleCount < minVisibleCount) {
                        visibleCount = minVisibleCount;
                    }
                }
            } else if (indexMoveLine > currentVisibleEnd - half) {//向右
                if (indexMoveLine + half < visibleEnd - 1) {
                    visibleStart += half;
                    if (visibleStart + visibleCount > visibleEnd) {
                        visibleStart = visibleEnd - visibleCount;
                    }
                } else {
                    visibleStart += half;
                    visibleCount -= half;
                }
            } else {//中间
                visibleStart += half;
                visibleCount -= moveCount;
                if (indexMoveLine - visibleStart < half) {
                    visibleStart = indexMoveLine - half;
                }
                var end = ((visibleStart + visibleCount) - 1) - indexMoveLine;
                if (end < half) {
                    visibleCount += half;
                    visibleCount -= end;
                }
            }
        } else {
            console.log("已经最大了！");
        }
    }
    /**
     * Down缩小
     * */
    var downMin = function () {
        //console.log(
        //    "\n visibleStart="+visibleStart
        //    +"\n visibleCount="+visibleCount
        //    +"\n indexMoveLine="+indexMoveLine
        //    +"\n currentVisibleEnd="+currentVisibleEnd
        //    +"\n visibleEnd="+visibleEnd
        //    +"\n push="+push);
        var half = moveCount / 2;
        var currentVisibleEnd = visibleStart + visibleCount - 1;//当前显示结束位置
        //当前显示数量必须小于总数量
        if (visibleEnd - visibleCount > moveCount) {
            if (indexMoveLine < visibleStart + half) {//向左
                if (visibleStart > 0) {
                    visibleStart -= half;
                    visibleCount += half;
                } else {
                    visibleCount += moveCount;
                }
            } else if (indexMoveLine > currentVisibleEnd - half) {//向右
                if (currentVisibleEnd < visibleEnd - 1) {
                    visibleStart -= half;
                    visibleCount += moveCount;
                    if (visibleStart + visibleCount > visibleEnd) {
                        visibleCount = visibleEnd - visibleStart;
                    }
                } else {
                    visibleStart -= moveCount;
                    visibleCount += moveCount;
                }
            } else {//中间
                visibleStart -= half;
                visibleCount += moveCount;
                if (visibleStart + visibleCount > visibleEnd) {
                    visibleCount = visibleEnd - visibleStart;
                }
            }
            if (visibleStart < 0) {
                visibleStart = 0;
            }
        } else {
            if (visibleStart > 0 || visibleCount < visibleEnd) {
                visibleStart = 0;
                if (visibleCount < visibleEnd) {
                    visibleCount = visibleEnd;
                }
            } else {
                console.log("已经最小了！");
            }
        }
    }

});
