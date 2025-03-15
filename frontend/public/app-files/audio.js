let dropdown = document.getElementById("sceneDropdown");
        let audioPlayer = document.getElementById("audioPlayer");

        // Object mapping scene values to corresponding audio files
        let audioMap = {
            "0-telescopes": "./audio/telescopes.mp3",
            "1-observatry": "./audio/observatory.mp3",
            "0-comp": "./audio/computer.mp3",
            "2-new-home": "./audio/new-home.mp3",
            "3-dom": "./audio/dom.mp3"
        };

        dropdown.addEventListener("change", function() {
            let selectedValue = dropdown.value; // Get selected value

            if (audioMap[selectedValue]) {
                audioPlayer.src = audioMap[selectedValue]; // Set the audio source
                audioPlayer.play(); // Play the audio
            } else {
                audioPlayer.pause(); // Pause if no matching audio
                audioPlayer.currentTime = 0;
            }
        });