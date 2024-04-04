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

 

 //不管是鼠标还是触屏，因为有且只有第一次点击，才需要载入第一本书，如何解决这个问题，下面这个代码片段演示了一个高智商的小技巧，
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


//1、本次代码提交完成了触屏模型的模拟，当前代码设置对main元素（展示当前书的功能）有效。通过建立Model.touch模型，目前仅关注触摸对x轴方向的触摸，实现了不同书的切换。2、研究了基于Web浏览器触屏的三个底层事件：touchstart、touchmove、touchend，结合DOM技术设计了一个可以滑动触屏控制书图案左右移动的UI，该UI流畅地实现了书的切换；2、用户用触屏操作的动作细节包括：接触，移动，抬起，触摸的距离，通过逻辑综合判断这些因素，本片段代码设计了一个可行算法，判断了有效触摸，杜绝了无效触摸(无意触摸等较小的距离)，也实现了左右方向触摸的判断，展现了一个逻辑清晰，简洁的换书的GUI模型，3、最后，本例利用CSS动画开关设置，结合JS的异步代码，创作了一个有流畅动画效果的触屏专用UI。
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

	   $('chapter').addEventListener("click",  function (e){
		e.preventDefault();
		let book = Model.books[Model.bookIndex] ;
		if(book.type === 'video'){ //此处原来的重要bug，=== 误写为 = ，由于语法没有错，但逻辑巨大的问题，导致程序响应book类型不是视频的所有交互。
          let videos = book ;
		  let i = parseInt(videos.files.length * Math.random( )) ;
		  UI.log($('book'),"播放NO."+(i+1)+" / "+videos.files.length+"号视频！") ;
          
		  //console.log(videos) ;
	      $('myV').style.display = 'block' ;
		  $('myV').src = videos.URL + videos.files[i] ;
		  $('myV').addEventListener('loadedmetadata',function(){
		    let m = Math.floor(this.duration/60) ;
			let s = Math.ceil(this.duration - parseInt(this.duration/60)*60) ;
			let bak = $('statusInfo').textContent ;
			UI.log($('statusInfo'),'本视频长度为: '+ m +' 分钟 '+ s + ' 秒 ！');
			setTimeout(() => {
				UI.log($('statusInfo'), bak) ; 
			}, 20000);
		  });
		  /*
		  $('myV').addEventListener('canplaythrough',function(){
		   this.style.width = UI.deviceWidth + 'px' ;
           this.play() ;
            setTimeout(() => {
				$('bookFace').style.display = 'none' ;
			}, 100);
		  });
		  */
		  $('myV').oncanplaythrough = function(){
			this.style.width = UI.deviceWidth + 'px' ;
			this.play() ;
			 setTimeout(() => {
				 $('bookFace').style.display = 'none' ;
			 }, 100);
			 UI.log($('chapter'),'点击此处刷视频') ;
		   };
		   
     	} // 处理视频这本书
   }); //$('chapter').addEventListener("click" 。。。
