var sheet = Atom.define({
  functions: {
    test : function(3){
      console.log("aaa");
    }
  },

  actions: {

  },

  tasks: {

  },

  values: {

  },

  main : function(){
    <body>
      <h1 en-event-click='{{ function@test(3) }}'>
        <script type='text/function' en-scope-type='function' name='aaaaa'>
          return function(){
            console.log("AA");
          }
        </script>
        <en:function name='test2'>
        var i = 0;
          return function(_a){
            i = i + _a;
            console.log(i);
          }
        </en:function>
        <sub>A</sub>
      </h1>
      <h2 en-ctrl-repeat-n='5' en-ctrl-hidden='false' a={aa} >
        <sub>B</sub>
      </h2>
      <h3>
        <sub>C</sub>
      </h3>


      <div en-ctrl-repeat-n='3'>
        <div en-ctrl-repeat-n='{{: en@repeat-n }}'>
          {{: en@repeat-n }}
        </div>
      </div>
      <!-- <span en-ctrl-repeat-n='5'>

      </span> -->
    </body>
  }
});
