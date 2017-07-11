class ScrollController {
    constructor() {
        this.canvasDiv = document.querySelector('#canvasdiv');
        this.scrollLeft = 0;
        this.scrollTop = config.Y_LROOT - config.ROOT_MARGIN_TOP;
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
            dragging = true;
            lastY = e.clientY;
            lastX = e.clientX;
            e.preventDefault();
        }, false);

        this.canvasDiv.addEventListener('mousemove', (e) => {
            if (dragging) {
                let delta =
                    {
                        x: lastX - e.clientX,
                        y: lastY - e.clientY,
                    };
                lastX = e.clientX;
                lastY = e.clientY;
                this.scrollCanvas(delta);
            }
            e.preventDefault();
        }, false);

        window.addEventListener('mouseup', () => {
            dragging = false;
        }, false);
    }

}