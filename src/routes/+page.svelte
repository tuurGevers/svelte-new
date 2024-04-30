<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { FetchedImage, FetchProductsByUrl } from "../lib/api";

    let container;
    let cube;
    let frame;
    let searchQuery = "";
    let scene;
    let is3D = false;
    let currentImage = "";
    let renderer;
    let camera;

    function setupScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        renderer.outputEncoding = THREE.sRGBEncoding;
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 5);
        controls.update();

        const geometry = new THREE.BoxGeometry(5, 5, 0.1);
        const material = new THREE.MeshBasicMaterial();
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const frameGeometry = new THREE.BoxGeometry(5.2, 5.2, 0.2);
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, -0.1);
        scene.add(frame);

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    onMount(() => {
        setupScene();
        window.addEventListener("resize", () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.render(scene, camera);
        });

        updateModel(    )
    });

    async function reloadModel() {
        const url = await FetchedImage(searchQuery);
        const products = await FetchProductsByUrl(url);
        currentImage = url;
        if (url) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(url, function (texture) {
                const image = texture.image;
                const aspectRatio = image.width / image.height;
                const cubeHeight = 1;
                const cubeWidth = cubeHeight * aspectRatio;

                cube.geometry.dispose();
                cube.material.dispose();

                const geometry = new THREE.BoxGeometry(cubeWidth * 4, cubeHeight * 4, 0.1);
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
                cube.geometry = geometry;
                cube.material = material;
                cube.position.set(0, 0, 0);
                
                frame.geometry.dispose();
                const frameGeometry = new THREE.BoxGeometry(cubeWidth * 4 + 0.2, cubeHeight * 4 + 0.2, 0.2);
                frame.geometry = frameGeometry;
                frame.position.set(0, 0, -0.1);
                
                renderer.render(scene, camera);  // Force render to update the scene
            });
        }
    }

    function updateModel() {
        if (!is3D) {
            renderer.setSize(0, 0);  // Hide renderer
        } else {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.render(scene, camera);
        }
    }
</script>


<body>
    <div class="search-container">
        <div class="search">
            <textarea type="text" placeholder="Search for an image" bind:value={searchQuery} rows="8" />
            <button on:click={reloadModel}>Search</button>
        </div>
        <div style="display:flex; flex-direction:column">
            <div class="wrapper-3D">
                <div bind:this={container} class="viewer {!is3D?"invis":""}"></div>
    
            </div>
    
            {#if !is3D && currentImage}
                <img src={currentImage} alt="background" />

    
            {/if}
            {#if !currentImage}
                <p>No image found</p>
            {/if}

            <button on:click={() => { is3D = !is3D; updateModel(); }}>
                {!is3D ? "3D mode" : "image mode"}
            </button>
        </div>
       
        
    </div>
</body>
<style>
    .viewer {
        width: 100%;
        height: 75vh;
    }

    body {
        background-color: #f0f0f0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        background-image: url("./background.jpg");
        background-size: cover;
        max-width: 100%;
        overflow-x: hidden;
    }

    .search-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 75vw;
    }
    @media (max-width: 768px) {
        .search-container {
            width: 80vw;
        }
    }

    @media (max-width: 480px) {
        .search-container {
            width: 80%;
        }
        body {
            background-size: 100% 100%;
            width: 100%;
        }
    }
    .invis {
        position: absolute;
        top: -1000px;
    }

    img{
        width: 40vw;
        height: 100%;
        object-fit: cover;
        position: relative;
    }

    .wrapper-3D {
        position: relative;
        width: 100%;
        margin: auto;
        
    }
    .search{
        display: flex;
        flex-direction: column;
        min-width: 40%;
        margin: auto;
    }
</style>
