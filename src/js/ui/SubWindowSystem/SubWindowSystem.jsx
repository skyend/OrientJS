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
            subWindowItems : [],

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
            if( item.ref === focusedWindowRef ){
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
            this.refs[item.ref].setState({zOrder:item.zOrder});
         }
      },

      onThrowCatcherCloseMe( _eventData, _pass ){
         var windowRef = _eventData.myRef;

         var filteredSubWindowItems = this.state.subWindowItems;

         for(var i = 0; i < filteredSubWindowItems.length; i++ ){
            var item = this.state.subWindowItems[i];

            if( windowRef === item.ref ){
               filteredSubWindowItems[i] = { empty:true };
            }
         }

         console.log(filteredSubWindowItems);

         this.setState({subWindowItems: filteredSubWindowItems});
      },



      spawnSubWindow( _newSubWindowItem ){
         var emptyIndex = -1;

         var items = this.state.subWindowItems;

         // subWindowArray 에서 window비어있는 방을 검색한다.
         // 비어있는 방을 검색과 동시에 비어있지 않은 방의 window Key와 현재 새 subWindow 의 Key가 같은지 확인한다.
         var duplicated = false;
         var duplicatedCount = 0;
         var lastDuplicatedCount = 0;
         for( var i = 0; i < items.length; i++ ){
            var item = items[i];

            if( item.empty ){
               emptyIndex = i;
            } else {

               // 같은 키를 가진 window를 발견하면 duplicated를 true로 변경한다.
               if( _newSubWindowItem.key === item.key){
                  duplicated = true;
                  duplicatedCount++;

                  if( typeof item.lastDuplicatedCount === 'number' ){
                     lastDuplicatedCount = item.lastDuplicatedCount;
                  }
               }
            }
         }

         _newSubWindowItem.ref = _newSubWindowItem.key;

         // 이미 생성되어 사용중인 window Key로 새 윈도우를 생성하려 한다면.
         if( duplicated ){

            // 해당 windowKey가 중복생성을 허용하지 않는다면
            // 이미 생성된 동일한 키의 윈도우로 focus한다.
            if( ! _newSubWindowItem.duplication ) return this.refs[_newSubWindowItem.ref].focus();

            // 중복생성을 허용한다면
            // ref를 중복된 key에서 중복생성으로 인해 만들어진 누적중복값에 +1을 한 후 새 ref를 만든다.
            _newSubWindowItem.lastDuplicatedCount = lastDuplicatedCount + 1;
            _newSubWindowItem.ref = _newSubWindowItem.key + "_" + _newSubWindowItem.lastDuplicatedCount;
         }


         // 중간에 비어있는 방을 찾았다면 그 방의 index에 새 윈도우를 삽입한다.
         if( emptyIndex > 0 ){

            _newSubWindowItem.empty = false;
            _newSubWindowItem.zOrder = items.length;
            items[emptyIndex] = _newSubWindowItem;
         } else {
            // 비어있는 방을 찾지 못했다면 push하여 윈도우를 삽입한다.
            _newSubWindowItem.zOrder = items.length + 1;

            items.push(_newSubWindowItem);
         }

         // component 업데이트
         this.setState({subWindowItems:items});
      },


      mapWindowItem( _windowItem ){

         if( _windowItem.empty ){
            return <div style={{display:'none'}}/>
         } else {

            return ( <SubWindow ref={ _windowItem.ref }
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

      componentDidMount(){
         var testWindowList = [{
            title:"Test A",
            empty:false,
            key:"A",
            desc: "A",
            duplication:false,
            zOrder:1
         },{
            title:"Test B",
            empty:false,
            key:"B",
            desc: "B",
            duplication:false,
            zOrder:2
         },{
            title:"Test C",
            empty:false,
            key:"C",
            desc: "C",
            duplication:false,
            zOrder:3
         },{
            title:"Test D",
            empty:false,
            key:"D",
            desc: "D",
            duplication:false,
            zOrder:4
         },{
            title:"Test E",
            empty:false,
            key:"E",
            desc: "E",
            duplication:false,
            zOrder:5
         }];

         for( var i = 0; i < testWindowList.length; i++ ){
            this.spawnSubWindow(testWindowList[i]);
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
