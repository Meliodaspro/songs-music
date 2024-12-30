const style = document.createElement('style');
style.innerHTML = `
    
    #music-player, #total-songs {
        position: fixed;
        opacity: 0;
        animation: fadeIn 1s forwards;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        
    }

    #music-player {
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(103, 226, 204, 0.13);
         border: 2px solid rgba(239, 21, 5, 0.5);
        backdrop-filter: blur(10px);
        padding: 10px 20px;
        border-radius: 100px;
        font-size: 16px;
        color:rgb(0, 0, 0);
        text-align: center;
        max-width: 300px;
        width: 100%;
        box-sizing: border-box;
    }

    #music-player h1 {
        font-size: 20px;
        margin-bottom: 10px;
        color:rgb(0, 0, 0);
        font-weight: bold;
        text-shadow: 0 0 8px#010a0c, 0 0 12px rgba(255, 255, 255, 0.7);
    }

    #song-info {
        font-size: 15px;
        color:rgb(192, 11, 11);
        text-shadow: 0 0 4px rgba(162, 153, 105, 0.7);
        word-wrap: break-word;
    }

    #total-songs {
        bottom: 10px;
        right: 10px;
        background: rgba(46, 46, 146, 0.12);
        border: 2px solid rgba(0, 150, 255, 0.5);
        backdrop-filter: blur(10px);
        color:rgb(23, 44, 162);
        text-shadow: 0 0 5px rgba(87, 85, 85, 0.8);
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 20px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;
        text-align: center;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(0px);
        }
        to {
            opacity: 1;
            transform: translateY(-10);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .number {
        font-weight: bold;
        color:rgb(220, 133, 34);
        text-shadow: 0 0 8px #00d4ff, 0 0 12px rgba(255, 255, 255, 0.7);
    }
`;
document.head.appendChild(style);

const musicPlayer = document.createElement('div');
musicPlayer.id = 'music-player';

const title = document.createElement('h1');
title.innerText = 'Music ♫';
musicPlayer.appendChild(title);

const songInfo = document.createElement('div');
songInfo.id = 'song-info';
musicPlayer.appendChild(songInfo);

const audioPlayer = document.createElement('audio');
audioPlayer.id = 'audio-player';
audioPlayer.autoplay = true;

const audioSource = document.createElement('source');
audioSource.id = 'audio-source';
audioSource.type = 'audio/mp3';
audioPlayer.appendChild(audioSource);

musicPlayer.appendChild(audioPlayer);
document.body.appendChild(musicPlayer);

const totalSongs = document.createElement('div');
totalSongs.id = 'total-songs';
document.body.appendChild(totalSongs);

let songs = [];
let currentSong = null;
const errorMessage = document.createElement('div');
errorMessage.style.position = 'fixed';
errorMessage.style.top = '100%';
errorMessage.style.left = '50%';
errorMessage.style.transform = 'translate(-50%, -50%)';
errorMessage.style.padding = '20px';
errorMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
errorMessage.style.color = 'white';
errorMessage.style.fontSize = '20px';
errorMessage.style.borderRadius = '5px';
errorMessage.style.display = 'none';  // Ban đầu ẩn
document.body.appendChild(errorMessage);
function HongSon_loadSongs() {
    fetch('https://raw.githubusercontent.com/Meliodaspro/songs-music/refs/heads/main/songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data.map(song => ({
                name: song.name,
                file: song.file,
                playCount: 0
            }));
            HongSon_updateTotalSongs();
            HongSon_playRandomSong();
        })
        .catch(error => {
            console.error('Lỗi kết nối tới hệ thống:', error);
            errorMessage.innerText = `Lỗi: ${error.message}`;  // Hiển thị thông báo lỗi
            errorMessage.style.display = 'block';  // Hiển thị phần tử thông báo lỗi
            setTimeout(() => {
                errorMessage.style.display = 'none';  // Ẩn thông báo lỗi sau 5 giây
            }, 5000);
        });
}

function HongSon_formatNumber(num) {
    return num.toString().split('').map(digit => `<span class="number">${digit}</span>`).join(' ');
}

function HongSon_playRandomSong() {
    const availableSongs = songs.filter(song => song.playCount < 2);

    if (availableSongs.length === 0) {
        console.log('Không còn bài hát để phát.');
        return;
    }

    currentSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    songInfo.innerHTML = `♫ ${currentSong.name}`;
    audioSource.src = currentSong.file;
    audioPlayer.load();
    audioPlayer.play();
    currentSong.playCount++;
}

function HongSon_updateTotalSongs() {
    totalSongs.innerHTML = `Có ${HongSon_formatNumber(songs.length)} Bài hát trong hệ thống`;
}

function HongSon_hideElement(element) {
    element.style.animation = 'fadeOut 1s forwards';
}

function HongSon_hideMusicPlayer() {
    setTimeout(() => {
        HongSon_hideElement(musicPlayer);
    }, 5000);
}

function HongSon_hideTotalSongs() {
    setTimeout(() => {
        HongSon_hideElement(totalSongs);
    }, 5000);
}

window.onload = function() {
    HongSon_loadSongs();
    HongSon_hideMusicPlayer();
    HongSon_hideTotalSongs();
};
