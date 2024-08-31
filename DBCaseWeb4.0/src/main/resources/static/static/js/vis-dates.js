var nodes = new vis.DataSet([]);
var nodes_super = new vis.DataSet([]);
var nodoSelected;
var poscSelection;
var typeDomain = new Domains();
// create an array with edges
var edges = new vis.DataSet([]);
var edges_super = new vis.DataSet([]);
var changeDrawView = true;
var nodes_selected_event = false;

var idCount =1000;
var idSuperEntityCount =0;

 
  // create a network
var container = document.getElementById('diagram');
var container_super = document.getElementById('diagram_super');
var data_super = {
		nodes: nodes_super,
	    edges: edges_super
	};

var data = {
	nodes: nodes,
    edges: edges
};

var options = {
		
		 edges: {      
			// font: '22px arial #13A20E',
			/* font: {
				 //strokeWidth:0,
			      color: '#13A20E',
			      //size: 14px, // px
			      face: 'arial'},
*///borderWidthSelected:0,
		//	 font: '12px arial #000000',
		    smooth: {
		      type: "continuous",
		      forceDirection: "none",
		      roundness: 1
		    }
		  },
		  nodes: {
			  borderWidthSelected:0,
			  font: '12px arial #000000',//cambiado
			  color: {
				 border: '#ffcc45',
				 background:'#ffcc45', 
				 highlight: {
				        border: '#000000',
				        background: '#CEA023'
				      },
				 hover: {
					 border: '#ffcc45',
					 background: '#ffcc45'
						 }
			 }},
		  physics: {
	          enabled: false
	        },
		  interaction:{
		    dragNodes:true,
		    dragView: true,
		    hideEdgesOnDrag: false,
		    hideEdgesOnZoom: false,
		    hideNodesOnDrag: false,
		    hover: false,
		    hoverConnectedEdges: true,
		    keyboard: {
		      enabled: true,
		      speed: {x: 10, y: 10, zoom: 0.02},
		      bindToWindow: true
		    },
		    multiselect: true,
		    navigationButtons: true,
		    selectable: true,
		    selectConnectedEdges: true,
		    tooltipDelay: 300,
		    zoomView: true
		  }

		};
  
//options = {};
var network = new vis.Network(container, data, options);

var network_super = new vis.Network(container_super, data_super, options);

/**
 * 
 * @returns Devuelve un id unico para asignar a un nuevo elemento que se cree
 */
  function getIdElement(){      //TODO: Eliminar, verificar antes su uso
	  var dataIds = nodes.getIds();
	  if(dataIds.length==0)
		  var nextId = -1;
	  else
		  var nextId = dataIds[dataIds.length-1];
	  return ++nextId;
  }
  
  function deleteSuperEntity(idNodo){
    console.log("deleting superEntity");
	  var idNode = parseInt(idNodo);
	  nodes_super.forEach(function(nod) {
		  //console.log("nodes_super id: " + nod.id);
		  // Desmarcamos los elementos que forman parte de la entidad
		  nodes.update({id:nod.id, super_entity:false});
		  nodes_super.remove(nod.id);
	  });
	  //deleteSuperEntityAndEelements(idNodo);
	  nodes.remove(idNode);
      nodes_super.clear();
      edges_super.clear()
	  updateTableElements();
  }
  
  function deleteSuperEntityAndEelements(idNodo){
	  var idNode = parseInt(idNodo);
	  console.log("deleteSuperEntityAndEelements: "+ idNode);
	  nodes_super.forEach(function(nod) {
          //nodes.update({id:nod.id, super_entity:false});
          // Eliminamos los nodos que forman parte de la agregación
          nodes.remove(nod.id);
          nodes_super.remove(nod.id);
      });
      // Eliminamos la agregación
	  nodes.remove(idNode);
	  //nodes_super.remove(idNode);
	  nodes_super.clear();
	  edges_super.clear();
  }

  function ctxRenderer({ ctx, x, y, state: { selected, hover }, style , label}) {
      const r = style.size;
      ctx.beginPath();
      const sides = 6;
      const a = (Math.PI * 2) / sides;
      ctx.moveTo(x , y + r);
      for (let i = 1; i < sides; i++) {
          ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
      }
      ctx.closePath();
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.font = "normal 12px sans-serif";
      ctx.fillStyle = 'black';
  }
  
  function simuleClickSuper(){  //TODO: Eliminar funcion
		var event = new PointerEvent('pointerdown');
		return new Promise(resolve => document.getElementsByClassName("vis-zoomExtendsScreen")[0].dispatchEvent(event));
  }
  
  function createSuperEntity(labelName){    //TODO: Eliminar funcion
	  var size_width = 110;
	  var c = document.getElementsByTagName("canvas")[0];
	  var sizeWidth = c.style.width.slice(0, -2);
	  if(parseInt(sizeWidth)<120)
		  size_width = sizeWidth;
	  
	  if(nodes_super.get().length<5)
		  size_width = 45;
	  var ctx = c.getContext("2d");
	  //var img_super = ctx.canvas.toDataURL('image/png', 1.0);//  2aba06 cambiado
	  var textTheme = $("#textTheme").text();
      var isDarkTheme = (textTheme === 'dark');
	  /*nodes.add({label: labelName, shape: 'image', size: size_width, borderWidth: 3,color: {
			 border: '#000000', 
			 background: isDarkTheme ? '#E0E0E0' : '#A0A0A0',
			 highlight: {
			        border: '#000000',
			        background: isDarkTheme ? '#C0C0C0' : '#606060'
			      },
			 hover: {
				 border: '#000000',
				 background: isDarkTheme ? '#C0C0C0' : '#606060'
					}

	  }, shapeProperties: { useBorderWithImage:true}, font: {
	         color: isDarkTheme ? '#000000' : '#ffffff'
	         }
	  });*/
  }
  
  async function simuleClickAsync() {   //TODO: Eliminar funcion
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 200)
	  });
	  let result = await promise; // wait until the promise resolves (*)
	  await simuleClickSuper(); // "done!"
	}
  
  async function simuleClickAsync1() {      //TODO: Eliminar funcion
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 2000)
	  });
	  let result = await promise; // wait until the promise resolves (*)
	  await simuleClickSuper(); // "done!"
	}
  
  function simuleClickSuperNew(){       //TODO: Eliminar funcion
	  var left = 0;
	  var right = 0;
	  var top = 0;
	  var bottom = 0;
	  if(nodes_super.length>0){
		  left = nodes_super.get()[0].x;
		  right = nodes_super.get()[0].x;
		  top = nodes_super.get()[0].y;
		  bottom = nodes_super.get()[0].y;
	  }
	  //console.log(left+" "+right+" "+ top+" "+bottom);
	  nodes_super.forEach(function(nod) {
		  if(left>nod.x){
			  left = nod.x;
		  }
	  });
	  
	  nodes_super.forEach(function(nod) {
		  if(right<nod.x){
			  right = nod.x;
		  }
	  });
	  
	  nodes_super.forEach(function(nod) {
		  if(top>nod.y){
			  top = nod.y;
		  }
	  });
	  
	  nodes_super.forEach(function(nod) {
		  if(bottom<nod.y){
			  bottom = nod.y;
		  }
	  });
	 // console.log(left+" "+right+" "+ top+" "+bottom);
	  var width_super = right - left;
	  var height_super = top - bottom;
	  width_super = Math.abs(width_super);
	  height_super = Math.abs(height_super)+50;
	 // console.log(width_super+" width_super");
	 // console.log(height_super+" height_super");
	  var widthTotal = (width_super+50);
	  var heightTotal = ((height_super*(width_super+50))/width_super);
	 // console.log(widthTotal+" widthTotal");
	  //console.log(heightTotal+" heightTotal");
	  document.getElementsByTagName("canvas")[0].style.width = widthTotal+"px";
	  document.getElementsByTagName("canvas")[0].style.height = heightTotal+"px";
  }
  
  async function simuleClickAsyncNew() {    //TODO: Eliminar funcion
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 1000)
	  });
	  let result = await promise;
	  await simuleClickSuperNew();
	  console.log("prueba12");
  }
  
  async function simuleClickAsync12(labelName) {        //TODO: Eliminar funcion
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 2800)
	  });
	  let result = await promise;
	  await createSuperEntity(labelName);
	}
  
  async function updateTableElementsPromise() {
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 3000)
	  });
	  let result = await promise;
	  await updateTableElements();
	}

    function updateIdCount(){
        //Actualizamos el contador
        var nods = nodes.getIds();
        var idCountAux = idCount;
        nods.forEach(function(node) {
            console.log(node + " - " +idCount);
            if(node >= idCount){
                idCount = node;
                idCount++;
            }

            console.log(idCount);

        });
        //idCount++;

    }
  
    function addSuperEntity(idElement, labelName, action){   //TODO: Mejorar implementacion + añadir comments

        var left = null;
        var right = null;
        var top = null;
        var bottom = null;

        var x_super = 0;
        var y_super =0;
        var width_super = 0;
        var height_super = 0;

        var num_elements_super_entity = 0;

        //console.log("[Super Entity] - idCount: " + idCount + ", label: " + labelName + ", idSuperEntityCount: " + idSuperEntityCount);

        if(action == "edit"){
        //console.log("idElement: "+idElement);
            nodes.update({id:idElement, label:labelName});
        }
        else if(getSuperEntityNode() ==null){   // No hay una agregación ya creada

            getNodesElementsWithSuperEntity(network.getSelectedNodes());    //get nodes connected to super entity
            console.log("Añadimos AGRE");
            updateSuperEntityEdges();

            // Calculamos el tamaño y posición de la agregación en base al numero de elementos que la componen

            //console.log("x_super: "+x_super+", y_super: "+y_super+", width_super: "+width_super+", height_super: "+height_super);
            var coordinates =[];
            //coordinates= setSuperEntityCoordinates((action == "edit"), null);
            //console.log("x_super: "+coordinates[0]+", y_super: "+coordinates[1]+", width_super: "+coordinates[2]+", height_super: "+coordinates[3]);


            var textTheme = $("#textTheme").text();
            var isDarkTheme = (textTheme === 'dark');
            var data_element = {id: idSuperEntityCount, widthConstraint: { minimum: 400}, heightConstraint: { minimum: 200 }, label: labelName, shape: 'box',physics:false, is_super_entity:true, super_entity:false,
              color:{
                  //background: isDarkTheme ? '#F8F9FA' : '#343A40',
                  border: '#ffcc45',
                  background: 'transparent',
                  highlight: {
                      border: '#000000',
                      background: 'transparent',
                      //background: isDarkTheme ? '#F8F9FA' : '#343A40',
                      borderWidth: 4
                  }
              },
               borderWidth: 2, font: {
                   color: isDarkTheme ? '#000000' : '#ffffff',
                   //vadjust: (coordinates[3]/2) + 15  // Ajustar la posición vertical de la etiqueta
              }
            };

            /*data_element.x = coordinates[0];
            data_element.y = coordinates[1];
            data_element.widthConstraint.minimum = coordinates[2];
            data_element.heightConstraint.minimum = coordinates[3];*/
            data_element.is_super_entity = true;
            setSuperEntityCoordinates(false, data_element);
            var aux = getSuperEntityNode();
            console.log("AGR:  x --> "+ aux.x +" y --> " +aux.y + " width --> " + aux.widthConstraint.minimum + " height --> " + aux.heightConstraint.minimum);

            //nodes.add(data_element);
            idSuperEntityCount++;
            idCount++;

        }
        else{
            alert("Error: Ya existe una agregación.");
        }

      updateTableElementsSuperEntity();
        //console.log("[Super Entity] - idCount: " + idCount + ", label: " + labelName + ", idSuperEntityCount: " + idSuperEntityCount);
    }

