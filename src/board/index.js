import React, { useEffect, useState } from 'react';
import Board from 'react-trello';
import axios from 'axios';
import ConfigApp from '../configApp';

const data = {
  lanes: [
    {
      id: 1,
      title: 'To do',
      label: '2/2',
      cards: [
        {
          id: 'Card1', title: 'Write Blog',
          description: 'Can AI make memes',
          label: '30 mins', draggable: false
        },
        { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' } }
      ]
    },
    {
      id: 2,
      title: 'Doing',
      label: '0/0',
      cards: []
    },
    {
      id: 3,
      title: 'Done',
      label: '',
      cards: []
    }
  ]
}



function MyBoard(props) {
  const [board, setBoard] = useState(null);
  
  //get board, then  lanes, then cards
  useEffect(() =>{

    fetch(`/boards/${props.boardId}`)
    .then(response => response.json())
    .then(data => mountBoard(data));
    
  }, []);

  function mountBoard(board){
      const lanes = [];      
      if(board.lanes.length > 0){

        board.lanes.map((lane) => {
            console.log(lane);
            console.log(board.cards);
            let cardsFiltered = board.cards.filter(c => c.lane_id === lane.id); 
            
            let newLane = {
                id:lane.id,
                title: lane.title,
                label: lane.label,
                cards: cardsFiltered
            }
            console.log(newLane);
            lanes.push(newLane);
        });        
        //set lanes
        const newBoard = {id: board.id,lanes:lanes};        
        //set board
        setBoard(newBoard);
      }
  }


  function handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails) {
    console.log(cardId);
    console.log(sourceLaneId);
    console.log(targetLaneId);
    console.log(position);
    console.log(cardDetails);
    fetch('/cards', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardId,
          lane_id: targetLaneId,
        }),
      });

  }

  function onCardAdd(card, laneId) {
    console.log(card);
    console.log(laneId);
    fetch('/cards', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: board.id,
          lane_id: laneId,
          title: card.title,
          label: card.label,
          description: card.description
        }),
      });
  }
  
  function onLaneAdd(params){
    console.log(params);
    fetch('/lanes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: board.id,
          title: params.title,
        }),
      });
  }


  console.log(data);
  console.log(board);

  return (
    <div>
      {
        board &&
        <Board
        data={board}
        handleDragEnd={handleDragEnd}
        onCardAdd={onCardAdd}
        editable={true}
        canAddLanes={true}
        onLaneAdd={onLaneAdd}
      />
      }

    </div>

  );
}

export default MyBoard;