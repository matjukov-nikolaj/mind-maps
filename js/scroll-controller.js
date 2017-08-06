class ScrollController {
    constructor() {
        this.canvasDiv = document.querySelector('#canvasDiv');
        this.scrollLeft = 0;
        this.scrollTop = configRightMap.Y_LROOT - configRightMap.ROOT_MARGIN_TOP;
        this.scrollCanvas({x: 0, y: 0});
        this.addDivListeners();
        this.lastX = 0;
        this.lastY = 0;
        this.dragging = false;
    }

    scrollCanvas(delta) {
        this.scrollLeft = Math.max(0, this.scrollLeft + delta.x);
        this.scrollTop = Math.max(0, this.scrollTop + delta.y);
        this.canvasDiv.scrollLeft = this.scrollLeft;
        this.canvasDiv.scrollTop = this.scrollTop;
    }

    addDivListeners() {
        this.canvasDiv.addEventListener('mousedown', (e) => {
            this.dragging = true;
            this.lastY = e.clientY;
            this.lastX = e.clientX;
        }, false);

        this.canvasDiv.addEventListener('mousemove', (e) => {
            if (this.dragging) {
                let delta =
                    {
                        x: this.lastX - e.clientX,
                        y: this.lastY - e.clientY,
                    };
                this.lastX = e.clientX;
                this.lastY = e.clientY;
                this.scrollCanvas(delta);
                this.canvasDiv.setAttribute('class', 'mouse_move');
            }
        }, false);

        window.addEventListener('mouseup', () => {
            this.dragging = false;
            this.canvasDiv.removeAttribute('class');
        }, false);
    }
}