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
        coverArt: "IM_FinalAlbumArt_4k.jpg",
        albumDownloadId: "1PQn_euNX0bjQ_iuMsvSRiHtuUinvXNHR",
        gallery: [
            // Add your gallery images here
        ],
        tracks: [
            { number: 1, title: "4155_tizm", duration: "5:29", audioSource: "https://www.dropbox.com/scl/fi/z10d9r3ruegbukuzhnf3p/1.4155_tizm.wav?rlkey=66209ptct2ianl061rmx13sq9" },
            { number: 2, title: "Uf0_grnd", duration: "4:02", audioSource: "https://www.dropbox.com/scl/fi/2raemgdrsoj11amwtmk9b/3.Uf0_grnd.wav?rlkey=q0bz9wzqo50u6zpqlj2nuruqe" },
            { number: 3, title: "NOLsta3", duration: "2:58", audioSource: "https://www.dropbox.com/scl/fi/m7v9g5gq027b19wddoct2/4.NOLsta3.wav?rlkey=07qo0vcz89wdzm6e7yzqo8qnn" },
            { number: 4, title: "re_Nolution", duration: "2:09", audioSource: "https://www.dropbox.com/scl/fi/jqqcaowp0gbse8i4p3t4v/5.reNolution.wav?rlkey=25eqlf3cfucrau20hzc25gnm0" },
            { number: 5, title: "J00LiAN", duration: "2:45", audioSource: "" },
            { number: 6, title: "sovieT1", duration: "1:44", audioSource: "https://www.dropbox.com/scl/fi/l96hz1jrnhyzf4b0huqvx/6.sovieT1.wav?rlkey=fsmicr48u8mmzjnxw8k8bwk3v" },
            { number: 7, title: "REM_fuel", duration: "3:21", audioSource: "https://www.dropbox.com/scl/fi/fantn5z933qdo700u6q8l/7.REM_fuel.wav?rlkey=kj4ncb3pfpipo6ci263sjaxpp" },
            { number: 8, title: "lim1n", duration: "3:35", audioSource: "https://www.dropbox.com/scl/fi/itcpp85ppjc1d97hlr0v8/2.lim1n.wav?rlkey=3zslgb3r1eozo69wpzc9aqkhf" },
            { number: 9, title: "wynesellr007", duration: "6:44", audioSource: "https://www.dropbox.com/scl/fi/aiheb4innwvb2gpqdln7d/8.wynesellr007.wav?rlkey=r605jpymnrcwslq6m8imn3moj" },
            { number: 10, title: "9flatten", duration: "3:35", audioSource: "https://www.dropbox.com/scl/fi/4t2wru1ng1rxs1krhv2ue/9.9flatten.wav?rlkey=fwzihkrl9ig15aqkbcsi9vzz8" },
            { number: 11, title: "null2", duration: "3:14", audioSource: "https://www.dropbox.com/scl/fi/dj29w41ohykw2bb9e5r9c/10.null2.wav?rlkey=jyieb3x414llq91w4rv4ucgdq" },
            { number: 12, title: "bsod_END", duration: "9:00", audioSource: "https://www.dropbox.com/scl/fi/usotgpt1hkhm54zxzgexw/11.bsod_END.wav?rlkey=svdox322jjbhqam0jvv4xu3pb" }
        ]
    };

    const downloadAlbumBtn = document.getElementById('downloadAlbumBtn');
    downloadAlbumBtn.href = `https://www.dropbox.com/scl/fi/tes3jx2avrt6fdbeiovcz/BIOS.update.zip?rlkey=p6vo4y881y96ny3daf0qquebz&dl=1`;

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