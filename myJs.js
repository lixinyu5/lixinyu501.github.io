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
  };

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
		this.removeChild($('bookFace')) ;
		this.appendChild(UI.bookFace[Model.bookIndex]) ;
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
		this.removeChild($('bookFace')) ;
		this.appendChild(UI.bookFace[Model.bookIndex]) ;
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

	
	
	   //打开书的后续代码，写在下面
	   $('chapter').addEventListener("click",  function (e){
		e.preventDefault();
		if( !Model.bookIsOpen){
		 setTimeout(() => {
			$('bookFace').style.display = 'none' ;
			$('chapter').textContent = "->关闭这本书" ;
		 }, 200);

		let book = Model.books[Model.bookIndex] ;
		Model.bookIsOpen = true ;

		if(book.type === 'video'){ //此处原来的重要bug，=== 误写为 = ，由于语法没有错，但逻辑巨大的问题，导致程序响应book类型不是视频的所有交互。
          let videos = book ;
		  let i = parseInt(videos.files.length * Math.random( )) ;
		  UI.log($('book'),"播放NO."+(i+1)+" / "+videos.files.length+"号视频！") ;
          
		  //console.log(videos) ;
	      
		  $('myV').src = videos.URL + videos.files[i] ;
		  $('myV').style.display = 'block' ;
		  $('myV').addEventListener('loadedmetadata',function(){
		    let m = Math.floor(this.duration/60) ;
			let s = Math.ceil(this.duration - parseInt(this.duration/60)*60) ;
			let bak = $('statusInfo').textContent ;
			UI.log($('statusInfo'),'本视频长度为: '+ m +' 分钟 '+ s + ' 秒 ！');
			setTimeout(() => {
				UI.log($('statusInfo'), bak) ; 
			}, 20000);

		  });
		 // 经测试，这几年的发布的移动浏览器为了节省用户流量，都不支持代码控制的play方法，必须设法把play放到用户交互事件之中
		  $('myV').addEventListener('canplaythrough',function(){
			UI.log($('statusInfo'), '读取视频完成，点击主区域播放！');
		    $('myV').onclick = $('myV').ontouchstart = function(){
			 if(book.type === 'video'){
			  if(!Model.videoIsPlaying){
			   $('myV').play() ;
				Model.videoIsPlaying = true;
				UI.log($('statusInfo'),  '视频正在播放，可点击它可以暂停！');
         	  }else{
				$('myV').pause() ;
				Model.videoIsPlaying = false;
				UI.log($('statusInfo'),  '视频已经暂停，可点击它可继续播放！');
			  }
			 }
	       } ; //用户确定播放/暂停视频
		    this.style.width = UI.deviceWidth + 'px' ;
			if( Model.clock){
			 clearInterval(Model.clock) ; //既然能播放了，则清楚下面不断反馈的“耐心等待”
			 Model.clock = null ;
			}
		  });

		  //实际上对于低速网络环境，上面反馈需要大量的等待时间，代码此时需要给用户积极反馈
		   Model.clock = setInterval(() => {
			    UI.log($('statusInfo'), parseInt(Math.random()*100) + '视频数据正在加载，请耐心等待！');
		       }, 2000);
		  
	  } // 处理视频组成的书

	} else//end if !Model.bookIsOpen
	      {
			setTimeout(() => {
				$('bookFace').style.display = 'block' ;
				$('chapter').textContent = "->打开这本书" ;
			 }, 200);
			Model.bookIsOpen = false ;
			$('myV').src = "" ;
			$('myV').style.display = 'none' ;
			
			setTimeout(function(){
				UI.log($('statusInfo'), " CopyRight from 李健宏 江西科技师范大学 2022--2025" );
			},5000);
		  } //end  if Model.bookIsOpen
   },true); //$('chapter').addEventListener("click" 。。。 最后这个true参数很重要，让该click事件不再传递到父元素main上
