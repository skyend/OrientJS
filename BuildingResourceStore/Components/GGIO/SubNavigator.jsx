using('less');

module.exports =  {
    class : React.createClass({ // 고정
      getDefaultProps(){
        return {
          pathObject:{
            value:'No Data'
          }
        };
      },

      renderDepth(_item){

        var splited = _item.split(',');

        return(
          <a href={splited[1]}>
            {splited[0]}
          </a>
        );
      },

      render: function () {
        console.log(this.props.pathObject);

        var addedElements = [];

        var elements = this.props.pathObject.value.split('|').map(this.renderDepth);

        elements.map(function(_element){
          addedElements.push(">");
          addedElements.push(_element);
        });

        addedElements.shift();


        return (
          <nav className='nav-here'>
            {addedElements}
          </nav>
        )
      }

    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "pathObject" : {
        "title": "Navi Path Object",
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
