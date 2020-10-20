class Ray {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.dir = createVector(1, 0);
        this.collisions = [];
        this.pointsAtOption = false;
    }

    draw() {
        this.collisions.forEach((c, i) => {
            push();
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = 'white';

            strokeWeight(2);

            stroke(255);
            line(c.x1, c.y1, c.x2, c.y2);
            pop();
        })
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        strokeWeight(12);
        line(0, 0, this.dir.x * 10, this.dir.y * 10);
        pop();
    }

    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    checkPointing() {
        if (this.collisions.length == 0) return;
        let collision = this.collisions[this.collisions.length - 1];

        if (collision.mirror.option)
            this.pointsAtOption = true;
        else
            this.pointsAtOption = false;
        return collision.mirror.option
    }

    cast(mirror, isAdding) {
        if ((this.collisions.length > 15 || this.pointsAtOption) && isAdding) return;
        const x1 = mirror.x1;
        const y1 = mirror.y1;
        const x2 = mirror.x2;
        const y2 = mirror.y2;


        let mirroDelta = createVector(x2 - x1, y2 - y1).normalize();
        let normal = createVector(- mirroDelta.y, mirroDelta.x);
        let incidence;

        let x3;
        let y3;
        let x4;
        let y4;
        let dir;

        if (this.collisions.length == 0 || !isAdding) {
            x3 = this.pos.x;
            y3 = this.pos.y;
            x4 = this.pos.x + this.dir.x;
            y4 = this.pos.y + this.dir.y;
            incidence = p5.Vector.mult(this.dir, -1);
        }
        else {
            let c = this.collisions[this.collisions.length - 1];
            x3 = c.x2;
            y3 = c.y2;
            x4 = c.x2 + c.dir.x;
            y4 = c.y2 + c.dir.y;
            incidence = p5.Vector.mult(c.dir, -1);
        }

        let dot = incidence.dot(normal);
        dir = createVector(2 * normal.x * dot - incidence.x, 2 * normal.y * dot - incidence.y)


        const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (d == 0) return;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
        if (t > 0 && t < 1 && u > 0) {
            let pt = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
            return { pt: pt, collision: { x1: x3, y1: y3, x2: x1 + t * (x2 - x1), y2: y1 + t * (y2 - y1), dir: dir, mirror: mirror }, dist: dist(x3, y3, pt.x, pt.y) };
        }
    }

    check() {
        if (this.collisions.length > 0) {
            const x1 = this.collisions[0].x1;
            const y1 = this.collisions[0].y1;
            const x2 = this.collisions[0].x2;
            const y2 = this.collisions[0].y2;

            const data = this.cast(this.collisions[0].mirror, false);
            let pt = data ? data.collision : null;

            if (!pt || pt.x1 != x1 || pt.x2 != x2 || pt.y1 != y1 || pt.y2 != y2) {
                this.pointsAtOption = false;
                this.collisions = [];
            }
        }
    }
}