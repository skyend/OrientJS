using('less');

module.exports =  {
    class : React.createClass({ // 고정
      getDefaultProps(){
        return {
          items:[]
        }
      },

      getInitialState(){
        return {
          forwardedIndex:0,
          timer:null,
          imageWidth:0
        };
      },

      placeHolderImageLoaded(_e){
        this.setState({imageWidth:_e.target.clientWidth});
        this.resetTimer();
      },

      resetTimer(){
        var self = this;
        if( this.state.timer !== null ){
          clearInterval(this.state.timer);
        }

        var timer = setInterval(function(){
          self.nextSlide();
        }, 3000);

        this.setState({
          timer:timer
        });
      },

      clickNext(){
        this.resetTimer();
        this.nextSlide();
      },

      clickPrev(){
        this.resetTimer();
        this.prevSlide();
      },

      nextSlide(){
        var itemcount = this.props.items.length;
        var nextIndex = this.state.forwardedIndex + 1;
        if( nextIndex >= itemcount ){
          nextIndex = 0;
        }

        this.setState({
          forwardedIndex:nextIndex
        });
      },

      prevSlide(){
        var itemcount = this.props.items.length;
        var nextIndex = this.state.forwardedIndex - 1;
        if( nextIndex == -1 ){
          nextIndex = itemcount-1;
        }

        this.setState({
          forwardedIndex:nextIndex
        });
      },

      renderSlidePager(_item, _i){
        var on;
        var self = this;

        if( this.state.forwardedIndex === _i ){
          on = 'on';
        }

        var pagerClick = function(){
          self.setState({forwardedIndex:_i});
          self.resetTimer();
        };

        return (
          <a onClick={pagerClick} className={on}>
            {_i+1}
          </a>
        )
      },

      renderImage(_item, _i){
        var replacedIndex = _i - this.state.forwardedIndex;
        var itemcount = this.props.items.length;
        var lastIndex = itemcount - 1;
        /*
        forwarded - 0
        0 : 0
        0 : 1
        0 : 2

        forwarded - 1
        0 : -1
        1 : 0
        2 : 1

        forwarded - 2
        0 : -2
        1 : 1
        2 : 0
        */
        var style = {
          position:'absolute',
          left:replacedIndex * this.state.imageWidth,
          top:0,
          transition:'all 1s'
        };


        // if( lastIndex - 1 == this.state.forwardedIndex ){
        //   if( _i == 0 ){
        //     replacedIndex = lastIndex;
        //     style.transition = '';
        //   }
        // }



        return <img style={style} src={"http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+_item.slide_img.value} alt="visual image" />;
      },

      renderImageSlide(){
        var placeholderStyle = {
          position:'static',
          visibility:this.state.imageWidth !== 0 ? 'hidden':'visible',
          zIndex:100
        };

        var visualStyle ={
          overflow:'hidden',
          position:'relative'
        };

        var prevnextStyle = {
          backgroundImage:'url(http://125.131.88.75:8080/image/kolon/main/btn_next.png)',
          cursor:'pointer'
        };

        return (
          <div className="visual" style={visualStyle}>
            <div id="main-visual-silde">
              <img style={placeholderStyle} onLoad={this.placeHolderImageLoaded} src={"http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+this.props.items[0].slide_img.value} alt="visual image" />
              { this.state.imageWidth !== 0 ? this.props.items.map(this.renderImage):'' }
            </div>
            <a onClick={this.clickPrev} id="main-visual-prev" style={prevnextStyle} className="prev">이전</a>
            <a onClick={this.clickNext} id="main-visual-next" style={prevnextStyle} className="next">다음</a>
            <span id="main-visual-pager">
              { this.props.items.map(this.renderSlidePager) }
            </span>
          </div>
        );
      },


      render: function () {


        return (
          <div className="visual-box">
          	<nav>
          		<ul>
          			<li><a href="#">Login</a></li>
          			<li><a href="#">Join</a></li>
          			<li><a href="#">My Page</a></li>
          			<li><a href="#">CS Center</a></li>
          			<li><a href="#">Notice</a></li>
          		</ul>
          	</nav>

          	<div className="btn-open"><a href="#" id="today-btn">GGIO2 TODAY열기</a></div>
          	<div id="today-content" className="content">
          		<a className="btn-close" href="#" id="today-close-btn">GGIO2 TODAY 닫기</a>
          		<div>
          			<p>오빠와 아저씨는 한끗차이. 당신은 오빠인가요? 아저씨인가요? 당신은 오빠인가요? 아저씨인가요?당신은 오빠인가요? 아저씨인가요?당신은 오빠인가요? 아저씨인가요?</p>
          			<span className="ellipsis">
          				오빠의 스타일에는 법칙이 있다.오빠의 스타일에는 법칙이 있다.
          			</span>
          			<a className="btn-confirm" href="#">확인하기</a>
          		</div>
          	</div>

          	{ this.renderImageSlide() }
          </div>
        )
      }
    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "items" : {
        "title": "Slide Image items",
        "format" : "array[object]",
        "require":true
      },
    },

    positionHints : {
      width:100,
      height:100,
      display:'block',
      float:'left'
    }
  };

  /*


<div className="visual-box">
	<nav>
		<ul>
			<li><a href="#">Login</a></li>
			<li><a href="#">Join</a></li>
			<li><a href="#">My Page</a></li>
			<li><a href="#">CS Center</a></li>
			<li><a href="#">Notice</a></li>
		</ul>
	</nav>
	<!-- ggio2 today content -->
	<div className="btn-open"><a href="#" id="today-btn">GGIO2 TODAY열기</a></div>
	<div id="today-content" className="content">
		<a className="btn-close" href="#" id="today-close-btn">GGIO2 TODAY 닫기</a>
		<div>
			<p>오빠와 아저씨는 한끗차이. 당신은 오빠인가요? 아저씨인가요? 당신은 오빠인가요? 아저씨인가요?당신은 오빠인가요? 아저씨인가요?당신은 오빠인가요? 아저씨인가요?</p>
			<span className="ellipsis">
				오빠의 스타일에는 법칙이 있다.오빠의 스타일에는 법칙이 있다.
			</span>
			<a className="btn-confirm" href="#">확인하기</a>
		</div>
	</div>
	<!-- //ggio2 today content -->
	<div className="visual">
		<div id="main-visual-silde">
			<img src="images/main/visual/img_visual01.jpg" alt="visual image" />
			<img src="images/main/visual/img_visual01.jpg" alt="visual image" />
			<img src="images/main/visual/img_visual01.jpg" alt="visual image" />
			<img src="images/main/visual/img_visual01.jpg" alt="visual image" />
		</div>
		<a href="#" id="main-visual-prev" className="prev">이전</a>
		<a href="#" id="main-visual-next" className="next">다음</a>
		<span id="main-visual-pager"><a href="#" className="on">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a></span>
	</div>
</div>
  */
