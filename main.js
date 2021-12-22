let count = 0;
let max = 940;


Math.clamp = (val, min, max) => {
    return Math.max(Math.min(val, max), min);
}

let counter, cb;

let grid;

let black = "#888"
let white = "#d2d2d2"
let currentColor = false;

let log = console.log

let gyro;
let gyro_used = false;

let gyro_x = 0;
let gyro_y = 0;
let gyro_z = 0;

let mouse_x = 0;
let mouse_y = 0;

let original_pos = []

let dataCounters = [];

let simplex = new SimplexNoise();

/* let rd = new ReactionDiffusionRenderer(); */

document.addEventListener("mousemove", e => {
    mouse_x = e.clientX;
    mouse_y = e.clientY;
})

function qte(quat) {

    const q0 = quat[0];
    const q1 = quat[1];
    const q2 = quat[2];
    const q3 = quat[3];

    const Rx = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)));
    const Ry = Math.asin(2 * (q0 * q2 - q3 * q1));
    const Rz = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2 * (q2 * q2 + q3 * q3)));

    const euler = [Rx, Ry, Rz];

    return (euler);
};

let angles = [0, 0, 0];
let original_set = false;

let metaballs = [];
let metaball_inner;

let infoOpen = false;
let infoPane;
let infoOpenText = "66vw"
let infoCloseText = "100vw"

window.onload = () => {
    infoPane = document.querySelector("#infoPane")
    grid = document.querySelector("#grid-container");
    initCounter();
    /* initGrid(16, 16); */

    if (window.innerWidth > window.innerHeight) {
        infoOpenText = "66vw"
        infoCloseText = "100vw"
        log("wide")
    } else {
        infoOpenText = "0vw"
        infoCloseText = "100vw"
        infoPane.style.width = "100vw"
        log("tall")
    }


    document.querySelector("#nextPage").onclick = (() => {
        /* log("fuck") */
        changePage()
    })
    document.querySelector("#infoPage").onclick = (() => {
        if (infoOpen) {
            infoPane.style.left = infoCloseText
        } else {
            infoPane.style.left = infoOpenText
        }
        infoOpen = !infoOpen
    })

    document.body.style.backgroundColor = black;
    /* document.body.style.backgroundImage = "url(./assets/textures/tv-noise.jpg)"; */
    document.body.style.backgroundPosition = Math.random() * 1000 + "px " + Math.random() * 1000 + "px";

    randomizeVideos();

    try {
        gyro = new AbsoluteOrientationSensor({
            frequency: 60,
            referenceFrame: "device"
        });
        gyro.addEventListener("reading", e => {
            /* gyro_x += gyro.x * s;
            gyro_y += gyro.y * s;
            gyro_z += gyro.z * s;
            gyro_x = Math.clamp(gyro_x, -max, max);
            gyro_y = Math.clamp(gyro_y, -max, max);
            gyro_z = Math.clamp(gyro_z, -max, max); */
            gyro_used = true;

            if (original_set < 5) {
                original_pos[0] = angles[0]
                original_pos[1] = angles[1]
                original_pos[2] = angles[2]

                original_set++;
            }

            angles = qte(gyro.quaternion);
            /* for (let i = 0; i < original_pos.length; i++) {
                let diff = original_pos[i] - angles[i];
                if (Math.abs(diff) > max) {
                    original_pos[i] = angles[i] - diff;
                }
            } */

        })
        gyro.start();
    } catch (e) {
        log(e)
    }

    /*     metaball_inner = document.querySelector("#metaball_inner_container")
        for (let i = 0; i < 0; i++) {
            let m = document.createElement("div");
            m.className = "metaball"
            m.style.top = Math.random() * window.innerHeight + "px"
            m.style.left = Math.random() * window.innerWidth + "px"
            m.seed = Math.random();
            m.acceleration = {
                x: 0,
                y: 0
            }
            metaballs.push(m)
            metaball_inner.appendChild(m);
        } */

    let frame = 0;
    /* setInterval(() => {
        frame++
        let newStyle = "rotate3d(" + frame / 100 + ", " + frame / 400 + ", " + frame / 1000 + ", " + frame / 100 + "deg)";
        grid.style.transform = newStyle

        log(newStyle)
    }, 30) */

    update()
}

