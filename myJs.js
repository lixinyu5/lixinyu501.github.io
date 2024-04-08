Plan.responsiveUI() ;
httpLoader.request("myData.json") ;
setTimeout(function(){
 //  按httpLoader模型的设计，_textContent存放了获取的文本的字符串
   if(httpLoader._textContent.length > 1 ){
       loadData() ;
     }else{
     setTimeout(loadData(),3000); //针对极差的网络环境，再给第2次处理调入的数据的机会，若这次还无法调入，则说明用户网络状态无法运行本系统
    }
   function loadData(){
		let s = httpLoader._textContent ;
		Model.books = JSON.parse(s) ;
         let imgArr = [] ;
	  for (let book of Model.books ){
		imgArr.push(book.bookPage) ;
	   }
	  //console.log(imgArr);
	  Plan.loadImgOneByOne(imgArr) ;
	  Plan.addBookButtons() ;
   }
 },3000) ; //发出request("myData.json") 后，3s后第一次处理调入的数据

 

 
  document.body.onclick =document.body.ontouchstart = function(){
	UI.log($('book'), Model.books[0].name);
	
	$('main').replaceChild(UI.bookFace[0],$('bookFace')) ;
	$('bookFace').style.opacity = 0 ;
	setTimeout(function(){
		$('bookFace').style.opacity = 0.9 ;
	},200);
	
	Model.bookIndex = 0 ; //设置当前书的指针
	document.body.onclick = document.body.ontouchstart = null ; 
    Plan.createMyUI() ;
  }; //第一次点击软件，进入选择书本

