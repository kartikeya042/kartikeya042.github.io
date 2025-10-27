document.querySelector('.snake-game').addEventListener('click', () => {
    redirectToGame('Snake Game');
});

document.querySelector('.flappy-bird-game').addEventListener('click', () => {
    redirectToGame('Flappy Bird Game');
});

function redirectToGame(folderName) {
    const encodedFolder = encodeURIComponent(folderName);
    window.location.href = `${encodedFolder}/index.html`;
}