let alignments = ["align-bot", "align-top"]
let linkPlaced = false;

/* document.onclick = changePage */

function initGrid(_x, _y) {

    for (let x = 0; x < _x; x++) {
        for (let y = 0; y < _y; y++) {
            let gridElem = document.createElement("div");
            gridElem.className = "grid-element"
            /* gridElem.textContent = "######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n######################\n" */
            /* gridElem.textContent = "HASDFHA" */
            /* gridElem.style.backgroundPositionX = Math.random() * 1000 + " px";
            gridElem.style.backgroundPositionY = Math.random() * 1000 + " px"; */
            /* gridElem.style.backgroundImage = "url(./assets/textures/tv-noise.jpg)"; */
            gridElem.style.backgroundPosition = Math.random() * 1000 + "px " + Math.random() * 1000 + "px";
            /* gridElem.style.backgroundColor = Math.random() < .4 ? white : black */
            gridElem.style.backgroundColor = white;
            gridElem.style.zIndex = Math.floor(Math.random() * 20) + 2;
            gridElem.onclick = () => {
                changePage()
            };
            /* gridElem.style.backgroundColor = "transparent" */
            grid.appendChild(gridElem);
            /* log(isVisible(gridElem)) */
            if (Math.random() < .3) {
                gridElem.classList.add("invisible")
                gridElem.onclick = null;
                /* if (Math.random() < 0) {
                    gridElem.width = 28 + (window.innerHeight > window.innerWidth ? "vh" : "vw");
                } */
            } else if (Math.random() < .1 && !linkPlaced && false) {
                let elem = document.createElement("img");
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && false) {
                    /* document.body = document.createElement("body") */
                    /* document.querySelector("video").style.opacity = 0; */
                } else {
                    let link = document.createElement("a")
                    link.href = "https://www.instagram.com/ar/669297661114524/?ch=ODQ5ZTVmNmQ5NmFkNTVkN2Q5NmU3YWM1YTcwNGVjNTg%3D"
                    elem.className = "QR"
                    elem.classList.add("grid-element")
                    elem.src = "qr.png"
                    link.appendChild(elem)
                    gridElem.appendChild(link);
                }
                /* linkPlaced = true; */
                log(gridElem, gridElem.offsetTop)
            }


            // let classList = ["left-wall", "top-wall", /*  "right-wall", "bot-wall" */ ]
            // for (c of classList) {
            //     let wall = document.createElement("div");
            //     wall.classList.add("wall");
            //     wall.classList.add(c);
            //     /* wall.style.backgroundColor = gridElem.style.backgroundColor; */
            //     gridElem.appendChild(wall);
            // }

            currentColor = !currentColor;
        }
    }
    let labelZ = 40
    for (var i = 0; i < grid.childElementCount; i++) {
        let gridElem = grid.children[i]
        if (Math.random() < .2 && isVisible(gridElem)) {
            /* log("FUCK") */
            /* gridElem.style.transform = "scale(2.01, 1)"
            gridElem.backgroundSize = "201% 100%" */
            /*                 log(gridElem)
             */
            let gridChild = document.createElement("div");
            let childElement = document.createElement("div");
            gridElem.activated = true;
            gridChild.className = "grid-child"
            childElement.classList.add("counter")
            childElement.textContent = "aaa"
            childElement.style.color = "white"
            /* gridElem.style.width = 28 + (window.innerHeight > window.innerWidth ? "vh" : "vw") */
            gridElem.classList.add("wide")


            let labelElement = document.createElement("div");
            /* labelElement.classList.add("grid-child"); */
            labelElement.classList.add("label")
            gridElem.style.zIndex = labelZ
            /* labelZ++; */
            /* log(labelZ); */


            let alignment = alignments[Math.random() < .5 ? 0 : 1]
            childElement.classList.add(alignment)
            labelElement.classList.add(alignment)

            gridElem.appendChild(gridChild);
            gridChild.appendChild(childElement);
            gridChild.appendChild(labelElement)


            dataCounters.push(new DataCounter(childElement, labelElement));

        } else if (isVisible(gridElem) && Math.random() < .18 && !gridElem.classList.contains("invisible")) {
            /* log("hi") */
            let videoChild = document.createElement("video");
            /* gridElem.backgroundColor = "transparent"; */
            let src = getRandomMedia();
            if (src.includes("png") || src.includes("jpg") || src.includes("jpeg") || src.includes("webp")) {
                videoChild = document.createElement("div");
                videoChild.classList.add("image-child")
                videoChild.displacement = [Math.random() * 2 - 1, Math.random() * 2 - 1]
                /* log(src) */
                videoChild.style.backgroundImage = "url(" + src + ")";
                /*  log(videoChild) */
            } else {
                videoChild.src = src;
                videoChild.autoplay = true;
                videoChild.muted = true;
                videoChild.play()
                videoChild.loop = true;
            }

            if (Math.random() < .6) {
                /* gridElem.style.width = "28vw" */
                gridElem.classList.add("wide")
            }
            if (Math.random() < .6) {
                /* gridElem.style.width = "18vw" */
                gridElem.classList.add("tall")
            }

            videoChild.classList.add("video-child");
            gridElem.appendChild(videoChild)
            gridElem.onclick = null;
            /* log(videoChild, src) */

        }
        if (gridElem.activated) {}
    }

    setInterval(() => {
        for (dc of dataCounters) {

            dc.update()

        }
    }, 260)
}

