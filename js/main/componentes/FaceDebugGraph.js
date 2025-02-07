export default class FaceDebugGraph {
    constructor(backendDescriptors = [], capturedColor = "blue", backendColor = "red", lineColor = "black") {
        this.backendDescriptors = backendDescriptors;
        this.capturedColor = capturedColor;
        this.backendColor = backendColor;
        this.lineColor = lineColor;
        this.lines = [];
        this.capturedPoints = [];
        this.backendPoints = [];
        this.isRendered = false;
    }

    processBackendDescriptors() {
        if (!Array.isArray(this.backendDescriptors) || this.backendDescriptors.length === 0) {
            return { capturedPoints: [], backendPoints: [] };
        }

        const capturedPoints = [];
        const backendPoints = [];

        this.backendDescriptors.forEach(({ vec1, vec2, diff }, index) => {
            capturedPoints.push({ x: vec1, y: diff, z: vec1, id: `V1 #${index}` });
            backendPoints.push({ x: vec2, y: diff, z: vec2+0.1, id: `V2 #${index}` });
        });

        this.capturedPoints = capturedPoints;
        this.backendPoints = backendPoints;
    }

    render(containerId = "faceDebugGraphContainer") {
        if (this.isRendered) return;

        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = containerId;
            container.style.width = "80%";
            container.style.height = "600px";
            container.style.margin = "auto";
            container.style.border = "1px solid #ccc";
            container.style.padding = "10px";
            container.style.top= "90px";
            document.body.appendChild(container);
        }

        this.processBackendDescriptors();

        const traceCaptured = {
            x: this.capturedPoints.map(p => p.x),
            y: this.capturedPoints.map(p => p.y),
            z: this.capturedPoints.map(p => p.z),
            text: this.capturedPoints.map(p => p.id),
            mode: "markers",
            type: "scatter3d",
            marker: { size: 6, color: this.capturedColor, opacity: 0.8 },
            name: "Vetor Capturado",
        };

        const traceBackend = {
            x: this.backendPoints.map(p => p.x),
            y: this.backendPoints.map(p => p.y),
            z: this.backendPoints.map(p => p.z),
            text: this.backendPoints.map(p => p.id),
            mode: "markers",
            type: "scatter3d",
            marker: { size: 6, color: this.backendColor, opacity: 0.8 },
            name: "Vetor Banco",
        };

        this.data = [traceCaptured, traceBackend];
        this.layout = {
            title: "Distância euclidiana",
            scene: {
                xaxis: { title: "Vec1 (Capturado)" },
                yaxis: { title: "Vec2 (Banco)" },
                zaxis: { title: "Diferença (Diff)" },
            },
            margin: { l: 0, r: 0, b: 0, t: 30 },
        };

        Plotly.newPlot(containerId, this.data, this.layout).then(() => {
            this.isRendered = true;
            this.fixPassiveEvent(containerId);
            container.on("plotly_click", (data) => this.onPointClick(data, containerId));
        });
    }

    onPointClick(data, containerId) {
        if (!data || !data.points || !data.points[0]) {
            console.warn("⚠ Nenhum ponto válido foi clicado.");
            return;
        }

        const clickedIndex = data.points[0].pointNumber;
        if (!Number.isInteger(clickedIndex)) {
            console.error("⚠ Índice de ponto inválido:", clickedIndex);
            return;
        }

        if (!this.capturedPoints[clickedIndex] || !this.backendPoints[clickedIndex]) {
            console.warn(`⚠ Ponto não encontrado para index ${clickedIndex}`);
            return;
        }

        const capturedPoint = this.capturedPoints[clickedIndex];
        const backendPoint = this.backendPoints[clickedIndex];

        console.log(`🔹 Conectando ${capturedPoint.id} ↔ ${backendPoint.id}`);

        const lineTrace = {
            x: [capturedPoint.x, backendPoint.x],
            y: [capturedPoint.y, backendPoint.y],
            z: [capturedPoint.z, backendPoint.z],
            mode: "lines",
            type: "scatter3d",
            line: { width: 3, color: this.lineColor },
            name: `Conexão ${capturedPoint.id} ↔ ${backendPoint.id}`,
        };

        const existingLine = this.lines.find(line => line.name === lineTrace.name);
        if (!existingLine) {
            this.lines.push(lineTrace);
            Plotly.addTraces(containerId, [lineTrace]);
        }
    }

    fixPassiveEvent(containerId) {
        setTimeout(() => {
            document.querySelectorAll(`#${containerId} canvas`).forEach(canvas => {
                canvas.addEventListener("wheel", (event) => {
                }, { passive: true });
            });
        }, 1000);
    }
}
