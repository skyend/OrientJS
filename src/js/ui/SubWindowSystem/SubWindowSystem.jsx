(function(){
   require('./SubWindowSystem.less');

   var React = require('react');

   var SubWindow = require('./SubWindow.jsx');

   var windowRefPrefix = "subWindow";

   var SubWindowSystem = React.createClass({
      mixins: [require('../reactMixin/EventDistributor.js')],

      windowCount:0,

      getInitialState(){
         return {
            subWindowItems : [
            {
               title:"Test A",
               empty:false,
               key:"A",
               desc: "A",
               zOrder:1
            },{
               title:"Test B",
               empty:false,
               key:"B",
               desc: "B",
               zOrder:2
            },{
               title:"Test C",
               empty:false,
               key:"C",
               desc: "C",
               zOrder:3
            },{
               title:"Test D",
               empty:false,
               key:"D",
               desc: "D",
               zOrder:4
            },{
               title:"Test E",
               empty:false,
               key:"E",
               desc: "E",
               zOrder:5
            }
            ],

            startZIndex: 10
         }
      },

      onThrowCatcherFocusedMe(_eventData, _pass){

         var focusedWindowRef = _eventData.myRef;
         var focusedWindowIndex = -1;
         var focusedWindowZOrder = -1;

         var items = this.state.subWindowItems;

         // 포커싱된 요소의 zOrder와 윈도우 배열상의 index를 얻는다.
         for(var i = 0; i < items.length; i++ ){
            var item = items[i];

            if( item.empty ) continue;
            if( item.key === focusedWindowRef ){
               focusedWindowIndex = i;
               focusedWindowZOrder = item.zOrder;
            }
         }

         if( focusedWindowRef < 0 ) throw new Error("존재하지 않는 윈도우 Key입니다.");

         for( var i = 0; i < items.length; i++ ){
            var item = items[i];

            // 비어있는 item은 스킵
            if( item.empty ) continue;


            if( item.zOrder > focusedWindowZOrder ){
               // 포커싱된 윈도우의 zOrder를 기준으로 상위의 zOrder를 가진 윈도우의 zOrder를 1씩 감소시킨다.
               item.zOrder = item.zOrder - 1;
            } else if ( item.zOrder == focusedWindowZOrder ) {
               // 포커싱된 윈도우의 zOrder를 maxZOrder로 변경한다.
               item.zOrder = items.length;
            }

            // 변경된 zOrder값을 반영한다.
            this.refs[item.key].setState({zOrder:item.zOrder});
         }
      },

      onThrowCatcherCloseMe( _eventData, _pass ){
         var windowRef = _eventData.myRef;

         var filteredSubWindowItems = this.state.subWindowItems;

         for(var i = 0; i < filteredSubWindowItems.length; i++ ){
            var item = this.state.subWindowItems[i];

            if( windowRef === item.key ){
               filteredSubWindowItems[i] = { empty:true };
            }
         }

         this.setState({subWindowItems: filteredSubWindowItems});
      },



      spawnSubWindow( _subWindowItem ){
         var emptyIndex = -1;

         var items = this.state.subWindowItems;

         for( var i = 0; i < items.length; i++ ){
            var item = items[i];

            if( item.empty ){
               emptyIndex = i;
               break;
            }
         }

         if( emptyIndex > 0 ){
            _subWindowItem.empty = false;
            _subWindowItem.zOrder = items.length;
            items[emptyIndex] = _subWindowItem;
         } else {
            _subWindowItem.zOrder = items.length + 1;
            items.push(_subWindowItem);
         }

         this.setState({subWindowItems:items});
      },


      mapWindowItem( _windowItem ){

         if( _windowItem.empty ){
            return <div style={{display:'none'}}/>
         } else {

            return ( <SubWindow ref={ _windowItem.key }
                                title={_windowItem.title}
                                text={_windowItem.desc}
                                x={50}
                                y={50}
                                width={300}
                                height={200}
                                baseZOrder={ this.state.startZIndex }
                                zOrder={_windowItem.zOrder}/> );
         }
      },


      render(){
         return (
            <div className='SubWindowSystem'>
               { this.state.subWindowItems.map( this.mapWindowItem ) }
            </div>
         );
      }
   });

   module.exports = SubWindowSystem;
})();
