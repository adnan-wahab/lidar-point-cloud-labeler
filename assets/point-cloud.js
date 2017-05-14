console.warn = function () {}
let annotations = {}





window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
viewer.setEDLEnabled(true);
viewer.setPointSize(1);
viewer.setMaterial("RGB");
viewer.setFOV(60);
viewer.setPointSizing("Adaptive");
viewer.setQuality("Squares");
viewer.setPointBudget(2*1000*1000);
viewer.setIntensityRange(0, 300);
viewer.setWeightClassification(1);
viewer.loadSettingsFromURL();

let scene = new Potree.Scene();

viewer.setScene(scene);
let url = "http://5.9.65.151/mschuetz/potree/resources/pointclouds/surface_and_edge/land_building/cloud.js"

//url = 'data/cloud.js'

Potree.loadPointCloud(url, "Building", function(e){
	scene.addPointCloud(e.pointcloud);

	scene.view.position.set(
    3.692547463915028, 28.85576639799165, -0.8670531920993878
  );


  l = new THREE.Vector3().fromArray([3, 0, 0])
	scene.view.lookAt(l);

});



function renderLabels(scene, d) {
  annotations = d
	var geometry = new THREE.BoxGeometry( 40, 40, 40 );

  var wireMat = new THREE.MeshLambertMaterial({color: 0x00ffff, wireframe: true });

  var insideMat = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
  
  let objects = [];
  

	annotations.labels.forEach((label, index) => {
    let object = new THREE.Object3D()
    let pos = annotations.positions[index]

		var wires = new THREE.Mesh( geometry,  wireMat);
    var inside = new THREE.Mesh( geometry,  insideMat);

    object.add(wires)
    object.add(inside)

		object.position.x = pos[0];
  	object.position.y = pos[1];
		object.position.z = pos[2];


    let scale = .04
		object.scale.x = scale
		object.scale.y = scale
		object.scale.z = scale * 2

    scene.scenePointCloud.add( object );

		objects.push( inside );

    pos[2] += 2

    let save = setPos(pos)
  
    let ano = scene.addAnnotation(pos, { "title": label,
                                  actions: [{
                                    // "icon": Potree.resourcePath + "/icons/goto.svg",
	                                  "onclick": function (e) {
                                      let label = prompt('what is this??')

                                      annotations.labels[index] = label

                                      ano.domElement
                                        .firstElementChild
                                        .firstElementChild
                                        .textContent = label

                                      setState(annotations)
                                    }
                                  }]
                                });
    window.ano = ano
	})

  let camera = scene.camera;
  let renderer = viewer.renderer;

  
  var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', function (mesh) {
    console.log('woo')
    viewer.controls.rotationSpeed = .1
  });
  dragControls.addEventListener( 'dragend', () => {
    viewer.controls.rotationSpeed = 5
  });

  return objects;
}

function setPos(pos){

	let tween = new TWEEN.Tween( scene.view.position ).to( {
		x: pos[0],
		y: pos[1],
		z: pos[2]}, 2000 )
		.easing( TWEEN.Easing.Quadratic.Out)

  return () => {
    console.log('wow')
    return tween.start()
  }
}

window.addEventListener('keydown', (e)=> {
  //console.log(e.which)
  if (e.which == 37) scene.view.position.x -= 1
  if (e.which == 39) scene.view.position.x += 1

  if (e.which == 40) scene.view.position.y += 1
  if (e.which == 38) scene.view.position.y -= 1

  
  let starts = [
    [13.701642379649593, 14.930553514687404, 0], //center
    [13.701642379649593, 14.930553514687404, 10], //center birdseye

    [4.106900141054328, -28.353222668610712, 0.5064736343779916],
    [3.8567377201649746, -34.401580129659166, 0.046546307218494],
  ]

  if (e.which == 13)  {
    scene.view.position.fromArray(starts[0])
  }

  if (e.which == 32) {
    scene.view.position.fromArray(starts[1])
  }


  if (e.which == 49) scene.view.position.fromArray(starts[2])
  if (e.which == 50) scene.view.position.fromArray(starts[3])
  if (e.which == 51) scene.view.position.fromArray(starts[4])
  //console.log(scene.view.position)

});


let drive = () => {
  let dest = new THREE.Vector3().fromArray([13.701642379649593, 14.930553514687404, 0])
  setInterval(function () {
    scene.view.position.lerp(dest, .01)
  }, 16)

  let url = 'https://media.giphy.com/media/9p87NPGhZXAaI/giphy.gif'

  if (! hasLabels)
    setTimeout(function () {
      document.body.innerHTML = `<img src="${url}" class="boom">`
    }, 5000)
  else {
    dest = new THREE.Vector3().fromArray([3.85673, -34.4015, 0.04654])
  }
}
let hasLabels = false

let getState = () => {
  hasLabels = true
  $.get('/data/label.json', (json) => {
    console.log('hi' + 44)
    json = JSON.parse(json)

    renderLabels(scene, json)
  })
}

let setState = (annotations) => {
  $.ajax({
    url:"/data/label.json",
    type:"POST",
    data:JSON.stringify(annotations),
    contentType:"application/json; charset=utf-8",
    dataType:"json",
    success: function(){
      console.log('yay')
    }
  })
}

$(".drive").on('click', drive)
$(".get-state").on('click', getState)
$(".save-state").on('click', setState)

$(".make-cube").on('click', () => {
  var geometry = new THREE.BoxGeometry( 40, 40, 40 );
  var wireMat = new THREE.MeshLambertMaterial({color: 0x00ffff, wireframe: true });
  var insideMat = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
  

  
  let object = new THREE.Object3D()
  annotations.labels.push('___')
  let pos = annotations.positions[annotations.positions.length] =
      [13.701642379649593, 14.930553514687404, 0]//center;

		var wires = new THREE.Mesh( geometry,  wireMat);
    var inside = new THREE.Mesh( geometry,  insideMat);

    object.add(wires)
    object.add(inside)

		object.position.x = pos[0]
  	object.position.y = pos[1]
		object.position.z = pos[2]


    let scale = .04
		object.scale.x = scale
		object.scale.y = scale
		object.scale.z = scale * 2

    scene.scenePointCloud.add( object );
	//objects.push( object );

  setState(annotations);
})
