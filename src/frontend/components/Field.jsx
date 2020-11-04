import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import Table from './Table';
import RivalsTable from './RivalsTable';

const Field = ({ battle, attack, myTurn }) => {
  return(
    <div>
      <div>
          <div>
            { myTurn ? `${battle.rival.name.toUpperCase()} ' S FIELD`
              : `WAITING FOR ${battle.rival.name.toUpperCase()} ' S ATTACK ...` }
          </div>
          <div className='table-container'>
            <RivalsTable rival={ battle.rival } moves={ battle.me.moves } attack={attack}/>
            { (!myTurn) &&
              <div className='block-table'></div>
            }
          </div>
          <div className='table-container'>
            <Table ships={ battle.me.ships } moves={battle.rival.moves}/>
          </div>
          <div>
              { myTurn ? `IT ' S YOUR TURN`
                : 'YOUR FIELD' }
          </div>

        </div>
    </div>);
};

export default Field;
