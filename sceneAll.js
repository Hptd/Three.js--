import * as thr from 'three'
// 是否增加{}作为引用需要查看源文件的输出形式
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// 场景基本设置
const scene = new thr.Scene();

// 添加摄像机
// const wid = 500;
// const hei = 300;
const wid = window.innerWidth;
const hei = window.innerHeight;
const camera = new thr.PerspectiveCamera(75, wid / hei, 0.1, 2000);
camera.position.set(150, 100, 100);
camera.lookAt(0, 50, 0);

// 使用gui可视化设置值；
const gui = new GUI();
gui.domElement.style.right = "6px"; // 距离页边距离；
gui.domElement.style.width = "300px"; // gui显示的长度；

// 新建子菜单进行分类：
const lightGui = gui.addFolder("灯光控制类");
const testGui = gui.addFolder("测试学习类");
const meshGui = gui.addFolder("物体类");
lightGui.close(); // 默认是关闭的状态；
testGui.close();
meshGui.close();
// 嵌套菜单，子菜单的子菜单；
const meshControlGui = meshGui.addFolder("控制类");
meshControlGui.close();

// 新建一个结构体
const guiObj = {
    x: 0,
    y: 0,
    bool: false,
}
testGui.add(guiObj, 'x', [0, 10, 20]).name("下拉菜单选择")
testGui.add(guiObj, 'y', {一: 30, 二: 40, 三: 50}).name("中文名称下拉菜单")
meshControlGui.add(guiObj, 'bool').name("小球是否运动");

// 添加灯光
const dirc = new thr.DirectionalLight(0xffffff, 1);

// 可视化控制灯光强度；
// 第一种形式：Slider
lightGui.add(dirc, 'intensity', 0, 2).name("平行光强度").step(0.1);
// 可视化控制平行光颜色；
// 第二种形式：颜色设置；
lightGui.addColor(dirc, 'color').name("平行光颜色");

const ambi = new thr.AmbientLight(0xffffff, 0.5);
// 可视化调整环境光强度；
lightGui.add(ambi, 'intensity', 0, 2).name("环境光强度");
dirc.position.set(300, 10, 100);
scene.add(dirc);
scene.add(ambi);

// 点光源
const pointLight = new thr.PointLight(0x00fff00, 20, 100, 2);
pointLight.position.set(130, 0, 0);// 放置于x轴上；
// 可视化点光源
const pointLightView = new thr.PointLightHelper(pointLight, 100);
scene.add(pointLightView);
scene.add(pointLight);

// 加载贴图
const textureLoader = new thr.TextureLoader();
const diffuseTex = textureLoader.load("../Texture/竹麻.jpg");
// 先允许开启图片阵列，然后设置阵列重复次数；
diffuseTex.wrapS = thr.RepeatWrapping;
diffuseTex.wrapT = thr.RepeatWrapping;
diffuseTex.repeat.set(2, 2);

// 添加测试物体-立方体
const object = new thr.BoxGeometry(100, 100, 100);
const material = new thr.MeshStandardMaterial({ 
    color: 0xffffff,
    map: diffuseTex,
    roughness: 0.4,
    metalness: 0.2,
    transparent: true,
    opacity: 1,
    });
const boxMesh = new thr.Mesh(object, material);
boxMesh.position.set(0, 0, 0);
boxMesh.scale.set(1, 0.3, 1);

// 添加球体
const sphere = new thr.SphereGeometry(30, 100, 100);
const sphereMaterial = new thr.MeshStandardMaterial(
    {
        color: 0x23a08a,
        roughness: 0.1,
        metalness: 0.7,
        transparent: true,
        opacity: 0.2,
    }
);
const sphereMesh = new thr.Mesh(sphere, sphereMaterial);
sphereMesh.position.set(0, 0, 100);

// 添加png图平面
const pngTextureLoad = new thr.TextureLoader();
const pngTex = pngTextureLoad.load("../Texture/PNG_test.png")
const pngPlane = new thr.PlaneGeometry(100, 100);
const pngPlaneMaterial = new thr.MeshBasicMaterial({
    transparent: true,
    map: pngTex,
    side: thr.DoubleSide,
})
const pngPlaneMesh = new thr.Mesh(pngPlane, pngPlaneMaterial);
pngPlaneMesh.position.set(0, 25, 200);
pngPlaneMesh.rotateY(Math.PI/2);

// uv 动画 ==> 传送带效果：
const chuansongdaiTexLoad = new thr.TextureLoader();
const chuansongdaiTex = chuansongdaiTexLoad.load("../Texture/传送带贴图.png")
chuansongdaiTex.wrapS = thr.RepeatWrapping;
chuansongdaiTex.wrapT = thr.RepeatWrapping;
chuansongdaiTex.repeat.set(10, 1);
// 增加传送带动画
function chuansongdaiAnimation()
{
    requestAnimationFrame(chuansongdaiAnimation)
    chuansongdaiTex.offset.x += 0.02;
}
chuansongdaiAnimation();

