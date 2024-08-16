document.addEventListener('DOMContentLoaded', function() {
    const backgroundImages = [
        'IM_Bonus1_4x.jpg',
        'IM_Bonus2_4x.jpg',
        'IM_Bonus3_4x.jpg',
        'IM_Bonus4_4x.jpg',
        'IM_Bonus5_4x.jpg',
    ];

    function setRandomBackground() {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        const selectedImage = backgroundImages[randomIndex];
        document.querySelector('.background-container').style.backgroundImage = `url('${selectedImage}')`;
        document.querySelector('.background-container').style.backgroundPositionY = `${0}px`;
    }

    setRandomBackground();

    const backgroundContainer = document.querySelector('.background-container');
    let scrollPosition = window.pageYOffset;
    let imageScrollSpeed = 0.1;

    function parallaxEffect() {
        const currentScrollPosition = window.scrollY;
        const scrollDifference = currentScrollPosition - scrollPosition;
        const newBackgroundPosition = parseFloat(getComputedStyle(backgroundContainer).backgroundPositionY) - (scrollDifference * imageScrollSpeed);

        backgroundContainer.style.backgroundPositionY = `${newBackgroundPosition}px`;
        scrollPosition = currentScrollPosition;
    }

    let throttleTimeout = null;
    function throttledParallax() {
        if (!throttleTimeout) {
            throttleTimeout = requestAnimationFrame(() => {
                parallaxEffect();
                throttleTimeout = null;
            });
        }
    }

    window.addEventListener('scroll', throttledParallax);

    const albumData = {
        title: "BIOS.update",
        coverArt: "IM_FinalAlbumArt_4k_Recolor.jpg",
        albumDownloadId: "1PQn_euNX0bjQ_iuMsvSRiHtuUinvXNHR",
        gallery: [
            // Add your gallery images here
        ],
        tracks: [
            { number: 1, title: "4155_tizm", duration: "5:29", audioSource: "https://www.dropbox.com/scl/fi/d6qf3ms2w96a1rtgjd3ph/1.4155_tizm.wav?rlkey=xhxx3saot3fadr4zk6jb22lkw&st=qymzwvy4" },
            { number: 2, title: "Uf0_grnd", duration: "4:02", audioSource: "https://www.dropbox.com/scl/fi/pcoc4yuxbihgsr8yz2pl3/2.UF0_grnd.wav?rlkey=m9vflo8gzb8zghvee67sshtvt&st=w1k3wq03" },
            { number: 3, title: "NOLsta3", duration: "2:58", audioSource: "https://www.dropbox.com/scl/fi/6580c1kqb9izwtgda5gqd/3.NOLsta3.wav?rlkey=0chms8pkd5rbaswmlkwh52v9l&st=5r0rs7pe" },
            { number: 4, title: "re_Nolution", duration: "2:09", audioSource: "https://www.dropbox.com/scl/fi/jil5sfnsp1xxifsk5ogtx/4.re_Nolution.wav?rlkey=qir3e2tib8or3m6kv0w4yb8tw&st=jemrtzr3" },
            { number: 5, title: "J00LiAN", duration: "2:45", audioSource: "https://www.dropbox.com/scl/fi/gkwa58d53kuk78bqod0tu/5.J00LiAN.wav?rlkey=6n9c6ma1t59uw8xiwpi3k3opq&st=1v7hir36" },
            { number: 6, title: "sovieT1", duration: "1:44", audioSource: "https://www.dropbox.com/scl/fi/8nxgzd0i5jvitau80tn79/6.sovieT1.wav?rlkey=t1hhz2dmv3vmzxltj044q0icw&st=ystow1o6" },
            { number: 7, title: "REM_fuel", duration: "3:21", audioSource: "https://www.dropbox.com/scl/fi/zvec6g7tlfoigj1lhiq76/7.REM_fuel.wav?rlkey=pax3mxcjp8fm7i5hpeqcw8a23&st=zx52f7ro" },
            { number: 8, title: "lim1n", duration: "3:35", audioSource: "https://www.dropbox.com/scl/fi/j81laask6ru52uh7x3qxi/8.lim1nl.wav?rlkey=nf3h4wgks59xzae3pql7h9n8n&st=basuwedf" },
            { number: 9, title: "wynesellr007", duration: "6:44", audioSource: "https://www.dropbox.com/scl/fi/af04138kgomaig7wbd6a7/9.wynesellr007.wav?rlkey=eskthnquwifyp8qdp66o417ez&st=wrogki1b" },
            { number: 10, title: "9flatten", duration: "3:35", audioSource: "https://www.dropbox.com/scl/fi/8jl0cq8avu7kik5unoyc9/10.9flatten.wav?rlkey=2zu0ypl69nxyp7qkxmqefmgal&st=7i9qtyhn" },
            { number: 11, title: "null2", duration: "3:14", audioSource: "https://www.dropbox.com/scl/fi/jw913a6b3dplad6ns8j7a/11.null2.wav?rlkey=zvneji0jhlmmgbs5klzu93gzu&st=wgducryc" },
            { number: 12, title: "bsod_END", duration: "9:00", audioSource: "https://www.dropbox.com/scl/fi/rb8qqp4abn32kz9lqd523/12.bsod_END.wav?rlkey=wyd49ssbpn7vye7oyg63fxpy2&st=sj3n3z79" }
        ]
    };

    const downloadAlbumBtn = document.getElementById('downloadAlbumBtn');
    downloadAlbumBtn.href = `https://storage.googleapis.com/therum-website-lts/bios.update/BIOS.update.24b.zip`;

    document.querySelector('.album-title').textContent = albumData.title;
    document.querySelector('.album-art img').src = albumData.coverArt;

    const galleryContainer = document.querySelector('.gallery');
    albumData.gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        galleryItem.addEventListener('click', () => openImageModal(image.src, image.alt));
        galleryContainer.appendChild(galleryItem);
    });

    const tracklistContainer = document.querySelector('.tracklist');
    let currentAudio = null;
    let currentPlayButton = null;

    function createAudioElement(src) {
        const audio = new Audio(src + '&raw=1');
        audio.preload = 'none'; // Don't preload audio
        return audio;
    }

    function togglePlayPause(audio, button) {
        if (audio.paused) {
            audio.play().catch(e => console.error('Error playing audio:', e));
            button.querySelector('i').className = 'fas fa-pause';
        } else {
            audio.pause();
            button.querySelector('i').className = 'fas fa-play';
        }
    }

    albumData.tracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <span class="track-number">${track.number}</span>
            <button class="play-button" data-audio-source="${track.audioSource}">
                <i class="fas fa-play"></i>
            </button>
            <span class="track-title">${track.title}</span>
            <span class="track-duration">${track.duration}</span>
            <a href="${track.audioSource}&dl=1" class="download-track-btn" download>
                <i class="fas fa-download"></i>
            </a>
        `;

        const playButton = trackItem.querySelector('.play-button');
        
        trackItem.addEventListener('click', (event) => {
            if (event.target.closest('.download-track-btn')) {
                event.stopPropagation();
                return;
            }
            
            if (currentAudio && currentAudio.src !== track.audioSource + '&raw=1') {
                currentAudio.pause();
                currentPlayButton.querySelector('i').className = 'fas fa-play';
            }

            if (!currentAudio || currentAudio.src !== track.audioSource + '&raw=1') {
                currentAudio = createAudioElement(track.audioSource);
                currentPlayButton = playButton;
            }

            togglePlayPause(currentAudio, playButton);
        });

        tracklistContainer.appendChild(trackItem);
    });

    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    function openImageModal(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        imageModal.style.display = 'flex';
        
        modalImage.onload = function() {
            imageModal.style.opacity = '1';
        }
    }

    const closeBtn = imageModal.querySelector('.close');
    closeBtn.onclick = function() {
        imageModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    }

    // Add touch event listener for iOS devices
    document.addEventListener('touchstart', function() {
        if (currentAudio) {
            currentAudio.play().catch(e => console.error('Error playing audio:', e));
        }
    }, { once: true });
});