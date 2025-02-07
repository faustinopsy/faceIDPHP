export default class ModelLoader {
    constructor(faceapi) {
        this.modelsLoaded = false;
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    async loadModels() {
        if (this.modelsLoaded) {
            return;
        }
        this.showLoadingIndicator();
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            await faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models")
            await faceapi.nets.faceRecognitionNet.loadFromUri("/models")
            this.modelsLoaded = true;
            console.log('Modelos de reconhecimento facial carregados.');
        } catch (error) {
            console.error("Falha ao carregar modelos face-api:", error);
            this.modelsLoaded = false;

        } finally {
            this.hideLoadingIndicator();
        }
    }
    showLoadingIndicator() {
        this.loadingIndicator.style.display = 'block';
    }

    hideLoadingIndicator() {
        this.loadingIndicator.style.display = 'none';
    }
    areModelsLoaded() {
        return this.modelsLoaded;
    }
}
