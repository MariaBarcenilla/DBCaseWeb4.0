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
				        background: '#FFFF00'
				      },
				 hover: {
					 border: '#ffcc45',
					 background: '#ffcc45'
						 }
			 }
		  },
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
  function getIdElement(){
	  var dataIds = nodes.getIds();
	  if(dataIds.length==0)
		  var nextId = -1;
	  else
		  var nextId = dataIds[dataIds.length-1];
	  return ++nextId;
  }
  
  function deleteSuperEntity(idNodo){
	  var idNode = parseInt(idNodo);
	  nodes_super.forEach(function(nod) {
		  nod.super_entity = false;
		  nodes.add(nod);
	  });
	  deleteSuperEntityAndEelements(idNodo);
	  updateTableElements();
  }
  
  function deleteSuperEntityAndEelements(idNodo){
	  var idNode = parseInt(idNodo);
	  nodes.remove(idNode);
	  nodes_super.clear();
	  edges_super.clear();
  }
  
  function simuleClickSuper(){
		var event = new PointerEvent('pointerdown');
		return new Promise(resolve => document.getElementsByClassName("vis-zoomExtendsScreen")[0].dispatchEvent(event));
  }
  
  function createSuperEntity(labelName){
	  var size_width = 110;
	  var c = document.getElementsByTagName("canvas")[0];
	  var sizeWidth = c.style.width.slice(0, -2);
	  if(parseInt(sizeWidth)<120)
		  size_width = sizeWidth;
	  
	  if(nodes_super.get().length<5)
		  size_width = 45;
	  var ctx = c.getContext("2d");
	  var img_super = ctx.canvas.toDataURL('image/png', 1.0);//  2aba06 cambiado
	  nodes.add({id: 9999999, label: labelName, shape: 'image', image: img_super, size: size_width, borderWidth: 3,color: {
			 border: '#000000', 
			 background:'#fafafa',
			 highlight: {
			        border: '#000000',
			        background: '#FFFF00'
			      },
			 hover: {
				 border: '#000000',
				 background: '#FFFF00'
					 }
	  }, shapeProperties: { useBorderWithImage:true} });  
  }
  
  async function simuleClickAsync() {
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 200)
	  });
	  let result = await promise; // wait until the promise resolves (*)
	  await simuleClickSuper(); // "done!"
	}
  
  async function simuleClickAsync1() {
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 2000)
	  });
	  let result = await promise; // wait until the promise resolves (*)
	  await simuleClickSuper(); // "done!"
	}
  
  function simuleClickSuperNew(){
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
  
  async function simuleClickAsyncNew() {
	  let promise = new Promise((resolve, reject) => {
	    setTimeout(() => resolve("done!"), 1000)
	  });
	  let result = await promise;
	  await simuleClickSuperNew();
	  console.log("prueba12");
  }
  
  async function simuleClickAsync12(labelName) {
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
  
  function addElementsWithRelationsToSuperEntity(idElement, labelName){
	  nodes.update({id: idElement, super_entity: true});
	  getNodesElementsWithSuperEntity(network.getConnectedNodes(idElement));
	  var nodes_super_select = [];
	  nodes.forEach(function(nod) {
		  if(nod.super_entity){
			  nod.x = network.getPosition(nod.id).x;
			  nod.y = network.getPosition(nod.id).y;
			  nodes_super.add(nod);
			  nodes_super_select.push(nod.id);
		  }
	  });
	  edges.forEach(function(edg) {
		  edges_super.add(edg);
	  });
	  simuleClickAsync();
	  simuleClickAsyncNew();
	  simuleClickAsync1();
	  simuleClickAsync12(labelName);
	  nodes_super_select.forEach(function(id_nd) {
		  nodes.remove(id_nd);
	  });
	  
	  updateTableElementsPromise();
  }
  
  function getNodesElementsWithSuperEntity(nodesIds){
	  nodesIds.forEach(function(nod) {
		  if(!nodes.get(nod).super_entity){
			  nodes.update({id: nod, super_entity: true});
			  if(network.getConnectedNodes(nod).length!=1){
				  getNodesElementsWithSuperEntity(network.getConnectedNodes(nod));
			  }
		  }
	  });
  }
  
  function addEntity(nombre, weakEntity,action, idSelected, elementWithRelation, relationEntity){
	  var id_node = getIdElement();
	  var data_element = {widthConstraint:{ minimum: 100, maximum: 200}, super_entity:false, label: nombre, isWeak: weakEntity, shape: 'box', scale:10, heightConstraint:25,physics:false};//cambiado
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  nodes.update(data_element);
	  }else{
		  if(poscSelection != null){
			  data_element.x = poscSelection.x;
			  data_element.y = poscSelection.y;
		  }
		  data_element.id = id_node++;
		  nodes.add(data_element);
	  }
	  
	  if(weakEntity && elementWithRelation != null){
		  idRelation = addRelation(relationEntity, "create", null, "back");
		  addEntitytoRelation(data_element.id, "", "1to1", "", "1", "1", "create", idRelation, true, true);
		  addEntitytoRelation(parseInt(elementWithRelation), "", "1toN", "", "1", "N", "create", idRelation, false);
	  }
	  updateTableElements();
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
	  var id_node = getIdElement();
	  var  tam = 30;
	  if (nombre.length>5){
		  tam = 30+(nombre.length-5);
	  }
	  var data_element = {size:tam,label: nombre, shape: 'diamond', super_entity:false,color:'#FF3F20', scale:20, physics:false};
		/*  color: {
				 border: '#575656', 
				 background:'#FF3F20',
				 highlight: {
				        border: '#000000',
				        background: '#FF2121'
				      }}
		  , scale:20, physics:false};//D5FF04  cambiado(ff554b)*/
	  
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
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
		  data_element.id = id_node++;
		  nodes.add(data_element);
	  }
	  if(origin != "front"){
		  return data_element.id;
	  }
  }
  
  function addIsA(){
	  var id_node = getIdElement();//FF952A   (ff554b) viejo cambiado
	  var data_element = {id: id_node++, label: 'IsA', shape: 'triangleDown', super_entity:false, color:'#FF952A', scale:20, physics:false}
	  if(poscSelection != null){
		  data_element.x = poscSelection.x;
		  data_element.y = poscSelection.y;
	  }
	  nodes.add(data_element);
	  updateTableElements();
  }
  
  function addAttribute(name, action, idSelected, idEntity, pk, comp, notNll, uniq, multi, dom, sz){
	  var id_node = getIdElement();
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
	  
	  var data_element = {width: 3,widthConstraint:{ minimum: 50, maximum: 160},labelBackend:name, super_entity:false, label: word_pk, dataAttribute:{entityWeak: valueEntityWeak, primaryKey: pk, composite: comp, notNull: notNll, unique: uniq, multivalued: multi, domain: dom, size: sz}, shape: 'ellipse',
		  color :"#22bdb1"/*'#4de4fc' cambiado*/, scale:20, heightConstraint:23,physics:false};
		  /*		  color: {
					 border: '#000000', 
					 background:'#22bdb1',
					 highlight: {
					        border: '#000000',
					        background: '#4de4fc'
					      }}
			 /*'#4de4fc' cambiado, scale:20, heightConstraint:23,physics:false};*/
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  data_element.dataAttribute.entityWeak = nodes.get(parseInt(idSelected)).dataAttribute.entityWeak;
		  nodes.update(data_element);
	  }else{
		  if(poscSelection != null){
			  data_element.x = poscSelection.x-180;
			  data_element.y = poscSelection.y+30;
		  }
		  data_element.id = id_node++;
		  nodes.add(data_element);
		  edges.add({from: parseInt(idEntity), to: parseInt(id_node)-1, color:{color:'#22bdb1'},width: 2});//cambiado
	  }
	  updateTableElements();
  }
  
  function addEntitytoRelation(idTo, element_role, cardinality, roleName, minCardinality, maxCardinality, action, idSelected, partActive){
	 // console.log(idTo+" - "+element_role+" - "+cardinality+" - "+roleName+" - "+minCardinality+" - "+maxCardinality+" - "+action+" - "+idSelected+" - "+ partActive);
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

	  var data_element = {width: 3,from: parseInt(idSelected), to: parseInt(idTo), label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, state: "false", smooth:false,arrows:{to: { enabled: direct1 }}};
	  var data_element1 = {width: 3,from: parseInt(idSelected), to: parseInt(idTo), label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, state: "false", smooth:false ,arrows:{to: { enabled: direct1 }}};
	  var data_element_update = {};

	  if(action == "edit"){
		  var data_element3 = {width: 3,label: labelText, labelFrom:right, labelTo:left, name:center, participation:partActive ,participationFrom: minCardinality, participationTo: maxCardinality, smooth:false, arrows:{to: { enabled: direct1 }}};
		  data_element3.id = element_role;
		  edges.update(data_element3);

	  }else{
		  if(idEdge != null){
			  data_element_update.id = idEdge;
			  data_element_update.state = "left";
			  data_element1.state = "right";
			  edges.update(data_element_update);
			  edges.add(data_element1);

		  }else{
			  edges.add(data_element);
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
		  nodes_super.forEach(function(nod) {
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
  	  var id_node = getIdElement();
	  var word_pk = name;
	  var word_multi = 1;
	  
	  if(!notNll){
		  word_pk +="*";
	  } 
	  if(multi){
		  word_multi = 3;
	  } 
	  
	  var data_element = {labelBackend:name, type:"subAttribute", borderWidth:word_multi,label: word_pk, dataAttribute:{composite: comp, notNull: notNll, unique: uniq, multivalued: multi, domain: dom, size: sz}, shape: 'ellipse', color:'#4de4fc', scale:20, widthConstraint:80, heightConstraint:25,physics:false};
	  if(action == "edit"){
		  data_element.id = parseInt(idSelected);
		  nodes.update(data_element);
	  }else{
		  if(poscSelection != null){
			  data_element.x = poscSelection.x;
			  data_element.y = poscSelection.y;
		  }
		  data_element.id = id_node++;
		  nodes.add(data_element);
		  edges.add({from: parseInt(idAttribute), to: parseInt(id_node)-1, color:{color:'blue'}});
	  }
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
	  nodos = network.getConnectedEdges(parseInt(nodo_select));
	  nodos.forEach(function(edg) {
		  	idNodo = edges.get(edg).to;
		  	roleName = edges.get(edg).label;
		  	if(nodes.get(idNodo).shape == "ellipse")
		  		data.push({id:idNodo, label:nodes.get(idNodo).labelBackend, type:nodes.get(idNodo).dataAttribute.domain, size:nodes.get(idNodo).dataAttribute.size});				  
	  });
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
	dat.forEach(function(id) {
		var attr = allAttributeOfEntity(id);
		attr.forEach(function(elem) {
			attrsId.push(elem.id);
		});
		attrsId.push(id);
	});
	
	network.selectNodes(attrsId);
	network.deleteSelected();
	updateTableElements();
  }
  
  function printDomains(){
	  typeDomain.print("#itemsDomains");
  }
  