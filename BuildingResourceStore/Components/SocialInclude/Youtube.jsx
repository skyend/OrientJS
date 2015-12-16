
module.exports =  {
    class : React.createClass({ // 고정
      getDefaultProps(){
        return {
          width:320,
          height:240,
          movieCode:'KK9bwTlAvgo',
          frameborder:0,
          allowfullscreen:false,
          hideRelativeItems: false,
          hideControls: false,
          hideInfo:false,
          private:false
        }
      },

      // 예시
      render: function () {
        var urlParams = [];
        var url = 'https://www.youtube.com/embed/'+this.props.movieCode

        if( /true|yes/.test(this.props.private) ){
          url = 'https://www.youtube-nocookie.com/embed/'+this.props.movieCode;
        }

        if( /true|yes/.test(this.props.hideRelativeItems) ){
          urlParams.push('rel=0');
        }

        if( /true|yes/.test(this.props.hideControls)  ){
          urlParams.push('controls=0');
        }

        if( /true|yes/.test(this.props.hideInfo) ){
          urlParams.push('showinfo=0');
        }

        url = url + '?' + urlParams.join("&");


        if( this.props.allowfullscreen ){
          return (
            <iframe width={this.props.width} height={this.props.height} src={this.props.sourceURL} frameborder={this.props.frameborder} allowfullscreen/>
          )
        } else {
          return (
            <iframe width={this.props.width} height={this.props.height} src={this.props.sourceURL} frameborder={this.props.frameborder} />
          )
        }

      }

    }),

    renderType:'staticFromReact',
    elementType:'react',

    propStruct : {
      "width" : {
        "title": "Width",
        "format" : "number"
      },
      "height" : {
        "title": "Height",
        "format" : "number"
      },
      "movieCode" : {
        "title": "Movie Code",
        "format" : "string"
      },
      "frameborder" : {
        "title": "Frame Border Width",
        "format" : "number"
      },
      "allowfullscreen" : {
        "title": "Allow fullscreen",
        "format" : "boolean" // -> checkbox
      },
      "hideRelativeItems" : {
        "title": "hide relative items",
        "format" : "boolean"
      },
      "hideControls" : {
        "title": "hide controls",
        "format" : "boolean"
      },
      "hideInfo" : {
        "title": "hide info",
        "format" : "boolean"
      },
    },

    positionHints : {
      width:100,
      height:100,
      display:'block',
      float:'left'
    }
  };
