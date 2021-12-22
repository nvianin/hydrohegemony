class reactionDiffusionRender {
    constructor(scale) {
        this.frametexture = new THREE.DataTexture();
        this.framebuffer = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                format: THREE.RGBAFormat
            }
        )
        this.renderer = new THREE.WebGLRenderer({
            autoClear: false,
            alpha: true
        });

        this.renderer.setClearColor(new THREE.Color(0x000000, 0))
        this.renderer.setClearAlpha(0);
        this.renderer.clear();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000)
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, .1, 1000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.shader = new THREE.ShaderMaterial();
        this.shader.transparent = true;
        this.shader.needsUpdate = true;
        this.shader.uniforms = {

            resolution: {
                value: new THREE.Vector2(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight)
            },
            prevFrame: {
                value: this.frametexture
            },
            time: {
                value: 0
            },
            mouse: {
                value: new THREE.Vector2()
            },
            mousedown: {
                value: false
            },
            fk: {
                value: new THREE.Vector2(.5, .5)
            },
            global_scale: {
                value: scale
            }
        }
        this.displayShader = new THREE.ShaderMaterial();
        this.displayShader.transparent = true;
        this.displayShader.needsUpdate = true;
        this.displayShader.uniforms = {
            resolution: {
                value: new THREE.Vector2(
                    this.renderer.domElement.offsetWidth,
                    this.renderer.domElement.offsetHeight
                )
            },
            frame: {
                value: this.frametexture
            },
        }
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial()
        );
        this.plane.position.z = 4.89;
        this.displayPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial()
        )
        this.displayPlane.position.z = 4.89

        this.displayScene = new THREE.Scene();
        this.displayScene.add(this.displayPlane);
        this.displayScene.background = null

        let init = false;
        fetch("./vertex.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.plane.material.vertexShader = data;
                this.shader.vertexShader = data;
                this.displayShader.vertexShader = data;
                if (!init) {
                    init = true;
                } else {
                    this.plane.material = this.shader;
                }
            });
        })
        fetch("./frag.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.plane.material.fragmentShader = data;
                this.shader.fragmentShader = data;
                if (!init) {
                    init = true;
                } else {
                    this.plane.material = this.shader;
                }
            })

        });
        fetch("./display.glsl").then(thing => {
            thing.text().then(data => {
                /* log(data) */
                this.displayShader.fragmentShader = data;
                this.displayPlane.material = this.displayShader;
            })
        });
        init = false;
        this.scene.add(this.plane);
        this.camera.position.z = 5;
        this.frame = 0;
        this.start_time;
        window.addEventListener("load", () => {
            document.body.appendChild(this.renderer.domElement);
            this.shader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth;
            this.shader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight;
            this.displayShader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth;
            this.displayShader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight;
            console.log(this.shader.uniforms.resolution.value)
            console.log(this.shader.uniforms.resolution.value.x / this.shader.uniforms.resolution.value.y);
            this.shader.uniforms.fk.value = new THREE.Vector2(.03239, .0324);
            /* log(shader.uniforms.fk) */
            this.render()
            console.log("reaction diffusion launched")
        })

        this.blackplane = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            }))
        this.scene.add(this.blackplane);
        this.blackplane.position.z = 4.9;
        setTimeout(() => {
            this.blackplane.position.y = -10
        }, 500)



        window.addEventListener("resize", () => {
            this.camera.aspectRatio = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.framebuffer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight);
            /* frametexture.setSize(window.innerWidth, window.innerHeight); */
            this.shader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth
            this.shader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight
            this.displayShader.uniforms.resolution.value.x = this.renderer.domElement.offsetWidth
            this.displayShader.uniforms.resolution.value.y = this.renderer.domElement.offsetHeight
        })

        window.addEventListener("mousemove", e => {
            /* this.shader.uniforms.mouse.value.x = e.layerX;
            this.shader.uniforms.mouse.value.y = e.layerY; */
            this.shader.uniforms.mouse.value.x = e.clientX;
            this.shader.uniforms.mouse.value.y = e.clientY;
        })
        this.renderer.domElement.onpointerdown = () => {
            this.shader.uniforms.mousedown.value = true;
        }
        this.renderer.domElement.onpointerup = () => {
            this.shader.uniforms.mousedown.value = false;
        }

        window.addEventListener("touchstart", e => {

        })

        window.addEventListener("touchmove", e => {
            log(e)
            this.shader.uniforms.mouse.value.x = e.changedTouches[0].clientX;
            this.shader.uniforms.mouse.value.y = e.changedTouches[0].clientY;
        })
    }

    render() {
        if (this.frame == 0) {
            this.start_time = Date.now();
        }
        this.frame++;
        let time = (Date.now() - this.start_time) / 1000
        this.shader.uniforms.time.value = time;
        this.frametexture.copy(this.framebuffer.texture)

        // animate fk
        this.shader.uniforms.fk.value.x = this.shader.uniforms.fk.value.x + Math.sin(time) * .000001;
        this.shader.uniforms.fk.value.y = this.shader.uniforms.fk.value.y + Math.cos(time) * .000001;
        /* log(shader.uniforms.fk.value) */


        requestAnimationFrame(this.render.bind(this));
        this.renderer.setRenderTarget(null)
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(this.framebuffer);
        this.renderer.render(this.scene, this.camera);
        this.renderer.copyFramebufferToTexture(new THREE.Vector2(), this.frametexture);
        this.shader.uniforms.prevFrame.value = this.frametexture;
        this.displayShader.uniforms.frame.value = this.frametexture;
    }

    reset() {
        this.blackplane.position.y = 0;

        setTimeout(() => {
            this.blackplane.position.y = -10
        }, 100)
    }

}

/* let rd;
rd = new reactionDiffusionRender(); */