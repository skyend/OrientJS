
using('less');

module.exports =  {
    class : React.createClass({ // 고정

      render: function () {

        return (
          <div className="star-thumbs">
          	<h3><img src="../images/brand/tit_thumb_jw.png" width="314" height="94" alt="JOO WON COLLECTION" /></h3>
          	<ul className="star-thumbsList star-thumbsList-jw">
          		<li className="list01"><a href="#popup1" className="popup-trigger poplight on">상품설명</a></li>
          		<li className="list02"><a href="#popup2" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list03"><a href="#popup3" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list04"><a href="#popup4" className="popup-trigger poplight">무슨 옷을 입을지 고민하는 것이 주식 투자 결정보다 어려운 남자에게 출근, 주말, 바캉스 시즌 공항패션까지 폭넓게 입을 수 있는 스타일링을 제안한다. 스타일리시하고 편안한 건 기본.</a></li>
          		<li className="list05"><a href="#popup5" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list06"><a href="#popup6" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list07"><a href="#popup7" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list08"><a href="#popup8" className="popup-trigger poplight">상품설명</a></li>
          		<li className="list09"><a href="#popup9" className="popup-trigger poplight">상품설명</a></li>
          	</ul>
          </div>
        )

      }

    }),

    renderType:'staticFromReact',
    elementType:'html',

    propStruct : {

    },

    positionHints : {
      width:100,
      height:100,
      display:'block',
      float:'left'
    }
  };
