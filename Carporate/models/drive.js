class Drive {
    constructor(id, starting_point, destination, date, time, amount_of_people, deviation_time, driver, passangers, passangersPushToken, passangersPickUpLocations, dir) {
        this.id = id;
        this.starting_point = starting_point;
        this.destination = destination;
        this.date = date;
        this.time = time;
        this.amount_of_people = amount_of_people;
        this.deviation_time = deviation_time;
        this.driver = driver;
        this.passangers = passangers;
        this.passangersPushToken = passangersPushToken;
        this.passangersPickUpLocations = passangersPickUpLocations;
        this.dir = dir
    }
}

export default Drive;