function initCounter() {
    counter = document.querySelector("#counter")
    let counterLabel = document.querySelector("#counter-label")
    if (counter) {
        // cb =
        //     setInterval(() => {
        //         if (count < max) {
        //             count++;
        //             counter.textContent = count
        //             /* console.log(count) */
        //         } else {
        //             let sentence = " million people are without access to drinking water.";
        //             let i = 0;
        //             let cb_two = setInterval(() => {
        //                 if (i < sentence.length) {
        //                     counter.textContent += sentence[i]
        //                     i++
        //                 } else {
        //                     clearInterval(cb_two);
        //                 }
        //             }, 60);
        //             clearInterval(cb)
        //         }
        //     }, 20);
        counter.dataCounter = new DataCounter(counter, counterLabel)
    }
}

let margin = 40;

function isVisible(element) {
    let r = element.getBoundingClientRect();
    /* log(r.x, r.y) */

    if (r.x > margin && r.x < window.innerWidth - margin) {
        if (r.y > margin && r.y < window.innerHeight - margin) {
            return true
        }
    }
    return false;
}

let videos = [
    /*     "./test_video3_2.mp4",
        "./assets/videos/bacteria2_render.mp4",
        "./assets/videos/bacteria4_10001-0250.mp4",
        "./assets/videos/Barcode-1.mp4",
        "./assets/videos/Fluid Fedback 1-1.mp4",
        "./assets/videos/Iridescent Foam-1.mp4",
        "./assets/videos/Lagoon-1.mp4",
        "./assets/videos/loopwaves.mp4", */
    "./assets/videos/background_metaballs0001-0718.mp4"
    /* "./background_metaballs0001-0360.mp4" */
    /* "./assets/videos/bacteria3_0001-0250.mp4", */
    /* "././assets/videos/bacteria4_20001-0250.mp4", */
    /* "./assets/videos/Fluid Fedback 2-1.mp4", */
    /* "./assets/videos/oil_2.mp4", */
    /* "./assets/videos",
    "./assets/videos",
    "./assets/videos",
    "./assets/videos",
    "./assets/videos",
    "./assets/videos", */
]

