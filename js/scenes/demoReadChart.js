import { videoHandTracker } from "../render/core/videoHandTracker.js";
import * as cg from "../render/core/cg.js";
import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";
import * as chartFile from "./chart.js";
import * as positionalaudio from "../util/positional-audio.js";

class Object{
    constructor(type, startTime, size, position1, position2, position3, gltfModel ){
        this.type=type;
        this.startTime=startTime;
        this.size=size;
        this.position1=position1;
        this.position2=position2;
        this.position3=position3;
        this.gltfModel=gltfModel;
    }
}

let d3 = (a,b) => { 
    let x = b[0] - a[0], 
        y = b[1] - a[1],
        z = b[1] - a[1]; 
    return Math.sqrt(x*x + y*y + z*z);
 } 

export const init = async model => {
    model.setTable(false);
    //let artist = model.add();
    //let title = model.add();
    
    var objects=[];
    var chart = chartFile.chart;
    var artist = chartFile.artist;
    var title = chartFile.title;
    var bpm = chartFile.bpm;
    var offset = chartFile.offset;
    var timePerBar=60000/bpm;
    for(var i=0; i<chart.length; i++){
        var infos=chart[i].split(',').map(Number);
        objects.push(infos)
    }
    var currentObjects=[];
    var currentGltfModels=[];
    var currentPositions=[];
    var currentTime=-1;
    var startTime;
    var objectAppearPosition=6;

    let text ="";
    let label=model.add();
    label.add('label').move(-0,1,1).scale(.05);
    label.add('label').move(-0,0.85,1).scale(.05);

    let hpLabel = model.add();
    hpLabel.add('label');
    hpLabel.flag('uTransparentTexture', 1);
    hpLabel.color([0,1,0]);
    hpLabel.child(0).info('hp: 100');

    let combo=0;
    let comboLabel = model.add();
    comboLabel.add('label');
    comboLabel.flag('uTransparentTexture', 1);
    comboLabel.color([0,0,1]);
    comboLabel.child(0).info('Combo: 0');

    let audio = new Audio("/media/sound/REANIMATE.mp3");
    let hitsound_ = new Audio("/media/sound/drum-hitnormal69.m4a");
    //let hitsound = model.add('cube').add().audio("/media/sound/drum-hitnormal69.m4a");
    
    let hp=100;
    //positionalaudio.loadAudioSources();
    //positionalaudio.playAudio();
    model.animate(() => {
        
        hpLabel.hud(true).scale(.05);
        comboLabel.hud(false).scale(.05);
        if(currentTime==-1){
            startTime=model.time*1000;
        }
        let time_gap=model.time*1000-startTime-currentTime;
        currentTime=model.time*1000-startTime;
        if(currentTime>6000-offset){
            audio.play();
        }
        console.log("Objects number: "+objects.length);
        if(objects.length>0 && objects[0][1]*timePerBar+3000<currentTime){

            var objectType=objects[0][0]; // 0:tap, 1:hold, 2:slide
            if(objectType==0){
                let object = new Object(0,objects[0][1],1,(objects[0][2]-50)/150,1.5+(objects[0][3]-50)/150,objectAppearPosition,new Gltf2Node({ url: './media/gltf/tap/scene.gltf' }));
                global.gltfRoot.addNode(object.gltfModel);
                object.gltfModel._scale=[0.1,0.1,0.1];
                object.gltfModel.translation=[object.position1,object.position2,objectAppearPosition];object
                
                currentObjects.push(object);
            }
            else if(objectType==1){
                let object = new Object(1,objects[0][1],objects[0][2],0,2.4,objectAppearPosition,new Gltf2Node({ url: './media/gltf/ring/scene.gltf' }));
                global.gltfRoot.addNode(object.gltfModel);
                object.gltfModel._scale=[0.2*object.size,0.2*object.size,0.2*object.size];
                object.gltfModel.translation=[object.position1,object.position2,objectAppearPosition];
                currentObjects.push(object);
            }
            else if(objectType==2){
                let object1 = new Object(2,objects[0][1],1,objects[0][3],objects[0][4],objectAppearPosition,new Gltf2Node({ url: './media/gltf/arrow/scene.gltf' }));
                global.gltfRoot.addNode(object1.gltfModel);
                object1.gltfModel._scale=[0.1,0.1,0.1];
                object1.gltfModel.translation=[object1.position1,object1.position2,objectAppearPosition];
                object1.gltfModel._rotation=[-0.5,0,0,1];
                currentObjects.push(object1);
                
                let object2 = new Object(2,objects[0][2],1,objects[0][3],objects[0][4],objectAppearPosition,new Gltf2Node({ url: './media/gltf/arrow/scene.gltf' }));
                global.gltfRoot.addNode(object2.gltfModel);
                object2.gltfModel._scale=[0.1,0.1,0.1];
                object2.gltfModel.translation=[object2.position1,object2.position2,objectAppearPosition];
                object2.gltfModel._rotation=[0.5,0,0,1];
                currentObjects.push(object2);
            }
            //currentObjects.push(objects[0]);
            //currentPositions.push(3);
            console.log("AddObject at time: "+currentTime+" and current number of objects is: "+currentObjects.length);
            console.log("current object time in file is:"+objects[0][1]);
            console.log("calculated object time is:" + (objects[0][1]*timePerBar+offset));
            objects.shift();
        }

        for(var i=0; i<currentObjects.length; ){
            //currentPositions[i]=currentPositions[i]-0.05*currentTime;
            currentObjects[i].position3=currentObjects[i].position3-0.002*time_gap;
            currentObjects[i].gltfModel.translation=[currentObjects[i].position1,currentObjects[i].position2,currentObjects[i].position3];
            console.log("current number of moving object: " + currentObjects.length);
            console.log("object: " + currentObjects[i].position1 +"; "+ currentObjects[i].position2 +"; " + currentObjects[i].position3);
            
            if(currentObjects[i].position3<0){
                if(currentObjects[i].type==0){
                    //position of left hand
                    let leftHand = videoHandTracker.getJointMatrix('left',0,0).slice(12,15);
                    //distance between the object and left hand
                    let leftDistance = d3(leftHand,[currentObjects[i].position1,currentObjects[i].position2,currentObjects[i].position3]);
                    console.log("hand: " + leftHand + leftDistance);
                    
                    label.child(0).info('left distance: '+leftDistance);
                    //if they are close enough, count as hit
                    if(leftDistance<2.5){
                        global.gltfRoot.removeNode(currentObjects[i].gltfModel);
                        delete currentObjects.gltfModel;
                        currentObjects.splice(i,1);
                        //hitsound
                        //hitsound.identity().move(currentObjects[i].position1,currentObjects[i].position2,currentObjects[i].position3).scale(0.00001);
                        //hitsound.child(0).playAudio();
                        hitsound_.play();
                        //combo
                        combo=combo+1;
                        comboLabel.child(0).info('Combo: '+combo);
                        continue;
                    }

                    //position of right hand
                    let rightHand = videoHandTracker.getJointMatrix('right',0,0).slice(12,15);
                    
                    //distance between object and right hand
                    let rightDistance = d3(rightHand,[currentObjects[i].position1,currentObjects[i].position2,currentObjects[i].position3]);
                    label.child(1).info('right distance: '+rightDistance);
                    if(rightDistance<2.5){
                        global.gltfRoot.removeNode(currentObjects[i].gltfModel);
                        delete currentObjects.gltfModel;
                        currentObjects.splice(i,1);
                        //hitsound
                        //hitsound.identity().move(currentObjects[i].position1,currentObjects[i].position2,currentObjects[i].position3).scale(0.00001);
                        //hitsound.child(0).playAudio();
                        hitsound_.play();
                        //combo
                        combo=combo+1;
                        comboLabel.child(0).info('Combo: '+combo);
                        continue;
                    }
                }

                if(currentObjects[i].type==1){
                    global.gltfRoot.removeNode(currentObjects[i].gltfModel);
                    delete currentObjects.gltfModel;
                    currentObjects.splice(i,1);
                    //hitsound
                    hitsound_.play();
                    //combo
                    combo=combo+1;
                    comboLabel.child(0).info('Combo: '+combo);
                    continue;
                }
            }

            //miss => hp drops
            if(currentObjects[i].position3<-1){
                hp = hp - 5;
                hpLabel.child(0).info('hp: '+hp);
                hpLabel.color([1-hp/100,hp/100,0]);
                global.gltfRoot.removeNode(currentObjects[i].gltfModel);
                delete currentObjects.gltfModel;
                currentObjects.splice(i,1);
                //combo
                combo=0;
                comboLabel.child(0).info('Combo: '+combo);
                continue;
            }
            i++;
        }

        //game over logic
    });
}