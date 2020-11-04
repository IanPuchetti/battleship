import { PubSub, withFilter } from 'graphql-subscriptions';
import createBattle from './models/battle';

const pubsub = new PubSub();

const players: any = new Array();
const battles: any = new Array();

function addBattle() {
  const newBattle = createBattle();
  battles.push(newBattle);
  return newBattle;
}

function findAvailableBattle(battles: any) {
  const availableBattle = battles.find((battle: any) => {
    return battle.players.some((player: any) => player.id === null);
  });
  return availableBattle;
}

function joinBattle(joiningPlayer: any, battles: any) {
  const shortid = require('shortid');
  const availableBattle = findAvailableBattle(battles);
  const battle = availableBattle || addBattle();
  const emptyPlayer = battle.players.find((player: any) => {
    return player.id === null;
  });
  const newPlayerId = shortid.generate();
  joiningPlayer.id = newPlayerId;
  emptyPlayer.id = newPlayerId;
  emptyPlayer.name = joiningPlayer.name;
  players.push(emptyPlayer);

  if (availableBattle) {
    const turn = Math.floor(Math.random() * 2);
    battle.turn = battle.players[turn].id;
  }

  return {battleId: battle.id, playerId: newPlayerId};
}

function getRival(me: any, battle: any) {
  const rival = battle.players.find((player: any) => {
    return player.id !== me.id;
  });

  if (rival && (rival.id === null)) {
    return {
      id: rival.id,
      name: rival.name,
      touchedCoordinates: [],
      moves: []
    }
  }
  const touchedCoordinates = new Array();

  if (rival) {
    rival.ships.map((ship: any) => {
      const touched = ship.coordinates.filter((coordinate: any) => coordinate.touch);
      if (touched.length) {
        touchedCoordinates.push(...touched);
      }
    })
    return {
      id: rival.id,
      name: rival.name,
      touchedCoordinates,
      moves: rival.moves
    };
  }
  return {};
}

function getPlayerSide(me: any, battle: any) {
  const myPlayer = battle.players.find((player: any) => {
    return player.id === me.id;
  });

  const rival = getRival(myPlayer, battle);

  return {
    me: myPlayer,
    rival,
    createdTime: battle.createdTime,
    turn: battle.turn,
    finished: battle.finished,
    winner: battle.winner
  }
}

function addMove(attacker: any, x: number, y: number) {
  const move = {x, y};
  attacker.moves.push(move);
}

function sunkShip(ship: any) {
  ship.sunken = true;
  ship.coordinates.map((coordinate: any) => {
    coordinate.sunken = true;
  });
}

function touchShip(receiver: any, x: number, y: number) {
  receiver.ships
    .map((ship: any) => {
      const section = ship.coordinates
        .find((coordinate: {x: string, y: string}) => {
          return parseInt(coordinate.x, 10) === parseInt(x, 10)
           && parseInt(coordinate.y, 10) === parseInt(y, 10);
        });
      if (section) {
        section.touch = true;
        const isSunken = ship.coordinates.every((coordinate: any) => coordinate.touch);
        if (isSunken) {
          sunkShip(ship);          
        }
      }
    });
}

function changeTurn(battle: any, playerId: any) {
  battle.turn = playerId;
}

function finishGame(battle: any, winner: any) {
  battle.finished = true;
  battle.winner = {
    id: winner.id,
    name: winner.name
  };
}

function verifyWinning(battle: any, receiver: any, attacker: any) {
  const allSunken = receiver.ships.every((ship: any) => ship.sunken);
  if (allSunken) {
    finishGame(battle, attacker);
  }
}

function attack(battleId: string, playerId: string, x: string, y: string) {
  const currentBattle = battles.find((battle: any) => battle.id === battleId);
  const attacker = currentBattle.players
    .find((player: {id: string}) => player.id === playerId);
  const receiver = currentBattle.players
    .find((player: {id: string}) => player.id !== playerId);
  addMove(attacker, parseInt(x, 10), parseInt(y, 10));
  touchShip(receiver, parseInt(x, 10), parseInt(y, 10));
  changeTurn(currentBattle, receiver.id);
  verifyWinning(currentBattle, receiver, attacker);
}

export default {
    Query: {
      battles: (): [any] => (battles),
      battle: (parent: object, args: {playerId: string, battleId: string}): any => {
        const player = {
          id: args.playerId
        };
        const currentBattle = battles.find((battle: any) => battle.id === args.battleId);

        const playerSide = getPlayerSide(player, currentBattle);
        return playerSide;
      }
    },
    Mutation: {
      join: (parent: object, args: {playerName: string}) => {
        const battleInfo = joinBattle({name: args.playerName}, battles);
        pubsub.publish('battleChange', {
          battleChange: 'battleChanged!'
        });
        return battleInfo;
      },
      attack: (parent: object, args: {battleId: string, playerId: string, x: string, y: string}) => {
        const {battleId, playerId, x, y} = args;
        attack(battleId, playerId, x, y);
        pubsub.publish('battleChange', {
          battleChange: 'battleChanged!'
        });
        pubsub.publish('turn', {
          turn: playerId
        });

        return 'attacked!';
      }
    },
    Subscription: {
      battleChange: {
        subscribe: () => pubsub.asyncIterator('battleChange'),
      }
    }
  };