const THREE = require("three");
const {CSS3DRenderer} = require('three/examples/jsm/renderers/CSS3DRenderer.js');
const {Controller} = require("./controller");
const {UI} = require("../ui/ui");

class MindARThree {
  constructor({container, uiLoading="yes", uiScanning="yes", uiError="yes", filterMinCF=null, filterBeta=null}) {
    this.container = container;
    this.ui = new UI({uiLoading, uiScanning, uiError});

    this.controller = new Controller({
      filterMinCF: filterMinCF,
      filterBeta: filterBeta,
    });
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.cssRenderer = new CSS3DRenderer({antialias: true });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera = new THREE.PerspectiveCamera();

    this.anchors = [];
    this.faceMeshes = [];

    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(this.cssRenderer.domElement);

    this.shouldFaceUser = true;

    window.addEventListener('resize', this._resize.bind(this));
  }

  async start() {
    this.ui.showLoading();
    await this._startVideo();
    await this._startAR();
    this.ui.hideLoading();
  }

  stop() {
    const tracks = this.video.srcObject.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.video.remove();
    this.controller.stopProcessVideo();
  }

  switchCamera() {
    this.shouldFaceUser = !this.shouldFaceUser;
    this.stop();
    this.start();
  }

  addFaceMesh() {
    const faceGeometry = this.controller.createThreeFaceGeometry(THREE);
    const faceMesh = new THREE.Mesh(faceGeometry, new THREE.MeshStandardMaterial({color: 0xffffff}));
    faceMesh.visible = false;
    faceMesh.matrixAutoUpdate = false;
    this.faceMeshes.push(faceMesh);
    return faceMesh;
  }

  addAnchor(landmarkIndex) {
    const group = new THREE.Group();
    group.matrixAutoUpdate = false;
    const anchor = {group, landmarkIndex, css: false};
    this.anchors.push(anchor);
    this.scene.add(group);
    return anchor;
  }

  addCSSAnchor(landmarkIndex) {
    const group = new THREE.Group();
    group.matrixAutoUpdate = false;
    const anchor = {group, landmarkIndex, css: true};
    this.anchors.push(anchor);
    this.cssScene.add(group);
    return anchor;
  }

  _startVideo() {
    return new Promise((resolve, reject) => {
      this.video = document.createElement('video');

      this.video.setAttribute('autoplay', '');
      this.video.setAttribute('muted', '');
      this.video.setAttribute('playsinline', '');
      this.video.style.position = 'absolute'
      this.video.style.top = '0px'
      this.video.style.left = '0px'
      this.video.style.zIndex = '-2'
	  this.video.style.width = "100%";
	  this.video.style.height = "100%";
      this.container.appendChild(this.video);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		this.ui.showCompatibility();
		reject();
		return;
      }

      navigator.mediaDevices.getUserMedia({audio: false, video: {
	facingMode: (this.shouldFaceUser? 'face': 'environment'),
      }}).then((stream) => {
	this.video.addEventListener( 'loadedmetadata', () => {
	  this.video.setAttribute('width', "100%");
	  this.video.setAttribute('height', "100%");
	  resolve();
	});
	this.video.srcObject = stream;
      }).catch((err) => {
	console.log("getUserMedia error", err);
	reject();
      });
    });
  }

  _startAR() {
    return new Promise(async (resolve, reject) => {
      const video = this.video;
      const container = this.container;

      this.controller.onUpdate = ({hasFace, estimateResult}) => {
	for (let i = 0; i < this.anchors.length; i++) {
	  if (this.anchors[i].css) {
	    this.anchors[i].group.children.forEach((obj) => {
	      obj.element.style.visibility = hasFace? "visible": "hidden";
	    });
	  } else {
	    this.anchors[i].group.visible = hasFace;
	  }
	}
	for (let i = 0; i < this.faceMeshes.length; i++) {
	  this.faceMeshes[i].visible = hasFace;
	}

	if (hasFace) {
	  const {metricLandmarks, faceMatrix, faceScale} = estimateResult;
	  for (let i = 0; i < this.anchors.length; i++) {
	    const landmarkIndex = this.anchors[i].landmarkIndex;
	    const landmarkMatrix = this.controller.getLandmarkMatrix(landmarkIndex);

	    if (this.anchors[i].css) {
	      const cssScale = 0.001;
	      const scaledElements = [
		cssScale * landmarkMatrix[0], cssScale * landmarkMatrix[1], landmarkMatrix[2], landmarkMatrix[3], 
		cssScale * landmarkMatrix[4], cssScale * landmarkMatrix[5], landmarkMatrix[6], landmarkMatrix[7], 
		cssScale * landmarkMatrix[8], cssScale * landmarkMatrix[9], landmarkMatrix[10], landmarkMatrix[11], 
		cssScale * landmarkMatrix[12], cssScale * landmarkMatrix[13], landmarkMatrix[14], landmarkMatrix[15] 
	      ]
	      this.anchors[i].group.matrix.set(...scaledElements);
	    } else {
	      this.anchors[i].group.matrix.set(...landmarkMatrix);
	    }
	  }
	  for (let i = 0; i < this.faceMeshes.length; i++) {
	    this.faceMeshes[i].matrix.set(...faceMatrix);
	  }
	}
      }
      this._resize();
      await this.controller.setup(video);

      const {fov, aspect, near, far} = this.controller.getCameraParams();
      this.camera.fov = fov;
      this.camera.aspect = aspect;
      this.camera.near = near;
      this.camera.far = far;
      this.camera.updateProjectionMatrix();

	  const parentHeight = this.video.parentElement.clientHeight;
	  const parentWidth = window.innerWidth;

      this.renderer.setSize(parentWidth, parentHeight);
      this.cssRenderer.setSize(parentWidth, parentHeight);

      await this.controller.dummyRun(video);

      this._resize();
      this.controller.processVideo(video);
      resolve();
    });
  }

  _resize() {
    const {renderer, cssRenderer, camera, container, video} = this;
    if (!video) return;

    let vw, vh; // display css width, height
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = container.clientWidth / container.clientHeight;
    if (videoRatio > containerRatio) {
      vh = container.clientHeight;
      vw = vh * videoRatio;
    } else {
      vw = container.clientWidth;
      vh = vw / videoRatio;
    }

    renderer.domElement.style.display = "none";
    const cssCanvas = cssRenderer.domElement;

    cssCanvas.style.position = 'absolute';
    cssCanvas.style.left = "0px";
    cssCanvas.style.top = "0px";
  }
}

if (!window.MINDAR) {
  window.MINDAR = {};
}
if (!window.MINDAR.FACE) {
  window.MINDAR.FACE = {};
}

window.MINDAR.FACE.MindARThree = MindARThree;
window.MINDAR.FACE.THREE = THREE;
