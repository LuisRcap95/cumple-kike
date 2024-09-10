const video = document.querySelector('#framevideo');
const container = document.querySelector('#container');
// Video set display size
if(window.matchMedia("(max-width: 767px)").matches) {
    // change style left
    video.style.left = '-50vw';
    video.width = window.innerWidth * 2;
    video.height = window.innerHeight;
} else {
    video.width = window.innerWidth;
    video.height = window.innerHeight;
}
let interactions = 0;
// pouse video on its second 14
video.addEventListener('timeupdate', function(e) {
    e.preventDefault();
    if (video.currentTime >= 5.5 && interactions === 0) {
        changeSlide();
        interactions++;
    }
});

const cuteTexts = [
    `<div class="slider_caption">
        <span class="span-medieval">Estamos encandatados de que hayas aceptado la invitación
        ¡Te esperamos con gusto!<br>🎉🥳🎆🎊</span>
    </div>`
]

function changeSlide () {
    const sliderArea = document.createElement('div');
    sliderArea.innerHTML = cuteTexts[interactions];
    sliderArea.className = `slider-area animate__animated animate__fadeIn animate__delay-2s`;

    container.appendChild( sliderArea );
}