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

      renderDepth2Items(_item){

        return (
          <li>
            <a href="#" data-navigate={_item.menu_id}>
              {_item.name}
            </a>
          </li>
        )
      },

      renderDepth2(_depth2, _depth1Base){

        var style = {display:'none'};

        var self = this;
        var depth2List = [];
        console.log("Depth 2", _depth2, _depth1Base);

        if( this.state.showDepth2 ) {
          style.display = 'block';
        }


        _depth1Base.map(function(_item){
          var nid = _item.nid;
          console.log(nid,_depth2 );
          if( _depth2[nid] !== undefined ){
            depth2List.push(_depth2[nid]);
          }
        });


        return (
          <div className="depth2" style={style}>
            <nav>
              {depth2List.map(function(_depth2Items,_i){

                var depth2Items = _depth2Items.sort(function(_a, _b){
                  return parseInt(_a.order_no) > parseInt(_b.order_no);
                });

                return (
                  <ul className={"w"+(_i+1)}>
                    { depth2Items.map(self.renderDepth2Items)}
                  </ul>
                )
              })}
            </nav>
          </div>
        )
      },

      render: function () {
        console.log( "GNB ITEM", this.props.items);
        var items = this.props.items;
        var depth1 = [];
        var depth2 = {};

        items.map(function(_item){
          if( _item.menu_depth == "1"){
            _item.child = []; // child 공간확보
            depth1.push(_item);
          } else if ( _item.menu_depth == "2" ){

            if( depth2[_item.parent_menu_id.nid] === undefined ){
              depth2[_item.parent_menu_id.nid] = [];
            }

            depth2[_item.parent_menu_id.nid].push(_item);
          }
        });

        depth1 = depth1.sort(function(_a, _b){
          return parseInt(_a.order_no) > parseInt(_b.order_no);
        });

        // depth2 = depth2.sort(function(_a, _b){
        //   return parseInt(_a.order_no) > parseInt(_b.order_no);
        // });


        return (
          <header className='ggio-gnb' onMouseLeave={this.hideDepth2}>
            <h1><a href="#" data-navigate="main"><img src="http://125.131.88.75:8080/image/kolon/common/h_logo.png" width="93" height="34" alt="GGIO2 CURATION" /></a></h1>
            <nav className="depth1">
              <ul onMouseEnter={this.showDepth2}>
                {depth1.map(function(_item, _i){
                  return <li className={"w"+(_i+1)}><a href="#" data-navigate={_item.menu_id}>{_item.name}</a></li>;
                })}

              </ul>
            </nav>
            {this.renderDepth2(depth2, depth1)}
            {/*<span className="sos-sub"><a href="#">STYLE S.O.S</a></span>*/}
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
        //
        // try {
        //
        // } catch( _e ){
        //   var style = {
        //     width:'100%',
        //     height:50,
        //     backgroundColor:"#333",
        //     color:'#fff'
        //   };
        //
        //   return (
        //     <div className='placeholder' style={style}>
        //       GGIO GNB Component Error : {_e.toString()}
        //     </div>
        //   )
        // }

      }

    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "items" : {
        "title": "Image items",
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
  <li className="w1"><a href="#">Brand</a></li>
  <li className="w2"><a href="#">Men&apos;s&nbsp;LAB</a></li>
  <li className="w3"><a href="#">GGIO<sup className="bNum">2</sup>&nbsp;Issue</a></li>
  <li className="w4"><a href="#">Event</a></li>
  <li className="w5"><a href="#">Online&nbsp;Shop</a></li>
  */
