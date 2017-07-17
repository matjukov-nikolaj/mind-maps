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

}
