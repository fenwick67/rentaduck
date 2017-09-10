/* 
 * sydneyzh 2016
 */

var UP = new THREE.Vector3(0,1,0);

var waterInfoWidth = waterWidth = 125;
var waterInfoHeight = waterInfoWidth;

var causticsInfoWidth = 4 * waterInfoWidth;
var causticsInfoHeight = causticsInfoWidth;

var waterHeight = waterWidth;
var poolHeight;


var useGui = true;

var showLightHelper = false;

var lightDirPresets = [
  [1.81, -0.41],  
  [0.85, 0.15],
  [1.34, -0.14]
];

var logDir = false; // log light direction vector

var showStats = false;

var showRaycastHelper = false;


window.onload = function(){
  
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  app = new App();
  app.startAnim();
  
  window.addEventListener( 'resize', onWindowResize, false );
  onWindowResize();

};

function onWindowResize() {
  app.camera.aspect = window.innerWidth / window.innerHeight;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize( window.innerWidth, window.innerHeight );
}

var App = function(){

  var self = this;
  this.container = document.getElementById("container");

  this.gui;

  if (useGui === true){

    this.initGui();
  }

  // renderer

  this.renderer = new THREE.WebGLRenderer();

  this.renderer.setClearColor( 0x000000, 1);
  this.renderer.antialias = true;
  this.renderer.autoClear = false;

  this.container.appendChild(this.renderer.domElement);


  // lightHelper

  this.lightHelper = new LightHelper({

    gui: useGui && this.gui,
    logDir: logDir,
    presets: lightDirPresets

  });
  

  if (this.lightHelper.obj){

    this.lightHelper.obj.position.y = 50;

  }

  
  
  // envmap     
  var env_urls = [
   'img/skybox/posx.jpg',
   'img/skybox/negx.jpg',
   'img/skybox/posy.jpg',
   'img/skybox/negy.jpg',
   'img/skybox/posz.jpg',
   'img/skybox/negz.jpg' 
  ];
  
  var enviro = new THREE.CubeTextureLoader().load(env_urls);    

  // real scene

  this.scene = new THREE.Scene();
  this.scene.matrixAutoUpdate = false;
  
  // ducke
  
  this.duck = null;
  this.duckitu = null;
  
  var loader = new THREE.JSONLoader();// load a resource
  loader.load(
    // resource URL
    'res/ducke.json',
    // Function when resource is loaded
    function ( geometry, material ) {
      var mat = new THREE.MeshStandardMaterial({metalness:0,roughness:0.4,envMap:enviro});
      mat.map = material[0].map;
      mat.shininess = 10;
      mat.specular = new THREE.Color(0x202020);
      
      self.duck = new THREE.Mesh( geometry, mat );
      self.duck.scale.set(15,15,15);
          
      self.duck.phase = Math.random()*100;
      self.duck.rot = 1/3.3215678;
      self.duck.rot2 = 1/2.31567;
      self.duck.rot3 = 1/3.35123;
      self.duck.euler = new THREE.Euler(0,0,0);
      self.duck.spd = 0.5;
      
      var loader = new THREE.TextureLoader();
      loader.load(
        'res/DUCKIMG.png',
        function ( texture ) {
          mat.map = texture;
          self.scene.add(self.duck);
          self.duckitu = self.duck.clone();
          self.duckitu.scale.set(10,10,10);
          self.scene.add(self.duckitu);
        }
        
      );

    }
  );
  
  // the sinke
  var loader2 = new THREE.JSONLoader();
  loader2.load('res/sink.json',function(geo,materials){     
    var l = new THREE.TextureLoader();
      l.load(
        'img/tile.jpg',
        function ( tileTexture ) {
          var l2 = new THREE.TextureLoader();
          l2.load('img/tilebump.jpg',function(bumpTexture){
            tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;

            var mat = new THREE.MeshStandardMaterial({
              metalness:0,
              roughness:0.5,
              envMap:enviro,
              map:tileTexture,
              bumpMap:bumpTexture,
              bumpScale:0.3
            });
            var mesh = new THREE.Mesh(geo,mat);
            mesh.scale.set(waterInfoWidth,waterInfoWidth,waterInfoWidth);
            mesh.position.y = -23.4
            self.scene.add(mesh);
            self.mappedSink = mesh;
          
          });
        }
        
      );

  });
  
  
  
  // sink
  

  // tileTexture
  
  /*  
  var sinkMat = new THREE.MeshStandardMaterial({roughness:0.2,metalness:0,envMap:enviro});
  this.sinkMat = sinkMat;
  this.sink = new SinkGeometry(waterInfoWidth,20,45, sinkMat );
  this.sink.position.set(0,5,0);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(waterInfoWidth,waterInfoWidth),sinkMat);
  floor.rotateX(-Math.PI/2);
  floor.position.y = -35;
  this.sink.add(floor)
  this.scene.add(this.sink);
  */
  
  // counter
  
  /*
  this.counter = new SinkGeometry(waterInfoWidth+20*2, 100, 40, new THREE.MeshStandardMaterial({roughness:0.8,metalness:0,color:0xc4ae79,envMap:enviro}) );
  this.scene.add(this.counter);
  */
  
  // fog
  
  // this.scene.fog = new THREE.FogExp2(0xfef8d3,0.001);
  
  // skybox
  
  var materialArray = env_urls.map(function(u){
    return new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( u ), fog:false })
  });
  
  for (var i = 0; i < 6; i++)
     materialArray[i].side = THREE.BackSide;
  var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
  var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
  this.scene.add( skybox );
  this.skybox = skybox;
  
  
  //cloud
  
  var loader3 = new THREE.JSONLoader();
  loader3.load('res/cloud.json',function(geo){
    self.cloud = new THREE.Mesh(geo,new THREE.MeshStandardMaterial({
      envMap:enviro,
      metalness:0.0,
      roughness:1,
      emissive:self.directionalLight.color,
      emissiveIntensity:0.5,
      side:THREE.DoubleSide
    }));
    self.cloud.scale.set(50,50,50);
    self.cloud.position.set(0,-160,0);
    self.scene.add(self.cloud);
  });
  
  
  //lights
  this.hemisphereLight = new THREE.HemisphereLight(0xeac49f,0xbd97c0,0.6);
  this.scene.add(this.hemisphereLight);
  this.directionalLight = new THREE.DirectionalLight(0xfbf3c1,0.5);
  this.directionalLight.position.set(1,1,1);
  this.scene.add(this.directionalLight);
  
  this.pointLight = new THREE.PointLight(0xc6f9ff);
  this.pointLight.position.set(0,100,0);
  this.scene.add(this.pointLight);
  
  //this.directionalLight.intensity = 0.4;
  this.pointLight.intensity = 0.2;

  // camera

  this.camera = new THREE.PerspectiveCamera( 45, 800 / 450, 1, 100000 );

  this.camera.position.z = 100;
  this.camera.position.y = 50;


  // controls

  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  this.controls.rotateSpeed = 0.25;
  this.controls.enableDamping = true;
  this.controls.dampingFactor = 0.25;
  this.controls.enableZoom = true;
  this.controls.maxPolarAngle = Math.PI/2 - 0.05;


  // skyTexture

  // this.sceneCube = new THREE.Scene();

  var path = "./img/skybox/";
  var format = '.jpg';
  var urls = [

      path + 'posx' + format, path + 'negx' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posz' + format, path + 'negz' + format

  ];

  var skyTexture = new THREE.CubeTextureLoader().load( urls );
  skyTexture.format = THREE.RGBFormat;



  // stats

  if (showStats && typeof Stats !== "undefined"){

    this.stats = new Stats();

    this.container.appendChild( this.stats.dom );

  }


  // raycaster

  this.raycaster = new THREE.Raycaster();

  this.mouse = new THREE.Vector2();

  this.container.addEventListener('click', this.onMouseClick.bind(this), false);


  // raycast helper

  var geometry = new THREE.CylinderGeometry( 0, 4, 6, 3 );

  this.raycasterOffsetY = 4;

  this.raycastHelper = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial());

  this.raycastHelper.position.y += this.raycasterOffsetY;

  this.scene.add( this.raycastHelper );

  this.raycastHelper.visible = showRaycastHelper;

  // "simple" water
    
  this.getWaterNoise = function(x,y,z){
    return tooloud.Simplex.noise(x, y, z);
  }  
  
  this.simpleWaterMat = new THREE.MeshStandardMaterial({transparent:true,opacity:0.7,color:0xd0e0e0, metalness:0, roughness:0, envMap:enviro} );
  
  this.simpleWaterGeometry = new THREE.PlaneGeometry(waterInfoWidth,waterInfoWidth,50,50);
  
  this.simpleWater = new THREE.Mesh(this.simpleWaterGeometry,this.simpleWaterMat);
  this.simpleWater.rotateX(-Math.PI/2);
  this.scene.add(this.simpleWater);

};

