// ### The RaceTrack-component ###
// Made with the help of ChatGPT-4o-prompts.
class RaceTrack extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Initial finish-line value, now replaced with one with
        // a relative positioning which relates to the track-size.
        this.finishLine = 500;
        this.winnerAnnounced = false;
        this.isPaused = false;
    }

    connectedCallback() {
        this.render();
        this.addEventListener('horse-moved', this.checkWinner.bind(this));
        document.addEventListener('race-reset', () => this.resetRace());
        document.addEventListener('race-paused', (e) => this.togglePause(e.detail.isPaused));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .track {
                    position: relative;
                    /* Ensures scaling with screen size. */
                    width: 90vw;
                    height: 60vh;
                    max-width: 1200px;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
                .finish-line {
                    position: relative;
                    /* Keeps the finish line within screen, and card, approximately. */
                    left: 70%;
                    height: 100%;
                    width: 3px;
                    background: white;
                }
                #winner {
                    background-color: antiquewhite;
                    position: static;
                    padding: 0.2em;
                }
                @media (max-width: 600px) {
                    .track {
                        /* Increase allowed height for small screens to fit all horses. - Jon */
                        height: 64vh;
                    }
                    .finish-line {
                        /* Adjusting the finish-line position on smaller screens. */
                        right: 3%;
                    }
                }
            </style>
            <div class="track">
                <div class="finish-line"></div>
                <slot></slot>
            </div>
            <div id="winner">Winner not decided...</div>
        `;
    }

    checkWinner(event) {
        const trackElement = this.shadowRoot.querySelector('.track');
        const trackWidth = trackElement.offsetWidth; // Getting the current track width.
        // The finish line is at roughly 70% of the track width.
        const finishLineX = trackWidth * 0.70;
        const horseWidth = 40; // Approximate horse emoji width in pixels.
    
        if (!this.winnerAnnounced && event.detail.position + horseWidth >= finishLineX) {
            this.winnerAnnounced = true;
            const winnerText = `🏆 Winner: ${event.detail.name}!`;
            this.shadowRoot.querySelector('#winner').textContent = winnerText;
    
            this.dispatchEvent(new CustomEvent('race-finished', { detail: { winner: event.detail.name } }));
        }
    }

    resetRace() {
        this.winnerAnnounced = false;
        this.shadowRoot.querySelector('#winner').textContent = 'Race restarted. Winner not decided...';
    }

    togglePause(isPaused) {
        this.isPaused = isPaused;
    }
}

customElements.define('race-track', RaceTrack);
