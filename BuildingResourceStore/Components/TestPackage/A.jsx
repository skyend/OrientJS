using('less');
module.exports =  {
    class : React.createClass({ // 고정

      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      // 예시
      render: function () {
        return (
          <div className='A'>
            <span> TestComponentA </span>
          </div>
        )
      }

    }),

    renderType:'static',
    
    struct : {

    },

    positionHints : {
      width:100,
      height:100,
      display:'block',
      float:'left'
    }
  };
