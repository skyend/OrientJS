using('less');

module.exports =  {
    class : React.createClass({ // 고정
      getDefaultProps(){
        return {
          items:[]
        }
      },
      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      // 예시
      renderItem(_item, _i){
        var navigate = "starCollection&parent_nid="+_item.nid;

        if( _i == 0 ){
          navigate = "starCollection_jw";
        }

        return (
          <li>
            <a href="#" data-navigate={navigate}>
              <img src={"http://125.131.88.75:8080/page/star_collection/image.cm?fileid="+_item.contents_file.value} width="1000"  alt="JOO WON COLLECTION" />
            </a>
          </li>
        );
      },


      render: function () {
        var items = this.props.items;

        if( typeof items !== 'object' ){
          return <div className='ggio-star-list'>
            <div className='placeholder'>
              <h1> GGIO Starlist component </h1>
            </div>
          </div>;
        }

        // items = items.sort(function(_a, _b){
        //   return parseInt(_a.order_no) > parseInt(_b.order_no);
        // })
        console.log('아이템------', items);

        return (
          <div className='ggio-star-list'>
            <ul className="star-mNav">
              { items.map(this.renderItem) }
        		</ul>
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
