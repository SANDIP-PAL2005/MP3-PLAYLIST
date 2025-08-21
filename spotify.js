console.log("Welcome to Spotify");

let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItems'));
let currentTimeDisplay = document.getElementById('currentTime');
let durationDisplay = document.getElementById('durationTime');

let songs = [
    { songName: "JAY JAY SIV SANKARA", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "FIKAR NOT", filePath: "songs/2.mp3", coverPath: "covers/2.jpeg" },
    { songName: "ALL IS WELL", filePath: "songs/3.mp3", coverPath: "covers/3.jpeg" },
    { songName: "Jugraafiy", filePath: "songs/4.mp3", coverPath: "covers/4.jpeg" },
    { songName: "COLDPLAY", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "VANDE MATARAM", filePath: "songs/6.mp3", coverPath: "covers/6.jpeg" },
    { songName: "Korbo Lorbo Jeetbo Re", filePath: "songs/7.mp3", coverPath: "covers/7.jpeg" },
    { songName: "atletico de kolkata", filePath: "songs/8.mp3", coverPath: "covers/8.jpeg" },
    { songName: "Jabo Na Jabo Na Phire", filePath: "songs/9.mp3", coverPath: "covers/9.jpeg" },
];

// Update song info inside each songItem
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Function to pause all songs
const pauseAllSongs = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
    audioElement.pause();
    masterPlay.classList.remove('fa-circle-pause');
    masterPlay.classList.add('fa-circle-play');
    gif.style.opacity = 0;
    // Remove active class from all song items
    songItems.forEach(item => item.classList.remove('active'));
};

// Play/Pause Master Button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
        updateSongButtonsState();
    } else {
        pauseAllSongs();
    }
});

// Progress bar update
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    currentTimeDisplay.innerText = formatTime(audioElement.currentTime);
    durationDisplay.innerText = formatTime(audioElement.duration - audioElement.currentTime);
});

// Format time function
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// Allow seeking by dragging progress bar
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Reset all play icons
const makeALLPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

// Sync master and songItemPlay icons
const updateSongButtonsState = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, i) => {
        if (i === songIndex) {
            element.classList.remove('fa-circle-play');
            element.classList.add('fa-circle-pause');
        } else {
            element.classList.remove('fa-circle-pause');
            element.classList.add('fa-circle-play');
        }
    });
};

// New logic: Clicking anywhere inside songItems plays/pauses song
songItems.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (songIndex === index && !audioElement.paused) {
            pauseAllSongs();
        } else {
            songIndex = index;
            audioElement.src = songs[songIndex].filePath;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();

            makeALLPlays();
            element.querySelector('.songItemPlay').classList.remove('fa-circle-play');
            element.querySelector('.songItemPlay').classList.add('fa-circle-pause');

            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            gif.style.opacity = 1;

            // Highlight the clicked song item
            songItems.forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }
    });
});

// Next song button
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();

    makeALLPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');

    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    gif.style.opacity = 1;

    // Highlight the current song item
    songItems.forEach(item => item.classList.remove('active'));
    songItems[songIndex].classList.add('active');
});

// Previous song button
document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();

    makeALLPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');

    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    gif.style.opacity = 1;

    // Highlight the current song item
    songItems.forEach(item => item.classList.remove('active'));
    songItems[songIndex].classList.add('active');
});

// 10s Rewind
document.getElementById('rewind10').addEventListener('click', () => {
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
});

// 10s Forward
document.getElementById('forward10').addEventListener('click', () => {
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
});

// Autoplay next song
audioElement.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();

    makeALLPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');

    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    gif.style.opacity = 1;

    // Highlight the current song item
    songItems.forEach(item => item.classList.remove('active'));
    songItems[songIndex].classList.add('active');
});
