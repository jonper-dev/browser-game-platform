// ### The RaceHorse-component ###
// Made with the help of ChatGPT-4o-prompts.
class RaceHorse extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Setting a fixed starting position.
        this.initialPosition = 50;
        this.position = this.initialPosition;
        // Standard speed value, though now overwritten by
        // the semi-random and rubber-banding values of
        // the "handleKeyPress"-function.
        this.speed = 5;
        this.key = this.getAttribute('key') || '';
        this.horsename = this.getAttribute('horsename') || 'Horse';
        this.isRunning = false;
        this.isPaused = false;
        // Setting the horses' lanes. Defaults to lane 1.
        this.lane = parseInt(this.getAttribute('lane')) || 1;
        // For custom emoji-inputs.
        this.emoji = this.getAttribute('emoji') || '🏇';
    }

    connectedCallback() {
        this.render();
        document.addEventListener('keyup', (e) => this.handleKeyPress(e));
        document.addEventListener('race-start', () => this.isRunning = true);
        document.addEventListener('race-reset', () => this.resetPosition());
        document.addEventListener('race-paused', (e) => this.togglePause(e.detail.isPaused));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .horse {
                    position: absolute;
                    font-size: 1em;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    /* Ensures space between name and emoji */
                    gap: 2vw;
                    left: ${this.position}px;
                    top: ${this.lane * 12}vh;
                    z-index: 80;
                    transition: left 0.1s ease-out;
                }
                .racer-name {
                    background-color: antiquewhite;
                    font-size: 0.8em;
                    position: absolute;
                    white-space: nowrap;
                    /* Positions the name 1em-unit above the emoji. */
                    top: -1em;
                    padding: 1px;
                    min-width: 100px;
                    text-align: right;
                    z-index: 100;
                }
                .racer-graphic {
                    font-size: 1.6em;
                    transform: scale(-1, 1) rotate(0deg);
                    transition: transform 0.1s ease-in-out;
                }
                .racer-graphic.wobble {
                    animation: wobble 0.3s ease-in-out 2; /* Slight wiggle effect */
                }
                @keyframes wobble {
                    0% { transform: scale(-1, 1) rotate(0deg); }
                    25% { transform: scale(-1, 1) rotate(-10deg); }
                    50% { transform: scale(-1, 1) rotate(10deg); }
                    75% { transform: scale(-1, 1) rotate(-5deg); }
                    100% { transform: scale(-1, 1) rotate(0deg); }
                }
                .dust-trail {
                    font-size: 1.6em;
                    transform: scale(-1, 1);
                    position: absolute;
                    /* Places dust behind the horse. */
                    /* Separate from the graphic so it can be detached from the emoji. */
                    /* Thus avoiding the issue of the dust "pushing" the horse. - Jon */
                    right: 100%;
                    opacity: ${this.dustActive ? 1 : 0};
                    transition: opacity 0.5s ease-out;
                }
            </style>
            <div class="horse">
                <p class="racer-name">${this.horsename} (${this.key.toUpperCase()})</p>
                <p class="dust-trail">${this.dustActive ? '💨' : ''}</p>
                <p class="racer-graphic ${this.isStopped ? 'wobble' : ''}">${this.emoji}</p>
            </div>
        `;
    }

    // ## handleKeyPress-function ##
    handleKeyPress(event) {
        if (this.isRunning && !this.isPaused && event.key.toLowerCase() === this.key.toLowerCase()) {
            const trackWidth = document.querySelector('race-track').offsetWidth; // Get track width dynamically.
            const finishLineX = trackWidth * 0.70; // Finish line at 70% of track width
            const horseWidth = 40; // Approximate width of horse emoji.

            // STOP MOVEMENT if horse has reached or crossed the finish line by some margin.
            // Do a bit more than the finish-line to ensure a winner is chosen.
            if (this.position + horseWidth >= finishLineX + (trackWidth * 0.25)) {
                this.isStopped = true;
                // Re-render to apply wobble effect.
                this.render();
                return;
            }

            // Continue with movement logic if not.
            const stepSize = trackWidth * 0.025; // Moves the horses by 2.5% of the track width.

            const allHorses = [...document.querySelectorAll('race-horse')];
            // Find the leading horse's position.
            const maxPosition = Math.max(...allHorses.map(h => h.position));

            // Calculate how far behind the leader this horse is.
            const distanceBehind = maxPosition - this.position;

            // "Mario Kart"-style "rubberbanding", e.g. the racers further behind
            // have speed advantages to catch up (beginner friendly and keeps excitement).
            // Adjusting the probability based on distance behind the leader. - Jon
            let speedBoost;
            if (distanceBehind > 100) {
                speedBoost = [stepSize * 1.3, stepSize * 1.5, stepSize * 1.6];  // Higher odds of fast movement.
            } else if (distanceBehind > 50) {
                speedBoost = [stepSize * 1.1, stepSize * 1.3, stepSize * 1.5];  // Slightly increased chance of high speed.
            } else {
                speedBoost = [stepSize, stepSize * 1.1, stepSize * 1.2];        // Normal, balanced speed.
            }

            // Randomly select a speed based on the probability table
            this.speed = speedBoost[Math.floor(Math.random() * speedBoost.length)];
            this.position += this.speed;

            // Trigger the dust-trail effect behind the horses.
            this.showDustEffect();
            this.render();
            this.dispatchEvent(new CustomEvent('horse-moved', { bubbles: true, detail: { name: this.horsename, position: this.position } }));
        }
    }

    // ## resetPosition-function ##
    resetPosition() {
        // Resets to the exact initial position.
        this.position = this.initialPosition;
        this.isRunning = false;
        // Removing the stop state,
        // which clears the stopped button-press animation.
        this.isStopped = false;
        this.render();
    }

    resetHorse() {
        this.isStopped = false; // Remove stop state
        this.position = 0; // Move horse back to start
        this.render(); // Re-render without wobble effect
    }

    // ## togglePause-function ##
    togglePause(isPaused) {
        this.isPaused = isPaused;
    }

    // ## showdustEffect-function ##
    // showDustEffect adds a dust-trail behind the relevant horse
    // for a short duration after the connected keypress.
    showDustEffect() {
        this.dustActive = true;
        // Update the horse to show the dust-cloud (💨).
        this.render();
    
        // Set a timeout to fade out the dust after 500ms.
        clearTimeout(this.dustTimeout);
        this.dustTimeout = setTimeout(() => {
            this.dustActive = false;
            this.render();
        }, 500);
    }
}

customElements.define('race-horse', RaceHorse);
