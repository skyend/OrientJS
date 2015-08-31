
var React = require("react");

var HorizonFieldSet = require('../../partComponents/HorizonFieldSet.jsx');
var htmlTag = require('../toolsData/htmlTag.json');

var EmptyTypeElementNode = React.createClass({
    mixins: [
        require('../../reactMixin/EventDistributor.js'),
        require('../mixins/WidthRuler.js')],



    render() {

        var rootClasses = ['part', this.props.theme, this.getMySizeClass()];

        var targetDocument = this.props.targetDocument;

        var documentInfo = [
          { "name": "DocumentID", title:"문서 ID", "initialValue": targetDocument.getDocumentID(), enterable:false},          
          { "name": "DocumentName", title:"문서 명", "initialValue": targetDocument.getDocumentName(), enterable:true, type:"input"},
          { "name": "DocumentTitle",  title:"문서 제목","initialValue": targetDocument.getDocumentTitle(), enterable:true, type:"input" },
          { "name": "DocumentType",  title:"문서 타입","initialValue": targetDocument.getType(), enterable:true, type:"select" , options:[{value:'layout'},{value: 'contents'}]}
        ];

        var documentState = [
          { "name": "lastElementId", title:"LEID", "initialValue": targetDocument.getLastElementId(), enterable:false},
          { "name": "createDate",  title:"생성날짜","initialValue": targetDocument.getDocumentCreate(), enterable:false},
          { "name": "updateDate",  title:"수정날짜","initialValue": targetDocument.getDocumentUpdate(), enterable:false}
        ];

        var cssEdit = [
          { "name": "PageCSS", title:"CSS", "initialValue": targetDocument.getPageCSS(), enterable:true, 'type':'ace', height:200, lang:'css', editorId:"DocumentCSSEditor"},
        ];

        return (
            <div className={rootClasses.join(' ')}>
              <HorizonFieldSet title="Document Profile" theme='dark' nameWidth={80} fields={ documentInfo } ref='DocumentProfile'/>
              <HorizonFieldSet title="Document State" theme='dark' nameWidth={80} fields={ documentState } ref='DocumentState'/>
              <HorizonFieldSet title="Page Style Sheet" theme='dark' nameWidth={0} fields={ cssEdit } ref='Style'/>
            </div>
        );
    }
});

module.exports = EmptyTypeElementNode;
