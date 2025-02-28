'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendTx } from './transaction/setTransaction';
import { GetWinners } from './transaction/getWinners';

const TournamentList = () => {
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('unstarted');
  const [transactionLink, setTransactionLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://league-of-legends-esports.p.rapidapi.com/schedule?leagueId=98767991299243165%252C99332500638116286%252C98767991302996019';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '127c64da5fmsh6599ba8bd9bae2ap10960djsnde33c2b25cf4',
          'x-rapidapi-host': 'league-of-legends-esports.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); 
        if (data.data && data.data.schedule && Array.isArray(data.data.schedule.events)) {
          setEvents(data.data.schedule.events);
        } else {
          throw new Error('Invalid data format received');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredEvents = events.filter(event => 
    filter === 'unstarted' ? event.state === 'unstarted' : event.state === 'completed'
  );

  const handleSelectMatch = (matchId) => {
    if (selectedMatchId === matchId) {
      setSelectedMatchId(null);
    } else {
      setSelectedMatchId(matchId);
    }
  };

  const handleClick = async (matchId, team) => {
    try {
      const link = await sendTx(matchId, team);
      console.log('Transaction successful in TournamentList:', link);
      setTransactionLink(link); // Set the transaction link state
    } catch (error) {
      console.error('Error in TournamentList:', error);
    }
  };

  const handleClaim = (matchId) => {
    const winnerIndex = findWinnerIndex(matchId);
    if (winnerIndex !== -1) {
      GetWinners(winnerIndex);
    } else {
      console.error('Could not determine winner index');
    }
  };

  return (
    <div className=''>
      <h1 className='w-96 m-auto justify-center items-center text-center'>List of Scheduled Tournaments</h1>
      <div className='flex justify-center my-4'>
        <button 
          className={`mx-2 px-4 py-2 rounded-full ${filter === 'unstarted' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('unstarted')}
        >
          Unstarted
        </button>
        <button 
          className={`mx-2 px-4 py-2 rounded-full ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setFilter('completed')}
        >
          Finished
        </button>
      </div>
      <ul className='grid grid-cols-2 gap-4'>
        {filteredEvents.slice(0, 6).map((event) => (
          <li key={event.match.id} className='border-4 border-pink-500 shadow-inner shadow-black bg-gradient-to-b from-blue-800 to-purple-900 gap-4 my-7 p-4 rounded-xl justify-center items-center'>
            <div>Tournament Name: {event.league.name}</div>
            <div className={event.state === 'unstarted' ? 'text-green-500' : 'text-red-500'}>
              Status: {event.state === 'unstarted' ? 'Unstarted' : 'Finished'}
            </div>
            <div>Teams: {event.match.teams.map(team => team.name).join(' vs ')}</div>
            <div>Start Time: {new Date(event.startTime).toLocaleString()}</div>
            {filter === 'unstarted' ? (
              <div>
                <div className='flex'>
                  <h1
                    className='shadow-lg mx-auto my-5 px-10 bg-gradient-to-r from-blue-500 to-pink-600 py-2 rounded-full cursor-pointer'
                    onClick={() => handleSelectMatch(event.match.id)}
                  >
                    Select Match
                  </h1>
                </div>
                {selectedMatchId === event.match.id && (
                  <motion.div className='mt-4 grid md:grid-cols-2 gap-2'>
                    {event.match.teams.map((team, index) => (
                      <button
                        key={index}
                        onClick={() => handleClick(event.match.id, index)}
                        className={`shadow-lg mx-auto my-1 px-5 w-40 bg-gradient-to-r from-green-500 to-blue-600  py-2 rounded-full`}
                      >
                        Bet {team.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className='flex'>
                <button onClick={() => handleClick(event.match.id, 0)} className='shadow-lg mx-auto my-5 px-10 bg-gradient-to-r from-blue-500 to-pink-600 py-2 rounded-full'>
                  Select
                </button> 
                <button onClick={() => GetWinners(event.match.id, 0)} className='shadow-lg mx-auto my-5 px-10 bg-gradient-to-r from-blue-500 to-pink-600 py-2 rounded-full'>
                  Claim
                </button> 
              </div>
            )}
          </li>
        ))}
      </ul>
      {transactionLink && (
        <div className='fixed bottom-0 right-0 mb-4 mr-4 p-4 bg-white shadow-lg rounded-lg'>
          <a href={transactionLink} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