App.prototype.addDrop = function(center, radius, strength){

  this.waterInfo.addDrop(center, radius, strength);

}

function getRandomArbitrary(min, max) {

  return Math.random() * (max - min) + min;

}

App.prototype.toggleLightHelper = function(){

  showLightHelper = !showLightHelper;

}

App.prototype.startAnim = function(){

  this.render.call(this);

}

App.prototype.render = function(){

  requestAnimationFrame( this.render.bind(this) );

  this.controls.update(); 

  if (useGui){

    this.guiUpdate();

  } 
  
  this.lightHelper.update();

  this.update();

  if (showStats){

    this.stats.update();

  }
}

App.prototype.update = function(){

  var now = performance.now();
  if (!this.lastTick){
    this.lastTick = now;
  }

  this.renderer.clear();

  // move the duck around
  if (this.duck){
    var t = now*this.duck.spd*10;
    this.duck.position.y = Math.sin(t/3000 + this.duck.phase)*this.duck.scale.y / 12;  
    this.duck.euler.x = Math.sin(t/1000 * this.duck.rot2)/10;
    //this.duck.euler.y = t/5000 * this.duck.rot + this.duck.phase;
    this.duck.euler.z = Math.sin(t/1000 * this.duck.rot3)/10;
    this.duck.setRotationFromEuler(this.duck.euler);
  }
  
  // move the duckitu around
  
  var theta = now/5000;
  var px = 700* -Math.sin(theta);
  var pz = 700* -Math.cos(theta);
  var py = 200 + 50* Math.sin(theta*2.32156);
  this.pointLight.position.set(px,py,pz);  
  if (this.duckitu){
    this.duckitu.position.copy(this.pointLight.position);
    this.duckitu.position.y += 13;
    this.duckitu.setRotationFromAxisAngle ( UP, theta - Math.PI/2);    
    if (!this.duckitu.hasCloud && this.cloud){// add cloud and bulb  
      this.duckitu.hasCloud = true;    
      this.duckitu.cloud = this.cloud.clone();
      this.duckitu.cloud.scale.set(5,5,5);
      this.scene.add(this.duckitu.cloud);
      this.duckitu.bulb = new THREE.Mesh(new THREE.SphereGeometry(10,8,6),new THREE.MeshStandardMaterial({color:0,emissive:this.pointLight.color}));
      this.scene.add(this.duckitu.bulb);
    }
    if (this.duckitu.hasCloud){
      this.duckitu.cloud.position.copy(this.pointLight.position);
      this.duckitu.bulb.position.copy(this.pointLight.position);
    
      this.duckitu.cloud.rotation.copy(this.duckitu.rotation)
      this.duckitu.bulb.position.y += 3;
    }        
  }
  
  // real scene

  this.renderer.render(this.scene, this.camera);
  
  //move water  
  
  this.simpleWaterGeometry.vertices.forEach((p)=>{    
    p.z = 7*(-0.1+this.getWaterNoise(now/1000,p.y/20,p.x/20));
  });
  
  //update cloud lighting
  if (this.cloud){
    this.cloud.material.emissive = this.directionalLight.color;
    this.cloud.material.emissiveIntensity = this.directionalLight.intensity * 0.5;    
  }

  this.simpleWaterGeometry.verticesNeedUpdate = true;
  this.simpleWaterGeometry.computeVertexNormals();

}

