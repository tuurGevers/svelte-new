<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { FetchedImage } from '../lib/api';

    let container;
    let cube;
    let frame
    let searchQuery = '';
    let scene

    const reloadModel = async () => {
        const url = await FetchedImage(searchQuery);
        if (url) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(url, function (texture) {
                const image = texture.image;
                const aspectRatio = image.width / image.height;

                const cubeHeight = 1;
                const cubeWidth = cubeHeight * aspectRatio;

                const geometry = new THREE.BoxGeometry(cubeWidth * 4, cubeHeight * 4, 0.1);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                });

                cube.geometry.dispose(); // Dispose the old geometry
                cube.material.dispose(); // Dispose the old material

                cube.geometry = geometry; // Assign the new geometry
                cube.material = material; // Assign the new material

                cube.scale.set(1, 1, 1); // Reset the scale

                // Update the scene
                cube.position.set(0, 0, 0);
                scene.add(cube);

                // Update the frame
                const frameGeometry = new THREE.BoxGeometry(cubeWidth * 4 +0.2, cubeHeight * 4  +0.2, 0.2);
                frame.geometry.dispose(); // Dispose the old geometry
                frame.geometry = frameGeometry; // Assign the new geometry


                frame.scale.set(1, 1, 1); // Reset the scale
                frame.position.set(0, 0, -0.1);
                scene.add(frame);

            });
        }
    };

    onMount(() => {
        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 5);
        controls.update();

        const geometry = new THREE.BoxGeometry(5, 5, 0.1);
        const material = new THREE.MeshBasicMaterial();
        cube = new THREE.Mesh(geometry, material);

        //initialize black frame
        const frameGeometry = new THREE.BoxGeometry(5.2, 5.2, 0.2);
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, -0.1);
        scene.add(frame);
        scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
        };
    });
</script>

<body>
    <div class="search-container">
        <div bind:this={container} class="viewer"></div>
        <div>
            <textarea type="text" placeholder="Search for an image" bind:value={searchQuery} />
            <button on:click={reloadModel}>Search</button>
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50vw;
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
        body{
            background-size: 100% 100%;
            width: 100%;
        }
    }
</style>
