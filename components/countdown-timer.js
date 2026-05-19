// ### Countdown-timer-component ###

// The countdown-timer is heavily based on on Full-stack lecture 9
// and the in-class activity done then, though it has been reworked from
// scratch in cooperation with ChatGPT-4o through my prompts,
// and small additional edits by me to ensure responsiveness and good layout.

// Credits: ChatGPT-4o, my prompts and my edits for the current code.
//          The Full-stack students, full-stack TAs and Carlos
//          at NTNU in Gjøvik for the initial code before rework.
class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.seconds = parseInt(this.getAttribute('seconds'), 10) || 3;
        this.remainingTime = this.seconds;
        this.interval = null;
        this.isPaused = false;
    }

    connectedCallback() {
        this.render();
        document.addEventListener('keydown', (e) => this.handleHotkeys(e)); // Listen for hotkeys
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .countdown { font-size: 24px; text-align: center; }
                button { margin: 5px; padding: 10px; cursor: pointer; }
            </style>
            <div class="countdown">${this.remainingTime}</div>
            <button id="start_button">Start Race</button>
            <button id="pause_button">Pause</button>
            <button id="reset_button">Reset</button>
        `;

        this.shadowRoot.querySelector('#start_button').addEventListener('click', () => this.startCountdown());
        this.shadowRoot.querySelector('#pause_button').addEventListener('click', () => this.togglePause());
        this.shadowRoot.querySelector('#reset_button').addEventListener('click', () => this.resetCountdown());
    }

    // Added hotkey functionality for smoother testing and playing. - Jon
    handleHotkeys(event) {
        if (event.key.toLowerCase() === 'p') {
            this.togglePause();     // Toggles pause when "p" is pressed.
        } else if (event.key.toLowerCase() === 'r') {
            this.resetCountdown();  // Resets the game when "r" is pressed.
        }
    }

    startCountdown() {
        if (this.interval) return;

        let countdownElement = this.shadowRoot.querySelector('.countdown');
        this.interval = setInterval(() => {
            if (this.isPaused) return;
            if (this.remainingTime > 0) {
                this.remainingTime--;
                countdownElement.textContent = this.remainingTime;
            } else {
                clearInterval(this.interval);
                this.interval = null;
                document.dispatchEvent(new Event('race-start'));
            }
        }, 1000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.dispatchEvent(new CustomEvent('race-paused', { detail: { isPaused: this.isPaused } }));
        this.shadowRoot.querySelector('#pause_button').textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    resetCountdown() {
        clearInterval(this.interval);
        this.interval = null;
        this.remainingTime = this.seconds;
        this.shadowRoot.querySelector('.countdown').textContent = this.remainingTime;
        document.dispatchEvent(new Event('race-reset'));
    }
}

customElements.define('countdown-timer', CountdownTimer);
