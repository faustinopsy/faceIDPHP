export default class Camera {
    constructor() {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
    }

    async activateCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                this.videoElement.srcObject = stream;
            } catch (err) {
                console.error("Falha ao ativar a câmera:", err);
            }
        }
    }
    render() {
        const container = document.createElement('div');
        container.className = 'camera-container';
        container.appendChild(this.videoElement);
        return container;
    }
}
