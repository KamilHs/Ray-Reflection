const canvasWidth = document.documentElement.clientWidth;
const canvasHeight = document.documentElement.clientHeight;

let ray;
let mirrors = [];

let textContainer;
let yes;
let no;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    renderDom();
    background(0);
    setTimeout(setMirrors, 100);
    ray = new Ray(canvasWidth - 100, 100);

}


function draw() {
    background(0);
    ray.draw();
    ray.check();

    let pointsAt = ray.checkPointing();

    if (pointsAt) {
        if (pointsAt == "yes")
            yes.addClass('active');

        else {
            no.addClass('active');
            noLoop();
        }
    } else
        yes.removeClass('active');



    let closest = null;
    let record = Number.MAX_SAFE_INTEGER;

    mirrors.forEach(mirror => {
        mirror.draw();
        const data = ray.cast(mirror, true);
        if (data && data.dist < record) {
            let lastCollision = ray.collisions[ray.collisions.length - 1];
            let collision = data.collision;
            if (ray.collisions.length == 0 || lastCollision.mirror != collision.mirror) {
                record = data.dist;
                closest = data;
            }
        }
    })

    if (closest) {
        ray.collisions.push(closest.collision);
        stroke(0, 0, 255);

        fill(0, 0, 255);
        ellipse(closest.pt.x, closest.pt.y, 29, 29)
    }
}


function renderDom() {
    textContainer = createDiv(`<p>Light up No</p>`);

    textContainer.addClass('center');

    yes = createButton(`Yes`);
    yes.addClass('yes');
    yes.addClass('option');


    no = createButton(`No`);
    no.addClass('no');
    no.addClass('option');

    no.mousePressed(function (e) {
        if (no.hasClass('active')) {
            noCanvas();
            textContainer.remove();
            yes.remove();
            no.remove();

            const congrats = createP(`
                Well Done!
            `)
            congrats.addClass('congrats')
        }
    })
}

function mouseDragged() {
    ray.lookAt(mouseX, mouseY);
}

function setMirrors() {
    const data = document.querySelector('.center').getBoundingClientRect();

    mirrors.push(new Mirror(data.right, data.top, data.right, data.bottom));
    mirrors.push(new Mirror(data.left, data.top, data.right, data.top));
    mirrors.push(new Mirror(data.left, data.bottom, data.right, data.bottom));
    mirrors.push(new Mirror(data.left, data.top, data.left, data.bottom));

    mirrors.push(new Mirror(data.left * 0.6, data.top, data.left * 0.6, data.bottom));
    mirrors.push(new Mirror(width / 4, 0, width / 4, data.top / 4));
    mirrors.push(new Mirror(width - 60, 0, width - 10, data.top / 4));
    mirrors.push(new Mirror(width - 140, 0, width - 140, data.top / 4));
    mirrors.push(new Mirror(width, height / 2, data.right * 1.26, height / 2));




    mirrors.push(new Mirror(width / 2, 0, width / 2, data.top / 4));


    mirrors.push(new Mirror(data.left, 0, data.left / 6, data.top));
    mirrors.push(new Mirror(data.left / 6, data.bottom, data.left, height));
    mirrors.push(new Mirror(data.right, height, data.right * 4 / 3, data.bottom));

    const yesData = document.querySelector('.yes').getBoundingClientRect();
    mirrors.push(new Mirror(yesData.right, yesData.top, yesData.right, yesData.bottom, "yes"));
    mirrors.push(new Mirror(yesData.left, yesData.top, yesData.right, yesData.top, "yes"));
    mirrors.push(new Mirror(yesData.left, yesData.bottom, yesData.right, yesData.bottom, "yes"));
    mirrors.push(new Mirror(yesData.left, yesData.top, yesData.left, yesData.bottom, "yes"));

    const noData = document.querySelector('.no').getBoundingClientRect();
    mirrors.push(new Mirror(noData.right, noData.top, noData.right, noData.bottom, "no"));
    mirrors.push(new Mirror(noData.left, noData.top, noData.right, noData.top, "no"));
    mirrors.push(new Mirror(noData.left, noData.bottom, noData.right, noData.bottom, "no"));
    mirrors.push(new Mirror(noData.left, noData.top, noData.left, noData.bottom, "no"));


    mirrors.push(new Mirror(0, 0, 0, height));
    mirrors.push(new Mirror(0, 2, width, 2));
    mirrors.push(new Mirror(0, height, width, height));
    mirrors.push(new Mirror(width, 0, width, height));
}