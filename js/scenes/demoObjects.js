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
   
   let label = model.add();
   label.add('label').move(0,0,0).scale(.5);

   //let ring = model.add();
   //ring = model.add('donut').texture('media/gltf/boost_ring/None_emissive.png').scale(2).bevel(true);
   model.animate(() => {

      
      //model.child(0).move(1.5,1.5,1.5);
      tap1._scale=[0.1,0.1,0.1];
      tap2._scale=[0.1,0.1,0.1];
      tap3._scale=[0.1,0.1,0.1];
      hold._scale=[0.2,0.2,0.2];
      slideUp._scale=[0.1,0.1,0.1];
      slideDown._scale=[0.1,0.1,0.1];
      slideDown._rotation=[0.5,0,0,1]
      slideUp._rotation=[-0.5,0,0,1]
   
      tap1.translation = [0.5, 1, 0];
      tap2.translation = [0.5, 1, -0.5];
      tap3.translation = [0.5, 1, -1];
      hold.translation = [0, 2, 0];
      slideUp.translation = [-0.5, 1, 0];
      slideDown.translation = [-0.5, 1, 2];
      
      //model.hud().scale(1);
      //label.identity().scale(.02);
      //label.flag('uTransparentTexture', isClear);
      //label.child(0).info("100").color([0,1,0]);

});

}