const video = document.querySelector('#framevideo');
const music = document.querySelector('#audio');
video.currentTime = 3;
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
    if (video.currentTime >= 24 && interactions === 0) {
        video.pause();
        changeSlide();
        interactions++;
    } else if(video.currentTime >= 69.5 && video.currentTime < 80 && interactions === 1) {
        video.pause();
        interactions = 1;
        changeSlide();
        interactions++;
    } else if (video.currentTime >= 144 && interactions === 1) {
        video.pause();
        interactions = 2;
        changeSlide();
    }
});

const cuteTexts = [
    `<div class="slider_caption">
        <span class="span-message">Parece que los minions van a celebrar algo estás invitado a la pachanga por el
        cumpleaños de <strong>Enrique Rico</strong> el día 20 de Octubre a las 12:00pm para festejar sus 60 años 🥳 en la siguiente
        dirección:<br>
        <a href="https://maps.app.goo.gl/cKNerAivg6nfuytd8" target=_blank>Calle Prol. Naranjo 445, Col. Del Gas,
        Azcapotzalco, C.P. 02950, CDMX</a><br>
        Nota: ya estás en la lista, sólo necesitamos que busques tu nombre y selecciones los invitados que llevarás. Están
        limitados a las personas que contemplamos de tu familia o acompañantes.</span>
        <div class="btn-container">
            <button id="si" >¿Confirmas asistencia?</button>
            <button id="no" >No, gracias</button>
        </div>
    </div>`,
    `<div class="slider_caption">
    <span class="span-message">Los minions están listos para la fiesta de Enrique pero nos faltas tú
    así que busca tu nombre en la lista y confirma tu asistencia  y la de tus acompañantes.
    </span>
    <form id="inviteForm">
        <select name="hosts" id="hosts"></select>
        <input class="pap-input" type="number" placeholder="Acompañantes (0 si no)" id="guests" required />
        <button class="pap-btn" id="enviar" >Confirmar</button>
    </form></div>`,
    `<div class="slider_caption">
    <sapn class="span-message">
        Bueno, los minions ya no tienen nada que hacer entonces...😕😩<br><br>
        Pero no te preocupes, si cambias de opinión puedes volver a abrir la invitación en cualquier momento
        y confirmar tu asistencia.
    </span>
    </div>`,
]

const csvData = {};

function changeSlide () {
    const sliderArea = document.createElement('div');
    sliderArea.innerHTML = cuteTexts[interactions];
    sliderArea.className = `slider-area animate__animated animate__fadeIn animate__delay-2s`;

    container.appendChild( sliderArea );

    if (interactions === 0) {
        addFirstListenerButtons();
    } else if (interactions === 1) {
        const selectInput = document.querySelector('#hosts');
        const guestsInput = document.querySelector('#guests');
        guestsInput.min = 0;
        guestsInput.max = 0;

        guestsInput.addEventListener('change', getMaxInvited);
        selectInput.addEventListener('change', addMaxGuests);
        // Read csv from the same domain
        const url = window.location.origin;

        const lines = [
            ["Nombre","Invitados"],
            ["Marta Rico Hernández","3"],
            ["Francisco Zamora Rico","1"],
            ["Wenceslao Rico Hernández","3"],
            ["José Luis Herrada","3"],
            ["Gilberto Eduardo Rico","3"],
            ["Christian Chávez","2"],
            ["Manuel Santos Torres","3"],
            ["Francisco De la Peña","3"],
            ["José Juan Chávez","5"],
            ["Oscar Quintanar","3"],
            ["Samuel Said Apaez García","1"],
            ["Juan Carlos Apaez","1"],
            ["Juan Jesús García","2"],
            ["Jorge Meléndez","2"],
            ["Monica Daría Castorena","3"],
            ["Alberto Torres","3"],
            ["Amparo Rico Cortés","0"],
            ["Salome Hernández Solano","1"],
            ["Vicente Ramírez Hernández","1"],
            ["Jaime Cortés","4"],
            ["Eva Meléndez Rico","2"],
            ["Graciela Hernández","1"],
            ["Karla Apaez García","1"]
        ]
        lines.forEach( (line, index) => {
            const option = document.createElement('option');
            if( index === 0 ) {
                option.value = '';
                option.innerHTML = 'Selecciona tu nombre';
                selectInput.appendChild(option);
                selectInput.selectedIndex = 0;
                return;
            }
            const [name, guests] = line;
            csvData[name] = parseInt(guests);
            option.value = name;
            option.innerHTML = name;
            selectInput.appendChild(option);
        })

        addFormListener();
    }

}

function getMaxInvited(e) {
    e.preventDefault();
    const guestsInput = document.querySelector('#guests');
    const selectedHost = document.querySelector('#hosts').value;
    const maxGuests = csvData[selectedHost];
    if( !selectedHost ) {
        guestsInput.value = 0;
        return;
    }
    
    guestsInput.value = e.target.value > maxGuests ? maxGuests : e.target.value;
}

function addMaxGuests(e) {
    e.preventDefault();
    const guestsInput = document.querySelector('#guests');
    const selectedHost = document.querySelector('#hosts').value;
    
    if( !selectedHost ) {
        guestsInput.max = 0;
        return;
    }
    const maxGuests = csvData[selectedHost];
    guestsInput.max = maxGuests;
}

function addFirstListenerButtons () {
    const buttonSi = document.querySelector('#si');
    const buttonNo = document.querySelector('#no');
    buttonSi.addEventListener( 'click', (e) => {
        e.preventDefault();
        video.currentTime = 45.2;
        video.play();
        container.removeChild( document.querySelector('.slider-area') );
    })

    buttonNo.addEventListener( 'click', (e) => {
        e.preventDefault();
        container.removeChild( document.querySelector('.slider-area') );
        video.currentTime = 104.5;
        music.pause();
        video.play();
        // unmute video
        video.muted = false;
    })
}

function addFormListener() {
    const url = "https://4dja2iwn78.execute-api.us-west-1.amazonaws.com/Prod";
    const btnSubmit = document.querySelector('#enviar');
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        try {
            document.querySelector('#inviteForm').removeChild( document.querySelector('.error-form') );
        } catch( err ) {}
        const nombre = document.querySelector('#hosts').value;
        const acompanantes = document.querySelector('#guests').value;

        if( !nombre || !acompanantes ) {
            const errorMessage = document.createElement('span');
            errorMessage.innerHTML = `Por favor llene todos los campos`;
            errorMessage.className = `message-form-err text-light`;
            document.querySelector('#inviteForm').appendChild(errorMessage)
            return;
        }

        btnSubmit.innerText = `Gracias!`
        btnSubmit.classList.remove('pap-btn');
        btnSubmit.classList.add('btn');
        btnSubmit.classList.add('btn-success');
        btnSubmit.disabled = true

        const successMessage = document.createElement('span');
        successMessage.innerHTML = `Estamos registrando sus datos`;
        successMessage.className = `message-form-succ text-light`;
        document.querySelector('#inviteForm').appendChild(successMessage);
        fetch(url + '/confirm-guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nombre, companions: acompanantes})
        }).then( res => {
            if(res.ok) {                
                setTimeout(() =>{
                    window.location = 'invite-accepted.html';
                },500);
            } else {
                return res.json();
            }
        }).then( data => {
            if( data ) {
                const errorMessage = document.createElement('span');
                errorMessage.innerHTML = `Error: ${data?.message}`;
                errorMessage.className = `message-form-err text-light`;
                document.querySelector('#inviteForm').appendChild(errorMessage)
                btnSubmit.disabled = false;
            }
        })
    })
}