App.prototype.initGui = function(){
  if (typeof dat != 'undefined'){

    this.gui = new dat.GUI();

    this.guiCtrl = {

      'poolHeight': 60

    };  
    
  }


};

App.prototype.guiUpdate = function(){

  //poolHeight = this.guiCtrl['poolHeight'];

};

App.prototype.toggleRaycastHelper = function(){

  showRaycastHelper = !showRaycastHelper;

  this.raycastHelper.visible = showRaycastHelper;

}


App.prototype.onMouseClick = function(event) {
  
  return;

  /*
  var rect = document.getElementsByTagName("canvas")[0].getBoundingClientRect();

  this.mouse.x = 2*((event.clientX - 0) / rect.width)  - 1;
  this.mouse.y = - 2*((event.clientY - 0) / rect.height) + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);

  var intersects0 = this.raycaster.intersectObject(this.waterMeshes[0]);
  var intersects1 = this.raycaster.intersectObject(this.waterMeshes[1]);

  if (intersects0.length > 0) {

    var point = intersects0[0].point; // world position

    var aboveWater = true;

  } else if(intersects1.length > 0){

    var point = intersects1[0].point;

    var aboveWater = false;

  } else { return; }

  var center = new THREE.Vector2((point.x + waterWidth / 2) / waterWidth, (-point.z + waterHeight / 2) / waterHeight); // uv

  for (var i = 0; i < 2; i++) {

    this.addDrop(center, 0.1, (i & 1) ? - 0.2 : 0.2);

  }

  if (showRaycastHelper){

    this.raycastHelper.position.copy(point);
    this.raycastHelper.rotation.x = aboveWater ? 0 : Math.PI;
    this.raycastHelper.position.y += (aboveWater ? 1 : -1) * this.raycasterOffsetY;

  }
  */
}