using('less');

module.exports =  {
    class : React.createClass({ // 고정

      // ReactJS 개발 가이드에 따라 컴포넌트를 구현합니다.

      componentDidMount(){
        console.log(window.document, window, this.getDOMNode().ownerDocument.defaultView);
        //var thisWindow = this.getDOMNode().ownerDocument.defaultView

        new Chartist.Line('.boxa', {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          series: [
            [12, 9, 7, 8, 5],
            [2, 1, 3.5, 7, 3],
            [1, 3, 4, 5, 6]
          ]
        }, {
          fullWidth: true,
          chartPadding: {
            right: 40
          }
        });
      },
      // 예시
      render: function () {
        return (
          <div className='boxa'>

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
      display:'block',
      float:"left"
    }
  };
