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
          showDepth2:false
        };
      },

      showDepth2(){
        console.log("Show depth2");
        this.setState({showDepth2:true});
      },

      hideDepth2(){
        console.log("hide depth2");
        this.setState({showDepth2:false});
      },

      renderDepth2(){
        if( !this.state.showDepth2 ) return;

        return (
          <div className="depth2">
            <nav>
              <ul className="w1">
                <li><a href="#">Star</a></li>
                <li><a href="#">Concept</a></li>
                <li><a href="#">Store Info</a></li>
              </ul>
              <ul className="w2">
                <li><a href="#">Style Lesson</a></li>
                <li><a href="#">1:1 STYLE SOS</a></li>
                <li><a href="#">Not To Do List</a></li>
                <li><a href="#">GGIO<sup className="bNum sm">2</sup> Survey</a></li>
              </ul>
              <ul className="w3">
                <li><a href="#">In Magazine</a></li>
                <li><a href="#">Star PPL</a></li>
                <li><a href="#">Issue</a></li>
              </ul>
            </nav>
          </div>
        )
      },

      render: function () {

        return (
          <header className='ggio-gnb' onMouseLeave={this.hideDepth2}>
          	<h1><a href="#"><img src="http://125.131.88.75:8080/image/kolon/common/h_logo.png" width="93" height="34" alt="GGIO2 CURATION" /></a></h1>
          	<nav className="depth1">
          		<ul onMouseEnter={this.showDepth2}>
          			<li className="w1"><a href="#">Brand</a></li>
          			<li className="w2"><a href="#">Men&apos;s&nbsp;LAB</a></li>
          			<li className="w3"><a href="#">GGIO<sup className="bNum">2</sup>&nbsp;Issue</a></li>
          			<li className="w4"><a href="#">Event</a></li>
          			<li className="w5"><a href="#">Online&nbsp;Shop</a></li>
          		</ul>
          	</nav>
            {this.renderDepth2()}
          	<span className="sos-sub"><a href="#">STYLE S.O.S</a></span>
          	<nav className="nav-login">
          		<ul>
          			<li><a href="#">Login</a></li>
          			<li><a href="#">Join</a></li>
          			<li><a href="#">My Page</a></li>
          			<li><a href="#">CS Center</a></li>
          			<li><a href="#">Notice</a></li>
          		</ul>
          	</nav>
          </header>
        )
      }

    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "items" : {
        "title": "Image items",
        "format" : "array[object]"
      },
    },

    positionHints : {
      width:100,
      height:100,
      display:'block',
      float:'left'
    }
  };
