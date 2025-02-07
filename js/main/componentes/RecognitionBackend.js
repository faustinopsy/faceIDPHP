
import Modal from '../../utils/Modal.js';
import FaceDebugGraph from './FaceDebugGraph.js';
export default class RecognitionBackend {
    constructor(camera, apiStrategy,debugEnabled, navbar, onLoginSuccess) {
        this.apiStrategy = apiStrategy;
        this.camera = camera;
        this.faceapi = faceapi;
        this.camera.activateCamera();
        this.debugEnabled = debugEnabled;
        this.navbar = navbar;
        this.onLoginSuccess = onLoginSuccess;
        this.modal = new Modal();
    }

    async recognize() {
        const detection = await faceapi.detectSingleFace(
            this.camera.videoElement, 
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();
    
        if (!detection) {
            this.modal.exibeModal("Nenhum rosto detectado.");
            return;
        }
    
        const descriptor = Array.from(detection.descriptor);
    
        const response = await this.apiStrategy.logar({
            acao: 'login',
            descriptor: descriptor,
            debug: this.debugEnabled
        });
    
        if (response.status) {
              this.modal.exibeModal(`Rosto reconhecido: ${response.usuario.email} (${response.method} : ${response.distance.toFixed(3)})`);
              this.navbar.update(true);
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('user', response.usuario.id);
              this.onLoginSuccess();
        } else {
              this.modal.exibeModal("Rosto não reconhecido");
        }
    
        if (this.debugEnabled && response.debugPoints) {
            const debugGraph = new FaceDebugGraph(response.debugPoints, "green", "purple", "black");
            debugGraph.render();
        }
    }
    
    extractCapturedPoints(detection) {
        const points = [];
        if (detection.landmarks && detection.landmarks.positions) {
          detection.landmarks.positions.forEach(pos => {
            points.push({ x: pos.x, y: pos.y, z: 0 });
          });
        } else {
          const descriptor = detection.descriptor;
          const step = Math.floor(descriptor.length / 3);
          for (let i = 0; i < step; i++) {
            points.push({
              x: descriptor[i],
              y: descriptor[i + step],
              z: descriptor[i + 2 * step]
            });
          }
        }
        return points;
      }

    render() {
        const container = document.createElement('div');
        container.className = 'camera-container';
        container.appendChild(this.camera.render());
        const button = document.createElement('button');
        button.textContent = 'Reconhecer';
        button.onclick = () => this.recognize();
        container.appendChild(button);
        return container;
    }
}
