
var Model = {} ;
    Model.clock = null ;
	Model.books = [] ;
  Model.bookIndex = 0 ;
  Model.bookIsOpen = false ;
  Model.videoIsPlaying = false ;
	Model.prevBook = function(){
      if(UI.bookFace.length < Model.books.length){
         UI.log($('book'),'书没下载完，等会儿！') ;
        setTimeout(function(){
          UI.log($('book'),'计算思维系列课程@masterLijh') ; 
        },2000);
        
        return ;
      }
     if(Model.bookIndex > 0){
				Model.bookIndex -- ;
			}else{
				Model.bookIndex = Model.books.length -1
			}
      UI.log($('book'), Model.books[Model.bookIndex].name);
		 };
     
		Model.nextBook = function (){
      if(UI.bookFace.length < Model.books.length){
        UI.log($('book'),'书没下载完，等会儿！') ;
        setTimeout(function(){
          UI.log($('book'),'计算思维系列课程@masterLijh') ; 
        },2000);
        return ;
      }
			if(Model.bookIndex < Model.books.length -1 ){
				Model.bookIndex ++ ;
			}else{
				Model.bookIndex = 0;
			}
      UI.log($('book'), Model.books[Model.bookIndex].name);
		 };

var UI = {} ;
    UI.bookFace = [] ;
    UI.log = function(ele, str){
        ele.textContent = str ;
    } ;


var Plan = {} ;
    Plan.responsiveUI = function(){
    UI.deviceWidth = window.innerWidth >= 600 ? 600 :  window.innerWidth ; 
    UI.deviceHeight = window.innerHeight ;
    UI.fontBase = parseInt(UI.deviceWidth / 21);
   
   document.body.style.width = UI.deviceWidth + "px" ;
   document.body.style.height = UI.deviceHeight + "px" ;
   document.body.style.fontSize = UI.fontBase + "px" ;
 
     $("book").style.lineHeight = UI.deviceHeight * 0.15 + 'px' ;
     $("chapter").style.lineHeight = UI.deviceHeight * 0.1 + 'px' ;
     $("statusInfo").style.lineHeight = UI.deviceHeight * 0.1 + 'px' ;
   //为将书封面的完美按比例设置在客户设备的main区域，需要计算图片的纵横比
    
  } //Plan.responsiveUI

 //imgArr为图片路径构成的数组
  Plan.loadImgOneByOne = function(imgArr){
    //------ lesson下的十几门课的封面图片的地址，源于json文本数据文件
     let img = new Image();
      img.id = 'bookFace' ;
      img.src =  imgArr[Model.bookIndex] ;
     
        img.addEventListener('load', function(){ 
          UI.bookFace.push(this) ;
         if ( Model.bookIndex < imgArr.length - 1 ){  //此处修改了以前逻辑的bug
           Model.bookIndex ++ ;
           Plan.loadImgOneByOne(imgArr);
          }
          let s = imgArr[Model.bookIndex].slice(0,imgArr[Model.bookIndex].length - 4) ;
          UI.log($('statusInfo'), '《 '+ s + ' 》'+ ' has been loaded !')
          } );  //img.addEventListener('load'。。。
       }//Plan.loadImgOneByOne

//httpLoader模型读入文本文件后，把文本处理为数组。
var httpLoader = { 
       textContent: [] , 
      _textContent: '' ,
       request: function(url, interval){
               this._request(url) ;
               typeof interval == "number" ? interval  : interval = 2 ;
                setTimeout(function(){  
                 let txt = httpLoader._textContent ;
                 if(txt.length > 1 ){
                  httpLoader.textContent = txt.split("\n"); 
                 }else{
                  console.log( "首次发起http请求的文件失败，请查查原因！") ;
                  setTimeout(httpLoader.request(url),interval*1000) ;
                  console.log("延时 " + interval + " s, 再次发起http请求");
                 }
              },interval*1000); //设定重新发起http请求
      } , // end of request
          _request: function( url ){
			         this._textContent = '' ; 
                let xhr = new XMLHttpRequest() ;
			          xhr.onreadystatechange = callback ; //注意：XMLHttpRequest的实例不支持 addEventListener方法
                xhr.open('GET', url, true); //true 设定为异步请求，false为同步请求
                xhr.send('');
    
				function callback(){ 
					        if (this.readyState === 1 ){
                    console.log("Request begin...");
                   return ;
                   } 
                  if (this.readyState === 2 ){
                    console.log("loading...");
                    return ;
                  } 
                  if (this.readyState === 3 ){
                    console.log("Http interact... ");
                    return ;
                  } 
                if (this.readyState === 4 ){
                    console.log("Request  is complete .");
                   if (xhr.status !== 200){
                      console.log("HttpServer refused ! ");
                      return ;
                   }else{
                       httpLoader._textContent = this.responseText; 
                   } // success of 
                }//readyState === 4
       }//end of callback	     
      },//end _request method
	 } ; //End httpLoader 
	 
 
     function $(ele){
        if (typeof ele !== 'string'){
           throw("自定义的$函数参数的数据类型错误，实参必须是字符串！");
           return 
        } 
        let dom = document.getElementById(ele) ;
          if(dom){
            return dom ;
          }else{
            dom = document.querySelector(ele) ;
            if (dom) {
                return dom ;
            }else{
                throw("执行$函数未能在页面上获取任何元素，请自查问题！");
                return ;
            }
          }
       } //end of $