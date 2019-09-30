/**
 * Created by 王明凡 on 2016/3/20.
 * 公共js导入
 */
(function() {

    var project="stockweb";
    //返回基本路径
    var loc = document.location;
    var index = loc.href.indexOf(project);
    var path=loc.href.substring(0, index);
    console.log("当前HTML："+loc.href);
    //离线地址
    //file:///android_asset/stockweb/html/index.html
    //在线地址
    //http://localhost:63342/stockweb/html/index.html
    //console.log("当前path："+path);
    var zepto=path+project+"/js/extend/zepto.js";
    var sm=path+project+"/js/extend/sm.js";
    var easeljs=path+project+"/js/createjs/easeljs-0.8.2.js";
    var handlebars=path+project+"/js/extend/handlebars.js";
    //console.log(zepto);
    //console.log(sm);
    //console.log(easeljs);
    //console.log(handlebars);
    document.write("<script type='text/javascript' src='"+zepto+"'></script>");
    document.write("<script type='text/javascript' src='"+sm+"'></script>");
    document.write("<script type='text/javascript' src='"+easeljs+"'></script>");
    document.write("<script type='text/javascript' src='"+handlebars+"'></script>");
	//转换html路径为js路径
    var index=loc.href.indexOf(".html");
    var js = loc.href.substring(0, index)+".js";
    console.log("当前js："+js);
    //加载执行
    window.onload=function(){
        //完成触发
        $(document).ready(function(){
            seajs.use(js,function(value){
                value.initialize();
            });
        });
    }
})();