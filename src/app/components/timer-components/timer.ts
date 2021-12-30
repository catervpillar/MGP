import { TimerComponents } from "./timer-components";

export class Timer {
    /**
     * Tempo totale del timer
     */
    private timerTime: number;

    /**
     * Tempo rimanente
     */
    private timeLeft: number;

    /**
     * Valore booleano per abilitare il timer 
     */
    enabled: boolean = false;

    /**
     * Componente grafico del timer
     */
    private timerComponent: TimerComponents = null;

    /**
     * Callback da chiamare quando il timer termina
     */
    callback: Function

    constructor(timerTime: number, enabled: boolean, cb?: Function) {
        this.timerTime = timerTime;
        this.timeLeft = timerTime;
        this.enabled = enabled;
        this.callback = cb;
    }

    /**
     * Avvia il timer.
     */
    startTimer() {
        this.enabled = true;
        if (this.timerComponent)
            this.timerComponent.startTimer();
    }

    /**
     * Ferma il timer.
     */
    stopTimer() {
        this.enabled = false;
    }

    /**
     * Imposta il componente grafico del timer.
     * @param timerComponent Componente grafico del timer
     */
    setTimerComponent(timerComponent: TimerComponents) {
        timerComponent = timerComponent;
    }

    /**
     * Imposta il tempo iniziale del timer.
     * @param timerTime Tempo iniziale del timer
     */
    setTimerTime(timerTime: number) {
        this.timerTime = timerTime;
        this.timeLeft = timerTime;
    }

    setCallback(cb) {
        this.callback = cb;
    }

    /**
     * Ritorna il componente grafico del timer.
     */
    getTimerComponent() {
        return this.timerComponent;
    }

    /**
     * Ritorna il tempo rimanente del timer.
     */
    getTimeLeft() {
        return this.timeLeft;
    }

    /**
     * Ritorna il tempo totale del timer.
     */
    getTimerTime() {
        return this.timerTime;
    }

    /**
     * Ritorna il tempo rimanente in formato *"minuti : secondi"*.
     * @returns una stringa contenente il tempo rimanente del timer
     */
    getTimeLeftToPrint() {
        var toReturn = "";
        if (this.timeLeft >= 60) {
            var minutes = Math.floor(this.timeLeft / 60);
            var seconds = this.timeLeft - (minutes * 60);

            if (seconds < 10)
                toReturn = minutes + ":0" + seconds;
            else
                toReturn = minutes + ":" + seconds;

        } else if (this.timeLeft >= 10)
            toReturn = "00:" + this.timeLeft;
        else
            toReturn = "00:0" + this.timeLeft;

        return toReturn;
    }

    /**
     * Riduce il tempo rimanente del timer.
     */
    decreaseTimeLeft() {
        this.timeLeft--;
    }

}