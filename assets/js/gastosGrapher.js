
window.already_printed_corrientes = false;
window.already_printed_capital = false;
window.already_printed_finalidad_funcion = false;
window.already_printed_finalidad = false;
function dibujarD3_gastos() {
  if(already_printed_corrientes == false){
    dibujarD3_gastos_corrientes();
  }
  if(already_printed_capital == false){
    dibujarD3_gastos_capital();
  }
  dibujarD3_gastos_finalidad();
  dibujarD3_gastos_finalidad_funcion();
  $.getJSON("https://spreadsheets.google.com/feeds/list/11UGXTNvmaOezQNpFXxMXps_gT7kwEP08YeMdcz4wKXo/od6/public/values?alt=json", function( dataJSON ) {
  $("#clasificacion-economica-gasto").empty();
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    // console.log(dataJSON.feed.entry);
    var i = 0;
    $.each( dataJSON.feed.entry, function( key, val ) {
      i += 1;
      var partida = val.gsx$partida.$t;
      var nivel_tabla = val.gsx$nivel.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if(nivel_tabla != -2){
        if (partida_splited[1]==""){
          nivel -=1;
        }
        detalle[nivel] = concepto;
        if (nivel_princ == 3){
          nivel = 4
          detalle[2] = detalle[1]
          detalle[3] = detalle[1]
          detalle[4] = detalle[1]
        }else if (nivel_princ == 2 && nivel == 3) {
          nivel = 4
          detalle[4] = detalle[3]
        }

        if (nivel == 4){
          var linea = {"key": detalle[4],
                  "rec1": detalle[1],
                  "rec2": detalle[2],
                  "rec3": detalle[3],
                 "valor": parseInt(total.split('.').join(""))
               }
            datos.push(linea);
        }

        if(nivel == 6){
            var linea = {  "key": concepto,
                          "rec1": detalle[1],
                          "rec2": detalle[2],
                          "rec3": detalle[3],
                          "rec4": detalle[4],
                          "rec5": detalle[5],
                         "value": parseInt(total.split('.').join(""))}
            datos.push(linea);
        }
      }
    });

    console.log(datos);
    var data = d3.nest()
                .key(function(d) { return d.rec1; })
                .key(function(d) { return d.rec2; })
                .key(function(d) { return d.rec3; })
                .key(function(d) { return d.rec4; })
                .key(function(d) { return d.rec5; })
                .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#clasificacion-economica-gasto")
      .legend({"size": 30})
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos)
      .type("tree_map")
      .id(["rec1", "rec2", "rec3", "rec4", "rec5", "key"])
      .size("valor")
      .format("es_ES")
      .format({
          "number": function(number, key) {
            var formatted = d3plus.number.format(number, key);
            if (key.key === "valor") {
                var formatted = number.toLocaleString("es-AR")
                return "$" + formatted;
            }
            else {
              return formatted
            }
          }
      })
      .dev(true)
      .draw();

  });
}
function dibujarD3_gastos_corrientes() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/12aHIOCmpAYYOx2mBoO_IzAqfjeOUX0AnX7BheISd4go/od6/public/values?alt=json", function( dataJSON ) {
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    // console.log(dataJSON.feed.entry);
    var i = 0;
    $.each( dataJSON.feed.entry, function( key, val ) {
      i += 1;
      var partida = val.gsx$partida.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }
      detalle[nivel] = concepto;

      if (partida_splited[0] == "-1" && i>1){
        if(concepto.toUpperCase() != "EROGACIONES DE CAPITAL"){
          $("#tbody-gastos-corrientes").append('<tr class="nivel-1"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }
      }
        if (partida_splited[0] == "0"){
          $("#tbody-gastos-corrientes").append('<tr class="nivel-3"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }

      });
  already_printed_corrientes=true;
});
}

