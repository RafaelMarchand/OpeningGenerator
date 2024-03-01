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
    const hasListener = this.observers.find((observer: Observer) => observer.name === name)
    if (hasListener) return
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

  remove(name: string) {
    this.observers = this.observers.filter((observer: Observer) => {
      return observer.name !== name
    })
  }
}
