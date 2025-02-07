
import Modal from '../../utils/Modal.js';
export default class FaceRegister {
    constructor(apiStrategy) {
        this.apiStrategy = apiStrategy;
        this.captureData = [];
        this.pontosData = [];
        this.formData = { email: '' };
        this.totalCaptures = 3;
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.initializeCamera();
        this.capturesInfo = null;
        this.modal = new Modal();
    }

    async initializeCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                this.videoElement.srcObject = stream;
            } catch (err) {
                console.error("Falha ao ativar a câmera:", err);
            }
        }
    }
    updateCapturesInfo() {
        if (this.capturesInfo) {
            this.capturesInfo.textContent = `Capturas: ${this.captureData.length} de ${this.totalCaptures}`;
        }
    }
    handleFormChange(event) {
        const { value } = event.target;
        this.formData.email = value; 
    }

    async handleSave() {
        console.log(this.formData)
        if (this.captureData.length === this.totalCaptures) {
            const usuario = { 
                email: this.formData.email,  
                rosto: this.captureData.map(descriptor => Array.from(descriptor))
            };
            const response = await this.apiStrategy.registrar(usuario);
            if (response) {  
                this.modal.exibeModal(response.message);
                this.captureData = [];
                this.formData = { email: '' };
                this.updateCapturesInfo();
                this.clearFormFields(); 
            }
            
        }
    }
    clearFormFields() {
        document.querySelector('input[name="email"]').value = '';
    }
    async captureFace() {
        if (this.captureData.length==3) {
            this.modal.exibeModal('Quantida de máxima de fotos atingida');
            return;
        }
        const detection = await faceapi.detectSingleFace(
            this.videoElement, 
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
            const descriptor = detection.descriptor;
            const landmarks = detection.landmarks;
            this.captureData.push(descriptor);
            console.log('Face captured successfully.');
            this.updateCapturesInfo();
        } else {
            this.modal.exibeModal('Nenhuma face detectada.');
        }
    }
   
    render() {
        const container = document.createElement('div');
        container.className = 'camera-container';
        container.appendChild(this.videoElement);

        this.capturesInfo = document.createElement('p');
        this.capturesInfo.textContent = `Capturas: ${this.captureData.length} de ${this.totalCaptures}`;
        container.appendChild(this.capturesInfo);

        const captureButton = document.createElement('button');
        captureButton.textContent = 'Capturar Face';
        captureButton.onclick = () => this.captureFace();
        container.appendChild(captureButton);

        const emailInput = document.createElement('input');
        emailInput.type = 'text';
        emailInput.name = 'email';
        emailInput.placeholder = 'E-mail';
        emailInput.onchange = (event) => this.handleFormChange(event);
        container.appendChild(emailInput);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar Dados';
        saveButton.onclick = () => this.handleSave();
        container.appendChild(saveButton);

        return container;
    }
}
