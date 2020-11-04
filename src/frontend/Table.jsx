import React from 'react';
import gql from 'graphql-tag';

const Table = ({ ships, moves }) => {

  function buildTable(ships) {

    const columns = new Array(10).fill({ship: null, touch: false});
    const rows = new Array(10).fill(columns);
    const table = rows.map((row, y)=> {
        const tableColumns = row.map((column, x) => {
            const attackedPosition = moves.some(coordinate => {
                return coordinate.x === x && coordinate.y === y;
            });
            const shipInPosition = ships.filter(ship => {
                return ship.coordinates.some(coordinate => {
                    return coordinate.x === x && coordinate.y === y;
                });
            });
            return (<div className='column'>
                {(!!shipInPosition.length && !!attackedPosition) && 'O'}
                {!!shipInPosition.length && !attackedPosition && 'X'}
                {!shipInPosition.length && !!attackedPosition && '-'}
            </div>);
        });
        return (<div className='row'>{tableColumns}</div>)
    });
    return table;
  }

  return(
    <div className='table'>
      {ships &&
        <div className='table-body'>{buildTable(ships)}</div>
      }
    </div>);
};

export default Table;