const chuansongdaiPlane = new thr.PlaneGeometry(200, 20);
const chuansongdaiMaterial = new thr.MeshBasicMaterial({
    transparent: true,
    map: chuansongdaiTex,
})
const chuansongdaiMesh = new thr.Mesh(chuansongdaiPlane, chuansongdaiMaterial);
chuansongdaiMesh.position.set(0, 10, -100);
chuansongdaiMesh.rotateX(-Math.PI/2);

// 可视化调整球体的大小；
// 第三种使用方式：配合函数.onChange(function(){  })
meshGui.add(sphereMesh.scale, "x", 0.2, 2).onChange(function(value)
{
    sphereMesh.scale.set(value, value, value);
}).name("球体大小")

// 增加坐标标尺
const axes = new thr.AxesHelper(200);

// 添加基准面
// thr.GridHelper(尺寸, 细分次数, 网格中线颜色, 网格颜色);
const ground = new thr.GridHelper(700, 30, 0x00eeee, 0x008800);
const groundHelper0 = new thr.Plane(new thr.Vector3(0, 1, 0), 0);
const groundHelper = new thr.PlaneHelper(groundHelper0, 500, 0xbbbbbb); //500: 尺寸；0xbbbbbb: 灰色

// 加载GLTF文件
const gltfLoader = new GLTFLoader();
const glotfModel = gltfLoader.load(
    "../GLTF/炎璃兽.gltf", 
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.2, 0.2, 0.2);
        model.position.set(10, 15, 0);
        model.rotateY(Math.PI/2);
        scene.add(model);
    }
);
// glotfModel.model.scale.set(0.4, 0.4, 0.4);

// 增加Mesh Group
const group = new thr.Group();
const groupSphereWorldRotation = new thr.Group();

groupSphereWorldRotation.add(sphereMesh);
group.add(boxMesh);
group.add(axes);
group.add(groundHelper);
group.add(pngPlaneMesh);
group.add(chuansongdaiMesh);
scene.add(ground); // 不可使用group的增加方式，只能使用scene.add();
scene.add(group);
scene.add(groupSphereWorldRotation);

// 增加渲染
const renderer = new thr.WebGLRenderer(
    {
        antialias: true, //抗锯齿开启
    }
);
renderer.setClearColor(0xb02e65, 0.6); // ClearColor 和 ClearAlpha的顺序不同，
// renderer.setClearAlpha(0.5);      //则渲染效果不同，Alpha在后则控制前面颜色的整体透明度；
renderer.setSize(wid, hei);
// 查看设备像素比
console.log("设备像素比", window.devicePixelRatio); // 1.375
// 设置设备像素比，必写内容；
renderer.setPixelRatio(window.devicePixelRatio);

// 由于下方的旋转动画增加了刷新，所以此处可以省略；
renderer.render(scene, camera);

// 新建一个时钟：
const clock = new thr.Clock();

// 使用Stats 模块实现性能监测
const stats = new Stats();
stats.setMode(0);// 设置初次打开时候的模式，0：帧率；1：一帧计算时间(毫秒)；2：缓存大小
document.body.appendChild(stats.domElement);

// 为球体增加旋转动画
function animationSphere()
{
    // 使用时钟工具测试渲染间隔和帧率（非准确算法）
    const splitTime = clock.getDelta() * 1000; // *1000由秒转换为毫秒
    // console.log("每帧花费时间", splitTime);
    // console.log("每秒渲染帧数", 1000 / splitTime);

    // 随动画实时刷新，如果没有动画则需要新建一个实时刷新函数；
    stats.update();
    
    requestAnimationFrame(animationSphere);
    // 新建一个位于原点的group，然后让整体group绕原点旋转；
    if(guiObj.bool)
    {
        groupSphereWorldRotation.rotation.y += 0.02;
    }
    renderer.render(scene, camera);
}
animationSphere();

// 添加到body
document.body.appendChild(renderer.domElement);

// 添加一个相机控件
const cameraControl = new OrbitControls(camera, renderer.domElement);
// 增加控件相机的目标点，原则上与默认的camera的目标点相同，且需要同时更新；
cameraControl.target.set(0, 50, 0);
cameraControl.update(); // 刷新；
cameraControl.addEventListener('change', function() //增加一个监听事件；
{
    // 由于动画的函数中一直在刷新画布，所以此处与常规渲染一样不需要刷新了；
    // 但是当没有动画函数一直在刷新画布，需要将下行的控件更新和常规画布更新都打开。
    renderer.render(scene, camera);// 重新刷新渲染场景；
})

// 增加一个窗口事件，当窗口尺寸发生变化时，实时更新
window.onresize = function()
{
    // 更新画布尺寸
    renderer.setSize(innerWidth, innerHeight);
    // 更新相机宽高比
    camera.aspect = innerWidth / innerHeight;
    // 更新相机投影矩阵：固定宽高比使其不发生变形；
    camera.updateProjectionMatrix();
}