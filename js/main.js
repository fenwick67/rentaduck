/*
 * sydneyzh 2016
 */

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  Vector3,
  Vector2,
  WebGLRenderer, 
  CubeTextureLoader,
  MeshStandardMaterial,
  Mesh,
  Material,
  MaterialLoader,
  Raycaster,
  SphereGeometry,
  Scene,
  MeshNormalMaterial,
  TextureLoader,
  ObjectLoader,
  RepeatWrapping,
  Euler,
  DoubleSide,
  PlaneGeometry,
  HemisphereLight,
  SpotLight,
  PointLight,
  PerspectiveCamera,
  RGBFormat,
  CylinderGeometry,
  Object3D,
  SpotLightHelper,
  PCFShadowMap,
  PCFSoftShadowMap,
  FogExp2,
} from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import ColorCorrectionShader from '../libs/ColorCorrectionShader.js';
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

var UP = new Vector3(0,1,0);
var ZERO = new Vector3(0,0,0);
var waterInfoWidth = 125;
var waterWidth = waterInfoWidth;
var waterInfoHeight = waterInfoWidth;

var causticsInfoWidth = 4 * waterInfoWidth;
var causticsInfoHeight = causticsInfoWidth;

var waterHeight = waterWidth;
var poolHeight;


var useGui = true;

var showLightHelper = false;

var showStats = false;

var showRaycastHelper = false;


window.onload = function(){

  // if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  window.app = new App();
  window.app.startAnim();

  window.addEventListener( 'resize', onWindowResize, false );
  onWindowResize();

};

function onWindowResize() {
  window.app.camera.aspect = window.innerWidth / window.innerHeight;
  window.app.camera.updateProjectionMatrix();
  window.app.renderer.setSize( window.innerWidth, window.innerHeight );
  window.app.composer.setSize( window.innerWidth, window.innerHeight );
}

