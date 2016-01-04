module.exports =  {
    class : React.createClass({ // 고정

      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      // 예시
      render: function () {
        var style = {
          width:100,
          height:100,
          backgroundColor:'#333'
        };

        return (
          <div style={style}>

          </div>
        )
      }

    }),

    renderType:'staticFromReact',
    elementType:'ref',

    struct : {

    },

    positionHints : {
      width:100,
      height:100,
      display:'block'
    }
  };
