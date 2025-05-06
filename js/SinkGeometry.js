import * as THREE from 'three'

SinkGeometry = function(size, wallThickness, sinkHeight, material){
  var ret = new THREE.Object3D();
  var material = material || new THREE.MeshStandardMaterial({roughness:0.2,metalness:0});
  var wallThickness = wallThickness;
  var sinkHeight = sinkHeight;
  
  // add 4 boxes
  
  for (var i = 0; i < 4; i ++){
    var b = new THREE.BoxGeometry(size + (i%2==0?0:wallThickness*2),sinkHeight,wallThickness)
    var x = (size/2 + wallThickness/2) * Math.sin(i*Math.PI/2);
    var z = (size/2 + wallThickness/2) * Math.cos(i*Math.PI/2); 
    
    var m = new THREE.Mesh(b,material);
    m.position.set(x,-sinkHeight/2,z)
    
    if (i == 1 || i == 3){
      m.rotateY(Math.PI/2);
    }
    
    ret.add(m);
  }
  
  return ret;
}

export default SinkGeometry