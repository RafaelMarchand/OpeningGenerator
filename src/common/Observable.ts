type Observer = {
  name: Symbol
  callback: Function
}

export default class Observable {
  observers: Observer[]
  constructor() {
    this.observers = []
  }

  listen(name: Symbol, callback: Function) {
    const hasListener = this.observers.find(
      (observer: Observer) => observer.name === name && observer.callback.toString() === callback.toString()
    )
    if (hasListener) return
    const listener = { name, callback }
    this.observers.push(listener)
  }

  notify(name: Symbol, ...args: any[]) {
    this.observers.forEach((observer: Observer) => {
      if (name === observer.name) {
        observer.callback(...args)
      }
    })
  }

  remove(name: Symbol) {
    this.observers = this.observers.filter((observer: Observer) => {
      return observer.name !== name
    })
  }
}
