document.addEventListener('DOMContentLoaded', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const colorRadios = document.querySelectorAll('input[name="p1color"]');
    const p2ColorDisplay = document.getElementById('p2ColorDisplay');
    const startGameBtn = document.getElementById('startGameBtn');
    const errorMsg = document.getElementById('errorMsg');


    colorRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'white') {
                p2ColorDisplay.innerHTML = 'Assigned to: <strong>Black</strong>';
            } else {
                p2ColorDisplay.innerHTML = 'Assigned to: <strong>White</strong>';
            }
        });
    });


    startGameBtn.addEventListener('click', () => {
        const p1Name = player1Input.value.trim();
        const p2Name = player2Input.value.trim();
        
        if (!p1Name || !p2Name) {
            errorMsg.textContent = 'Please enter names for both players.';
            return;
        }

        const p1Color = document.querySelector('input[name="p1color"]:checked').value;
        const p2Color = p1Color === 'white' ? 'black' : 'white';

        let whitePlayer = p1Color === 'white' ? p1Name : p2Name;
        let blackPlayer = p1Color === 'black' ? p1Name : p2Name;


        sessionStorage.setItem('chess_whitePlayer', whitePlayer);
        sessionStorage.setItem('chess_blackPlayer', blackPlayer);


        document.body.classList.add('fade-out');
        

        setTimeout(() => {
            window.location.href = 'chess.html';
        }, 500);
    });
});