function setSuperEntityCoordinates(modifySuperEntity, node){

    var left = null;
    var right = null;
    var top = null;
    var bottom = null;

    var x_super = 0;
    var y_super =0;
    var width_super = 0;
    var height_super = 0;

    var allNodes = nodes.get();

    allNodes.forEach(function(nod){
        // Guardamos las coordenadas que forman los extremos de los nodos de la agregación
        if(nod.super_entity){
            if(left ===null || left > nod.x){
                left = nod.x;
            }

            if(right ===null || right < nod.x) {
                right = nod.x;
            }

            if(top == null || (top > nod.y)) {
                top = nod.y;
            }

            if(bottom ===null || (bottom < nod.y)) {
                bottom = nod.y;
            }


            /*console.log("[LEFT] - label: " + nod.label + ", min X: " + left);
            console.log("[RIGHT] - label: " + nod.label + ", max X: " + right);
            console.log("[TOP] - label: " + nod.label + ", min Y: " + bottom);
            console.log("[BOTTOM] - label: " + nod.label + ", max Y: " + top);*/

        }

    });

    node.x = (left + right)/2;
    node.y = (top + bottom)/2;

    node.widthConstraint.minimum = (Math.abs(right - left)) + 200;
    node.heightConstraint.minimum = (Math.abs(top - bottom)) + 100;

    node.font.vadjust = (node.heightConstraint.minimum/2) + 15;

        /*console.log("[X] - label: " + node.label + ", valor: " + node.x);
        console.log("[Y] - label: " + node.label + ", valor: " + node.y);
        console.log("[width] - label: " + node.label + ", valor: " + (Math.abs(right - left)));
        console.log("[height] - label: " + node.label + ", valor: " + (Math.abs(top - bottom)));*/


    if(!modifySuperEntity && node.is_super_entity){  // Añadimos agregación u otro elemento nuevo

        nodes.add(node);
        //nodes_super.add(node);
    }
    else{       // Modificamos un nodo

        nodes.update(node);

        if(node.super_entity){
            nodes_super.update(node);
        }
    }

}

  // Marcamos los nodos que pertenecen a la agregación
  function getNodesElementsWithSuperEntity(nodesIds){

	  nodesIds.forEach(function(nod) {
	  //Actualizamos el campo si el nodo no es la agregación
		  if(!nod.is_super_entity){
              var node = nodes.get(nod);
			  nodes.update({id: nod, super_entity: true});
			  nodes_super.add(node);
			  console.log("nod shape: "+node.shape);
			  // Buscamos los atributos de las entidades y relaciones que forman parte de la agregación
			  switch(node.shape){
			  case 'box':
                  var entityAttr = allAttributeOfEntity(node.id);
                  entityAttr.forEach(function(attr){
                    //Actualizamos el campo si el nodo no está seleccionado
                    if(!nodesIds.includes(attr.id)){
                        nodes.update({id: attr.id, super_entity: true});
                        var aux = nodes.get(attr.id);
                        nodes_super.add(aux);
                    }
                    //Recorremos y actualizamos los subatributos si los hay
                    var subAttr = allSubAttribute(attr.id);
                    subAttr.forEach(function(sAttr){
                         //Actualizamos el campo si el nodo no está seleccionado
                         if(!nodesIds.includes(sAttr.id)){
                            nodes.update({id: sAttr.id, super_entity: true});
                            var auxS = nodes.get(sAttr.id);
                            nodes_super.add(auxS);
                         }
                     });
                  });
			  break;
			  case 'diamond':
                  var relationAttr = allAttributeOfEntity(node.id);
                  relationAttr.forEach(function(attr){
                    //Actualizamos el campo si el nodo no está seleccionado
                    if(!nodesIds.includes(attr.id)){
                        nodes.update({id: attr.id, super_entity: true});
                        var aux = nodes.get(attr.id);
                        nodes_super.add(aux);
                    }

                    //Recorremos y actualizamos los subatributos si los hay
                    var subAttr = allSubAttribute(attr.id);
                    subAttr.forEach(function(sAttr){
                         //Actualizamos el campo si el nodo no está seleccionado
                         if(!nodesIds.includes(sAttr.id)){
                            nodes.update({id: sAttr.id, super_entity: true});
                            var auxS = nodes.get(sAttr.id);
                            nodes_super.add(auxS);
                         }
                     });

                  });
              break;
              default:
              break;
			  }
		  }
	  });
  }

  function updateSuperEntityEdges(){
      console.log("updateSuperEntityEdges");
      var edge = edges.get();
      var superNodes = nodes_super.getIds();
  	  edge.forEach(function(edg) {
  	  // Añadimos los edges de los elementos que forman parte de la agregación
  		  if(superNodes.includes(edg.to) && superNodes.includes(edg.from)){
              console.log("edge To: "+edg.to + " - edge from: "+edg.from);
              edges_super.add(edg);
              console.log("edges_super: "+edges_super.length);

  		  }
  	  });
    }
  
  function addEntity(nombre, weakEntity,action, idSelected, elementWithRelation, relationEntity){
      updateIdCount();
	  console.log("[Entity] - idCount: " + idCount + ", label: " + nombre + ", idSuperEntityCount: " + idSuperEntityCount + ", nodes size: " + nodes.length);
	  var data_element = {id: idCount, widthConstraint:{minimum: 100, maximum: 200}, label: nombre, isWeak: weakEntity, shape: 'box', scale:10, heightConstraint:25,physics:true, is_super_entity:false, super_entity:false};//cambiado
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
          data_element.super_entity=nodes.get(data_element.id).super_entity;
		  nodes.update(data_element);
		  //console.log("parseamos id: "+idSelected + " data_element.id: "+data_element.id);
		  //console.log("nombre de la entidad: "+nombre);
		  //var data_element = {id: idCount, widthConstraint:{minimum: 100, maximum: 200}, is_super_entity:false, super_entity:false, label: nombre, isWeak: weakEntity, shape: 'box', scale:10, heightConstraint:25,physics:true};//cambiado
		  //nodes.update({id:data_element.id, label:nombre});

	  }else{
		  if(poscSelection != null){
			  data_element.x = poscSelection.x;
			  data_element.y = poscSelection.y;
		  }
		  //console.log("add entity id: " + data_element.id);
		  nodes.add(data_element);
		  idCount++;
	  }
      //console.log("[Entity (x, y) - (w, h) ]: ( "+ data_element.x +", " +data_element.y + " ) - ( " + data_element.widthConstraint.minimum + ", " + data_element.heightConstraint + " )");

	  
	  if(weakEntity && elementWithRelation != null){
		  idRelation = addRelation(relationEntity, "create", null, "back");
		  addEntitytoRelation(data_element.id, "", "1to1", "", "1", "1", "create", idRelation, true, true);
		  addEntitytoRelation(parseInt(elementWithRelation), "", "1toN", "", "1", "N", "create", idRelation, false);
	  }

	  updateTableElements();
	  //console.log("[Entity] - idCount: " + idCount + ", label: " + nombre + ", idSuperEntityCount: " + idSuperEntityCount);
  }

  function addConstrainst(values, idSelected, action){
	  var valuesFilter = [];
	  for(var i=0;i<values.length;i++){
		 if(values[i].value!="" && values[i].value!="${temp_value}")
			  valuesFilter.push(values[i].value);
	  }
	  var data_element = {constraints: valuesFilter};
	  data_element.id = parseInt(idSelected);
	  nodes.update(data_element);
  }
 
  function addTableUnique(values, idSelected, action){
	  var data_element = {tableUnique: JSON.stringify(values)};
	  data_element.id = parseInt(idSelected);
	  nodes.update(data_element);
  }
  
  function addRelation(nombre, action, idSelected, origin = "front"){
      updateIdCount();

	  var  tam = 30;
	  if (nombre.length>5){
		  tam = 30+(nombre.length-5);
	  }
	  console.log("[Relation] - idCount: " + idCount + ", label: " + nombre + ", idSuperEntityCount: " + idSuperEntityCount);
	  var data_element = {id: idCount, size:tam,label: nombre, shape: 'diamond', is_super_entity:false, super_entity:false,
		  color: {
				 border: '#FF3F20',
				 background:'#FF3F20',
				 highlight: {
				        border: '#000000',
				        background: '#C93821'
				      }}
		  //color: '#FF3F20'
		  , scale:20, physics:false, zIndex:0};//D5FF04  cambiado(ff554b)
	  
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  data_element.super_entity=nodes.get(data_element.id).super_entity;
		  nodes.update(data_element);
	  }else{
		  if(poscSelection != null){
			  if(origin != "front"){
				  data_element.x = poscSelection.x;
				  data_element.isWeak = "active";
				  data_element.y = poscSelection.y-100;
			  }else{
				  data_element.x = poscSelection.x;
				  data_element.y = poscSelection.y;
			  }
		  }
		  idCount++;
		  //console.log("[Relation] - idCount: " + idCount + ", label: " + nombre + ", idSuperEntityCount: " + idSuperEntityCount);
		  //console.log("[Relation (x, y) - (size) ]: ( "+ data_element.x +", " +data_element.y + " ) - ( " + data_element.size + " )");
		  nodes.add(data_element);
	  }
	  if(origin != "front"){
		  return data_element.id;
	  }
  }
  
  function addIsA(){
        updateIdCount();

	  var data_element = {id: idCount, label: 'IsA', shape: 'triangleDown',is_super_entity:false, super_entity:false,
          color: {
                 border: '#FF952A',
                 background:'#FF952A',
                 highlight: {
                        border: '#000000',
                        background: '#D37211'
                      }}
          , scale:20, physics:false};

	  if(poscSelection != null){
		  data_element.x = poscSelection.x;
		  data_element.y = poscSelection.y;
	  }
	  nodes.add(data_element);
	  idCount = idCount + 1;
	  updateTableElements();
  }
  
  function addAttribute(name, action, idSelected, idEntity, pk, comp, notNll, uniq, multi, dom, sz){
	  var word_pk = name;
	  if(pk){
		  word_pk = name;
	  }else{
		  word_pk = name;
		  if(!notNll){
			  word_pk +="*";
		  }
	  }
	  var valueEntityWeak = nodes.get(parseInt(idEntity)).isWeak;
      updateIdCount();

	  console.log("[Attribute] - idCount: " + idCount + ", label: " + name + ", idSuperEntityCount: " + idSuperEntityCount);
	  var data_element = {id: idCount, width: 3,widthConstraint:{ minimum: 50, maximum: 160},labelBackend:name, label: word_pk, dataAttribute:{entityWeak: valueEntityWeak, primaryKey: pk, composite: comp, notNull: notNll, unique: uniq, multivalued: multi, domain: dom, size: sz}, shape: 'ellipse', is_super_entity:false, super_entity:false,
		  //color :"#22bdb1",/*'#4de4fc' cambiado*/
		  		  color: {
					 border: '#078980',
					 background:'#22bdb1',
					 highlight: {
					        border: '#000000',
					        background: '#1A958A'
					      }},
					      scale:20, heightConstraint:23,physics:false};
			 /*'#4de4fc' cambiado, scale:20, heightConstraint:23,physics:false};*/
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  data_element.dataAttribute.entityWeak = nodes.get(parseInt(idSelected)).dataAttribute.entityWeak;
		  data_element.super_entity=nodes.get(data_element.id).super_entity;
		  nodes.update(data_element);
	  }else{
		  if(poscSelection != null){
			  data_element.x = poscSelection.x-180;
			  data_element.y = poscSelection.y+30;
		  }

          //Añadimos atributo a agregación
		  if(inSuperEntity(parseInt(idEntity))){
              data_element.super_entity = true;
              //Añadimos el nodo
              nodes.add(data_element);
              nodes_super.add(data_element);

              // Añadimos los edges
              edges.add({from: parseInt(idEntity), to: parseInt(idCount), color:{color:'#22bdb1'},width: 2});//cambiado
              updateSuperEntityEdges();
              setSuperEntityCoordinates(true, getSuperEntityNode());
		  }
		  // Añadimos atributo fuera de la agregación
		  else{
		      //console.log("Añadimos atributo fuera de la agregación: ");
              nodes.add(data_element);
              edges.add({from: parseInt(idEntity), to: parseInt(idCount), color:{color:'#22bdb1'},width: 2});//cambiado
		  }

	  }
	  idCount++;
      /*var aux = getSuperEntityNode();
      if(aux !=null)console.log("AGR:  x --> "+ aux.x +" y --> " +aux.y + " width --> " + aux.widthConstraint.minimum + " height --> " + aux.heightConstraint.minimum);*/
	  //console.log("[Attribute] - idCount: " + idCount + ", label: " + name + ", idSuperEntityCount: " + idSuperEntityCount);
      //console.log("[Attribute (x, y) - (w, h) ]: ( "+ data_element.x +", " +data_element.y + " ) - ( " + data_element.widthConstraint.minimum + ", " + data_element.heightConstraint + " )");
	  //console.log("[Attribute (x, y) - (w, h) ]: ( "+ data_element.x +", " +data_element.y + " ) - ( " + data_element.widthConstraint + ", " + data_element.heightConstraint + ", size: " + data_element.size" )");
	  updateTableElements();
  }
  
  function addEntitytoRelation(idTo, element_role, cardinality, roleName, minCardinality, maxCardinality, action, idSelected, partActive){
	 //console.log(idTo+" - "+element_role+" - "+cardinality+" - "+roleName+" - "+minCardinality+" - "+maxCardinality+" - "+action+" - "+idSelected+" - "+ partActive);
	 console.log("< -- addEntitytoRelation -- >");
	  var left;
	  var center;
	  var right;
	  var exist = false;
	  var direct1 = false;
	  switch(cardinality){
	  	case 'max1':
	  		direct1 = true;
	  		left = '1';
	  		right = '0';
	  	break;
	  	case 'maxN':
		  	left = 'N';
	  		right = '0';
	  	break;
	  	case '1toN':
	  		direct1 = true;
		  	left = 'N';
	  		right = '1';
	  	break;
	  	case '1to1':
		  	left = '1';
	  		right = '1';
	  	break;
	  	case 'minMax':
		  	left = maxCardinality;
	  		right = minCardinality;
	  	break;
	  	default:
	  }
	  
	  if(roleName == "")
		  center = "";
	  else
		  center = roleName;
	  
	  if(partActive){
		  labelText = "( "+minCardinality+" , "+maxCardinality+" ) "+ center;
	  }else{
		  labelText = center;
	  } 	

	  var idEdge = existEdge(idSelected, idTo);

	  var data_element = {width: 3,from: parseInt(idSelected), to: parseInt(idTo), label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, state: "false", smooth:false,arrows:{to: { enabled: direct1 }}, zIndex:1};
	  var data_element1 = {width: 3,from: parseInt(idSelected), to: parseInt(idTo), label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, state: "false", smooth:false ,arrows:{to: { enabled: direct1 }}, zIndex:1};
	  var data_element_update = {};

	  if(action == "edit"){
		  //console.log("edit relation edge");
		  var data_element3 = {width: 3,label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, smooth:false, arrows:{to: { enabled: direct1 }}, zIndex:1};
		  data_element3.id = element_role;
		  edges.update(data_element3);
		  if(inSuperEntity(idTo)){
		    edges_super.update(data_element3);
		  }

	  }else{
		  if(idEdge != null){
		      //console.log("new relation edge exists");
			  data_element_update.id = idEdge;
			  data_element_update.state = "left";
			  data_element1.state = "right";
			  edges.update(data_element_update);
			  edges.add(data_element1);
			  if(inSuperEntity(idTo)){
                edges_super.update(data_element_update);
                edges_super.add(data_element1);
              }

		  }else{
		      //console.log("new relation edge");
			  edges.add(data_element);
			  if(inSuperEntity(idTo)){
                edges_super.add(data_element);
              }
		  }  
	  }
  }
  
  /**
   * Añadir una entidad padre a un elemento IsA
   * @param idTo Entidad Padre
   * @param action añadir o actualizar
   * @param idSelected Nodo IsA
   * @returns
   */
  function addEntityParent(idTo, action, idSelected){
    console.log("< -- addEntityParent -- >");
	  var idParent = nodes.get(parseInt(idSelected)).parent;
	  var data_element = {width: 3,from: parseInt(idSelected), to: parseInt(idTo),type:"parent", arrows: 
	  						{from: { enabled: true }, middle: { enabled: false },to: { enabled: false }
	  						}
	  					};
	  
	  if(idParent != null){
		  var idEdge = existEdge(parseInt(idSelected), idParent);
		  data_element.id = idEdge;
		  edges.update(data_element);
	  }else{
		  edges.add(data_element);
	  }
	  
	  nodes.update({id: parseInt(idSelected), parent: parseInt(idTo)});
	  updateTableElements();
  }
  
  /**
   * Quita la entidad padre
   * @param idNodo Id padre
   * @returns
   */
  function removeParentIsA(idNodo){
	  var idParent = nodes.get(parseInt(idNodo)).parent;
	  nodes.get(parseInt(idNodo)).parent = undefined;
	  var allData = allEntitysToRelation(idNodo);
	  
	  allData.forEach(function (key){
		  if(nodes.get(idParent).label == key.label)
			  edges.remove(key.id);
	  });
	  nodes.update({id: parseInt(idNodo), parent: undefined});
	  updateTableElements();
  }
  
  function removeEntitytoRelation(idEdge, action, idSelected){
	  var idFrom = edges.get(idEdge).from;
	  var idTo = edges.get(idEdge).to;
	  edges.remove(idEdge);
	  var idExist = existEdge(idFrom, idTo);
	  if(idExist != null){
		  var data_element_update = {};
		  data_element_update.id = idExist;
		  data_element_update.state = "false";
		  edges.update(data_element_update);
	  }
	  updateTableElements();
  }
  
  /* 
   * filter = array
   * if (filter = null) return allNodes 
   * else return nodes of type filter
   * */
  function getAllNodes(filter = null){
	  var data = [];
	  if(filter != null){
		  nodes.forEach(function(nod) {
			  if(filter.indexOf(nod.shape) != -1)
				  data.push(nod);				  
		  });
	  }else{
		  nodes.forEach(function(nod) {
			  data.push(nod);
		  });
	  }
	  return data;
  }
  
  /* 
   * filter = array
   * if (filter = null) return allNodes 
   * else return nodes of type filter
   * */
  function getAllNodesSuper(filter = null){
	  var data = [];
	  if(filter != null){
		  nodes.forEach(function(nod) {
			  if(filter.indexOf(nod.shape) != -1)
				  data.push(nod);				  
		  });
	  }else{
		  nodes_super.forEach(function(nod) {
			  data.push(nod);
		  });
	  }
	  return data;
  }
  
  /*
   * Check if exist a edge between "idFrom" to "idTo" nodes
   * return "null" if it doesn't exist
   * return idEdge if it  exist
   * */
  function existEdge(idFrom, idTo){
	  var idEdgeExist = null;
	  var edgesFrom = network.getConnectedEdges(parseInt(idFrom));
	  var edgesTo = network.getConnectedEdges(parseInt(idTo));
	  var dataPush = [];
	  edgesTo.forEach(function(idEdge) {
		  if(edgesFrom.indexOf(idEdge) != -1)
			  idEdgeExist = idEdge;
	  });
	  return idEdgeExist;
  }

  function existEdgeSuper(idFrom, idTo){
	  var idEdgeExist = null;
	  var edgesFrom = network_super.getConnectedEdges(parseInt(idFrom));
	  var edgesTo = network_super.getConnectedEdges(parseInt(idTo));
	  var dataPush = [];
	  edgesTo.forEach(function(idEdge) {
		  if(edgesFrom.indexOf(idEdge) != -1)
			  idEdgeExist = idEdge;
	  });
	  
	  return idEdgeExist;
  }

  function inSuperEntity(idNode){
    var superNod = nodes.get(parseInt(idNode))
    return (superNod.super_entity);
  }
  
  function existElementName(oneNodeName, typeElement){
	  var exist = false;
	  var i = 0;
	  var allNodes;
	  if(typeElement=="addAttribute"){
		  id_atribute = jQuery('#element').val();
		  id_atribute = parseInt(id_atribute);
		  allNodes = network.getConnectedNodes(id_atribute); 
		  if(oneNodeName == ""){
			  exist = true;
		  }else{
			  
			  while(i<allNodes.length && !exist){
				  if(nodes.get(allNodes[i]).shape != "box"){
					  if(nodes.get(allNodes[i]).label == oneNodeName){
						  exist = true;
					  }
				  }
				  i++
			  }  
		  }
	  }else{
		  allNodes = nodes.getIds({
		  filter: function (item) {
			  return (item.shape == "box" || item.shape == "diamond" || item.shape == "triangleDown");
		  	}
		  });
		  
		  if(oneNodeName == ""){
			  exist = true;
		  }else{
			  
			  while(i<allNodes.length && !exist){
				  if(nodes.get(allNodes[i]).label == oneNodeName){
					  exist = true;
				  }
				  i++
			  }  
		  }
	  }
	  return exist;
  }
  
  function fillEditConstraints(idNodo){
	  idNodo = parseInt(idNodo);
	  valuesConstraints = nodes.get(idNodo).constraints;
	  for(var i=0;i<valuesConstraints.length;i++){
		  if(i!=0){
			  	var nextValue = parseInt($("#totalInputs").val())+1;
		  		var dataType = {
						temp_unique: nextValue,
						temp_value: valuesConstraints[i]
					};
		  		$("#totalInputs").val(nextValue);
				$("#inputList").append($('#templateSelectAddConstrainst').tmpl(dataType));
				$('#insertModal').prop('disabled', false);
		  }else{
			  $("#list0").val(valuesConstraints[i]);
		  }
	  }
  }
  
  function fillEditTableUnique(idNodo){
	  idNodo = parseInt(idNodo);
	  valuesUnique = JSON.parse(nodes.get(idNodo).tableUnique);
	  var nodo = allAttributeOfEntity(parseInt($("#idSelected").val()));
	  for(var i=0;i<valuesUnique.length;i++){
		  if(i!=0){
				var nextValue = parseInt($("#totalInputs").val())+1;
		  		var dataType = {
						temp_nodes: nodo,
						temp_unique: nextValue,
						temp_value: ""
					};
		  		$("#totalInputs").val(nextValue);
				$("#inputList").append($('#templateSelectTableUnique').tmpl(dataType));	
		  }
		  for(var e=0;e<valuesUnique[i].length;e++){
				$("#listTextUnique"+i+" option[value='" + valuesUnique[i][e] + "']").prop("selected", true);
		  }
	  }
	  $('.select-multiple').select2();
	  $('#insertModal').prop('disabled', false);
  }
  
  function fillEditRelation(idNodo){
	  idNodo = parseInt(idNodo);  
	  jQuery("#recipient-name").val(nodes.get(idNodo).label);
	  $('#titleModal').html($('#textEditRelation').text());
	  $('#insertModal').prop('disabled', false);
  }
  
  function fillEditEntity(idNodo){
	  idNodo = parseInt(idNodo);
	  jQuery("#recipient-name").val(nodes.get(idNodo).label);
	  $('#titleModal').html($('#textEditEntity').text());
	  $("#weak-entity").prop("checked",nodes.get(idNodo).isWeak);
	  $('#insertModal').prop('disabled', false);
	  $('#weak-entity').change(function(){
		  $('#insertModal').prop('disabled', false);
	  });
  }

  function fillEditSuperEntity(idNodo){
  	  idNodo = parseInt(idNodo);
  	  jQuery("#recipient-name").val(nodes.get(idNodo).label);
  	  $('#titleModal').html($('#textEditSuperEntity').text());
  	  $("#weak-entity").prop("checked",nodes.get(idNodo).isWeak);
  	  $('#insertModal').prop('disabled', false);
  	  $('#weak-entity').change(function(){
  		  $('#insertModal').prop('disabled', false);
  	  });
    }
  
  function existParent(idNodo){
	  var exist = false;
	  var dataFull = network.getConnectedEdges(parseInt(idNodo));
	  
	  dataFull.forEach(function(key){
		  if(edges.get(key).type == "parent")
			  exist = true;
	  });
	  
	  return exist;
  }
  
  /**
   * Obtiene el nodo padre del elemento IsA
   * @param idNodo ELemente IsA
   * @returns
   */
  function getParentId(idNodo){
	  var idParent = -1;
	  var dataFull = network.getConnectedEdges(parseInt(idNodo));
	  
	  dataFull.forEach(function(key){
		  if(edges.get(key).type == "parent")
			  idParent = edges.get(key).to;
	  });
	  return idParent;
  }
  
  function getChildData(idNodo){
	  var dataFull = network.getConnectedEdges(parseInt(idNodo));
	  var data = [];
	  dataFull.forEach(function(key){
		  if(edges.get(key).type == "child")
			  data.push({id:key, labelChild: nodes.get(edges.get(key).to).label, idChild: nodes.get(edges.get(key).to).id});
	  });
	  
	  return data;
  }
  
  function addEntityChild(idTo, action, idSelected){
	  var data_element = {from: parseInt(idSelected),type:"child", to: parseInt(idTo),arrows: 
	  						{from: { enabled: false },middle: { enabled: false },to: { enabled: true }
	  						}
	  					};
	  if(existEdge(idSelected, idTo) == null){
		  edges.add(data_element);
	  }
	  updateTableElements();
  }
  
  function addSubAttribute(name, action, idSelected, idAttribute = idEntity, comp, notNll, uniq, multi, dom, sz){
	  var word_pk = name;
	  var word_multi = 1;
	  
	  if(!notNll){
		  word_pk +="*";
	  } 
	  if(multi){
		  word_multi = 3;
	  } 
      updateIdCount();
	  var data_element = {id:idCount, labelBackend:name, type: 'subAttribute', borderWidth:word_multi,label: word_pk, dataAttribute:{composite: comp, notNull: notNll, unique: uniq, multivalued: multi, domain: dom, size: sz}, shape: 'ellipse', is_super_entity:false, super_entity:false, color:'#4de4fc', scale:20, widthConstraint:80, heightConstraint:25,physics:false};
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  data_element.super_entity=nodes.get(data_element.id).super_entity;
		  nodes.update(data_element);
	  }else{
           if(poscSelection != null){
      			  data_element.x = poscSelection.x-180;
      			  data_element.y = poscSelection.y+30;
      	   }

            //Añadimos atributo a agregación
           if(inSuperEntity(parseInt(idAttribute))){
                data_element.super_entity = true;
                //Añadimos el nodo
                nodes.add(data_element);
                nodes_super.add(data_element);
                // Añadimos los edges
                edges.add({from: parseInt(idAttribute), to: parseInt(idCount), color:{color:'#22bdb1'},width: 2});//cambiado
                updateSuperEntityEdges();
                setSuperEntityCoordinates(true, getSuperEntityNode());
           }
           // Añadimos atributo fuera de la agregación
           else{
              //console.log("Añadimos atributo fuera de la agregación: ");

                nodes.add(data_element);
                edges.add({from: parseInt(idAttribute), to: parseInt(idCount), color:{color:'#22bdb1'},width: 2});//cambiado
           }

		/*  nodes.add(data_element);
		  edges.add({from: parseInt(idAttribute), to: parseInt(idCount), color:{color:'blue'}});
*/
	  }

      	  idCount++;
}
  
  function fillEditAtributte(idNodo){
	  idNodo = parseInt(idNodo);
	  var nameAttribute = nodes.get(idNodo).label;
	  var pk = nameAttribute.split("\n");
	  nameAttribute = pk[0].replace("*","");
	  jQuery("#recipient-name").val(nameAttribute);
	  jQuery("#domain").val(nodes.get(idNodo).dataAttribute.domain);
	  jQuery("#size").val(nodes.get(idNodo).dataAttribute.size);
	  $('#titleModal').html($('#textEditAttribute').text());
	  $("#composite").prop("checked",nodes.get(idNodo).dataAttribute.composite);
	  $("#multivalued").prop("checked",nodes.get(idNodo).dataAttribute.multivalued);
	  $("#notNull").prop("checked",nodes.get(idNodo).dataAttribute.notNull);
	  $("#primaryKey").prop("checked",nodes.get(idNodo).dataAttribute.primaryKey);
	  $("#unique").prop("checked",nodes.get(idNodo).dataAttribute.unique);
	  $('#insertModal').prop('disabled', false);
	  $("label[for='element']" ).hide();
	  $("#element" ).hide();
  }
  
  // Metodo que obtiene el nodo seleccionado con boton derecho y lo almacena en nodoSelect
  network.on('oncontext', function(params) {
	  poscSelect = params.pointer.DOM;
	  poscSelection = params.pointer.canvas;
	  if(typeof network.getNodeAt(poscSelect) !== 'undefined'){
		  nodoSelected = network.getNodeAt(poscSelect);
	  }else{
		  nodoSelected = null;
	  }
	  
	  params.event.preventDefault();
	});

  var drag = false;
  var rect = {}
  var canvas = network.canvas.frame.canvas;
  var ctx = canvas.getContext('2d');
  var drawingSurfaceImageData;
  
  function saveDrawingSurface() {
	   drawingSurfaceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  function getStartToEnd(start, theLen) {
	    return theLen > 0 ? {start: start, end: start + theLen} : {start: start + theLen, end: start};
  }
  
  function restoreDrawingSurface() {
	    ctx.putImageData(drawingSurfaceImageData, 0, 0);
  }
  
  //crear boton para poder que dragView: poner a true o false
  
  function selectNodesFromHighlight() {
	    var fromX, toX, fromY, toY;
	    var nodesIdInDrawing = [];
	    var xRange = getStartToEnd(rect.startX, rect.w);
	    var yRange = getStartToEnd(rect.startY, rect.h);

	    var allNodes = nodes.get();
	    for (var i = 0; i < allNodes.length; i++) {

	        var curNode = allNodes[i];
	        var nodePosition = network.getPositions([curNode.id]);
	        var nodeXY = network.canvasToDOM({x: nodePosition[curNode.id].x, y: nodePosition[curNode.id].y});
	        if (xRange.start <= nodeXY.x && nodeXY.x <= xRange.end && yRange.start <= nodeXY.y && nodeXY.y <= yRange.end) {
	            nodesIdInDrawing.push(curNode.id);
	        }
	    }
	    network.selectNodes(nodesIdInDrawing);
  }

  $(document).ready(function() {
	  $(".vis-centrarMover").on("click", function(e){
		  changeDrawView = !changeDrawView;
		  network.setOptions({interaction:{dragView:changeDrawView}});
		  if(changeDrawView){
			  $(".vis-centrarMover").css('background-color', 'transparent');
			  $("#diagram").unbind("mousemove");
			  $("#diagram").unbind("mousedown");
			  $("#diagram").unbind("mouseup");
		  }else{
			  $(".vis-centrarMover").css('background-color', 'rgb(255 0 0 / 27%)');
			  $("#diagram").on("mousemove", function(e) {
			      if (drag) { 
			          restoreDrawingSurface();
			          rect.w = (e.pageX - this.offsetLeft) - rect.startX;
			          rect.h = (e.pageY - this.offsetTop) - rect.startY-80;
			          ctx.setLineDash([5]);
			          var colorRed = '';
			          if(changeDrawView)
			        	  colorRed = 'transparent';
					  else
						  colorRed = 'rgb(255 0 0 / 27%)';
			          ctx.strokeStyle = colorRed;
			          ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
			          ctx.setLineDash([]);
			          ctx.fillStyle = colorRed;
			          ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
			      }
			  });
			  $("#diagram").on("mousedown", function(e) {

			      if (e.button == 0) {
			          selectedNodes = e.ctrlKey ? network.getSelectedNodes() : null;
			          saveDrawingSurface();
			          var that = this;
			          rect.startX = e.pageX - this.offsetLeft;
			          rect.startY = e.pageY - this.offsetTop-90;
			          drag = true;
			          if(changeDrawView)
			        	  container.style.cursor = "default";
			          else
			        	  container.style.cursor = "crosshair";
			          if(nodes_selected_event){
			        	  $("#diagram").unbind("mousemove");
			        	  container.style.cursor = "default";
			          }else{
			        	  $("#diagram").bind("mousemove", function(e) {
						      if (drag) { 
						          restoreDrawingSurface();
						          rect.w = (e.pageX - this.offsetLeft) - rect.startX;
						          rect.h = (e.pageY - this.offsetTop) - rect.startY-80;
						          ctx.setLineDash([5]);
						          var colorRed = '';
						          if(changeDrawView)
						        	  colorRed = 'transparent';
								  else
									  colorRed = 'rgb(255 0 0 / 27%)';
						          ctx.strokeStyle = colorRed;
						          ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
						          ctx.setLineDash([]);
						          ctx.fillStyle = colorRed;
						          ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
						      }
						  });
			          }
			      }
			  });
			  $("#diagram").on("mouseup", function(e) {
			      if (e.button == 0) {
			          restoreDrawingSurface();
			          drag = false;
			          container.style.cursor = "default";
			          selectNodesFromHighlight();
			          if(network.getSelectedNodes().length>0)
			        	  nodes_selected_event = true;
			          else
			        	  nodes_selected_event = false;
			      }
			  });
		  }
	  });
	  /*

	  */
  });
  
  function getNodeSelected(){
	  return nodoSelected;
  }
 
  function setNodeSelected(value){
	  nodoSelected = value;
  }
 
  function existDataTableUnique(idSelected){
	  idSelected = parseInt(idSelected);
	  return (nodes.get(idSelected).tableUnique === undefined)
  }
  
  function getIsSubAttribute(idSelected){
	  idSelected = parseInt(idSelected);
	  console.log("Entra "+ nodes.get(idSelected).label + " type "+ nodes.get(idSelected).type);
	  return (nodes.get(idSelected).type == "subAttribute")
  }
  
  /**
   * 
   * @param id de un nodo tipo atributo
   * @returns Devuelve true si es un atributo compuesto o no
   */
  function getComposedEllipse(nodo_select){
	  var idNodo = parseInt(nodo_select);
	  return (nodes.get(idNodo).dataAttribute.composite)
  }
  
  
  function existConstraints(idSelected){
	  idSelected = parseInt(idSelected);
	  return (nodes.get(idSelected).constraints === undefined)
  }
  
  function allEntitysToRelation2(nodo_select, onlyType=null){
	  var data = [];
	  var dataAll = [];
	  var type = "all";
	  
	  if(onlyType != null){
		  type = onlyType;
	  }

	  nodos = network.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges.get(edg).to;
		  	roleName = edges.get(edg).label;
		  	labelF = edges.get(edg).labelFrom;
		  	labelT = edges.get(edg).labelTo;
		  	if(nodes.get(idNodo).shape == type || nodes.get(idNodo).shape == "image"){
		  		if(nodes.get(idNodo).shape == "box")
		  			data.push({id:edg, label:nodes.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
		  		else
		  			data.push({id:edg, label:nodes.get(idNodo).label, role:roleName});
		  	}
		  	if(nodes.get(idNodo).shape == "box")
		  		dataAll.push({id:edg, label:nodes.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
	  		else
	  			dataAll.push({id:edg, label:nodes.get(idNodo).label, role:roleName});
		  		
	  });
	  
	  if(onlyType != null){
		  return data;
	  }else{
		  return dataAll;
	  }
	  
  }
  /**
   * Devuelve los elementos de una relacion, todas o solo las del tipo especificado
   * @param nodo_select id del elemento tipo relacion del que se quiere obtener sus elementos conectados
   * @param onlyType si es distinto de null filtra los elementos que se quiere obtener
   * @returns Devuelve un array con los datos
   */
  function allEntitysToRelation(nodo_select, onlyType=null){
	  var data = [];
	  var dataAll = [];
	  var type = "all";
	  
	  if(onlyType != null){
		  type = onlyType;
	  }

	  nodos = network.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges.get(edg).to;
		  	roleName = edges.get(edg).label;
		  	labelF = edges.get(edg).labelFrom;
		  	labelT = edges.get(edg).labelTo;
		  	if(nodes.get(idNodo).shape == type){
		  		if(nodes.get(idNodo).shape == "box")
		  			data.push({id:edg, label:nodes.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
		  		else
		  			data.push({id:edg, label:nodes.get(idNodo).label, role:roleName});
		  	}
		  	if(nodes.get(idNodo).shape == "box")
		  		dataAll.push({id:edg, label:nodes.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
	  		else
	  			dataAll.push({id:edg, label:nodes.get(idNodo).label, role:roleName});
		  		
	  });
	  
	  if(onlyType != null){
		  return data;
	  }else{
		  return dataAll;
	  }
	  
  }
  
  function allEntitysToRelationSuper(nodo_select, onlyType=null){
	  var data = [];
	  var dataAll = [];
	  var type = "all";
	  
	  if(onlyType != null){
		  type = onlyType;
	  }

	  nodos = network_super.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges_super.get(edg).to;
		  	roleName = edges_super.get(edg).label;
		  	labelF = edges_super.get(edg).labelFrom;
		  	labelT = edges_super.get(edg).labelTo;
		  	if(nodes_super.get(idNodo).shape == type){
		  		if(nodes_super.get(idNodo).shape == "box")
		  			data.push({id:edg, label:nodes_super.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
		  		else
		  			data.push({id:edg, label:nodes_super.get(idNodo).label, role:roleName});
		  	}
		  	if(nodes_super.get(idNodo).shape == "box")
		  		dataAll.push({id:edg, label:nodes_super.get(idNodo).label, role:roleName, asoc:labelF+"-"+labelT});
	  		else
	  			dataAll.push({id:edg, label:nodes_super.get(idNodo).label, role:roleName});
		  		
	  });
	  
	  if(onlyType != null){
		  return data;
	  }else{
		  return dataAll;
	  }
	  
  }

  function allAttributeOfEntity(nodo_select){
	  var data = [];
	  var nodos = network.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
          var aux = nodes.get(nodo_select);
          //console.log("nodo_Select: "+nodo_select+" aux: "+ aux.label);

		  	idNodo = edges.get(edg).to;
		  	roleName = edges.get(edg).label;
		  	if(nodes.get(idNodo).shape == "ellipse"){
		  		//console.log("entra en if");
		  		data.push({id:idNodo, label:nodes.get(idNodo).labelBackend, type:nodes.get(idNodo).dataAttribute.domain, size:nodes.get(idNodo).dataAttribute.size});
		  		//console.log("idNodo: "+data[0].label);
		  		//console.log("data: "+data);
	  }});
	  return data;
  }

    function allSubAttribute(nodo_select){
      var data = [];
      var nodos = network.getConnectedEdges(parseInt(nodo_select));
      nodos.forEach(function(edg) {
            var aux = nodes.get(nodo_select);
            //console.log("nodo_Select: "+nodo_select+" aux: "+ aux.label);

            idNodo = edges.get(edg).to;
            roleName = edges.get(edg).label;
            if(nodes.get(idNodo).type == "subAttribute"){
                //console.log("entra en if");
                data.push({id:idNodo, label:nodes.get(idNodo).labelBackend, type:"subAttribute", size:nodes.get(idNodo).dataAttribute.size});
                //console.log("idNodo: "+data[0].label);
                //console.log("data: "+data);
      }});
      return data;
    }
  
  function allAttributeOfEntitySuper(nodo_select){
	  var data = [];
	  nodos = network_super.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges_super.get(edg).to;
		  	roleName = edges_super.get(edg).label;
		  	if(nodes_super.get(idNodo).shape == "ellipse")
		  		data.push({id:idNodo, label:nodes_super.get(idNodo).labelBackend, type:nodes_super.get(idNodo).dataAttribute.domain, size:nodes_super.get(idNodo).dataAttribute.size});				  
	  });
	  return data;
  }
  
  function allEntityOfRelation(nodo_select){
	  var data = [];
	  nodos = network.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges.get(edg).to;
		  	roleName = edges.get(edg).label;
		  	if(nodes.get(idNodo).shape == "box")
		  		data.push({id:idNodo, label:nodes.get(idNodo).label});				  
	  });
	  return data;
  }
  
  /* domains**/
  
  function getAllTypesDomain(){
	  return typeDomain.getTypesDomains();
  }
  
  function addTypeDomain(nameType, type, values_separated, typeAction){
	  var id = nameType.replace(/ /g, "_");
	  typeDomain.setTypesDomains(id.toLowerCase(), nameType, type, values_separated);
  }
  
  function getTypeItem(idItem){
	  return nodes.get(parseInt(idItem)).shape;
  }
  
  function getNodesSelectedCount(){
	  return network.getSelectedNodes().length;
  }
  
  function deleteNodeSelected(id = null){

	if(id==null){
		var dat = network.getSelectedNodes();
	}else{
		var dat = [parseInt(id)];
	}
	
	var attr = allAttributeOfEntity(getNodeSelected());
	var attrsId = [];

	if(nodes.get(id).is_super_entity){
	    //console.log("deleting super entity");
	    deleteSuperEntity(id);
	}
	else{
	dat.forEach(function(id) {
		var attr = allAttributeOfEntity(id);
		//console.log("delete node selected id: " + id);
		attr.forEach(function(elem) {
            //console.log("Eliminamos id: " + elem);
//		    if(elem.is_super_entity) idSuperEntityCount--;
			attrsId.push(elem.id);
		});

		//console.log("Eliminamos id: " + id.id);
		//if(id.is_super_entity) idSuperEntityCount--;
        //else idCount--;
        attrsId.push(id);

	});
	}
	
	network.selectNodes(attrsId);
	network.deleteSelected();
	updateTableElements();
  }
  
  function printDomains(){
	  typeDomain.print("#itemsDomains");
  }

  function getSuperEntityNode() {
    var r = null;
    var allNodes = nodes.get();

    allNodes.forEach(function(nodeId){
        //console.log("nodeId: "+nodeId.id+", isSuperEntity: "+nodeId.is_super_entity);
        if(nodeId.is_super_entity) r = nodeId;

    });

    return r;
  }

  function getAllSuperEntityNodes(){
    var allNodes = nodes.get();
    var super_entity_nodes
        allNodes.forEach(function(nodeId){

        var nod = nodes.get(nodeId);
            if(nod.super_entity) return nod;
        });

    return null;
  }


  /*network.on('selectNode', function(event, nodeId) {

    var selectedNodes = network.getSelectedNodes();
    var nodesToSelect= selectedNodes;
    var superEntitySelected = false;

    selectedNodes.forEach(function(nodeId) {
        var nod = nodes.get(nodeId);
        if(nod.is_super_entity) superEntitySelected = true;
    });

    if(superEntitySelected){
        nodes.forEach(function(node) {
          if (node.super_entity === true && !selectedNodes.includes(node.id)){
              nodesToSelect.push(node.id);
              //console.log("nodes to select: " + node.label);
          }
        });
    }
    network.selectNodes(nodesToSelect);
  });*/

  function updateEdges(){
    // Get the edge data



  }

  /*network.on('dragging', function (params) {
      var auxEdges = [];
      if(params.nodes.length) {
          var draggedNodeId = params.nodes[0];
          var superEntityNode = getSuperEntityNode();

          if(superEntityNode!=null){
             var allEdges = network.getConnectedEdges(parseInt(draggedNodeId));
             allEdges.forEach(function(edg) {

                var edge = edges.get(edg);
                var edgeTo = nodes.get(edge.to);
                var edgeFrom = nodes.get(edge.from);

                if(edgeTo.id == superEntityNode.id || edgeFrom.id == superEntityNode.id){   // Uno de los nodos esta conectado a la agregacion

                    var x_super = superEntityNode.x;
                    var y_super = superEntityNode.y;

                    var x_width = superEntityNode.widthConstraint.minimum;
                    var y_height = superEntityNode.heightConstraint.minimum;

                    var dx = toNode.x - fromNode.x;
                    var dy = toNode.y - fromNode.y;
                    var angle = Math.atan2(dy, dx);

                    var borderX = toNode.x - Math.cos(angle) * toNode.size;
                    var borderY = toNode.y - Math.sin(angle) * toNode.size;

                    if(edgeFrom.id == superEntityNode.id){
                        console.log("edgeFrom - super entity");
                        edgeFrom.x = edgeFrom.x;
                        edgeFrom.y = edgeFrom.y;
                        edgeTo.x = borderX;
                        edgeTo.y = borderY;
                    }
                    else if(edgeTo.id == superEntityNode.id){
                        console.log("edgeTo - super entity");
                        edgeFrom.x = borderX;
                        edgeFrom.y = borderY;
                        edgeTo.x = edgeTo.x;
                        edgeTo.y = edgeTo.y;
                    }

                    console.log("before drawing to : "+edge.id);//nodes.get(nod).label);
                    console.log("Edges length antes: "+ edge.length);
                    var aux = edge.length - 1;
                    //edges.update({id: edges.get(edg).id, length: aux});
                    console.log("Edges length despues: "+ aux);

                }

             });
          }
      }

    });*/

 network.on('dragStart', function (params) {

    var selectedNodes = network.getSelectedNodes();
    var nodesToSelect= selectedNodes;
    var superEntitySelected = false;

    selectedNodes.forEach(function(nodeId) {
        var nod = nodes.get(nodeId);
        if(nod.is_super_entity) superEntitySelected = true;
    });

    if(superEntitySelected){
        nodes.forEach(function(node) {
          if (node.super_entity === true && !selectedNodes.includes(node.id)){
              nodesToSelect.push(node.id);
              //console.log("nodes to select: " + node.label);
          }
        });
    }
    network.selectNodes(nodesToSelect);
});

  network.on('dragEnd', function (params) {
        var i=0;
        if (params.nodes.length > 0) {
            //console.log("params.nodes.length: "+params.nodes.length);
            while(i < params.nodes.length){
                // Obtenemos el nodo movido
                var nodeId = params.nodes[i];
                var movedNode = nodes.get(nodeId);
                //console.log("Movemos nodo: "+movedNode.label);
                // Obtenemos la posición del nodo que se ha movido
                var movedNodePos = network.getPosition(movedNode.id);
                /*console.log("nodeId: " + movedNode.label+" , x: " + movedNode.x + " , y: " + movedNode.y);
                console.log("nodeId: " + movedNode.label+" , x: " + movedNodePos.x + " , y: " + movedNodePos.y);*/
                // Actualizamos el nodo con la nueva posición
                nodes.update({id: movedNode.id, x: movedNodePos.x, y: movedNodePos.y});
                if(movedNode.super_entity){
                    nodes_super.update({id: movedNode.id, x: movedNodePos.x, y: movedNodePos.y});
                }
                i++;
            }

            var superNode = getSuperEntityNode();
            if(!movedNode.is_super_entity && superNode!=null) {
                setSuperEntityCoordinates(true, superNode);
            }

        }

    });


$(document).ready(function() {
    $(".changeOptions").on("click", function(event) {

        var theme = $(this).attr('href').split('=')[1];

        //Actualizamos el color de fuente de la agregación
        var superNode = getSuperEntityNode();
        if(superNode!= null){
            superNode.font.color = (theme === 'light') ? '#000000' : '#ffffff';
            nodes.update(superNode);
        }
    });
});


// Añadir el listener para la red de Vis.js
network.on('click', function(params) {

    var selectedNodes = network.getSelectedNodes();
    var superNode = getSuperEntityNode();
    var param = null;

    if(superNode != null){
        selectedNodes.forEach(function(nodeId) {
            if(nodeId === superNode.id){
                param = superNode.id;
            }
        });
    }

    if(param !=null){
        document.addEventListener('keydown',function(event) {
            eliminarNodoSeleccionado(event, param);  // Llama a la función con parámetros adicionales
        });
    }

});

// Definir la función de eliminación
function eliminarNodoSeleccionado(event, param) {
    if (event.key === 'Delete' || event.key === 'Del') {

        if(param !==null) deleteSuperEntity(param);
        // Remover el listener de teclado cuando se termine de usar
    }
    document.removeEventListener('keydown', eliminarNodoSeleccionado);

}
