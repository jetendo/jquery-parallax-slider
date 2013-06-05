
(function($) {
	var zParallaxSlider=function(initObject){
	this.slideDuration=2000;
	this.fadeInDuration=1000;
	this.fadeIn=true;
	this.transition='horizontal';
	this.autoplay=true;
	this.completeCount=0;
	this.animateCount=0;
	this.slideEndCallback=function(obj){};
	this.slideBeginCallback=function(obj){};
	this.defaultAnimatedBackgroundDuration=3000;
	this.defaultSlideInDuration=3000;
	this.defaultSlideOutDuration=1000;
	this.defaultSlideElementInDuration=400;
	this.defaultSlideElementOutDuration=2000;
	this.defaultSlideElementInDelay=400;
	this.defaultSlideElementOutDelay=0;
	this.defaultAnimatedBackgroundEasing="linear";
	this.defaultSlideEasing="swing";
	this.defaultSlideOutEasing="swing";
	this.defaultSlideElementInEasing="swing";
	this.defaultSlideElementOutEasing="swing";
	this.slideIndex=0;
	this.direction="forward";
	this.prev=null
	this.next=null;
	this.arrSlideObj=[];
	this.doNextSlide=false;
	this.doPreviousSlide=false;
	this.slideAnimating=true;
	this.debug=false;
	this.slideElementOutDone=function(a){
	}
	this.slideElementInDone=function(a){
		a.elem.zPSlide.completeCount++;
		if(a.elem.zPSlide.completeCount>=a.elem.zPSlide.animateCount){
			a.elem.zPSlide.slideAnimating=false;
			a.elem.zPSlide.checkButtonClick();
		}
	}
	this.checkButtonClick=function(){
		if(this.debug) console.log("checkButtonClick:"+this.doNextSlide+":"+this.doPreviousSlide);
		if(this.slideAnimatingOut || this.slideAnimating){
			return;
		}
		if(this.doNextSlide){
			clearTimeout(this.slideTimeoutId);
			this.nextSlide();
			this.doNextSlide=false;
			this.doPreviousSlide=false;
		}else if(this.doPreviousSlide){
			this.doPreviousSlide=false;
			this.doNextSlide=false;
			clearTimeout(this.slideTimeoutId);
			this.previousSlide();
			clearTimeout(this.slideTimeoutId);
			var curObj=this;
			this.slideTimeoutId=setTimeout(function(){
				if(curObj.autoplay){
					curObj.nextSlide();
				}
			}, this.currentSlideDuration);
		}
	}
	this.slideDone=function(a){
		a.elem.zPSlide.slideAnimatingOut=false;
		a.elem.zPSlide.checkButtonClick();
	}
	this.slideTimeoutId=null;
	this.nextSlide=function(){
		if(this.slideCount <= 1) return;
		clearTimeout(this.slideTimeoutId);
		var b=this.slideIndex;
		this.slideIndex++;
		this.direction="forward";
		if(this.slideIndex>=this.slideCount){
			this.slideIndex=0;	
		}
		this.setupSlideOut(b);
		var curObj=this;
		this.slideTimeoutId=setTimeout(function(){
			if(curObj.autoplay){
				curObj.nextSlide();
			}
		}, this.currentSlideDuration);
		
	}
	this.nextSlideButton=function(){
		if(this.slideCount <= 1) return;
		this.doNextSlide=true;
		if(!this.slideAnimating){
			this.checkButtonClick();
		}
		
	}
	this.previousSlideButton=function(){
		if(this.slideCount <= 1) return;
		this.doPreviousSlide=true;
		if(!this.slideAnimating){
			this.checkButtonClick();
		}
	}
	this.previousSlide=function(){
		if(this.slideCount <= 1) return;
		clearTimeout(this.slideTimeoutId);
		var b=this.slideIndex;
		this.slideIndex--;
		this.direction="back";
		if(this.slideIndex<0){
			this.slideIndex=this.slideCount-1;	
		}
		this.setupSlideOut(b);
		var curObj=this;
		this.slideTimeoutId=setTimeout(function(){
			if(curObj.autoplay){
				curObj.nextSlide();
			}
		}, this.currentSlideDuration);
	}
	this.setupSlideOut=function(index){
		this.slideAnimatingOut=true;
		this.completeCount=0;
		this.animateCount=0;
		if(this.debug) console.log('setupSlideOut:'+index);
		this.currentSlideObj=this.arrSlideObj[index];
		this.currentSlidePosition=$(this.currentSlideObj).position();
		this.currentSlideOutDuration=this.currentSlideObj.zPSlideConfig.end.duration;
		this.currentSlideEasing=this.currentSlideObj.zPSlideConfig.end.easing;
		
		if(typeof this.slideEndCallback=="function"){
			this.slideEndCallback(this.arrSlideObj[index]);
		}
		
		var slideWidth=$(this.currentSlideObj).width();
		var slideHeight=$(this.currentSlideObj).height();
		var curObj=this;
		var arrSlideElements=$(".zPSlideElement", this.currentSlideObj);
		arrSlideElements.each(function(){
			this.zPSlide.animateCount++;
			var c={};
			if(this.zPSlideConfig.end.left != -9999){
				c.left=this.zPSlideConfig.end.left+"px";
			}else{
				c.left=parseInt(this.style.left);
			}
			if(this.zPSlideConfig.end.top != -9999){

				c.top=this.zPSlideConfig.end.top+"px";
			}else{
				c.top=parseInt(this.style.top);
			}
			if(this.zPSlideConfig.end.opacity != -9999){
				c.opacity=this.zPSlideConfig.end.opacity;
			}else{
				if(this.style.opacity){
					c.opacity=parseFloat(this.style.opacity);
				}else{
					c.opacity=1;
				}
			}
			if(curObj.debug) console.log(c);
			var k={easing:this.zPSlideConfig.end.easing, duration:this.zPSlideConfig.end.duration, done: this.zPSlide.slideElementOutDone};
			var f=$(this);
			if(curObj.debug) console.log(k);
			setTimeout(function(){
				f.animate(c, k);
			}, this.zPSlideConfig.end.delay);
		});
		var c={};
		var k={easing:this.currentSlideEasing, duration:this.currentSlideOutDuration, done: this.slideDone, queue:false};
		var c2={};
		var k2={easing:this.currentSlideEasing, duration:this.currentSlideOutDuration, queue:false};
		
		var slideIndex2=0;
		if(this.direction=="forward"){
			slideIndex2=index+1;
			if(slideIndex2>=this.slideCount){
				slideIndex2=0;
			}
		}else{
			slideIndex2=index-1;
			if(slideIndex2<0){
				slideIndex2=this.slideCount-1;
			}
		}
		for(i=0;i<this.arrSlideObj.length;i++){
			this.arrSlideObj[i].style.display="none";
		}
		if(this.arrSlideObj[slideIndex2].zPSlideConfig.transition=='crossfade'){
			$(this.arrSlideObj[slideIndex2]).css("opacity",0);
			c.opacity=0;
			c2.opacity=1;
			if(this.direction=="forward"){
				if(index==this.slideCount-1){
					this.arrSlideObj[slideIndex2].style.top=0+"px";
					this.arrSlideObj[index].style.top=-slideHeight+"px";
				}else{
					this.arrSlideObj[slideIndex2].style.top=-slideHeight+"px";
					this.arrSlideObj[index].style.top="0px";
				}
			}else{
				if(index==0){
					this.arrSlideObj[slideIndex2].style.top=-(slideHeight)+"px";
					this.arrSlideObj[index].style.top=0+"px";
				}else{
					this.arrSlideObj[slideIndex2].style.top=(-0)+"px";
					this.arrSlideObj[index].style.top=-slideHeight+"px";
				}
			}
			this.arrSlideObj[slideIndex2].style.left="0px";
			this.arrSlideObj[index].style.left="0px";
		}else if(this.arrSlideObj[slideIndex2].zPSlideConfig.transition=='vertical'){
			$(this.arrSlideObj[slideIndex2]).css({
				filter: "alpha(opacity=100)",
				opacity:1
			});
			if(this.direction=="forward"){
				if(index==this.slideCount-1){
					c.top=(-slideHeight*2)+"px";
					c2.top=0+"px";
					this.arrSlideObj[slideIndex2].style.top=slideHeight+"px";
					this.arrSlideObj[index].style.top=-slideHeight+"px";
				}else{
					c.top=-slideHeight+"px";
					c2.top=-slideHeight+"px";
					this.arrSlideObj[slideIndex2].style.top="0px";
					this.arrSlideObj[index].style.top="0px";
				}
			}else{
				if(index==0){
					c.top=slideHeight+"px";
					c2.top=-slideHeight+"px";
					this.arrSlideObj[slideIndex2].style.top=-(slideHeight*2)+"px";
					this.arrSlideObj[index].style.top=0+"px";
				}else{
					c.top=(0)+"px";
					c2.top=0+"px";
					this.arrSlideObj[slideIndex2].style.top=(-slideHeight)+"px";
					this.arrSlideObj[index].style.top=-slideHeight+"px";
				}
			}
			this.arrSlideObj[slideIndex2].style.left="0px";
			this.arrSlideObj[index].style.left="0px";
		}else if(this.arrSlideObj[slideIndex2].zPSlideConfig.transition=='horizontal'){
			$(this.arrSlideObj[slideIndex2]).css({
				filter: "alpha(opacity=100)",
				opacity:1
			});
			if(this.direction=="forward"){
				c.left="-100%";
				c2.left="0%";
				this.arrSlideObj[slideIndex2].style.left="100%";
				this.arrSlideObj[index].style.left="0";
			}else{
				c.left="100%";
				c2.left="0%";
				this.arrSlideObj[slideIndex2].style.left="-100%";
				this.arrSlideObj[index].style.left="0";
			}
			this.arrSlideObj[Math.min(index, slideIndex2)].style.top="0px";
			this.arrSlideObj[Math.max(index, slideIndex2)].style.top=-slideHeight+"px";
		}
		this.arrSlideObj[index].style.display="block";
		this.arrSlideObj[slideIndex2].style.display="block";
		if(this.debug) console.log("move:"+index+":"+slideIndex2);
		if(this.debug) console.log(c);
		if(this.debug) console.log(c2);
		for(var i=0;i<this.arrSlideObj[index].arrAnimateBackgroundOut.length;i++){
			this.animateBackgroundOut({elem:this.arrSlideObj[index].arrAnimateBackgroundOut[i]});
		}
		for(var i=0;i<this.arrSlideObj[this.slideIndex].arrAnimateBackgroundOut.length;i++){
			this.animateBackgroundOut({elem:this.arrSlideObj[this.slideIndex].arrAnimateBackgroundOut[i]});
		}
		$(this.arrSlideObj[index]).animate(c, k);
		$(this.arrSlideObj[slideIndex2]).animate(c2, k2);
		
		
		
		
		this.setupSlideIn(this.slideIndex);
	};
	this.setupSlideIn=function(index){
		this.slideAnimating=true;
		this.completeCount=0;
		this.animateCount=0;
		this.currentSlideObj=this.arrSlideObj[index];
		this.currentSlideObj.style.display="block";
		
		if(typeof this.slideBeginCallback=="function"){
			this.slideBeginCallback(this.arrSlideObj[index]);
		}
		
		if(this.debug) console.log('setupSlideIn:'+index);
		this.currentSlideDuration=this.currentSlideObj.zPSlideConfig.begin.duration;
		var arrSlideElements=$(".zPSlideElement", this.currentSlideObj);
		var curObj=this;
		
		var arrImage=$('[data-background-image]', this.currentSlideObj);
		arrImage.each(function(){
			this.style.backgroundImage="url("+this.getAttribute("data-background-image")+")";
			this.removeAttribute("data-background-image");
		});
		arrImage=$('[data-image]', this.currentSlideObj);
		arrImage.each(function(){
			this.src="url("+this.getAttribute("data-image")+")";
			this.removeAttribute("data-image");
		});
		
		arrSlideElements.each(function(){
			this.zPSlide.animateCount++;
			$(this).css({
				filter: "alpha(opacity="+(Math.round(this.zPSlideConfig.originalOpacity*100))+")",
				opacity:this.zPSlideConfig.originalOpacity}
			);
			this.style.opacity=this.zPSlideConfig.originalOpacity+"px";
			this.style.left=this.zPSlideConfig.originalLeft+"px";
			this.style.top=this.zPSlideConfig.originalTop+"px";
			
			var c={};
			var left=this.zPSlideConfig.begin.left;
			var top=this.zPSlideConfig.begin.top;
			var opacity=this.zPSlideConfig.begin.opacity;
				
			if(left != -9999){
				c.left=parseInt(this.style.left);
				this.style.left=(parseInt(left))+"px";
			}else{
				this.style.left=parseInt(this.style.left);
			}
			if(top != -9999){
				c.top=parseInt(this.style.top);
				this.style.top=(parseInt(top))+"px";
			}else{
				this.style.top=parseInt(this.style.top);
			}
			if(opacity != -9999){
				c.opacity=parseFloat(this.style.opacity);
				$(this).css({
					filter: "alpha(opacity="+(Math.round(opacity*100))+")",
					opacity:opacity
				});
			}
			
			c.left+="px";
			c.top+="px";
			if(curObj.debug) console.log(c);
			this.style.display='block';
			var k={easing:this.zPSlideConfig.begin.easing, duration:this.zPSlideConfig.begin.duration, done: this.zPSlide.slideElementInDone, queue:false};
			if(curObj.debug) console.log(k);
			var f=$(this);
			setTimeout(function(){
				f.animate(c, k);
			}, this.zPSlideConfig.begin.delay);
			
		});
		if(!arrSlideElements.length){
			this.slideElementInDone();
		}
	}
	this.setSlideConfig=function(configObj){
		var defaultConfig={
			transition:this.transition,
			begin:{duration:this.defaultSlideInDuration, easing:this.defaultSlideInEasing},
			end:{duration:this.defaultSlideOutDuration, easing:this.defaultSlideOutEasing}
		};
		for(var i in defaultConfig){
			if(typeof configObj[i] == "undefined"){
				configObj[i]=defaultConfig[i];
			}else{
				for(var n in defaultConfig[i]){
					if(typeof configObj[i][n] == "undefined"){
						configObj[i][n]=defaultConfig[i][n];
					}
				}
			}
		}
		return configObj;
	}
	this.setSlideElementConfig=function(slideObj, configObj){
		var defaultConfig={
			begin:{opacity:-9999, left:-9999, top:-9999, delay:this.defaultSlideElementInDelay, duration:this.defaultSlideElementInDuration, easing:this.defaultSlideElementInEasing},
			end:{opacity:0, left:0, top:0, delay:this.defaultSlideElementOutDelay, duration:this.defaultSlideElementOutDuration, easing:this.defaultSlideElementOutEasing}
		};
		
		var d=slideObj.zPSlideConfig.begin.duration;
		if(d){
			defaultConfig.begin.duration=parseInt(d);
		}
		var d=slideObj.zPSlideConfig.end.duration;
		if(d){
			defaultConfig.end.duration=parseInt(d);
		}
		var d=slideObj.zPSlideConfig.begin.easing;
		if(d){
			defaultConfig.begin.easing=parseInt(d);
		}
		var d=slideObj.zPSlideConfig.end.easing;
		if(d){
			defaultConfig.end.easing=parseInt(d);
		}
		for(var i in defaultConfig){
			if(typeof configObj[i] == "undefined"){
				configObj[i]=defaultConfig[i];
			}else{
				for(var n in defaultConfig[i]){
					if(typeof configObj[i][n] == "undefined"){
						configObj[i][n]=defaultConfig[i][n];
					}
				}
			}
		}
		return configObj;
	}
	this.setSlideAnimatedBackgroundConfig=function(configObj){
		var defaultConfig={
			type:'loop',
			animateX:0,
			animateY:0, 
			durationX:this.defaultAnimatedBackgroundDuration, 
			durationY:this.defaultAnimatedBackgroundDuration, 
			easingX:this.defaultAnimatedBackgroundEasing,
			easingY:this.defaultAnimatedBackgroundEasing,
		};
		for(var n in defaultConfig){
			if(typeof configObj[n] == "undefined"){
				configObj[n]=defaultConfig[n];
			}
		}
		return configObj;
	}
	this.init=function(obj){
		for(var i in obj){
			this[i]=obj[i];
		}
		if(typeof this.container == "undefined" || !this.container){
			console.log("initObject.container is required.");
			return;
		}
		var curObj=this;
		
		var arrSlidePosition=[];
		var curObj=this;
		$(this.container).each(function(){
			d=$(".zPSlideSlider", this);
			curObj.currentSlideSliderObj=d[0];
			d=$(".zPSlide", this);
			curObj.slideCount=d.length;
			for(var i2=0;i2<d.length;i2++){
				curObj.arrSlideObj[i2]=d[i2];
				var slideConfig=d[i2].getAttribute("data-config");
				if(slideConfig){
					var d2=0;
					eval("d2="+slideConfig+";");
					slideConfig=d2;
				}else{
					slideConfig={};
				}
				d[i2].zPSlideConfig=curObj.setSlideConfig(slideConfig);
				
				d[i2].zPSlide=curObj;
				if(i2!=0){
					d[i2].style.top=-($(d[i2]).height()*i2)+"px"
				}
				var arrSlideElements=$(".zPSlideElement", d[i2]);
				for(var i=0;i<arrSlideElements.length;i++){
					var s=arrSlideElements[i];
					s.zPSlide=curObj;
					s.zPSlideSlideIndex=i2;
					var c=s.getAttribute("data-config");
					if(c){
						var d2=0;
						eval('d2='+c+';');
						s.zPSlideConfig=d2;
					}else{
						s.zPSlideConfig={};
					}
					s.zPSlideConfig=curObj.setSlideElementConfig(d[i2], s.zPSlideConfig);
					if(s.style.opacity){
						var c=parseFloat(s.style.opacity);
					}else{
						var c=1;
					}
					s.zPSlideConfig.originalOpacity=c;
					if(s.style.left){
						var c=parseInt(s.style.left);
					}else{
						var c=1;
					}
					s.zPSlideConfig.originalLeft=c;
					if(s.style.top){
						var c=parseInt(s.style.top);
					}else{
						var c=1;
					}
					s.zPSlideConfig.originalTop=c;
				}
				curSlideIndex=i2;
				var arrBg=$(".zPSlideAnimatedBackground", d[i2]);
				var curYOffset=0;
				var curHeight=0;
				d[i2].arrAnimateBackgroundOut=[];
				for(var n=0;n<arrBg.length;n++){
					var n2=$(arrBg[n]);
					if(n2[0].style.marginTop){
						var m2=parseInt(n2[0].style.marginTop);
						var c2=n2.height()+m2;
					}else{
						var m2=0;
						var c2=n2.height();
					}
					n2.each(function(){
						var c=this.getAttribute("data-config");
						if(c){
							var d2=0;
							eval("d2="+c+";");
							c=d2;
						}else{
							c={};
						}
						c=curObj.setSlideAnimatedBackgroundConfig(c);
						
						if(this.style.marginTop){
							this.style.top=(curYOffset+parseInt(n2[0].style.marginTop))+"px";
							curYOffset+=parseInt(n2[0].style.marginTop);
						}else{
							this.style.top=(curYOffset)+"px";
						}
						this.style.marginTop="0px";
						if(typeof c.animateX != 'string' || c.animateX.indexOf("%") == -1){
							c.animateX+="px";
						}
						if(typeof c.animateY != 'string' || c.animateY.indexOf("%") == -1){
							c.animateY+="px";
						}
						if(c.animateX != "0px" || c.animateY != "0px"){
							this.zPSlideSlideIndex=curSlideIndex;
							this.zPSlideAnimatedBackgroundConfig=c;
							this.zPSlide=curObj;
							if(c.type=='transition'){
								d[i2].arrAnimateBackgroundOut.push(this);
							}else{
								if(c.animateX != "0px"){
									curObj.animateBackgroundX({elem:this});
								}
								if(c.animateY != "0px"){
									curObj.animateBackgroundY({elem:this});
								}
							}
						}
					});
					curYOffset-=c2;
					
				}
				n3=$(".zPSlideCenter", d[i2]);
				n3[0].style.top=(curYOffset)+"px";
			}
			
			if(curObj.fadeIn){
				$(this).hide().fadeIn({duration: curObj.fadeInDuration, queue:false});
			}
		});
		if(typeof this.prev != "undefined" && this.prev){
			if(this.slideCount <= 1){
				$(this.prev).hide();
			}else{
				$(this.prev).hide().fadeIn({duration: this.fadeInDuration, queue:false}).bind("click", function(){
					curObj.previousSlideButton();
					return false;
				});
			}
		}
		if(typeof this.next != "undefined" && this.next){
			if(this.slideCount <= 1){
				$(this.next).hide();
			}else{
				$(this.next).hide().fadeIn({duration: this.fadeInDuration, queue:false}).bind("click", function(){
					curObj.nextSlideButton();
					return false;
				});
			}
		}
		this.slideIndex=0;
		
		
		this.slideIndex=0;
		this.setupSlideIn(this.slideIndex);
		this.slideTimeoutId=setTimeout(function(){
			if(curObj.autoplay){
				curObj.nextSlide();
			}
		}, this.currentSlideDuration);
		
	}
	this.animateBackgroundOut=function(a){	
		$(a.elem).css( {"background-position": "0px 0px"} ).animate({"backgroundPositionX": a.elem.zPSlideAnimatedBackgroundConfig.animateX}, {duration:a.elem.zPSlideAnimatedBackgroundConfig.durationX, queue:false, easing:a.elem.zPSlideAnimatedBackgroundConfig.easingX});
		$(a.elem).css( {"background-position": "0px 0px"} ).animate({"backgroundPositionY": a.elem.zPSlideAnimatedBackgroundConfig.animateY}, {duration:a.elem.zPSlideAnimatedBackgroundConfig.durationY, queue:false, easing:a.elem.zPSlideAnimatedBackgroundConfig.easingY});
	}
	this.animateBackgroundX=function(a){	
		if(a.elem.zPSlideAnimatedBackgroundConfig.type=='loop'){
			if(a.elem.zPSlide.slideIndex==a.elem.zPSlideSlideIndex){
				var c=a.elem.style.backgroundPosition.split(" ");
				$(a.elem).css( {"background-position": "0px "+c[1]} ).animate({"backgroundPositionX": a.elem.zPSlideAnimatedBackgroundConfig.animateX}, {duration:a.elem.zPSlideAnimatedBackgroundConfig.durationX, queue:false, easing:a.elem.zPSlideAnimatedBackgroundConfig.easingX, done:a.elem.zPSlide.animateBackgroundX});
			}else{
				setTimeout(function(){a.elem.zPSlide.animateBackgroundX({elem:a.elem})}, 50);
			}
		}
	}
	this.animateBackgroundY=function(a){	
		if(a.elem.zPSlideAnimatedBackgroundConfig.type=='loop'){
			if(a.elem.zPSlide.slideIndex==a.elem.zPSlideSlideIndex){
				var c=a.elem.style.backgroundPosition.split(" ");
				$(a.elem).css( {"background-position": c[0]+" 0px"} ).animate({"backgroundPositionY": a.elem.zPSlideAnimatedBackgroundConfig.animateY}, {duration:a.elem.zPSlideAnimatedBackgroundConfig.durationY, queue:false, easing:a.elem.zPSlideAnimatedBackgroundConfig.easingY, done:a.elem.zPSlide.animateBackgroundY});
			}else{
				setTimeout(function(){a.elem.zPSlide.animateBackgroundY({elem:a.elem})}, 50);
			}
		}
	}
	this.init(initObject);
};

	 $.fn.parallaxSlider = function(initObject){
		 return this.each(function(){
			 initObject.container=this;
			 this.zParallaxSlider=new zParallaxSlider(initObject);
		 });
	 }
	$.extend($.fx.step,{
		backgroundPositionY: function(a) {
			var c=a.elem.style.backgroundPosition.split(" ");
			var v=(a.end-a.start);
			var b=Math.round(a.start+(a.pos*v));
			a.elem.style.backgroundPosition=c[0]+" "+b+a.unit;
			return;
		},
		backgroundPositionX: function(a) {
			var c=a.elem.style.backgroundPosition.split(" ");
			var v=(a.end-a.start);
			var b=Math.round(a.start+(a.pos*v));
			a.elem.style.backgroundPosition=b+a.unit+" "+c[1];
			return;
		}
	});

})(jQuery);