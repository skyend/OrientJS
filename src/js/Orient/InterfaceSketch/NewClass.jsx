var component = Orient.createComponent({

  defineValues: function(){
    return [
      { name:'val01', 'type':'string', 'AAA'},
      { name:'val02', 'type':'string', 'AAA'},
      { name:'val03', 'type':'string', 'AAA'},
    ];
  },

  random(){
    return Math.random() * 1000;
  },

  main : function(){
    <body>
      <h1 en-event-click='{{ function@test(3) }}'>
        <sub>A</sub>
      </h1>

      <h2 en-ctrl-repeat-n='5' en-ctrl-hidden='false' a={{ func@random() }} >
        <sub>B</sub>
      </h2>

      <h3>
        <sub>C</sub>
      </h3>

      <div o-ctrl-repeat-n='3'>
        <div en-ctrl-repeat-n='{{: en@repeat-n }}'>
          {{: en@repeat-n }}
        </div>
      </div>
    </body>
  }
});
