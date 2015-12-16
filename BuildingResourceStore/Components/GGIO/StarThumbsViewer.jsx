using('less');

module.exports =  {
    class : React.createClass({ // 고정
      getDefaultProps(){
        return {
          items:[]
        };
      },

      getInitialState(){
        return {
          popupItem:null,
          popupItemAppear:false,
          popupImageWidth:0,
          popupImageHeight:0
        };
      },

      clickThumbItem(_item){
        console.log('click', _item);
        this.setState({popupItem:_item, popupItemAppear:true});
        //this.setState({popupItemAppear:true});
      },

      imageLoaded(_e){
        console.log('Image loaded', _e.target);
        this.setState({wi})
      },

      renderPopupInside(){
        if( this.state.popupItem === null ) return;
        var item = this.state.popupItem;
        var self = this;

        var closePopup = function(){
          self.setState({popupItem:null,popupItemAppear:false});
        };

        return (
          <div className='window' >
            <div className="item-wrapper">
              <img onClick={closePopup} src={"http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+item.pop_image.value} onLoad={this.imageLoaded}/>
            </div>
          </div>
        );
      },

      renderGlobalWindow(){



        var style = {};
        if( this.state.popupItemAppear ){
          style.opacity = 1;
          style.pointerEvents = 'all';
        } else {
          style.opacity = 0;
        }

        return (
          <div className='global-window' style={style}>
            {this.renderPopupInside()}
          </div>
        )
      },

      renderItem(_item, _i){
        var self = this;
        var style = {};
        if(_i == 0 ) return;
        console.log(_item);

        style.backgroundImage = "url(http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+_item.thumb_img.value+")";

        return (
          <li className={"list0"+(_i)} style={style}>
            <a onClick={function(){self.clickThumbItem(_item)}} className="popup-trigger poplight on">
              {_item.thumb_desc}
            </a>
          </li>
        );
      },

      render: function () {
        console.log('아이템',this.props.items);


        try {
          var titleObject = this.props.items[0];
          var name = titleObject.parent_nid.display;
          var namesplit = name.split(' ');
          var className = namesplit.map(function(_namePart){
            return _namePart[0].toLowerCase();
          }).join('');

          return (
            <div className="star-thumbs">

        			<h3><img src={"http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+titleObject.thumb_img.value} width="314" height="94" alt="JOO WON COLLECTION" /></h3>
        			<ul className={"star-thumbsList star-thumbsList-"+className }>
                {this.props.items.map(this.renderItem)}
        			</ul>

              {this.renderGlobalWindow()}
        		</div>
          );
        }catch(_e){
          return (
            <div className="star-thumbs">
              <div className='placeholder'>
                Star Thumbs Viewer Component Error: {_e.toString()}
              </div>
        		</div>
          )
        }
      }

    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "items" : {
        "title": "Thumbs items",
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


  /*
  <li className="list01"><a href="#popup1" className="popup-trigger poplight on">상품설명</a></li>
  <li className="list02"><a href="#popup2" className="popup-trigger poplight">상품설명</a></li>
  <li className="list03"><a href="#popup3" className="popup-trigger poplight">상품설명</a></li>
  <li className="list04"><a href="#popup4" className="popup-trigger poplight">무슨 옷을 입을지 고민하는 것이 주식 투자 결정보다 어려운 남자에게 출근, 주말, 바캉스 시즌 공항패션까지 폭넓게 입을 수 있는 스타일링을 제안한다. 스타일리시하고 편안한 건 기본.</a></li>
  <li className="list05"><a href="#popup5" className="popup-trigger poplight">상품설명</a></li>
  <li className="list06"><a href="#popup6" className="popup-trigger poplight">상품설명</a></li>
  <li className="list07"><a href="#popup7" className="popup-trigger poplight">상품설명</a></li>
  <li className="list08"><a href="#popup8" className="popup-trigger poplight">상품설명</a></li>
  <li className="list09"><a href="#popup9" className="popup-trigger poplight">상품설명</a></li>

  */
