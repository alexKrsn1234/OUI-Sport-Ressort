import * as BABYLON from 'babylonjs';
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders";
import { AnimationEvent } from '@babylonjs/core';
// INTERFACE MENU
const jeux = ["Jeu1","Jeu2","Jeu3"];
const backinterface = document.getElementById("backinterface");
const Interface = document.getElementById("interface");
const canvas = document.getElementById("renderCanvas");
const gameinterface = document.getElementById("gameinterface");
const interface1 = document.getElementById("interface1");
const interface2 = document.getElementById("interface2");
const interface3 = document.getElementById("interface3");
const interfaceInfo = document.getElementById("interfaceInfo");
const interfaceParam = document.getElementById("interfaceParam");
const loading = document.getElementById("loading");
const end1 = document.getElementById("end1");
const wintext = document.getElementById("wintext");
canvas.classList.add("notplaying");
const menu = document.getElementById("menu");
const menu1 = document.getElementById("menu1");
menu.classList.add("notplaying");
interface1.classList.add("notplaying");
interface2.classList.add("notplaying");
interface3.classList.add("notplaying");
interfaceInfo.classList.add("notplaying");
interfaceParam.classList.add("notplaying");
const info = document.getElementById("INFORMATIONS")
const param = document.getElementById("PARAMETRES"); 
const crowds = document.getElementById("crowds");
gameinterface.classList.add("notplaying");
loading.classList.add("notplaying")
end1.classList.add("notplaying");
//START JEU AFFICHAGE DU HAUT
const start1 = document.getElementById("start1");
start1.classList.add("notplaying");
const start2 = document.getElementById("start2");
start2.classList.add("notplaying");
const start3 = document.getElementById("start3");
start3.classList.add("notplaying");
//SCORES JEU 
const score1 = document.querySelectorAll("#score4")
const score2 = document.querySelectorAll("#score3");
const score3 = document.querySelectorAll("#score2");
const score4 = document.querySelectorAll("#score1");
//FAIL JEU 1
var fail1=false;
var fail2=false;
var fail3 = false;
var fail4 = false;

var pubList = ["./textures/pub1.png", "./textures/pub2.png", "./textures/pub3.png", "./textures/pub4.png", "./textures/pub5.png", "./textures/pub6.png"]
var crowd = ["crowd1.glb","crowd2.glb","crowd3.glb","crowd4.glb"];
var finish=false;
var activated=false;


jeux.forEach((elem) => {
    console.log(crowds.value);
    console.log(localStorage.getItem('foule'));
    let jeu = document.getElementById(elem);
    jeu.addEventListener('click', function(){
        loading.classList.remove("notplaying");
        const game = new Game(jeux.indexOf(elem)+1);
        game.engine.resize();
        window.addEventListener("resize", function () {
            game.engine.resize();
        });
        game.engine.enterPointerlock();
        gameinterface.classList.add("playing");
        gameinterface.classList.remove("notplaying");
        canvas.classList.remove("notplaying");
        canvas.classList.add("playing");
        menu.classList.remove("notplaying");
        if(game.jeut==1){
            interface1.classList.remove("notplaying");
            start1.classList.remove("notplaying");
        }else if(game.jeut==2){
            interface2.classList.remove("notplaying");
            start2.classList.remove("notplaying");
        }else if(game.jeut==3){
            interface3.classList.remove("notplaying");
            start3.classList.remove("notplaying");
        }
        game.engine.resize();
        Interface.classList.add("notplaying");
        backinterface.classList.add("notplaying");
    })
})
info.addEventListener('click', function() {
    menu.classList.remove("notplaying");
    interfaceInfo.classList.remove("notplaying");
    Interface.classList.add("notplaying");
})
param.addEventListener('click', function() {
    menu.classList.remove("notplaying");
    interfaceParam.classList.remove("notplaying");
    Interface.classList.add("notplaying");
})
crowds.addEventListener('click', function() {
    var val = crowds.value;
    localStorage.setItem("foule", val);
});
menu.addEventListener('click', function() {
    location.reload();
})
menu1.addEventListener('click', function() {
    location.reload();
})



// JEU :

