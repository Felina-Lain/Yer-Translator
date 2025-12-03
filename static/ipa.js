const inputMessage = document.getElementById('input_message');
const validerButton = document.getElementById('valider_button');
const audio = document.getElementById('audio');
var audioContext = null;

validerButton.addEventListener('click', function() {
    if(!inputMessage.value){  
        audio.src = "../IPA/silence.wav";
        audio.play();
        return;
    }
    
    // Stop any current playback
    if (audioContext) {
        audioContext.close();
    }
    //new empty playback    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //split the letters of the text
    var audioPaths = inputMessage.value.split('');
    
    // Create an array of promises to load all files (to make sure they load in order)
    var loadPromises = audioPaths.map(function(letter) {
        //get the file path from the letters
        var soundPath;
        if(letter != " ") {
            soundPath = "../IPA/" + letter + ".wav";
        } else {
            soundPath = "../IPA/silence.wav";
        }
        //use the paths to get the files and extract just the audio data
        return fetch(soundPath)
            .catch(() => fetch("IPA/empty.wav")) // If the letter typed didn't have a sound file, use silence
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .catch(error => {
                // if it still fail, generate some empty sound file
                var buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
                return buffer;
            });
    });
    
    // Wait for ALL files to load
    Promise.all(loadPromises).then(function(audioBuffers) {
        //start to play at time 0
        var currentTime = 0;
        
        // Now schedule them IN ORDER
        audioBuffers.forEach(function(audioBuffer) {
            var source = audioContext.createBufferSource(); //like creating a new CD player to play the sounds
            source.buffer = audioBuffer; //load the current sound in
            source.connect(audioContext.destination); //connect to the speakers, allow the sound to play, without it, no sound
            source.start(currentTime); //when to start playing. That's the magic, that check if the previous sound is done before starting the next right on time
            
            // Add duration for next sound
            currentTime += audioBuffer.duration;
        });
    });
});