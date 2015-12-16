using('less');

module.exports =  {
    class : React.createClass({ // 고정

      render: function () {

        return (
          <div className='footer'>
            <div className="quick-btn">
            	<div>
            		<a className="b1" href="#">facebook</a>
            		<a className="b2" href="#">cs center</a>
            		<a className="b3" href="#">online shop</a>
            		<a className="b4" href="#">store info</a>
            	</div>
            </div>
            <footer>
            	<h2><img src="http://125.131.88.75:8080/image/kolon/common/h_logo_foot.png" width="112" height="40" alt="GGIO2 CURATION" /></h2>
            	<div className="content">
            		<nav><a href="#">이용약관</a>  /  <a href="#">개인정보취급방침</a>  /  <a href="#">개인정보처리방침</a></nav>
            		  <address>코오롱인더스트리㈜  대표이사 : 박동문  사업자등록번호 : 138-85-19612   개인정보관리 책임자 : 경영지원본부 손정현 상무<br/>
                  	서울시 서초구 서초대로 411 GT타워    대표전화 : 1588-7667   FAX : 02-3677-7546    EMAIL : ggio2@kolon.com</address>
            		<p>COPYRIGHT&copy; 2015 GGIO<sup className="bNum sm mt0">2</sup> ALL RIGHTS RESERVED.</p>
            	</div>
            </footer>
          </div>
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