var App = function(){

  var self = this;
  this.container = document.getElementById("container");

  this.gui;

  if (useGui === true){

    this.initGui();
  }

  // renderer

  this.renderer = new WebGLRenderer({antialias:true});

  this.renderer.setClearColor( 0x000000, 1);
  this.renderer.antialias = true;
  this.renderer.autoClear = false;
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = PCFSoftShadowMap;
  this.container.appendChild(this.renderer.domElement);

  if (this.lightHelper?.obj){

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

  var enviro = new CubeTextureLoader().load(env_urls);


  // real scene

  this.scene = new Scene();
  this.scene.background=enviro;

  this.scene.matrixAutoUpdate = false;

  // ducke

  this.duck = null;
  this.duckitu = null;

  var loader = new GLTFLoader();// load a resource
  loader.load(
    // resource URL
    'res/ducke.glb',
    // Function when resource is loaded
    function ( glb ) {
      // var mat = new MeshStandardMaterial({metalness:0.01,roughness:0.2,envMap:enviro});
      // mat.map = material[0].map;

      self.duck = new Object3D();
      glb.scene.children.forEach(child=>{
        if (child.isMesh && child.material){
          child.material.envMap=enviro;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      })
      self.duck.add(glb.scene)
      self.duck.castShadow = true;
      self.duck.receiveShadow = true;
      self.duck.scale.set(15,15,15);

      self.duck.phase = Math.random()*100;
      self.duck.rot = 1/3.3215678;
      self.duck.rot2 = 1/2.31567;
      self.duck.rot3 = 1/3.35123;
      self.duck.euler = new Euler(0,0,0);
      self.duck.spd = 0.5;

      self.scene.add(self.duck);
      self.duckitu = self.duck.clone();
      self.duckitu.castShadow = self.duckitu.receiveShadow = false;

      self.duckitu.scale.set(10,10,10);
      self.scene.add(self.duckitu);

    }
  );

  // the sinke
  var loader2 = new GLTFLoader();
  loader2.load('res/sink.glb',function(glb){
    var geo = glb.scene.children[0].geometry;
    var l = new TextureLoader();
      l.load(
        'img/tile.jpg',
        function ( tileTexture ) {
          var l2 = new TextureLoader();
          l2.load('img/tilebump.jpg',function(bumpTexture){
            tileTexture.wrapS = tileTexture.wrapT = RepeatWrapping;
            bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;

            var mat = new MeshStandardMaterial({
              metalness:0,
              roughness:0.1,
              envMap:enviro,
              map:tileTexture,
              bumpMap:bumpTexture,
              bumpScale:0.5
            });
            var mesh = new Mesh(geo,mat);
            mesh.scale.set(waterInfoWidth,waterInfoWidth,waterInfoWidth);
            mesh.position.y = -23.4
      	    mesh.castShadow = true;
      	    mesh.receiveShadow = true;
            self.scene.add(mesh);
            self.mappedSink = mesh;

          });
        }

      );

  });



  // sink


  // tileTexture

  /*
  // var sinkMat = new THREE.MeshStandardMaterial({roughness:0.2,metalness:0,envMap:enviro});
  // this.sinkMat = sinkMat;
  // this.sink = new SinkGeometry(waterInfoWidth,20,45, sinkMat );
  // this.sink.position.set(0,5,0);
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

  // this.scene.fog = new FogExp2(0xfef8d3,0.001);

  //cloud
  var loader3 = new GLTFLoader();
  loader3.load('res/cloud_smooth.glb',function(glb){
    var geo = glb.scene.children[0].geometry

    self.cloud = new Mesh(geo,new MeshStandardMaterial({
      envMap:enviro,
      metalness:0.0,
      roughness:1,
      emissive:self.spotLight.color,
      emissiveIntensity:0.5,
      side:DoubleSide,
      flatShading:false
    }));
    self.cloud.scale.set(50,50,50);
    self.cloud.receiveShadow = true;
    self.cloud.castShadow = false;
    self.cloud.position.set(0,-112,0);// formerly -160
    self.scene.add(self.cloud);
  });


  //lights
  this.hemisphereLight = new HemisphereLight(0xeac49f,0xbd97c0,0.3);
  this.scene.add(this.hemisphereLight);

  this.spotLight = new SpotLight(0xfbf3c1,55.5);
  this.spotLight.castShadow = true;
  this.spotLight.position.set(0,50,0);
  this.spotLight.lookAt(ZERO);
  this.spotLight.shadow.camera.far = 2000;
  this.spotLight.shadow.camera.near = 10;
  this.spotLight.shadow.mapSize.width = 1024;
  this.spotLight.shadow.mapSize.height = 1024;
  // this.spotLight.shadow.camera.fov = 5;
  this.spotLight.decay=0;
  this.spotLight.shadow.focus=1;
  this.scene.add(this.spotLight);

  this.spotLight.shadow.camera.updateProjectionMatrix();

  this.spotLightHelper = new SpotLightHelper( this.spotLight );
  this.scene.add( this.spotLightHelper );
  // it's just for debugging so turn it off 
  this.spotLightHelper.visible=false

  this.pointLight = new PointLight(0xc6f9ff);
  this.pointLight.position.set(0,100,0);
  this.pointLight.decay=0;
  this.scene.add(this.pointLight);

  this.spotLight.intensity = 0.5;
  this.pointLight.intensity = 0.2;

  // camera

  this.camera = new PerspectiveCamera( 45, 800 / 450, 1, 100000 );

  this.camera.position.z = 100;
  this.camera.position.y = 50;


  // controls

  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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

  var skyTexture = new CubeTextureLoader().load( urls );
  skyTexture.format = RGBFormat;



  // stats

  if (showStats && typeof Stats !== "undefined"){

    this.stats = new Stats();

    this.container.appendChild( this.stats.dom );

  }


  // raycaster

  this.raycaster = new Raycaster();

  this.mouse = new Vector2();

  this.container.addEventListener('click', this.onMouseClick.bind(this), false);


  // raycast helper

  var geometry = new CylinderGeometry( 0, 4, 6, 3 );

  this.raycasterOffsetY = 4;

  this.raycastHelper = new Mesh( geometry, new MeshNormalMaterial());

  this.raycastHelper.position.y += this.raycasterOffsetY;

  this.scene.add( this.raycastHelper );

  this.raycastHelper.visible = showRaycastHelper;

  // "simple" water

  this.getWaterNoise = function(x,y,z){
    return tooloud.Simplex.noise(x, y, z)
  }

  this.simpleWaterMat = new MeshStandardMaterial({transparent:true,opacity:0.5,color:0xd0e0f0, metalness:0, roughness:0, envMap:enviro} );

  this.simpleWaterGeometry = new PlaneGeometry(waterInfoWidth,waterInfoWidth,50,50);

  this.simpleWater = new Mesh(this.simpleWaterGeometry,this.simpleWaterMat);
  this.simpleWater.rotateX(-Math.PI/2);
  this.scene.add(this.simpleWater);

	var renderPass = new RenderPass( this.scene, this.camera );
  var effectCopy = new ShaderPass( CopyShader );
  this.effectColor = new ShaderPass(ColorCorrectionShader);
  this.effectColor.uniforms.powRGB.value.set(0.6,0.7,1);// brightness => yellow
  this.effectColor.uniforms.mulRGB.value.set(1.05,1,1.4);// darkness => purple
  this.effectColor.uniforms.addRGB.value.set(0,0,0);

  // // pasted
  this.composer = new EffectComposer(this.renderer);
  this.effectBloom = new UnrealBloomPass(
    new Vector2( 256,256 ),
    0.3, 0.4, 0.9 // strength, radius, threshold
  );
  this.composer.addPass(renderPass);
  this.aaPass = new ShaderPass( FXAAShader );
  this.composer.addPass(this.aaPass);
  // this.aaPass.renderToScreen = true;
  this.composer.addPass(this.effectBloom);
  this.composer.addPass(this.effectColor);

  this.composer.addPass(effectCopy)
  effectCopy.renderToScreen = true;

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

  this.lightHelper?.update();

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

  var theta = now/2000;
  var px = 200* -Math.sin(theta);
  var pz = 200* -Math.cos(theta);
  var py = 500 + 50* Math.sin(theta*2.32156);
  this.pointLight.position.set(px,py,pz);

  this.spotLight.angle=0.9;
  this.spotLight.position.set(px/2.5,py/2.5,pz/2.5);
  this.spotLight.lookAt(ZERO);
  this.spotLight.shadow.needsUpdate=true;
  this.spotLightHelper.update();
  this.spotLight.shadow.camera.updateProjectionMatrix();

  if (this.duckitu){
    this.duckitu.position.copy(this.pointLight.position);
    this.duckitu.position.y += 13;
    this.duckitu.setRotationFromAxisAngle ( UP, theta - Math.PI/2);
    if (!this.duckitu.hasCloud && this.cloud){// add cloud and bulb
      this.duckitu.hasCloud = true;
      this.duckitu.cloud = this.cloud.clone();
      this.duckitu.cloud.castShadow = this.duckitu.cloud.receiveShadow = false;
      this.duckitu.cloud.scale.set(5,5,5);
      this.scene.add(this.duckitu.cloud);
      this.duckitu.bulb = new Mesh(new SphereGeometry(10,8,6),new MeshStandardMaterial({color:0,emissive:this.pointLight.color}));
      this.scene.add(this.duckitu.bulb);
    }
    if (this.duckitu.hasCloud){
      this.duckitu.cloud.position.copy(this.pointLight.position);
      this.duckitu.bulb.position.copy(this.pointLight.position);

      this.duckitu.cloud.rotation.copy(this.duckitu.rotation);
      this.duckitu.bulb.position.y += 6;
      this.duckitu.cloud.position.y += 6;
    }
  }

  // real scene
  // this.renderer.render(this.scene, this.camera);


  //move water
  const waterPos=this.simpleWaterGeometry.attributes.position
  for (var i = 0; i < waterPos.count; i++){
    var x = waterPos.getX(i)
    var y = waterPos.getY(i)
    waterPos.setZ(i, 9*(-0.1+this.getWaterNoise(y/20,x/20, now/1000)));
  }

  //update cloud lighting
  if (this.cloud){
    this.cloud.material.emissive = this.spotLight.color;
    this.cloud.material.emissiveIntensity = this.spotLight.intensity * 0.5;
  }

  this.simpleWaterGeometry.attributes.position.needsUpdate = true;
  this.simpleWaterGeometry.computeVertexNormals();

  this.composer.render();
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
