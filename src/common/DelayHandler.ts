export default class DelayHandler {
  setTimeOutID: number | null
  constructor() {
    this.setTimeOutID = null
  }

  setTimer(delay: number, callback: any, ...args: any[]) {
    if (this.setTimeOutID !== null) return

    this.setTimeOutID = setTimeout(() => {
      this.setTimeOutID = null
      callback(...args)
    }, delay)
  }

  cancle() {
    if (this.setTimeOutID) {
      clearTimeout(this.setTimeOutID)
      this.setTimeOutID = null
    }
  }
}
