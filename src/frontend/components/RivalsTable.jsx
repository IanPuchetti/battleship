import React from 'react';
import gql from 'graphql-tag';

const RivalsTable = ({ rival, attack, moves, myTurn }) => {


  function buildTable(rival) {
    const touchedCoordinates = rival.touchedCoordinates;
    const columns = new Array(10).fill({ship: null, touch: false});
    const rows = new Array(10).fill(columns);
    const table = rows.map((row, y)=> {
        const tableColumns = row.map((column, x) => {
            const attackedPosition = moves.some(coordinate => {
                return coordinate.x === x && coordinate.y === y;
            });
            const shipInPosition = touchedCoordinates.some(coordinate => {
                    return coordinate.x === x && coordinate.y === y;
                });
            const cellStatus = !!shipInPosition ? 'attacked' :
                (!shipInPosition && !!attackedPosition) ? 'missed' : 'water';
            return (<div className='column column-rival'  onClick={() =>
                 cellStatus === 'attacked' || cellStatus === 'missed' ? null : attack(x, y)}>
                 {!!shipInPosition && 'X'}
                 {!shipInPosition && !!attackedPosition && '~'}
            </div>);
        });
        return (<div className='row'>{tableColumns}</div>)
    });
    return table;
  }

  return(
    <div className='table'>
      {rival && rival.touchedCoordinates &&
        <div className='table-body'>{buildTable(rival)}</div>
      }
    </div>);
};

export default RivalsTable;
