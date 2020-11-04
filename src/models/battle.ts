
function verifyAvailability(unavailableCoordinates: [{x: number, y: number}], coordinate: {x: number, y: number}) {
    const filteredCoordinate = unavailableCoordinates
     .filter((unavailableCoordinate) => {
        return unavailableCoordinate.x === coordinate.x && 
               unavailableCoordinate.y === coordinate.y;
     });
    return !filteredCoordinate.length;
}
 
function addToUnavailables(unavailableCoordinates: [object], coordinate: {x: number, y: number}) {
    const {x, y} = coordinate;
    unavailableCoordinates.push({x, y});
}

function createShip(length: number, unavailableCoordinates: [{x: number, y: number}]): any {
    const isVertical = Math.random() >= 0.5;
    const xRange = isVertical ? 10 : (10 - length);
    const yRange = isVertical ? (10 - length) : 10;
    const x = Math.floor(Math.random() * xRange);
    const y = Math.floor(Math.random() * yRange);

    try {
        const coordinates = new Array(length).fill({})
        .map((coordinate, number) => {
            const shipX = isVertical ? x : (x + number);
            const shipY = isVertical ? (y + number) : y;
            const available = verifyAvailability(unavailableCoordinates, {x: shipX, y: shipY});
            if (available) {
                addToUnavailables(unavailableCoordinates, {x: shipX, y: shipY})
                return {x: shipX, y: shipY, touched: false};
            } else {
                throw new Error('unavailable');
            }
        });
        return {number: length, coordinates, sunken: false};
    } catch(error) {
        return createShip(length, unavailableCoordinates);
    }
}

function addShips(player: object, unavailableCoordinates: any) {
    const ships = new Array(4).fill({}).map((ship, index) => {
        return createShip((index + 1), unavailableCoordinates);
    });
    return ships;
}

function createBattle(): any {
    const shortid = require('shortid');
    const unavailableCoordinates = new Array();
    const players = new Array(2).fill(null).map((player) => {
        return {
            id: null,
            name: null,
            ships: addShips(player, unavailableCoordinates),
            moves: [],
            touchedCoordinates: []
        };
    });
    const createdTime = (new Date()).toString();
    return {
        id: shortid.generate(),
        players,
        createdTime,
        turn: null,
        finished: false,
        winner: null
    };
}

export default createBattle;