let images = [
    "./assets/textures/images/bacteria_test_1.webp",
    "./assets/textures/images/glass_rocks.webp",
    "./assets/textures/images/microbabbles.webp",
    "./assets/textures/images/microbabbles_2.webp",
    "./assets/textures/images/reactionDiffusion.webp",
    "./assets/textures/images/sacks_test_2.webp",
    "./assets/textures/images/troubled_water.webp",
    "./assets/textures/images/voro_volume_1.webp",
    "./assets/textures/images/voro_volume_2.webp",
    "./assets/textures/images/water_filter1.webp",
    "./assets/textures/images/water_filter2.webp",
    "./assets/textures/images/water_filter3.webp",
    "./assets/textures/images/AdobeStock_123212182_Preview.webp",
    "./assets/textures/images/AdobeStock_153613564_Preview.webp",
    "./assets/textures/images/AdobeStock_180539132_Preview.webp",
    "./assets/textures/images/AdobeStock_273110877_Preview.webp",
    "./assets/textures/images/AdobeStock_35364937_Preview.webp",
    "./assets/textures/images/AdobeStock_436829149_Preview.webp",
    "./assets/textures/images/AdobeStock_63717888_Preview.webp",
    "./assets/textures/images/plastic-cups-973103_1920.webp",
    "./assets/textures/images/plastic-631625_1920.webp",
    "./assets/textures/images/garbage-2263208_1920.webp",
    "./assets/textures/images/concepts-4916635_1920.webp",
    "./assets/textures/images/concepts-4966979_1920.webp",
    /* "./assets/textures/images",
    "./assets/textures/images", */
]

function randomizeVideos() {
    try {
        let videos = document.getElementsByClassName("background-vid");
        for (vid of videos) {
            /* log(vid) */
            vid.src = randomVideo();
        }

    } catch (e) {
        log("could not find video", e)
    }
}

function randomVideo() {
    return videos[Math.floor(Math.random() * videos.length)];
}

let usedMedia = []
usedMedia.fill(false, 0, videos.length + images.length);

function getRandomMedia(retries = 0) {
    let i = 0;
    if (Math.random() > .5) {
        i = videos[Math.floor(Math.random() * videos.length)];
    } else {
        i = images[Math.floor(Math.random() * images.length)];
    }
    if (usedMedia[i]) {
        if (retries < 50) return getRandomMedia(1);
        else return i;
    } else {
        usedMedia[i] = false;
        return i;
    }

}
let global_rot = 0;

let rd = new reactionDiffusionRender(12);
let rd2 = new reactionDiffusionRender(6);

function changePage() {
    /*  log("reinit page") */
    initCounter()
    global_rot += 360
    /* rd = new reactionDiffusionRender(12);
    rd2 = new reactionDiffusionRender(6); */
    rd.reset();
    rd2.reset();
    /* document.querySelector("#perspective-container").style.transform = "rotateY(" + global_rot + "deg)"
    setTimeout(() => {
        global_rot += (360 - 90);
        document.querySelector("#perspective-container").style.transform = "rotateY(" + global_rot + "deg)"
    }, 1300); */
    /* for (rule of document.styleSheets[0].cssRules) {
        try {
            if (rule.selectorText.includes("grid-element")) {
                rule.style.transform = "rotateY(" + global_rot + "deg)"
                log(rule.style.transform)
            }
        } catch (e) {
            log(e)
        }
    } */
    /* log(document.querySelector("#perspective-container").style.transform) */
    dataCounters = []

    original_pos[0] = angles[0]
    original_pos[1] = angles[1]
    original_pos[2] = angles[2]

    let count = grid.childElementCount;
    /* log(grid.childElementCount) */
    for (let i = 0; i < count; i++) {
        grid.removeChild(grid.children[0]);
    }
    /* initGrid(16, 16) */
    randomizeVideos()
}

let startTime = Date.now()

