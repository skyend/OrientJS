using('less');

module.exports =  {
  class : React.createClass({ // 고정
    getDefaultProps(){
      return {
        rows:null
      };
    },

    over(){

    },

    renderRxColumn(_rowIdx, _colIdx){


      var row = this.props.rows[_rowIdx];
      var size = 25;

      if( _rowIdx == 1 && _colIdx == 1){
        size = 50;
      } else if( _rowIdx == 2 && _colIdx == 2){
        size = 75;
      } else if( _rowIdx == 3 && _colIdx == 1){
        size = 50;
      }

      return (
        <li className={"w"+size}>
          <a href="#">
            <img className='on' src={"http://125.131.88.75:8080/page/main_banner/image.cm?fileid="+row['img_'+_colIdx+'_on'].value} class="hoverimg" alt="style lesson" />
            <img className='off' src={"http://125.131.88.75:8080/page/main_banner/image.cm?fileid="+row['img_'+_colIdx+'_off'].value} class="hoverimg" alt="style lesson" />
          </a>
        </li>
      );
    },

    renderRow(_item, _i){
      if( _i == 0 ) return;



      var elements = [];


      if( typeof _item.img_1_on === 'object' ){
        elements.push(this.renderRxColumn(_i, 1));
      }

      if( typeof _item.img_2_on === 'object' ){
        elements.push(this.renderRxColumn(_i, 2));
      }

      if( typeof _item.img_3_on === 'object' ){
        elements.push(this.renderRxColumn(_i, 3));
      }

      return elements;
    },

    render(){

      try {
        return (
          <ul className="bnr-main">
            {this.props.rows.map(this.renderRow)}
      		</ul>
        );
      }catch(_e){
        return (
          <div className="bnr-main">
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
    "rows" : {
      "title": "Banner rows",
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
