class scrollController {
    constructor() {
        this.canvasDiv = document.querySelector('#canvasdiv');
        this.scrollLeft = 0;
        this.scrollTop = config.Y_LROOT - 400;
        this.scrollCanvas({x: 0, y: 0});
        this.addDivListeners();
    }

    scrollCanvas(delta) {
        this.scrollLeft = Math.max(0, this.scrollLeft + delta.x);
        this.scrollTop = Math.max(0, this.scrollTop + delta.y);
        this.canvasDiv.scrollLeft = this.scrollLeft;
        this.canvasDiv.scrollTop = this.scrollTop;
    }

    addDivListeners() {
        let lastX = 0;
        let lastY = 0;
        let dragging = false;

        this.canvasDiv.addEventListener('mousedown', (e) => {
            let evt = e || event;
            dragging = true;
            lastY = evt.clientY;
            lastX = evt.clientX;
            e.preventDefault();
        }, false);

        this.canvasDiv.addEventListener('mousemove', (e) => {
            let evt = e || event;
            if (dragging) {
                let delta =
                    {
                        x: lastX - evt.clientX,
                        y: lastY - evt.clientY,
                    };
                lastX = evt.clientX;
                lastY = evt.clientY;
                this.scrollCanvas(delta);
            }
            e.preventDefault();
        }, false);

        window.addEventListener('mouseup', () => {
            dragging = false;
        }, false);
    }

}