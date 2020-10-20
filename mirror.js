class Mirror {
    constructor(x1, y1, x2, y2, option = false) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.option = option;
    }

    draw() {
        if (this.option)
            stroke(255, 0, 0);
        else
            stroke(200, 0, 255);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}