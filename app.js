const recommendationsDiv = document.getElementById('song-recommendations');
let userSelections = [];

async function fetchRecommendedSong(userSelections) {
    try {
        if (!Array.isArray(userSelections) || userSelections.length === 0) {
            throw new Error('Geçersiz kullanıcı seçimleri');
        }

        const response = await fetch('songs.json');
        if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}`);
        }
        const data = await response.json();
        let recommendedSongs = data;

        userSelections.forEach(selection => {
            if (recommendedSongs && recommendedSongs[selection]) {
                recommendedSongs = recommendedSongs[selection];
            } else {
                throw new Error(`Veride '${selection}' seçeneği bulunamadı`);
            }
        });

        return getRandomSong(recommendedSongs);
    } catch (error) {
        console.error('Önerilen şarkı alınırken hata oluştu:', error);
        return null;
    }
}

function getRandomSong(songs) {
    const options = Object.values(songs).flat();
    if (options.length === 0) {
        return null;
    }
    const randomSong = options[Math.floor(Math.random() * options.length)];
    return randomSong;
} 
function displayRecommendedSong(song) {
    // Mevcut butonları ve soruları gizle
    document.querySelector('.question').style.display = 'none';
    document.querySelector('.btn-group').style.display = 'none';
    recommendationsDiv.innerHTML = '';
    if (song) {
        const songElement = document.createElement('div');
        songElement.innerHTML = `
            <h2 class="recommendation-heading">${song.title} - ${song.artist}</h2>
            <p class="recommendation-paragraph"><strong>Neden Bu Şarkı:</strong> ${song.reason}</p>
            <p class="recommendation-paragraph"><a href="${song.link}" target="_blank">Şarkıyı Dinle</a></p>
        `;
        recommendationsDiv.appendChild(songElement);
    } else {
        const messageElement = document.createElement('p');
        messageElement.textContent = 'Önerilen şarkı bulunamadı.';
        recommendationsDiv.appendChild(messageElement);
    }
}



async function showRecommendedSong() {
    try {
        if (userSelections.length === 0) {
            throw new Error('Lütfen bir duygu seçimi yapın.');
        }
        const recommendedSong = await fetchRecommendedSong(userSelections);
        displayRecommendedSong(recommendedSong);
    } catch (error) {
        console.error('Önerilen şarkı görüntülenirken hata oluştu:', error);
        displayRecommendedSong(null);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.querySelector('.question');
    const buttons = document.querySelectorAll('.mood-btn');

    buttons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const mood = e.target.getAttribute('data-mood');
            userSelections.push(mood);
            await askQuestion();
        });
    });

    async function askQuestion() {
        const questions = [
            'Modun değişsin mi?',
            'Hangi türde müzik dinlemek istersin?',
            'Hangi dilde dinlemek istersin?',
            'Ritim yoğunluğu olsun mu?',
            'Şarkı sözleri anlamlı olsun mu?'
        ];

        const currentQuestionIndex = userSelections.length - 1;

        if (currentQuestionIndex >= questions.length) {
            await showRecommendedSong();
            return;
        }

        questionElement.textContent = questions[currentQuestionIndex];
        const btnGroup = document.querySelector('.btn-group');
        btnGroup.innerHTML = '';

        if (currentQuestionIndex === 0 || currentQuestionIndex === 3 || currentQuestionIndex === 4) {
            createYesNoButtons();
        } else if (currentQuestionIndex === 1) {
            createMusicTypeButtons();
        } else if (currentQuestionIndex === 2) {
            createLanguageButtons();
        }
    }

    function createYesNoButtons() {
        const btnGroup = document.querySelector('.btn-group');
        btnGroup.innerHTML = '';

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Evet';
        yesButton.className = 'yes-no-btn';
        yesButton.addEventListener('click', async () => {
            userSelections.push('Evet');
            await askQuestion();
        });

        const noButton = document.createElement('button');
        noButton.textContent = 'Hayır';
        noButton.className = 'yes-no-btn';
        noButton.addEventListener('click', async () => {
            userSelections.push('Hayır');
            await askQuestion();
        });

        btnGroup.appendChild(yesButton);
        btnGroup.appendChild(noButton);
    }

    function createMusicTypeButtons() {
        const musicTypes = ['Pop', 'Rock','Hip-Hop'];
        const btnGroup = document.querySelector('.btn-group');
        btnGroup.innerHTML = '';

        musicTypes.forEach(type => {
            const button = document.createElement('button');
            button.textContent = type;
            button.className = 'music-type-btn';
            button.setAttribute('data-type', type);
            button.addEventListener('click', async () => {
                userSelections.push(type);
                await askQuestion();
            });
            btnGroup.appendChild(button);
        });
    }

    function createLanguageButtons() {
        const languages = ['Türkçe', 'Yabancı'];
        const btnGroup = document.querySelector('.btn-group');
        btnGroup.innerHTML = '';

        languages.forEach(lang => {
            const button = document.createElement('button');
            button.textContent = lang;
            button.className = 'language-btn';
            button.addEventListener('click', async () => {
                userSelections.push(lang);
                await askQuestion();
            });
            btnGroup.appendChild(button);
        });
    } 
  
});

 


   