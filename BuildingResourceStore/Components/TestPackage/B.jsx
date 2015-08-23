var CompA = session.getComponent('TestPackage/A').class;
using('less');

module.exports =  {
    class : React.createClass({ // 고정

      click : function(){
        alert('click');
      },

      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      // 예시
      render: function () {
        return (
          <div className='B' onClick={this.click}>
            <span> TestComponentB </span>
            <CompA />
          </div>
        )
      }

    }),
    renderType:'staticFromReact',
    elementType:'react',
    struct : {

    },

    positionHints : {
      width:100,
      height:100,
      display:'block'
    }
  };
