class ScrollController {
    constructor(renderer) {
        this.canvasDiv = document.querySelector('#canvasDiv');
        this.scrollLeft = 0;
        this.scrollTop = rendererRootCfg.leftTop.y - rendererRootCfg.MARGIN_TOP;
        this._scrollCanvas({x: 0, y: 0});
        this._addDivListeners();
        this.lastX = 0;
        this.lastY = 0;
        this.dragging = false;
        this.renderer = renderer;
    }

    _scrollCanvas(delta) {
        this.scrollLeft = Math.max(0, this.scrollLeft + delta.x);
        this.scrollTop = Math.max(0, this.scrollTop + delta.y);
        this.canvasDiv.scrollLeft = this.scrollLeft;
        this.canvasDiv.scrollTop = this.scrollTop;
    }

    _addDivListeners() {
        this.canvasDiv.addEventListener('mousedown', (e) => {
            const canvas = this.canvasDiv.getElementsByTagName("canvas").item(0);
            const offset = new Point(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top);
            const checkPoint = new Point(e.clientX - offset.x, e.clientY - offset.y);
            if (this.renderer.findNodeByPoint(checkPoint))
            {
                return;
            }
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
                this._scrollCanvas(delta);
                this.canvasDiv.setAttribute('class', 'mouse_move');
            }
        }, false);

        window.addEventListener('mouseup', () => {
            this.dragging = false;
            this.canvasDiv.removeAttribute('class');
        }, false);
    }
}