Plan.createMyUI = function(){

  Model.mouse = {
	isDown: false ,
	x : 0 ,
	deltaX : 0 ,
	 } ;

  $('main').addEventListener("mousedown", function(ev){
    ev.preventDefault() ;
	console.log("mouse is down! ");
    Model.mouse.isDown = true ;
	Model.mouse.x = ev.pageX ;
   }) ;
  $('main').addEventListener("mousemove", function(ev){
	ev.preventDefault() ;
   let mouse = Model.mouse ;
   if (mouse.isDown && Math.abs($('bookFace').offsetLeft) < UI.deviceWidth / 5){
	   console.log("认可的 mouse事件： down and moving");
	   mouse.deltaX = ev.pageX - mouse.x ;
	   $('bookFace').style.left = $('bookFace').offsetLeft + mouse.deltaX + 'px' ;
	   mouse.deltaX = 0 ;
   } //end if mouse.isDown
  }) ; //'main'.addEventListener("mousemove")
  
  $('main').addEventListener("mouseup",function(ev){
	ev.preventDefault() ;
   	let mouse = Model.mouse ;
	    mouse.isDown = false ;
	let mini = parseInt(UI.deviceWidth/5) ;
	let offsetLeft =  $('bookFace').offsetLeft ;
	 if( Math.abs(offsetLeft) > mini){
 		if( offsetLeft > mini){
			 Model.prevBook();
		}else{
			if( offsetLeft < - mini ){
             Model.nextBook() ;
			}
		}
        mouse.x = 0 ;
      //下面的if逻辑，保障了在13张书页图全部加载完成前，不作书的切换。代码在慢速网络环境下，若遇到用户的快速滑动，就不会出现书的逻辑和封面的匹配问题！
		if(Model.books.length >1 && UI.bookFace.length == Model.books.length){ 
		 this.removeChild($('bookFace')) ;
		 this.appendChild(UI.bookFace[Model.bookIndex]) ;
		}

		bookFace.style.opacity =  '0.1' ;
      setTimeout(function(){ 
		$('bookFace').style.left =  '0px' ;
		$('bookFace').style.opacity =  '0.9' ;
      },200); 
	}else{ //end if Math.abs(mouse.deltaX) > mini,else 则需要书图回归原位
		setTimeout(function(){ 
			$('bookFace').style.left =  '0px' ;
	    },200); 
	 }
   }) ;       //'main'.addEventListener("mouseup")


//------触屏模型定义和处理函数---------
    Model.touch = {
	target: null ,
	x0: 0 ,
	deltaX : 0 ,
	} ; //Model.touch定义完毕

	   $('main').addEventListener("touchstart",function(e){
	       	   e.preventDefault();
	          let touch = Model.touch ;
	           touch.target = e.touches[0].target ;
	           touch.x0 = e.touches[0].pageX ;
	           console.log("touch start at:("+ touch.x0 + ', ' + e.touches[0].pageY + ")")  ;
	    }); //$('main').addEventListener("touchstart"...

	   $('main').addEventListener("touchend", function(e){
	     e.preventDefault();
	   let eTouch = e.changedTouches ;
       let touch = Model.touch ;
	       touch.x0 = 0 ;
	   let mini = UI.deviceWidth / 3 ;
        //需要书图回归原位的条件
	   if (touch.deltaX <= mini && touch.deltaX >= -mini ){
		  $('bookFace').style.opacity =  '0.9' ;
          setTimeout(function(){ 
			 $('bookFace').style.left =  '0px' ;
	      },200);
		  return ;
	    }
	      if (touch.deltaX > mini){
			  Model.nextBook() ;
	      }
          if (touch.deltaX < -mini ){
			  Model.prevBook() ;
          }
		 //下面的if逻辑，保障了在13张书页图全部加载完成前，不作书的切换。代码在慢速网络环境下，若遇到用户的快速滑动，就不会出现书的逻辑和封面的匹配问题！
         if(Model.books.length >1 && UI.bookFace.length == Model.books.length){
		  this.removeChild($('bookFace')) ;
		  this.appendChild(UI.bookFace[Model.bookIndex]) ;
		 }
		
		 $('bookFace').style.opacity =  '0.1' ;
        setTimeout(function(){ 
		  $('bookFace').style.left =  '0px' ;
		  $('bookFace').style.opacity =  '0.9' ;
        },200); 
	    touch.deltaX = 0 ;
	  }); //$('main').addEventListener("touchend",...

	   $('main').addEventListener("touchmove",  function (e){
	     e.preventDefault();
	    let eTouch = e.changedTouches[0] ;
	    let touch = Model.touch ;
	   	let x = parseInt(eTouch.pageX);
		touch.deltaX = x - touch.x0 ;
		if (Math.abs(touch.deltaX) < UI.deviceWidth / 2 ) {
		    $('bookFace').style.left =  touch.deltaX + 'px' ;
		  }
       }); //$('main').addEventListener("touchmove", ...

	
	



//“打开本书”按钮发生的事件，编写代码如下：
 $('handleBook').addEventListener("click",  function (e){
	e.preventDefault();
	if( !Model.bookIsOpen){
		 setTimeout(() => {
			$('bookFace').style.display = 'none' ;
			$('handleBook').textContent = "关闭本书" ;
		 }, 200);

	let book = Model.books[Model.bookIndex] ;
		Model.bookIsOpen = true ;
		$('mediaUI').style.display = 'block' ;
     
/* 对UI设计更改如下，JS代码作出相应调整和优化
      <div id = "mediaUI">
       <button id="prevMedia">Prev</button> 
       <button id="playPause">Play | Pause</button> 
       <button id="duration">000</button>
       <button id="nextMedia">Next</button> 
      </div>
** 按HTML对UI的设计，已经在Model中为本书设定一个fileIndex属性，
**用来记录当前打开的音视频编号，该代码已经在myInit中添加
**首次打开书，默认打开第一个媒体文件，即Model.fileIndex 为 0
*/
/**
 * 本版程序整理了“打开本书”按钮的逻辑，再次组织内部了代码：
 * 1、在 !Model.bookIsOpen（“打开本书”） 逻辑模块中，增加了playVideoBook()、playAudioBook() 函数
 *    ，并在这二个函数中处理UI的反馈。
 * 2、PlayVideoBook()和playAudioBook() 函数，调用mediaPlayer(mediaDom , url) 播放音视频文件，
 *    mediaPlayer内部实现对音视频的的具体异步控制和UI反馈。
 * 3、在这个逻辑模块中，还组织了playPause的点击事件代码，用于播放或暂停媒体。
 * 4、仍然在在这个逻辑模块中，增加了用于本书内容导航二个按钮的事件代码，即：prevMedia和nextMedia。
 * 5、prevMedia和nextMedia内，管理了Model.fileIndex的定位，调用了playVideoBook()、playAudioBook()来播放媒体。
 * 6、本版实现的playAudioBook() 函数，完成了弹出列表式菜单的设计部署，并更改了相应的CSS代码，实现了对教学音频较好的视觉反馈和定位互动效果。
 * 7、本项目的myData.json数据中，对audio类书的chapters数据，仅输入了模拟了CS这一本书，其他数据还有待输入。
 */
  if(book.type === 'video'){ 
	playVideoBook() ;
  }  //视频书结束

  if(book.type === "audio"){
	playAudioBook() ;
  }//音频书结束

function playVideoBook(){
	let videos = book ;
	let i = Model.fileIndex ;
	UI.log($('book'),"播放NO."+(i+1)+" / "+videos.files.length+"号视频！") ;
	mediaPlayer($('myV') , videos.URL + videos.files[i]) ;
  } //end of function playVideo()
function playAudioBook(){
	let i = Model.fileIndex ;
	let chapters =  book.chapters[i] ? book.chapters[i] : [];
	 $('bookMenu').style.display = 'block' ;  
    let url = book.URL + book.files[i] ;
	 mediaPlayer($('myA') , url) ;
	// UI.log($('statusInfo'), book.name +" 的课程 ！") ;
	let dadDom = $("bookMenu") ;
		dadDom.textContent = "" ;
	if( chapters.length){
		for(let chapter of chapters){
		 liDom = document.createElement('li') ;
		 let duration = chapter.end - chapter.begin ;
		 liDom.textContent = chapter.title + ' 【'+duration+'秒】';
         liDom.onclick = liDom.ontouchstart = function(){
			console.log('click '+chapter.title + '!');
			$('myA').currentTime = chapter.begin ;
			this.className = "choice" ;
		 };
		 dadDom.appendChild(liDom);
	  }
	 }else{
		dadDom.textContent = "遗憾，本书暂无教学音频 ！" ;
	 }
  }//end of function playAudio()

  function mediaPlayer(mediaDom , url){  
		mediaDom.style.display = 'block' ;     
		mediaDom.src = url ; //这条语句将开启音视频漫长的加载过程
	
		mediaDom.addEventListener('loadedmetadata',function(){
		  let m = Math.floor(this.duration/60) ;
		  let s = Math.ceil(this.duration - parseInt(this.duration/60)*60) ;
		  let bak = $('statusInfo').textContent ;
		  UI.log($('statusInfo'),'本教学音/视频长度为: '+ m +' 分钟 '+ s + ' 秒 ！');
		  setTimeout(() => {
			  UI.log($('statusInfo'), bak) ; 
		  }, 20000);
	
		}); //获取了视频的元数据信息
	   
		mediaDom.addEventListener('canplaythrough',function(){
		  UI.log($('statusInfo'), '读取教学音/视频完成，点Play播放！');
		  this.style.width = UI.deviceWidth + 'px' ;
		 
		  Model.clock = setInterval(() => {
			  let leftTime = parseInt(mediaDom.duration - mediaDom.currentTime) ;
			  UI.log($('duration'), leftTime + ' s ');
			 }, 1000);
		}); //End canplaythrough
  	  } //end of mediaPlayer function
	
	$('playPause').onclick = $('playPause').ontouchstart = function(){
		let mediaDom = null ;
		if(book.type === "video"){
			mediaDom = $("myV") ;
		}
		if(book.type === "audio"){
			mediaDom = $("myA") ;
		}
		if(!Model.videoIsPlaying){
		 	  mediaDom.play() ;
			  this.textContent = "暂 停" ;
			  Model.videoIsPlaying = true;
			  UI.log($('statusInfo'),  '教学音/视频正在播放！');
			 }else{
			  mediaDom.pause() ;
			  this.textContent = "播 放" ;
			  Model.videoIsPlaying = false;
			  UI.log($('statusInfo'),  '教学音/视频已经暂停！');
			}
		 $('duration').textContent = parseInt(mediaDom.duration) + ' s' ;
		} ; //按移动互联网节省流量的标准，把确定播放/暂停视频的权力交给用户

     $("prevMedia").onclick = $("prevMedia").ontouchstart = function(){
       //上一级的变量book已经存放了当前的书对象
	   let files = book.files ;
	    if(Model.fileIndex > 0 ){
			Model.fileIndex -- ;
		  }else{
			  Model.fileIndex = files.length - 1 ;
		  }
		 console.log("Prev Media Button clicked!") ;
		 if(book.type =="video"){
			playVideoBook();
		 }
		 if(book.type == "audio"){
			playAudioBook();
		 }
		 $('playPause').textContent = "播 放" ; 
	 };
	 $("nextMedia").onclick = $("nextMedia").ontouchstart = function(){
		console.log("Next  Media Button clicked!") ;
		let files = book.files ;
		   if(Model.fileIndex < files.length -1){
              Model.fileIndex ++ ;
			}else{
				Model.fileIndex = 0 ;
			}
		  if(book.type =="video"){
				playVideoBook();
			 }
		  if(book.type == "audio"){
				playAudioBook();
			 }
		  $('playPause').textContent = "播 放" ;
	 };

	} else//end if !Model.bookIsOpen
	      { //下面的代码模块处理关闭本书的逻辑
			setTimeout(() => {
				$('bookFace').style.display = 'block' ;
				$('handleBook').textContent = "打开本书" ;
			 }, 200);
			Model.bookIsOpen = false ;
			$('myV').src = "" ;
			$('myA').src = "" ;
			Model.fileIndex = 0 ;
			$('playPause').textContent = "Play | Pause" ;
			$('myV').style.display = 'none' ;
			$('bookMenu').textContent = '' ;
			$('mediaUI').style.display = 'none' ;
			//离开本书，关闭显示 duration的动态显示
			clearInterval(Model.clock);
			Model.clock = null ;

			setTimeout(function(){
				UI.log($('statusInfo'), " CopyRight from 李健宏 江西科技师范大学 2022--2025" );
			},5000);
		  } //end  if Model.bookIsOpen
   },true); //$('handleBook').addEventListener("click" 。。。 最后这个true参数很重要，让该click事件不再传递到父元素main上
   
   $('downloadBook').addEventListener("click",function(){
  	  let book = Model.books[Model.bookIndex] ;
	if(book.type=="audio" ){
	 let url = book.URL + book.pdf ;
	 window.open(url,target="_BLANK") ;
	 UI.log($('statusInfo'),"系统在另一个窗口打开了本书PDF版！");
	}else{
	  UI.log($('statusInfo'),"抱歉，系统无法提供本书的PDF文件！");
	}
   });
   $('aboutBook').addEventListener("click",function(){
		console.log("介绍本书内容！");
		UI.log($('statusInfo'),"请打开本书，听听第一段音频即可！");
   });   
}//最大的函数createMyUI结束，该函数把所有增加用户交互功能的代码打包