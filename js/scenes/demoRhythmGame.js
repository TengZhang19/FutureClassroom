import { videoHandTracker } from "../render/core/videoHandTracker.js";
import * as cg from "../render/core/cg.js";
import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";
export const init = async model => {
   let tap1 = new Gltf2Node({ url: './media/gltf/tap/scene.gltf' });
   let tap2 = new Gltf2Node({ url: './media/gltf/tap/scene.gltf' });
   let tap3 = new Gltf2Node({ url: './media/gltf/tap/scene.gltf' });
   let hold = new Gltf2Node({ url: './media/gltf/ring/scene.gltf' });
   let slideUp = new Gltf2Node({ url: './media/gltf/arrow/scene.gltf' });
   let slideDown = new Gltf2Node({ url: './media/gltf/arrow/scene.gltf' });

   global.gltfRoot.addNode(tap1);
   global.gltfRoot.addNode(tap2);
   global.gltfRoot.addNode(tap3);
   global.gltfRoot.addNode(hold);
   global.gltfRoot.addNode(slideUp);
   global.gltfRoot.addNode(slideDown);
   
   tap1._scale=[0.1,0.1,0.1];
   tap2._scale=[0.1,0.1,0.1];
   tap3._scale=[0.1,0.1,0.1];
   hold._scale=[0.2,0.2,0.2];
   slideUp._scale=[0.1,0.1,0.1];
   slideDown._scale=[0.1,0.1,0.1];
   slideDown._rotation=[0.5,0,0,1]
   slideUp._rotation=[-0.5,0,0,1]

   tap1.translation = [0.5, 1, 0];
   tap2.translation = [0.5, 1, 0];
   tap3.translation = [0.5, 1, 0];
   hold.translation = [0, 2, 0];
   slideUp.translation = [-0.5, 1, 0];
   slideDown.translation = [-0.5, 1, 2];

   //let ring = model.add();
   //ring = model.add('donut').texture('media/gltf/boost_ring/None_emissive.png').scale(2).bevel(true);
   let y=[3,4,5,10,14,16];
   model.animate(() => {

      for(var i=0; i<6; i++){
         y[i]=y[i]-0.00005*model.time;
         if(y[i]<-10)y[i]=10;
      }
      //model.child(0).move(1.5,1.5,1.5);

      tap1.translation = [0.5, 0.5, y[0]];
      tap2.translation = [0, 1, y[1]];
      tap3.translation = [-0.5, 1, y[2]];

      hold.translation = [0, 2, y[3]];
      slideUp.translation = [-0.5, 1, y[4]];
      slideDown.translation = [-0.5, 1, y[5]];

      

});

}