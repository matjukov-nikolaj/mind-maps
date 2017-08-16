class Rect {
    constructor(leftTop, rightBottom) {
        this.leftTop = leftTop;
        this.rightBottom = rightBottom;
    }

    pointInRect(point) {
        return (point.x >= this.leftTop.x && point.x <= this.rightBottom.x)
            && (point.y >= this.leftTop.y && point.y <= this.rightBottom.y);
    }

    width() {
        return this.rightBottom.x - this.leftTop.x;
    }

    height() {
        return this.rightBottom.y - this.leftTop.y;
    }

    moveTo(x, y) {
        const width = this.width();
        const height = this.height();
        this.leftTop.x = x;
        this.leftTop.y = y;
        this.rightBottom.x = x + width;
        this.rightBottom.y = y + height;
    }

    intersectionArea(rect) {
        let x1 = rect.leftTop.x;
        let y1 = rect.leftTop.y;
        let x2 = x1+ rect.width();
        let y2 = y1 + rect.height();
        if (this.leftTop.x > x1) {
            x1 = this.leftTop.x;
        }
        if (this.leftTop.y > y1) {
            y1 = this.leftTop.y;
        }
        if (this.rightBottom.x < x2) {
            x2 = this.rightBottom.x;
        }
        if (this.rightBottom.y < y2) {
            y2 = this.rightBottom.y;
        }
        return (x2 <= x1 || y2 <= y1) ? 0 : ((x2-x1) * (y2-y1));
    }

}