function dibujarD3_gastos_capital() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1dHvfU13hR8rThdLqplWKSMg6t8Xt3oq1nxB9c-ZJlfA/od6/public/values?alt=json", function( dataJSON ) {
    var datos = [];
    var datos_clasif_econo = [];
    var detalle = [];
    var i = 0;
    $.each( dataJSON.feed.entry, function( key, val ) {
      i += 1;
      var partida = val.gsx$partida.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      var concepto = val.gsx$concepto.$t;
      var total = val.gsx$total.$t;
      if (partida_splited[1]==""){
        nivel -=1;
      }
      detalle[nivel] = concepto;

      if (partida_splited[0] == "-1" && i>1){
        if(concepto.toUpperCase() != "EROGACIONES CORRIENTES"){
          $("#tbody-gastos-capital").append('<tr class="nivel-1"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }
      }
      if (partida_splited[0] == "0"){
        $("#tbody-gastos-capital").append('<tr class="nivel-2"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
      }
      if (partida_splited[0] == "1"){
        $("#tbody-gastos-capital").append('<tr class="nivel-3"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
      }

    });
    already_printed_capital=true;
});
}

function dibujarD3_gastos_finalidad() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1kNKGph0cxoVQf2WHSJK3ok7MoHg8vmISX5WFJ40jnyc/od6/public/values?alt=json", function( dataJSON ) {
    $("#gastos-finalidad").empty();
    var datos = [];
    var i = 0;
    $.each( dataJSON.feed.entry, function( key, val ) {
      i += 1;

      var concepto = val.gsx$clasificaciónporfinalidadyfunción.$t;
      var total = val.gsx$total.$t;
      if(i>1){
        var linea = {"key": concepto,
                "valor": parseInt(total.split('.').join(""))}
        datos.push(linea);
        if(already_printed_finalidad == false){
          $("#tbody-gastos-finalidad").append('<tr class="nivel-3"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }
      }else{
        if(already_printed_finalidad == false){
          $("#tbody-gastos-finalidad").append('<tr class="nivel-2"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }
      }

    });
    // Grafico Gastos por Clasificacion Economica
    var visualization = d3plus.viz()
      .container("#gastos-finalidad")
      .background("#EEEEEE")
      .legend({"size": 50})
      .tooltip(true)
      .tooltip({"children":0})
      .data(datos)
      .type("pie")
      .id(["key"])
      .size("valor")
      .format("es_ES")
      .format({
          "number": function(number, key) {
            var formatted = d3plus.number.format(number, key);
            if (key.key === "valor") {
                var formatted = number.toLocaleString("es-AR")
                return "$" + formatted;
            }
            else {
              return formatted
            }
          }
      })
      .draw();
      already_printed_finalidad=true;

});
}

function dibujarD3_gastos_finalidad_funcion() {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1kneGr7WYlVWQ4KyzH79bm3W5tHW4C45z1HYg1AYrlJg/od6/public/values?alt=json", function( dataJSON ) {
    $("#finalidadFuncionGraph").empty();
    var datos = [];
    var detalle = [];
    var i = 0;
    // console.log(dataJSON.feed.entry);
    $.each( dataJSON.feed.entry, function( key, val ) {
      i += 1;
      var partida = val.gsx$partida.$t;
      var partida_splited = partida.split('.');
      var nivel = partida_splited.length;
      var nivel_princ = parseInt(partida_splited[0]);
      var concepto = val.gsx$clasificaciónporfinalidadyfunción.$t;
      var total = val.gsx$total.$t;
      var nivel_aux = nivel;
      if (partida_splited[1]==""){
        nivel -=1;
      }else{
        nivel_aux+=1;
      }
      if(already_printed_finalidad_funcion == false){
        if(i>1){
          $("#tbody-gastos-finalidad-funcion").append('<tr class="nivel-'+nivel_aux+'"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }else{
          $("#tbody-gastos-finalidad-funcion").append('<tr class="nivel-1"><td>'+concepto+'</td><td>$'+total.toLocaleString("es-AR")+'</td></tr>');
        }
      }

      if(partida_splited[0]!= "-1"){
        detalle[nivel] = concepto;
        if (nivel == 2){
          var linea = {"key": detalle[2],
                  "rec1": detalle[1],
                 "valor": parseInt(total.split('.').join(""))
               }
            datos.push(linea);
        }

      }

    });
    // console.log(datos);



    var data = d3.nest()
                .key(function(d) { return d.rec1; })
                .entries(datos);

    // console.log(data);
    var visualization = d3plus.viz()
      .background("#EEEEEE")
      .container("#finalidadFuncionGraph")
      .legend({"size": 30})
      // .labels({"align": "left", "valign": "top"})
      .tooltip(true)
      .tooltip({"children":0})
      // .tooltip({"large":getTooltipWidth(), "small":getTooltipWidth()})
      .data(datos)
      .type("tree_map")
      .id(["rec1", "key"])
      .size("valor")
      .format("es_ES")
      .format({
          "number": function(number, key) {
            var formatted = d3plus.number.format(number, key);
            if (key.key === "valor") {
                var formatted = number.toLocaleString("es-AR")
                return "$" + formatted;
            }
            else {
              return formatted
            }
          }
      })
      .dev(true)
      .draw();
      already_printed_finalidad_funcion=true;

});
  // create list of node positions
  // $("#viz-clasificacion-gasto").empty();
  // var positions = [
  //   {"name": "Clasificaciones del Gasto", "x": 0, "y": 0, "size":100},
  //   {"name": "Institucional", "x": 0, "y": -50, "size":20},
  //   {"name": "Por Objeto", "x": 0, "y": 50, "size":20},
  //   {"name": "Económica", "x": -50, "y": 0, "size":20},
  //   {"name": "Por Finalidad y Función", "x": 50, "y": 0, "size":20}
  // ]
  // // create list of node connections
  // var connections = [
  //   {"source": "Clasificaciones del Gasto", "target": "Institucional"},
  //   {"source": "Clasificaciones del Gasto", "target": "Por Objeto"},
  //   {"source": "Clasificaciones del Gasto", "target": "Económica"},
  //   {"source": "Clasificaciones del Gasto", "target": "Por Finalidad y Función"},
  // ]
  // var attributes = [
  //   {"name": "Clasificaciones del Gasto", "hex":"#1F5693"},
  //   {"name": "Institucional", "hex":"#1F5693"},
  //   {"name": "Por Objeto", "hex":"#1F5693"},
  //   {"name": "Económica", "hex":"#1F5693"},
  //   {"name": "Por Finalidad y Función", "hex":"#1F5693"},
  // ]
  // // instantiate d3plus
  // var visualization = d3plus.viz()
  //   .container("#viz-clasificacion-gasto")
  //   .type("network")
  //   .background("#EEEEEE")
  //   .attrs(attributes)
  //   .color("hex")
  //   .nodes(positions)
  //   .edges(connections)
  //   .edges({"color":"#000"})
  //   .focus({
  //      "tooltip" : false
  //    })
  //   // .zoom(false)
  //   .id("name")
  //   .size(20)
  //   .draw()
}
dibujarD3_gastos();



$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  // e.prevenDefault();
  if(history.pushState) {
    history.pushState(null, null, '#'+e.target.hash.substr(1));
  }
  else {
      location.hash = '#'+e.target.hash.substr(1);
  }
  dibujarD3_gastos();
  // if(e.target.hash.substr(1) == 'en-que'){
  //   dibujarD3_gastos();
  // }
  return false ;
})

$(window).on('resize', function(){
  dibujarD3_gastos();
});


$( document ).ready(function() {
  var hash = window.location.hash;
  hash = hash.substring(hash.indexOf('#')+1).toLowerCase();
  // console.log(hash);
  if(hash == "propios" || hash == "no-propios"){
    $('.nav-tabs a[href="#corrientes"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  }else if (hash == "cortoplazo" || hash == "largoplazo"){
    $('.nav-tabs a[href="#capital"]').tab('show');
    // $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  }
  $('.nav-tabs a[href="#'+hash+'"]').tab('show');
  if(hash!= ""){
    $('html, body').animate({

        scrollTop: $("#"+hash).offset().top-275
      }, 1000);
  }

});
