import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import Table from './Table';
import Battle from './Battle';

const Home = ({ propTypes, history }) => {
  const [playerName, setPlayerName] = useState('');
  const [battleId, setBattleId] = useState(null);

  const JOIN_BATTLE = gql`
    mutation Join($playerName: String) {
      join(playerName: $playerName) {
        battleId
        playerId
      }
    }
  `;


  const [joinMutation] = useMutation(JOIN_BATTLE,
    {
      onCompleted: (data) => {
        history.push(`battle/${data.join.battleId}/${data.join.playerId}`);
      }
    });

  function joinBattle() {
    joinMutation({
      variables: {
        playerName
      }
    });
  }

  function handleChange(e) {
    setPlayerName(e.target.value);
  }

  return(
    <div>
        <div className='home'>
          <h1 className='no-select'>BattleShip</h1>
          <div>
            <input value={playerName} onChange={handleChange}/>
            <button onClick={() => joinBattle()}>Join Battle</button>
          </div>
        </div>
    </div>);
};

export default Home;
