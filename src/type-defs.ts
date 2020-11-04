import { gql } from 'apollo-server';

export default gql`

  type Subscription {
    battleChange: String
  }

  type Me {
    name: String!
  }

  type Coordinate {
    x: Int
    y: Int
    touched: Boolean
    sunken: Boolean
  }

  type Ship {
    number: Int
    coordinates: [Coordinate]
    sunken: Boolean
  }

  type Player {
    id: String
    name: String
    ships: [Ship]
    touchedCoordinates: [Coordinate]
    moves: [Coordinate]
  }

  type Battle {
    me: Player
    rival: Player
    createdTime: String
    turn: String
    finished: Boolean
    winner: Player
  }

  type BattleInfo {
    battleId: String
    playerId: String
  }

  type Query {
      me: Me
      battles: [Battle]
      battle(playerId: String, battleId: String): Battle
  }

  type Mutation {
    join(playerName: String): BattleInfo
    attack(battleId: String, playerId: String, x: String, y: String): String
  }
`;