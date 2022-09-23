interface Subject {
    subscribe(observer: Observer): void
    unsubscribe(observer: Observer): void
    notify(): void
}

interface Observer {
    update(temperature: Number): void
}

interface TemperatureSensor extends Subject {
    getTemperature(): Number
} 

class TemperatureEndpoint implements TemperatureSensor {
    private temperature: Number = 0;
    private observers: Observer[] = []

    constructor(){
        setInterval(this.readNewTemperature.bind(this), 5000);
    }

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    public unsubscribe(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer)
    }

    public notify(): void {
        this.observers.forEach((observer) => observer.update(this.getTemperature()))
    }

    public getTemperature(): Number {
        return this.temperature;
    }

    private async readNewTemperature(){
        // const response = await fetch('https://weather.contrateumdev.com.br/api/weather/city/?city=Belo%20Horizonte,minas%20gerais')
        // const data = await response.json()

        // this.setTemperature(data.main.temp)
        const randomTemperature = Math.floor(Math.random() * 120);

        this.setTemperature(Math.floor(randomTemperature))
    }

    private setTemperature(temperature: Number) {
        this.temperature = temperature;
        this.notify();
    }
}

class AvenueDisplay implements Observer {
    private temperatureSensor: Subject
    private avenueName: string

    constructor(temperatureSensor: Subject, avenueName: string) {
        this.temperatureSensor = temperatureSensor;
        this.temperatureSensor.subscribe(this)
        this.avenueName = avenueName
    }

    public update(temperature: Number): void {
        console.info(`Temperatura na ${this.avenueName}: ${temperature}`)
    }
}

const temperatureEndpoint = new TemperatureEndpoint();
const avenueA = new AvenueDisplay(temperatureEndpoint, 'Avenida A')
const avenueB = new AvenueDisplay(temperatureEndpoint, 'Avenida B')