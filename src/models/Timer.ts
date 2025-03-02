type TTimeField = 'hour' | 'minutes' | 'seconds'
interface IHowMany {
    hour: number;
    minutes: number;
    seconds: number;
}
const MODEL_NAME_PART1 = 'vue_timer'
/**
 * Logic model for Timer component
 */
export class TimerModel {
    readonly name: string = `${MODEL_NAME_PART1}_not_inited`;
    /** Init instance date for debug. Not used */
    dStart: Date = new Date();
    /** Used to undestand how many time left to end timer */
    dTarget: Date = new Date(this.dStart);
    readonly howManyWait: IHowMany = {
        hour: 1,
        minutes: 0,
        seconds: 0,
    };
    readonly howManyLeft: IHowMany = {
        ...this.howManyWait,
    };

    constructor(index: number) {
        this.name = `${MODEL_NAME_PART1}_${index}`;
        // init howManyWait
        const h = this.getHMWFromLS('hour')
        const m = this.getHMWFromLS('minutes')
        const s = this.getHMWFromLS('seconds')
        if (h >= 0) {
            this.howManyWait.hour = h
        }
        if (m >= 0) {
            this.howManyWait.minutes = m
        }
        if (s >= 0) {
            this.howManyWait.seconds = s
        }
        // end init howManyWait
        // init howManyLeft
        this.howManyLeft.hour = this.howManyWait.hour
        this.howManyLeft.minutes = this.howManyWait.minutes
        this.howManyLeft.seconds = this.howManyWait.seconds
        // end init howManyLeft
        this.dTarget.setHours(this.dTarget.getHours() + this.howManyWait.hour)
    }
    /**
     * Get this timer property value from localStorage
     * @param field - what property we need
     */
    getLS(field: string): string | null {
        return localStorage.getItem(`${this.name}_${field}`)
    }
    // start title
    get title(): string {
        return this.getLS('timer_title') || 'Timer title'
    }
    set title(value: string) {
        localStorage.setItem(`${this.name}_timer_title`, String(value).trim())
    }
    // end title
    /**
     * Get values for howManyWait property from localStorage
     * @param field - what exactly we try to get
     */
    getHMWFromLS(field: TTimeField): number {
        return parseInt(this.getLS(`hmw_${field}`) || '', 10)
    }
    /**
     * Clear all timer values in localStorage because timer is removed
     */
    clearLS() {
        localStorage.removeItem(`${this.name}_timer_title`)
        localStorage.removeItem(`${this.name}_hmw_hour`)
        localStorage.removeItem(`${this.name}_hmw_minutes`)
        localStorage.removeItem(`${this.name}_hmw_seconds`)
    }
    /**
     * Re-init timer
     */
    setLeftToWait() {
        this.howManyLeft.hour = this.howManyWait.hour
        this.howManyLeft.minutes = this.howManyWait.minutes
        this.howManyLeft.seconds = this.howManyWait.seconds
    }
    /**
     * Save values on pause
     */
    saveHowManyLeft() {
        const dCurrent = new Date()
        this.howManyLeft.hour = (this.dTarget.getDate() - dCurrent.getDate()) * 24 + this.dTarget.getHours() - dCurrent.getHours()
        this.howManyLeft.minutes = this.dTarget.getMinutes() - dCurrent.getMinutes()
        this.howManyLeft.seconds = this.dTarget.getSeconds() - dCurrent.getSeconds()
    }
    /**
     * Init date value at start timer
     */
    loadHowManyLeft() {
        const dCurrent = new Date()
        this.dTarget.setHours(dCurrent.getHours() + this.howManyLeft.hour)
        this.dTarget.setMinutes(dCurrent.getMinutes() + this.howManyLeft.minutes)
        this.dTarget.setSeconds(dCurrent.getSeconds() + this.howManyLeft.seconds)
    }
    /**
     * Set value in model after onchange event
     * @param field - what field changed
     * @param value - what data we get from input
     */
    changeTime(field: TTimeField, value: string) {
        this.howManyWait[field] = parseInt(value, 10)
        localStorage.setItem(`${this.name}_hmw_${field}`, String(value))
    }
    getTimeRender(): IHowMany {
        const now = (this.dTarget.getTime() - Date.now()) / 1000
        return {
            hour: now > 0 ? Math.floor(now / 3600) : 0,
            minutes: now > 0 ? Math.floor(now / 60 % 60) : 0,
            seconds: now > 0 ? Math.floor(now % 60) : 0,
        }
    }
}