function update() {
    requestAnimationFrame(update)
    let time = Date.now() - startTime;
    /* log(time) */

    counter.dataCounter.update()

    if (!gyro_used) {
        angles[0] = (mouse_x - window.innerWidth / 2) / (window.innerWidth / 2);
        angles[1] = (mouse_y - window.innerHeight / 2) / (window.innerHeight / 2);

        /* log(angles) */
    }


    if (original_pos.length < 3 && gyro_used) {
        original_pos[0] = angles[0]
        original_pos[1] = angles[1]
        original_pos[2] = angles[2]
    } else if (!original_set) {
        original_pos[0] = 0
        original_pos[1] = 0
        original_pos[2] = 0
    }

    let s = 1;
    let max = 1;

    gyro_x = (original_pos[0] - angles[0]) * s;
    gyro_y = (original_pos[1] - angles[1]) * s;
    gyro_z = (original_pos[2] - angles[2]) * s;
    let mag = Math.sqrt(gyro_x ** 2 + gyro_y ** 2 + gyro_z ** 2);
    /* log(mag) */
    /* mag = 1; */
    /* document.querySelector("#debug_thing").textContent = "x:" + gyro_x + " y:" + gyro_y + " z:" + gyro_z; */
    let newRot = "rotate3d(" + (gyro_z < -6 ? gyro_z + 6 : gyro_z) + ", " + -gyro_y + ", " + /* gyro_z */ 0 + ", " + mag * 7 + "deg)";
    if (!gyro_used) {
        newRot = "rotateY(" + gyro_x * 1 + "deg)" + " rotateX(" + gyro_y * 1 + "deg)"
    } else {
        newRot = "rotateY(" + gyro_x * 15 + "deg)" + " rotateX(" + gyro_z * 15 + "deg)"
    }
    /* log(newRot) */

    grid.style.transform = newRot
    /* log(newRot) */
    /* "rotate3d(1,0,1,45deg)" */


    // for (let metaball of metaballs) {
    //     let force = {}
    //     force.x = simplex.noise3D(metaball.offsetLeft / 500, metaball.offsetTop / 500, (time + metaball.seed * 10000) / 10000) * 10;
    //     force.y = simplex.noise3D(metaball.offsetTop / 500, (time + metaball.seed * 10000) / 10000, metaball.offsetLeft / 500) * 10;

    //     /* force.x -= (metaball.offsetLeft - window.innerWidth / 2) * .01;
    //     force.x -= (metaball.offsetTop - window.innerHeight / 2) * .01; */


    //     /* log(metaball.offsetRight, metaball.offsetTop) */
    //     /* log(force) */
    //     metaball.style.top = metaball.offsetTop + metaball.acceleration.x + "px";
    //     metaball.style.left = metaball.offsetLeft + metaball.acceleration.y + "px";

    //     metaball.acceleration.x += force.x * .1;
    //     metaball.acceleration.y += force.y * .1;

    //     /* metaball.acceleration.x += (metaball.offsetLeft - mouse_x) * .002;
    //     metaball.acceleration.y += (metaball.offsetTop - mouse_y) * .002; */

    //     metaball.acceleration.x += Math.pow(gyro_used ? gyro_z : gyro_y, 3);
    //     metaball.acceleration.y += Math.pow(gyro_used ? gyro_y : gyro_x, 3)

    //     metaball.acceleration.x *= .9;
    //     metaball.acceleration.y *= .9;


    //     if (metaball.offsetTop > window.innerHeight + 200) {
    //         metaball.style.top = "-200px";
    //     } else if (metaball.offsetTop < -200) {
    //         metaball.style.top = window.innerHeight + 200 + "px";
    //     }
    //     if (metaball.offsetLeft > window.innerWidth + 200) {
    //         metaball.style.left = "-200px";
    //     } else if (metaball.offsetLeft < -200) {
    //         metaball.style.left = window.innerWidth + 200 + "px";
    //     }
    // }

    let images = document.getElementsByClassName("image-child")
    let speed = gyro_used ? 200 : 100;
    let x_displace = gyro_used ? gyro_x : gyro_y;
    let y_displace = gyro_used ? gyro_z : gyro_x;
    for (i of images) {
        i.style.backgroundPosition =
            ((i.displacement[0] + x_displace) * 50 + (time / speed)) + "px" +
            " " +
            ((i.displacement[0] + y_displace) * 50 + (time / speed)) + "px"
    }
    document.body.style.backgroundPosition =
        (x_displace) * 10 + (time / 250) + "px" +
        " " +
        (y_displace) * 10 + (time / 250) + "px"

}