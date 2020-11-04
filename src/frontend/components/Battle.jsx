import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useHistory } from "react-router-dom";
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks';

import Table from './Table';
import Field from './Field';

const Battle = (props) => {
  const {battleId, playerId} = props.match.params;

  if (!battleId) {
    let history = useHistory();
    history.push(`/`);
  }

  const ATTACK_MUTATION = gql`
    mutation Attack($battleId: String, $playerId: String, $x: String, $y: String) {
      attack(battleId: $battleId, playerId: $playerId, x: $x, y: $y)
    }
  `;

  const GET_BATTLE = gql`
    query Battle($playerId: String, $battleId: String) {
      battle(playerId: $playerId, battleId: $battleId) {
        me {
          id
          name
          ships {
            number
            coordinates {
              x
              y
              touched
              sunken
            }
          }
          touchedCoordinates {
            x
            y
            touched
            sunken
          }
          moves {
            x
            y
          }
        }
        rival {
          id
          name
          touchedCoordinates {
            x
            y
            touched
            sunken
          }
          moves {
            x
            y
          }
        }
        turn
        finished
        winner {
          id
          name
        }
      }
    }
  `;

  const { data, refetch, error } = useQuery(
    GET_BATTLE,
    {variables: {
      playerId,
      battleId
    }
  });

  const CHANGE_SUBSCRIPTION = gql`
    subscription onBattleChange {
      battleChange
    }
  `;


  useSubscription(
    CHANGE_SUBSCRIPTION,
    {
      onSubscriptionData: () => {
        refetch();
      }
    }
  );

  const [attackMutation] = useMutation(ATTACK_MUTATION,
    {
      onCompleted: () => {
        refetch();
      }
    });

  function attack(x, y) {
    attackMutation({
      variables: {
        battleId,
        playerId,
        x: (x).toString(),
        y: (y).toString()
      }
    });
  }

  return(
    <div className='no-select'>
      {data && data.battle &&
        <div className='field-container'>
          <div>
            { data.battle.turn === null ?
              (<div>Waiting for another player...</div>) :
              (<Field battle={data.battle}
                attack={attack}
                myTurn={data.battle.turn === playerId}
                playerId={playerId}
              />)
            }
          </div>
          <div>
          { data.battle.finished &&
            `GAME OVER! THE WINNER IS ${data.battle.winner.name}`
          }
          </div>
        </div>
      }
    </div>);
};

export default Battle;
