var CompA = session.getComponent('A').class;
using('less');

module.exports =  {
    class : React.createClass({ // 고정

      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      // 예시
      render: function () {
        return (
          <div className='B'>
            <span> TestComponentB </span>
            <CompA />
          </div>
        )
      }

    }),

    struct : {

    }
  };
