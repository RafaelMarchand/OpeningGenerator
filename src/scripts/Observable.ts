type Observer = {
  name: string
  callback: any
}

export default class Observable {
  observers: Observer[]
  constructor() {
    this.observers = []
  }

  listen(name: string, callback: any) {
    const listener = { name, callback }
    this.observers.push(listener)
  }

  notify(name: string, ...args: any[]) {
    this.observers.forEach((observer: Observer) => {
      if (name === observer.name) {
        observer.callback(...args)
      }
    })
  }
}