//SCENE DE JEU
export class Game {
    constructor (jeut) {
        this.jeut=jeut;
        this.mov=new Map();
        // Load Babylon 3D engine
        this.engine = new BABYLON.Engine(canvas, true);
        // Call the createScene function
        this.scene = this.createScene();   
        // Run the render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene = function () {
        var scene = new BABYLON.Scene(this.engine);
        scene.onPointerDown = (evt)=>{
            if(evt.button === 0) this.engine.enterPointerlock();
            if(evt.button === 1) this.engine.exitPointerlock();
        }


        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.groundColor = new BABYLON.Color3(1, 1, 1);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.8;

        //soundstade
        const music1 = new BABYLON.Sound("stade", "sounds/stadium.mp3", scene, null, { loop: true, autoplay: true, length: 24, offset: 2.0, volume:0.2});
        //clapping stade
        const clap1 = new BABYLON.Sound("gunshot", "sounds/clapping.mp3", scene,null, { loop: true, autoplay: false, length: 18, offset: 3.0, volume:0.5});

        const envTex = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.env", scene);
        scene.environmentTexture = envTex;
        scene.createDefaultSkybox(envTex,true);

        //para jeu1  utile pour autre jeu ??
        var positions= new Array();
        for(let i=0;i<20;i++){
            positions.push(140-i*12);
        }
        var boxs1=[];
        var boxs2=[];
        var boxs3=[];
        var boxs4=[];
        var metal = new BABYLON.Sound("metal", "sounds/metal.mp3", scene, null, { loop: false, autoplay: false, volume:0.005});

        //gradin
        var foule = localStorage.getItem("foule");
        if(foule==null) {foule="full";}
        var path = [];
        var bottomLine = BABYLON.Curve3.CreateQuadraticBezier(
        new BABYLON.Vector3(0, 3, -10),
        new BABYLON.Vector3(7.5, 8, -15),
        new BABYLON.Vector3(16, 3, -10),
        50);
        path.push(bottomLine.getPoints());
        var topLine = BABYLON.Curve3.CreateQuadraticBezier(
        new BABYLON.Vector3(0, 0, 20),
        new BABYLON.Vector3(7.5, 5, 20),
        new BABYLON.Vector3(16, 0, 20),
        50);
        path.push(topLine.getPoints());
        var path1=[];
        bottomLine = BABYLON.Curve3.CreateQuadraticBezier(
        new BABYLON.Vector3(0, 3, -10),
        new BABYLON.Vector3(7.5, 8, -15),
        new BABYLON.Vector3(16, 3, -10),
        4);
        path1.push(bottomLine.getPoints());
        topLine = BABYLON.Curve3.CreateQuadraticBezier(
        new BABYLON.Vector3(0, 0, 20),
        new BABYLON.Vector3(7.5, 2, 20),
        new BABYLON.Vector3(16, 0, 20),
        4);
        path1.push(topLine.getPoints());
        for(let k=0; k<3;k++){
            var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
            stair.material = this.CreateStairMaterial();
            stair.position.y=0.5+k*3;
            stair.position.x=-173-10*k;
            stair.position.z=32;
            stair.rotation.y=-1.57;
            stair.rotation.x=-0.52;
            var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
            stair.material = this.CreateStairMaterial();
            stair.position.y=0.5+k*3;
            stair.position.x=173+10*k;
            stair.position.z=-32;
            stair.rotation.y=1.57;
            stair.rotation.x=-0.52;
            for(let j=0; j<5;j++){
                for(let i=0;i<4;i++){
                    var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 15, height: 1 }, scene);
                    grad1.material = this.CreateGradMaterial();
                    grad1.position.y=0.5+j*0.6+k*3;
                    grad1.position.x=-172-j-10*k;
                    grad1.position.z=16*i-24;
                    grad1.rotation.y=-1.57;
                    grad1.rotation.x=-1;
                    var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 15, height: 1 }, scene);
                    grad1.material = this.CreateGradMaterial();
                    grad1.position.y=0.5+j*0.6+k*3;
                    grad1.position.x=172+j+10*k;
                    grad1.position.z=16*i-24;
                    grad1.rotation.y=1.57;
                    grad1.rotation.x=-1;
                    if(foule=="full"){
                        var cro = crowd[Math.floor(Math.random() * 4)]
                        SceneLoader.ImportMeshAsync("", "/models/", cro, scene).then((result) => {
                            var anim = result.animationGroups[0];
                            var mesh = result.meshes[0];
                            mesh.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                            mesh.position.z=16*i-24+15*(Math.random()-0.5);
                            mesh.position.x=172.5+j+10*k;
                            mesh.position.y=j*0.6+k*3;
                            mesh.rotationQuaternion = false;
                            mesh.rotation.y=-1.57;
                            anim.goToFrame(0);
                            anim.stop();     
                        });
                        SceneLoader.ImportMeshAsync("", "/models/", cro, scene).then((result) => {
                            var anim = result.animationGroups[0];
                            var mesh = result.meshes[0];
                            mesh.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                            mesh.position.z=16*i-24+15*(Math.random()-0.5);
                            mesh.position.x=-172.5-j-10*k;
                            mesh.position.y=j*0.6+k*3;
                            mesh.rotationQuaternion = false;
                            mesh.rotation.y=1.57;
                            anim.goToFrame(0);
                            anim.stop();  
                        
                        });
                    }
                    if(j==0){
                        var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
                        stair.material = this.CreateStairMaterial();
                        stair.position.y=0.5+k*3;
                        stair.position.x=-173-10*k;
                        stair.position.z=16*i-32;
                        stair.rotation.y=-1.57;
                        stair.rotation.x=-0.52;
                        var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
                        stair.material = this.CreateStairMaterial();
                        stair.position.y=0.5+k*3;
                        stair.position.x=173+10*k;
                        stair.position.z=-16*i+32;
                        stair.rotation.y=1.57;
                        stair.rotation.x=-0.52;
                        if(k==2){
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: path }, scene)
                            bendedMesh.material = this.CreateBendedMaterial();
                            bendedMesh.position.z=16*i-32;
                            bendedMesh.rotation.y=-1.57;
                            bendedMesh.position.y=10;
                            bendedMesh.position.x=-178;
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: path }, scene)
                            bendedMesh.material = this.CreateBendedMaterial();
                            bendedMesh.position.z=-16*i+32;
                            bendedMesh.rotation.y=1.57;
                            bendedMesh.position.y=10;
                            bendedMesh.position.x=178;
                        }
                        if(k==1){
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: path1 }, scene)
                            bendedMesh.material = this.CreateBendMaterial();
                            bendedMesh.position.z=16*i-32;
                            bendedMesh.rotation.y=-1.57;
                            bendedMesh.position.y=9.8;
                            bendedMesh.position.x=-178;
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: path1 }, scene)
                            bendedMesh.material = this.CreateBendMaterial();
                            bendedMesh.position.z=-16*i+32;
                            bendedMesh.rotation.y=1.57;
                            bendedMesh.position.y=9.8;
                            bendedMesh.position.x=178;
                        }
                    }
                }
                for(let i=0;i<=20;i++){
                    var grad = BABYLON.MeshBuilder.CreateGround("grad", { width: 15, height: 1 }, scene);
                    grad.material = this.CreateGradMaterial();
                    grad.position.y=0.5+j*0.6+k*3;
                    grad.position.z=30+j+10*k;
                    grad.position.x=16*i-160;
                    grad.rotation.x=-1;
                    var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 15, height: 1 }, scene);
                    grad1.material = this.CreateGradMaterial();
                    grad1.position.y=0.5+j*0.6+k*3;
                    grad1.position.z=-30-j-10*k;
                    grad1.position.x=16*i-160;
                    grad1.rotation.y=-3.14;
                    grad1.rotation.x=-1;
                    var cro = crowd[Math.floor(Math.random() * 4)]
                    if(foule=="full"){
                        SceneLoader.ImportMeshAsync("", "/models/", cro, scene).then((result) => {
                            var anim = result.animationGroups[0];
                            var mesh = result.meshes[0];
                            mesh.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                            mesh.position.z=-30-j-10*k;
                            mesh.position.x=16*i-160+15*(Math.random()-0.5);
                            mesh.position.y=j*0.6+k*3;
                            mesh.rotationQuaternion = false;
                            anim.goToFrame(0);
                            anim.stop();
                            const clapAnim = anim.targetedAnimations[0].animation;
                            const clapEvt = new AnimationEvent(
                                170,
                                () => {
                                    anim.goToFrame(80);
                                },
                                false
                            );
                            clapAnim.addEvent(clapEvt);
                            scene.onAfterRenderObservable.add(function(){
                                if(finish){
                                    anim.start();
                                } else {
                                    anim.goToFrame(0);
                                    anim.stop()
                                }
                            })
                        });
                    }
                    if(foule=="full"||foule=="semi"||foule=="empty"&&i==20&&j==4&&k==2){
                        SceneLoader.ImportMeshAsync("", "/models/", cro, scene).then((result) => {
                            var anim = result.animationGroups[0];
                            var mesh = result.meshes[0];
                            mesh.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                            mesh.position.z=30+j+10*k;
                            mesh.position.x=16*i-160+15*(Math.random()-0.5);
                            mesh.position.y=j*0.6+k*3;
                            mesh.rotationQuaternion = false;
                            mesh.rotation.y=-3.14;
                            anim.goToFrame(0);
                            anim.stop();
                            const clapAnim = anim.targetedAnimations[0].animation;
                            const clapEvt = new AnimationEvent(
                                170,
                                () => {
                                    anim.goToFrame(80);
                                },
                                false
                            );
                            clapAnim.addEvent(clapEvt);
                            scene.onAfterRenderObservable.add(function(){
                                if(finish){
                                    anim.start();
                                } else {
                                    anim.goToFrame(0);
                                    anim.stop()
                                }
                            })
                            if(i==20&&j==4&&k==2){
                                loading.classList.add("notplaying");
                            }
                        });
                    }
                    if(j==0){
                        var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
                        stair.material = this.CreateStairMaterial();
                        stair.position.y=0.5+k*3;
                        stair.position.z=30.5+10*k;
                        stair.position.x=16*i-168;
                        stair.rotation.x=-0.52;
                        var stair = BABYLON.MeshBuilder.CreateGround("stair", { width: 5, height: 10 }, scene);
                        stair.material = this.CreateStairMaterial();
                        stair.position.y=0.5+k*3;
                        stair.position.z=-30.5-10*k;
                        stair.position.x=16*i-168;
                        stair.rotation.y=-3.14;
                        stair.rotation.x=-0.52;
                        if(k==2){
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: path }, scene)
                            bendedMesh.material = this.CreateBendedMaterial();
                            bendedMesh.position.x=16*i-168;
                            bendedMesh.position.y=10;
                            bendedMesh.position.z=35.5;
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: path }, scene)
                            bendedMesh.material = this.CreateBendedMaterial();
                            bendedMesh.position.x=16*(i+1)-168;
                            bendedMesh.rotation.y=-3.14;
                            bendedMesh.position.y=10;
                            bendedMesh.position.z=-35.5;
                        }
                        if(k==1){
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: path1 }, scene)
                            bendedMesh.material = this.CreateBendMaterial();
                            bendedMesh.position.x=16*i-168;
                            bendedMesh.position.y=9.8;
                            bendedMesh.position.z=35.5;
                            var bendedMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: path1 }, scene)
                            bendedMesh.material = this.CreateBendMaterial();
                            bendedMesh.position.x=16*(i+1)-168;
                            bendedMesh.rotation.y=-3.14;
                            bendedMesh.position.y=9.8;
                            bendedMesh.position.z=-35.5;
                        }
                    } else if(this.jeut==1){
                        SceneLoader.ImportMeshAsync("", "/models/", "Barricade.glb", scene).then((result) => {
                            var mesh = result.meshes[0];
                            mesh.position.z=3.8-2.6*(j-1);
                            mesh.position.x=positions.at(i);
                            mesh.rotationQuaternion=false;
                            mesh.rotation.y=3.14;
                            var down=false;
                            scene.onAfterRenderObservable.add(function(){
                                if(!down){
                                    if(j==4&&fail1){   //j1
                                        if(mesh.intersectsMesh(camerabox1,false)){
                                            mesh.rotation.z=1.47;
                                            down=true;
                                            metal.play();
                                        }
                                    }else if(j==3&&fail2){   //j1
                                        if(mesh.intersectsMesh(camerabox2,false)){
                                            mesh.rotation.z=1.47;
                                            down=true;
                                            metal.play();
                                        }
                                    }else if(j==2&&fail3){   //j1
                                        if(mesh.intersectsMesh(camerabox3,false)){
                                            mesh.rotation.z=1.47;
                                            down=true;
                                            metal.play();
                                        }
                                    }else if(j==1&&fail4){   //j1
                                        if(mesh.intersectsMesh(camerabox4,false)){
                                            mesh.rotation.z=1.47;
                                            down=true;
                                            metal.play();
                                        }
                                    }
                                }
                            });
                        });
                        var limitBox = BABYLON.MeshBuilder.CreateBox("startBox", { height: 2 , width:0.2,depth:2}, scene);
                        limitBox.position.x = positions.at(i);
                        limitBox.position.z=-3.8+2.5*(j-1);
                        limitBox.isVisible=false;
                        if(j==1) boxs1.push(limitBox);
                        if(j==2) boxs2.push(limitBox);
                        if(j==3) boxs3.push(limitBox);
                        else boxs4.push(limitBox);
                    }
                    
                }
            }
        }
        for(let i=0;i<2;i++){
            var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 370, height: 6 }, scene);
            grad1.material = this.CreateGradGroundMaterial();
            grad1.position.y=(i+1)*3;
            grad1.position.z=37.2+10*i;
            var wall = BABYLON.MeshBuilder.CreateGround("wall", { width: 370, height: 25 }, scene);
            wall.material = this.CreateWallMaterial();
            wall.position.z=-40.5+81*i;
            var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 370, height: 6 }, scene);
            grad1.material = this.CreateGradGroundMaterial();
            grad1.position.y=(i+1)*3;
            grad1.position.z=-37.2-10*i;
            var wall = BABYLON.MeshBuilder.CreateGround("wall", { width: 370, height: 25 }, scene);
            wall.material = this.CreateWallMaterial();
            wall.position.z=-55.5+111.03*i;
            wall.rotation.x=1.57;
            var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 6, height: 100 }, scene);
            grad1.material = this.CreateGradGroundMaterial();
            grad1.position.y=(i+1)*3;
            grad1.position.x=179.5+10*i;
            var wall = BABYLON.MeshBuilder.CreateGround("wall", { width: 100, height: 25 }, scene);
            wall.material = this.CreateWallMaterial();
            wall.position.x=180-360*i;
            wall.rotation.y=1.57;
            var grad1 = BABYLON.MeshBuilder.CreateGround("grad1", { width: 6, height: 100 }, scene);
            grad1.material = this.CreateGradGroundMaterial();
            grad1.position.y=(i+1)*3;
            grad1.position.x=-179.5-10*i;
            var wall = BABYLON.MeshBuilder.CreateGround("wall", { width: 100, height: 25 }, scene);
            wall.material = this.CreateWallMaterial();
            wall.position.x=-198.1+396.2*i;
            wall.rotation.x=1.57;
            wall.rotation.y=1.57;
            for(let j=0;j<2;j++){
                var cornwall = BABYLON.MeshBuilder.CreateGround("wall", { width: 25, height: 27 }, scene);
                cornwall.material = this.CreateWallMaterial();
                cornwall.position.x=-183+363*i;
                cornwall.rotation.x=1.57;
                cornwall.position.z=34-68*j;
                var cornwall = BABYLON.MeshBuilder.CreateGround("wall", { width: 25, height: 27 }, scene);
                cornwall.material = this.CreateWallMaterial();
                cornwall.position.x=-170.5+338*i;
                cornwall.rotation.x=1.57;
                cornwall.rotation.y=1.57;
                cornwall.position.z=46.5-93*j;
            }
        }
        for(let i=0;i<19;i++){
            const pub = BABYLON.MeshBuilder.CreateGround("pub", { width: 18, height: 1.24 }, scene);
            pub.position.z=28;
            pub.position.x=18*i-170;
            pub.rotation.x=-1.47;
            pub.position.y=0.62
            pub.material = this.CreatePubMaterial();
            scene.onAfterRenderObservable.add(function(){
                pub.position.x+=0.05;
                if(pub.position.x>170){
                    pub.position.x=-170;
                }
            })
            const pub2 = BABYLON.MeshBuilder.CreateGround("pub", { width: 18, height: 1.24 }, scene);
            pub2.position.z=-28;
            pub2.position.x=170-18*i;
            pub2.rotation.x=-1.47;
            pub2.rotation.y=3.14;
            pub2.position.y=0.62
            pub2.material = this.CreatePubMaterial();
            scene.onAfterRenderObservable.add(function(){
                pub2.position.x-=0.05;
                if(pub2.position.x<-170){
                    pub2.position.x=170;
                }
            })
        for(let i=0;i<5;i++){
            const pub3 = BABYLON.MeshBuilder.CreateGround("pub", { width: 18, height: 1.24 }, scene);
            pub3.position.z=-50+18*i;
            pub3.position.x=-170;
            pub3.rotation.x=-1.47;
            pub3.rotation.y=-Math.PI/2;
            pub3.position.y=0.62
            pub3.material = this.CreatePubMaterial();
            scene.onAfterRenderObservable.add(function(){
                pub3.position.z+=0.05;
                if(pub3.position.z>40){
                    pub3.position.z=-50;
                }
            })
            const pub4 = BABYLON.MeshBuilder.CreateGround("pub", { width: 18, height: 1.24 }, scene);
            pub4.position.z=50-18*i;
            pub4.position.x=170;
            pub4.rotation.x=-1.47;
            pub4.rotation.y=Math.PI/2;
            pub4.position.y=0.62
            pub4.material = this.CreatePubMaterial();
            scene.onAfterRenderObservable.add(function(){
                pub4.position.z-=0.05;
                if(pub4.position.z<-40){
                    pub4.position.z=50;
                }
            })
        }
        }
        //pelouse
        var grassGrd = BABYLON.MeshBuilder.CreateGround("Grassground", { width: 400, height: 300 }, scene);
        grassGrd.material = this.CreateGrassGroundMaterial();
        grassGrd.position.y=-0.1;

        //POUR TOUS LES JEU !!
        scene.onAfterRenderObservable.add(function(){
            if(finish&&!activated){
                clap1.play();activated=true;console.log("ok");
            }
        })

        //JEU 1
        if(this.jeut==1){
            var jumpsound = new BABYLON.Sound("jump", "sounds/jump.mp3", scene, null, { loop: false, autoplay: false, volume:0.4, length: 1.4, offset: 0.6});
            var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-99, 10, -20), scene);
            var runGrd = BABYLON.MeshBuilder.CreateGround("runGrd", { width: 300, height: 12 }, scene);
            runGrd.material = this.CreateGroundMaterial();
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 300, height: 0.1}, scene);
            traitGrd.position.y=0.01;
            var traitGrd1 = BABYLON.MeshBuilder.CreateGround("traitGrd1", { width: 300, height: 0.1}, scene);
            traitGrd1.position.y=0.01;
            traitGrd1.position.z=2.5;
            var traitGrd2 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 300, height: 0.1}, scene);
            traitGrd2.position.y=0.01;
            traitGrd2.position.z=-2.5;
            var traitGrd3 = BABYLON.MeshBuilder.CreateGround("traitGrd1", { width: 300, height: 0.1}, scene);
            traitGrd3.position.y=0.01;
            traitGrd3.position.z=5;
            var traitGrd4 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 300, height: 0.1}, scene);
            traitGrd4.position.y=0.01;
            traitGrd4.position.z=-5;
            var traitGrd5 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 0.1, height: 12}, scene);
            traitGrd5.position.y=0.01;
            traitGrd5.position.x=-100;
            var traitGrd6 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 0.1, height: 12}, scene);
            traitGrd6.position.y=0.01;
            traitGrd6.position.x=-150;
            var traitGrd7 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 0.1, height: 12}, scene);
            traitGrd7.position.y=0.01;
            traitGrd7.position.x=150;
            var traitGrd8 = BABYLON.MeshBuilder.CreateGround("traitGrd2", { width: 0.6, height: 12}, scene);
            traitGrd8.position.y=0.01;
            traitGrd8.position.x=145;
            var limitBox = BABYLON.MeshBuilder.CreateBox("startBox", { height: 5 , width:10,depth:12}, scene);
            limitBox.position.x = 150;
            limitBox.isVisible=false;
            var camerabox1 = BABYLON.MeshBuilder.CreateBox("startBox", { size:3}, scene); camerabox1.isVisible=false; camerabox1.position.z=-3.8;
            var camerabox2 = BABYLON.MeshBuilder.CreateBox("startBox", { size:3}, scene); camerabox2.isVisible=false; camerabox2.position.z=-1.8;
            var camerabox3 = BABYLON.MeshBuilder.CreateBox("startBox", { size:3}, scene); camerabox3.isVisible=false; camerabox3.position.z=1.8;
            var camerabox4 = BABYLON.MeshBuilder.CreateBox("startBox", { size:3}, scene); camerabox4.isVisible=false; camerabox4.position.z=3.8;

            SceneLoader.ImportMeshAsync("", "/models/", "gate.glb", scene).then((result) => {
                var mesh = result.meshes[1];
                mesh.rotationQuaternion = null;
                mesh.rotation.y=1.57;
                mesh.position.x=-145;
            });
            SceneLoader.ImportMeshAsync("", "/models/", "cam.glb", scene).then((result) => {
                result.meshes.forEach((mesh)=>{
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
                    mesh.rotation.y=-2.80;
                    mesh.position.z=14;
                    mesh.position.x=202;
                    mesh.position.y=1.3;
                })
            });
            SceneLoader.ImportMeshAsync("", "/models/", "cam.glb", scene).then((result) => {
                result.meshes.forEach((mesh)=>{
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
                    mesh.rotation.y=-2.80+1.8;
                    mesh.position.z=-14;
                    mesh.position.x=202;
                    mesh.position.y=1.3;
                })
            });
            SceneLoader.ImportMeshAsync("", "/models/", "cam.glb", scene).then((result) => {
                result.meshes.forEach((mesh)=>{
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
                    mesh.position.z=-14;
                    mesh.position.x=-137.5;
                    mesh.position.y=1.3;
                })
            });
            SceneLoader.ImportMeshAsync("", "/models/", "cam.glb", scene).then((result) => {
                result.meshes.forEach((mesh)=>{
                    mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
                    mesh.rotation.y=3.14;
                    mesh.position.z=14;
                    mesh.position.x=-137.5;
                    mesh.position.y=1.3;
                })
            });

            //PLAYER
            SceneLoader.ImportMeshAsync("", "/models/", "player1bis.glb", scene).then((result) => {  //PLAYER 1
                var mesh = result.meshes[0];
                var anim = result.animationGroups;
                mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/2);
                mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                mesh.position.z=-3.8;
                mesh.position.x=-100;
                anim[3].play(true);
                var started=false;
                var injump=false;
                var jumped=false;
                var score = 20;
                const jumpAnim = anim[1].targetedAnimations[0].animation;
                const jumpEvt = new AnimationEvent(
                    44,
                    () => {
                        anim.forEach((an) => an.stop());
                        jumped=false;
                        anim[2].start(true);
                    },
                    false
                );
                const injumpEvt = new AnimationEvent(
                    15,
                    () => {
                        injump=true;
                    },
                    false
                );
                const offjumpEvt = new AnimationEvent(
                    30,
                    () => {
                        injump=false;
                    },
                    false
                );
                jumpAnim.addEvent(jumpEvt);
                jumpAnim.addEvent(offjumpEvt);
                jumpAnim.addEvent(injumpEvt);
                const failAnim = anim[0].targetedAnimations[0].animation;
                const failEvt = new AnimationEvent(
                    25,
                    () => {
                        anim[0].stop();
                        fail1 = false;
                        anim[2].start(true);
                    },
                    false
                );
                failAnim.addEvent(failEvt);
                scene.onAfterRenderObservable.add(function () {
                    camerabox1.position.x=mesh.position.x;
                    if (started){
                        if(!fail1)mesh.position.x+=0.18;
                        boxs1.forEach((box) => {
                            if(!injump){
                                if(mesh.intersectsMesh(box, false)){
                                    boxs1.splice(boxs1.indexOf(box))
                                    anim[1].stop();
                                    jumped=false;
                                    anim[2].stop()
                                    fail1=true;
                                    anim[0].start(false);
                                    score-=1; 
                                    camerabox1.position.y=1;
                                }
                                score1.forEach(function(scor){scor.innerText=score+"/20";})
                            }
                        });
                        if(mesh.intersectsMesh(limitBox, false)){
                            anim[1].stop();
                            jumped=false;
                            anim[2].stop()
                            var listbox=[camerabox1.position.x,camerabox2.position.x,camerabox3.position.x,camerabox4.position.x];
                            var max = Math.max(...listbox);
                            anim[3].start(true);
                            if(max==camerabox1.position.x){
                                anim[3].start(true);
                                wintext.innerText = "FÉLICITATIONS JOUEUR 4";

                            }else{
                                anim[3].goToFrame(15)
                                anim[3].stop();
                            }
                            started=false;
                        }
                    }
                })
                canvas.addEventListener("keydown", function (event) {  
                    if (started==false && event.key === " "){
                        gameinterface.classList.add("notplaying");
                        gameinterface.classList.remove("playing");
                        started=true;
                        anim.forEach((an) => an.stop());
                        anim[2].start(true);
                        canvas.addEventListener("keydown", function (event) {  
                            if (started && !jumped && !fail1 && event.key === "a" ){
                                jumpsound.play();
                                anim.forEach((an) => an.stop());
                                anim[1].start();
                                jumped=true;
                                

                            }
                        });
                    }
                });
                    
            
                
            });
            SceneLoader.ImportMeshAsync("", "/models/", "player2bis.glb", scene).then((result) => {  //PLAYER 2
                var mesh = result.meshes[0];
                var anim = result.animationGroups;
                mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/2);
                mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                mesh.position.z=-1.3;
                mesh.position.x=-100;
                anim[3].play(true);
                var started=false;
                var injump=false;
                var jumped=false;
                var score = 20;
                const jumpAnim = anim[1].targetedAnimations[0].animation;
                const jumpEvt = new AnimationEvent(
                    44,
                    () => {
                        anim.forEach((an) => an.stop());
                        jumped=false;
                        anim[2].start(true);
                    },
                    false
                );
                const injumpEvt = new AnimationEvent(
                    15,
                    () => {
                        injump=true;
                    },
                    false
                );
                const offjumpEvt = new AnimationEvent(
                    30,
                    () => {
                        injump=false;
                    },
                    false
                );
                jumpAnim.addEvent(jumpEvt);
                jumpAnim.addEvent(offjumpEvt);
                jumpAnim.addEvent(injumpEvt);
                const failAnim = anim[0].targetedAnimations[0].animation;
                const failEvt = new AnimationEvent(
                    25,
                    () => {
                        anim[0].stop();
                        fail2 = false;
                        anim[2].start(true);
                    },
                    false
                );
                failAnim.addEvent(failEvt);
                scene.onAfterRenderObservable.add(function () {
                    camerabox2.position.x=mesh.position.x;
                    if (started){
                        if(!fail2)mesh.position.x+=0.18;
                        boxs2.forEach((box) => {
                            if(!injump){
                                if(mesh.intersectsMesh(box, false)){
                                    boxs2.splice(boxs2.indexOf(box))
                                    anim[1].stop();
                                    jumped=false;
                                    anim[2].stop()
                                    fail2=true;
                                    anim[0].start(false);
                                    score-=1;
                                    camerabox2.position.y=1;
                                }
                                score2.forEach(function(scor){scor.innerText=score+"/20";})
                            }
                        });
                        if(mesh.intersectsMesh(limitBox, false)){
                            anim[1].stop();
                            jumped=false;
                            anim[2].stop()
                            var listbox=[camerabox1.position.x,camerabox2.position.x,camerabox3.position.x,camerabox4.position.x];
                            var max = Math.max(...listbox);
                            anim[3].start(true);
                            if(max==camerabox2.position.x){
                                anim[3].start(true);
                                wintext.innerText = "FÉLICITATIONS JOUEUR 3";

                            }else{
                                anim[3].goToFrame(6)
                                anim[3].stop();
                            }
                            started=false;
                        }
                    }
                })
                canvas.addEventListener("keydown", function (event) {  
                    if (started==false && event.key === " "){
                        started=true;
                        anim.forEach((an) => an.stop());
                        anim[2].start(true);
                        canvas.addEventListener("keydown", function (event) {  
                            if (started && !jumped && !fail2 && event.key === "p" ){
                                jumpsound.play();
                                anim.forEach((an) => an.stop());
                                anim[1].start();
                                jumped=true;
                            }
                        });
                    }
                });
            });
            SceneLoader.ImportMeshAsync("", "/models/", "player3bis.glb", scene).then((result) => {  //PLAYER 3 (2)
                var mesh = result.meshes[0];
                var anim = result.animationGroups;
                mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/2);
                mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                mesh.position.z=1.3;
                mesh.position.x=-100;
                anim[3].play(true);
                var started=false;
                var injump=false;
                var jumped=false;
                var score = 20;
                const jumpAnim = anim[1].targetedAnimations[0].animation;
                const jumpEvt = new AnimationEvent(
                    44,
                    () => {
                        anim.forEach((an) => an.stop());
                        jumped=false;
                        anim[2].start(true);
                    },
                    false
                );
                const injumpEvt = new AnimationEvent(
                    15,
                    () => {
                        injump=true;
                    },
                    false
                );
                const offjumpEvt = new AnimationEvent(
                    30,
                    () => {
                        injump=false;
                    },
                    false
                );
                jumpAnim.addEvent(jumpEvt);
                jumpAnim.addEvent(offjumpEvt);
                jumpAnim.addEvent(injumpEvt);
                const failAnim = anim[0].targetedAnimations[0].animation;
                const failEvt = new AnimationEvent(
                    25,
                    () => {
                        anim[0].stop();
                        fail3 = false;
                        anim[2].start(true);
                    },
                    false
                );
                failAnim.addEvent(failEvt);
                scene.onAfterRenderObservable.add(function () {
                    camerabox3.position.x=mesh.position.x;
                    if (started){
                        if(!fail3)mesh.position.x+=0.18;
                        boxs3.forEach((box) => {
                            if(!injump){
                                if(mesh.intersectsMesh(box, false)){
                                    boxs3.splice(boxs3.indexOf(box))
                                    anim[1].stop();
                                    jumped=false;
                                    anim[2].stop()
                                    fail3=true;
                                    anim[0].start(false);
                                    score-=1;
                                    camerabox3.position.y=1;
                                }
                                score3.forEach(function(scor){scor.innerText=score+"/20";})
                            }
                        });
                        if(mesh.intersectsMesh(limitBox, false)){
                            anim[1].stop();
                            jumped=false;
                            anim[2].stop()
                            var listbox=[camerabox1.position.x,camerabox2.position.x,camerabox3.position.x,camerabox4.position.x];
                            var max = Math.max(...listbox);
                            anim[3].start(true);
                            if(max==camerabox3.position.x){
                                anim[3].start(true);
                                wintext.innerText = "FÉLICITATIONS JOUEUR 2";

                            }else{
                                anim[3].goToFrame(4)
                                anim[3].stop();
                            }
                            started=false;
                        }
                    }
                })
                canvas.addEventListener("keydown", function (event) {  
                    if (started==false && event.key === " "){
                        started=true;
                        anim.forEach((an) => an.stop());
                        anim[2].start(true);
                        canvas.addEventListener("keydown", function (event) {  
                            if (started && !jumped && !fail3 && event.key === "w" ){
                                jumpsound.play();
                                anim.forEach((an) => an.stop());
                                anim[1].start();
                                jumped=true;
                            }
                        });
                    }
                });
            });
            SceneLoader.ImportMeshAsync("", "/models/", "player4bis.glb", scene).then((result) => {  //PLAYER 4
                var mesh = result.meshes[0];
                var anim = result.animationGroups;
                mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/2);
                mesh.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
                mesh.position.z=3.8;
                mesh.position.x=-100;
                anim[3].play(true);
                var started=false;
                var injump=false;
                var jumped=false;
                var score = 20;
                const jumpAnim = anim[1].targetedAnimations[0].animation;
                const jumpEvt = new AnimationEvent(
                    44,
                    () => {
                        anim.forEach((an) => an.stop());
                        jumped=false;
                        anim[2].start(true);
                    },
                    false
                );
                const injumpEvt = new AnimationEvent(
                    15,
                    () => {
                        injump=true;
                    },
                    false
                );
                const offjumpEvt = new AnimationEvent(
                    30,
                    () => {
                        injump=false;
                    },
                    false
                );
                jumpAnim.addEvent(jumpEvt);
                jumpAnim.addEvent(offjumpEvt);
                jumpAnim.addEvent(injumpEvt);
                const failAnim = anim[0].targetedAnimations[0].animation;
                const failEvt = new AnimationEvent(
                    25,
                    () => {
                        anim[0].stop();
                        fail4 = false;
                        anim[2].start(true);
                    },
                    false
                );
                failAnim.addEvent(failEvt);
                scene.onAfterRenderObservable.add(function () {
                    camerabox4.position.x=mesh.position.x;
                    if (started){
                        if(!fail4)mesh.position.x+=0.18;
                        boxs4.forEach((box) => {
                            if(!injump){
                                if(mesh.intersectsMesh(box, false)){
                                    boxs4.splice(boxs4.indexOf(box))
                                    anim[1].stop();
                                    jumped=false;
                                    anim[2].stop()
                                    fail4=true;
                                    anim[0].start(false);
                                    score-=1;
                                    camerabox4.position.y=1;
                                }
                                score4.forEach(function(scor){scor.innerText=score+"/20";})
                            }
                        });
                        if(mesh.intersectsMesh(limitBox, false)){
                            anim[1].stop();
                            jumped=false;
                            anim[2].stop()
                            var listbox=[camerabox1.position.x,camerabox2.position.x,camerabox3.position.x,camerabox4.position.x];
                            var max = Math.max(...listbox);
                            anim[3].start(true);
                            if(max==camerabox4.position.x){
                                anim[3].start(true);
                                wintext.innerText = "FÉLICITATIONS JOUEUR 1";

                            }else{
                                anim[3].goToFrame(10)
                                anim[3].stop();
                            }
                            started=false;
                        }
                    }
                })
                canvas.addEventListener("keydown", function (event) {  
                    if (started==false && event.key === " "){
                        started=true;
                        anim.forEach((an) => an.stop());
                        anim[2].start(true);
                        canvas.addEventListener("keydown", function (event) {  
                            if (started && !jumped && !fail4 && event.key === "n" ){
                                jumpsound.play();
                                anim.forEach((an) => an.stop());
                                anim[1].start();
                                jumped=true;
                            }
                        });
                    }
                });
            });
            


            scene.onAfterRenderObservable.add(function () {
                var listbox=[camerabox1.position.x,camerabox2.position.x,camerabox3.position.x,camerabox4.position.x];
                var max = Math.max(...listbox);
                var min = Math.min(...listbox)
                var center = (max+min)/2;
                camera.setTarget(new BABYLON.Vector3(center,0,0));
                camera.position.y=10;
                if(center>=100&&center<130){
                    camera.position.z=-36;
                    camera.position.x=100;
                    camera.position.y=6;
                }else if(center>143){
                    camera.position.x=160;
                    camera.position.y=3;
                    camera.position.z=0
                    camera.setTarget(new BABYLON.Vector3(center,3,0));
                    if(center>145){
                        end1.classList.remove("notplaying");
                        interface1.classList.add("notplaying");
                        finish=true;
                    }
                }else if(center<-95){
                    camera.position.y=3;
                    camera.position.z=0
                    camera.position.x=-115;
                    camera.setTarget(new BABYLON.Vector3(center,3,0));
                } else if(center<100&&center>50){
                    camera.position.z=25
                    camera.position.z+=(max-min)/4;
                    camera.position.x=center
                } else {
                    camera.position.z=-25;
                    camera.position.z-=(max-min)/4;
                    camera.position.x=center
                }
            });
        }

        //JEU 2
        if(this.jeut==2){
            var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-30, 10, -20), scene);
            camera.attachControl();
            var runGrd = BABYLON.MeshBuilder.CreateGround("runGrd", { width: 60, height: 10 }, scene);
            runGrd.material = this.CreateGroundMaterial();
            runGrd.position.x=-60;
            runGrd.position.y=0.008;
            for(let i=0;i<29;i++){
                var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 10+i*(1.2), height: (i%4==0? 0.3:0.1)}, scene);
                traitGrd.position.y=0.01;
                traitGrd.rotation.y=1.57;
                traitGrd.position.x=-30+i*5;
            }
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 142, height: 0.3}, scene);
            traitGrd.position.y=0.005;
            traitGrd.position.x=40;
            traitGrd.position.z=13.5;
            traitGrd.rotation.y=-0.1212;
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 142, height: 0.3}, scene);
            traitGrd.position.y=0.005;
            traitGrd.position.x=40;
            traitGrd.position.z=-13.5;
            traitGrd.rotation.y=0.1212;
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 60, height: 0.3}, scene);
            traitGrd.position.y=0.01;
            traitGrd.position.x=-60;
            traitGrd.position.z=-5;
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 60, height: 0.3}, scene);
            traitGrd.position.y=0.01;
            traitGrd.position.x=-60;
            traitGrd.position.z=5;
            var traitGrd = BABYLON.MeshBuilder.CreateGround("traitGrd", { width: 10, height: 0.3}, scene);
            traitGrd.position.y=0.01;
            traitGrd.position.x=-90;
            traitGrd.rotation.y=1.57;


        }
        return scene;
    }

    CreatePubMaterial() { 
        const Mat = new BABYLON.StandardMaterial("pub",this.scene);
        const diffuseTex = new BABYLON.Texture(pubList[Math.floor(Math.random()*6)], this.scene);
        Mat.diffuseTexture = diffuseTex;
        return Mat
    }
    CreateCrowdMaterial() {
        const Mat = new BABYLON.StandardMaterial("GrdMat", this.scene);
        var col = 0.5*(Math.random()-0.5)
        Mat.diffuseColor = new BABYLON.Color3(0.5+col, 0.4+col, 0.2+col);
        return Mat;
    }

    CreateWallMaterial() {
        const GrdMat = new BABYLON.StandardMaterial("GrdMat", this.scene);
        const diffuseTex = new BABYLON.Texture("./textures/steel.jpg",this.scene)
        GrdMat.backFaceCulling = false;
        diffuseTex.uScale=10;
        diffuseTex.vScale=1;
        GrdMat.diffuseTexture= diffuseTex;
        return GrdMat;
    }

    CreateBendMaterial() {
        const GrdMat = new BABYLON.StandardMaterial("GrdMat", this.scene);
        GrdMat.wireframe = true;
        
        GrdMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        return GrdMat;
    }

    CreateBendedMaterial() {
        const GrdMat = new BABYLON.StandardMaterial("GrdMat", this.scene);
        GrdMat.backFaceCulling = false;
        const diffuseTex = new BABYLON.Texture("./textures/steel.jpg",this.scene)
        diffuseTex.uScale=10;
        diffuseTex.vScale=0.25;
        GrdMat.diffuseTexture= diffuseTex;
        return GrdMat;
    }

    CreateStairMaterial() {
        const GradMat = new BABYLON.StandardMaterial("GradMat", this.scene);
        const  diffuseTex = new BABYLON.Texture("./textures/stairs.png",this.scene)
        GradMat.diffuseTexture= diffuseTex
        return GradMat;
    }

    CreateGradMaterial() {
        const GradMat = new BABYLON.StandardMaterial("GradMat", this.scene);
        const  diffuseTex = new BABYLON.Texture("./textures/gradin.png",this.scene)
        GradMat.diffuseTexture= diffuseTex
        return GradMat;
    }

    CreateGradGroundMaterial() {
        const GradGroundMat = new BABYLON.StandardMaterial("GradGroundMat", this.scene);
        const diffuseTex = new BABYLON.Texture("./textures/concrete.jpg",this.scene)
        diffuseTex.uScale=20;
        diffuseTex.vScale=0.1;
        GradGroundMat.diffuseTexture= diffuseTex
        return GradGroundMat;
    }

    CreateGroundMaterial() {
        const runGrdMat = new BABYLON.StandardMaterial("runGrdMat", this.scene);
        const  diffuseTex = new BABYLON.Texture("./textures/red_sand.jpg",this.scene)
        diffuseTex.uScale=10;
        runGrdMat.diffuseTexture= diffuseTex
        return runGrdMat;
    }

    CreateGrassGroundMaterial() {
        const grassGrdMat = new BABYLON.StandardMaterial("grassGrdMat", this.scene);
        const  diffuseTex = new BABYLON.Texture("./textures/Grass_001_COLOR.jpg",this.scene)
        diffuseTex.uScale=70;
        diffuseTex.vScale=70;
        grassGrdMat.diffuseTexture= diffuseTex;
        return grassGrdMat;
    }
}



