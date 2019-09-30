/**
* Created by 王明凡 on 2016/3/20.
* 日期处理工具类
*/
define(function(require, exports, module){
    /**
     * 判断闰年
     * @param date Date日期对象
     * @return boolean true 或false
     */
    exports.isLeapYear = function(date){
        return (0==date.getYear()%4&&((date.getYear()%100!=0)||(date.getYear()%400==0)));
    }

    /**
     * 日期对象转换为指定格式的字符串
     * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
     * @param date Date日期对象, 如果缺省，则为当前时间
     *
     * YYYY/yyyy/YY/yy 表示年份
     * MM/M 月份
     * W/w 星期
     * dd/DD/d/D 日期
     * hh/HH/h/H 时间
     * mm/m 分钟
     * ss/SS/s/S 秒
     * @return string 指定格式的时间字符串
     */
    exports.dateToStr = function(formatStr, date){
        formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
        date = arguments[1] || new Date();
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];
        str=str.replace(/yyyy|YYYY/,date.getFullYear());
        str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
        str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
        str=str.replace(/M/g,date.getMonth());
        str=str.replace(/w|W/g,Week[date.getDay()]);

        str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
        str=str.replace(/d|D/g,date.getDate());

        str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
        str=str.replace(/h|H/g,date.getHours());
        str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
        str=str.replace(/m/g,date.getMinutes());

        str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
        str=str.replace(/s|S/g,date.getSeconds());

        return str;
    }


    /**
     * 日期计算
     * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param num int
     * @param date Date 日期对象
     * @return Date 返回日期对象
     */
    exports.dateAdd = function(strInterval, num, date){
        date =  arguments[2] || new Date();
        switch (strInterval) {
            case 's' :return new Date(date.getTime() + (1000 * num));
            case 'n' :return new Date(date.getTime() + (60000 * num));
            case 'h' :return new Date(date.getTime() + (3600000 * num));
            case 'd' :return new Date(date.getTime() + (86400000 * num));
            case 'w' :return new Date(date.getTime() + ((86400000 * 7) * num));
            case 'm' :return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            case 'y' :return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        }
    }

    /**
     * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
     * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     */
    exports.dateDiff = function(strInterval, dtStart, dtEnd) {
        switch (strInterval) {
            case 's' :return parseInt((dtEnd - dtStart) / 1000);
            case 'n' :return parseInt((dtEnd - dtStart) / 60000);
            case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
            case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
            case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
            case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
        }
    }

    /**
     * 字符串转换为日期对象
     * @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
     */
    exports.strToDate = function(dateStr){
        var data = dateStr;
        var reCat = /(\d{1,4})/gm;
        var t = data.match(reCat);
        t[1] = t[1] - 1;
        eval('var d = new Date('+t.join(',')+');');
        return d;
    }

    /**
     * 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
     *
     */
    exports.strFormatToDate = function(formatStr, dateStr){
        var year = 0;
        var start = -1;
        var len = dateStr.length;
        if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
            year = dateStr.substr(start, 4);
        }
        var month = 0;
        if((start = formatStr.indexOf('MM')) > -1  && start < len){
            month = parseInt(dateStr.substr(start, 2)) - 1;
        }
        var day = 0;
        if((start = formatStr.indexOf('dd')) > -1 && start < len){
            day = parseInt(dateStr.substr(start, 2));
        }
        var hour = 0;
        if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
            hour = parseInt(dateStr.substr(start, 2));
        }
        var minute = 0;
        if((start = formatStr.indexOf('mm')) > -1  && start < len){
            minute = dateStr.substr(start, 2);
        }
        var second = 0;
        if((start = formatStr.indexOf('ss')) > -1  && start < len){
            second = dateStr.substr(start, 2);
        }
        return new Date(year, month, day, hour, minute, second);
    }


    /**
     * 日期对象转换为毫秒数
     */
    exports.dateToLong = function(date){
        return date.getTime();
    }

    /**
     * 毫秒转换为日期对象
     * @param dateVal number 日期的毫秒数
     */
    exports.longToDate = function(dateVal){
        return new Date(dateVal);
    }

    /**
     * 判断字符串是否为日期格式
     * @param str string 字符串
     * @param formatStr string 日期格式， 如下 yyyy-MM-dd
     */
    exports.isDate = function(str, formatStr){
        if (formatStr == null){
            formatStr = "yyyyMMdd";
        }
        var yIndex = formatStr.indexOf("yyyy");
        if(yIndex==-1){
            return false;
        }
        var year = str.substring(yIndex,yIndex+4);
        var mIndex = formatStr.indexOf("MM");
        if(mIndex==-1){
            return false;
        }
        var month = str.substring(mIndex,mIndex+2);
        var dIndex = formatStr.indexOf("dd");
        if(dIndex==-1){
            return false;
        }
        var day = str.substring(dIndex,dIndex+2);
        if(!this.isNumber(year)||year>"2100" || year< "1900"){
            return false;
        }
        if(!this.isNumber(month)||month>"12" || month< "01"){
            return false;
        }
        if(day>this.getMaxDay(year,month) || day< "01"){
            return false;
        }
        return true;
    }
    /**
     *
     * */
    exports.getMaxDay = function(year,month) {
        if(month==4||month==6||month==9||month==11)
            return "30";
        if(month==2)
            if(year%4==0&&year%100!=0 || year%400==0)
                return "29";
            else
                return "28";
        return "31";
    }

    /**
     *   变量是否为数字
     */
    exports.isNumber = function(str)
    {
        var regExp = /^\d+$/g;
        return regExp.test(str);
    }

    /**
     * 把日期分割成数组 [年、月、日、时、分、秒]
     */
    exports.toArray = function(myDate)
    {
        myDate = arguments[0] || new Date();
        var myArray = Array();
        myArray[0] = myDate.getFullYear();
        myArray[1] = myDate.getMonth();
        myArray[2] = myDate.getDate();
        myArray[3] = myDate.getHours();
        myArray[4] = myDate.getMinutes();
        myArray[5] = myDate.getSeconds();
        return myArray;
    }

    /**
     * 取得日期数据信息
     * 参数 interval 表示数据类型
     * y 年 M月 d日 w星期 ww周 h时 n分 s秒
     */
    exports.datePart = function(interval, myDate)
    {
        myDate = arguments[1] || new Date();
        var partStr='';
        var Week = ['日','一','二','三','四','五','六'];
        switch (interval)
        {
            case 'y' :partStr = myDate.getFullYear();break;
            case 'M' :partStr = myDate.getMonth()+1;break;
            case 'd' :partStr = myDate.getDate();break;
            case 'w' :partStr = Week[myDate.getDay()];break;
            case 'ww' :partStr = myDate.WeekNumOfYear();break;
            case 'h' :partStr = myDate.getHours();break;
            case 'm' :partStr = myDate.getMinutes();break;
            case 's' :partStr = myDate.getSeconds();break;
        }
        return partStr;
    }

    /**
     * 取得当前日期所在月的最大天数
     */
    exports.maxDayOfDate = function(date)
    {
        date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
    }

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * */
    exports.format=function (fmt,date) {
        var o = {
            "M+" : date.getMonth() + 1, //月份
            "d+" : date.getDate(), //日
            "h+" : date.getHours(), //小时
            "m+" : date.getMinutes(), //分
            "s+" : date.getSeconds(), //秒
            "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
            "S" : date.getMilliseconds()
            //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for ( var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * 判断是否为闰年
     * */
    exports.isLeapYear=function (year) {
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    }

    /**
     * 根据开始和结束日期计算总天数，日期转换为毫秒数计算
     * start "2015-03-23"
     * end   "2016-03-22"
     * */
    exports.sumDay=function(start,end){
        var start = Date.parse(start);
        var end = Date.parse(end);
        var day = Math.abs((start - end)) / (1000 * 60 * 60 * 24);
        return day;
    }

    /**
     * 根据当前日期计算去年
     * current   "2016-03-22"
     * */
    exports.lastYear=function(current){
        var date = new Date(current);
        date.setMonth(d.getMonth() - 12);//减去12月
        date.setDate(d.getDate() + 1);//加上一天
        var fmt=format("yyyy-MM-dd",date);
        date=null;
        return fmt;
    }

    /**
     * 根据当前日期计算上月
     * current   "2016-03-22"
     * */
    exports.lastYear=function(current){
        var date=new Date(current);
        date.setMonth(d.getMonth() - 1);//减去1月
        date.setDate(d.getDate() + 1);//加上一天
        var fmt=format("yyyy-MM-dd",date);
        date=null;
        return fmt;
    }

    /**
     * 日期对象转换为指定格式的字符串
     * format	日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
     * date 	Date日期对象, 如果缺省，则为当前时间
     * YYYY/yyyy/YY/yy 表示年份
     * MM/M 月份
     * W/w 星期
     * dd/DD/d/D 日期
     * hh/HH/h/H 时间
     * mm/m 分钟
     * ss/SS/s/S 秒
     * */
    exports.formatDate = function(format, date){
        format = arguments[0] || "yyyy-MM-dd HH:mm:ss";
        date = arguments[1] || new Date();
        var str = format;
        var Week = ['日','一','二','三','四','五','六'];
        str=str.replace(/yyyy|YYYY/,date.getFullYear());
        str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
        str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
        str=str.replace(/M/g,date.getMonth());
        str=str.replace(/w|W/g,Week[date.getDay()]);

        str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
        str=str.replace(/d|D/g,date.getDate());

        str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
        str=str.replace(/h|H/g,date.getHours());
        str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
        str=str.replace(/m/g,date.getMinutes());

        str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
        str=str.replace(/s|S/g,date.getSeconds());

        return str;
    }
});