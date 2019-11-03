import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import './Main.css';
import logo from '../../assets/logo.svg';
import itsamatch from '../../assets/itsamatch.png';
import Card from './user-card/Card';
import api from '../../services/api';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(false);

  async function handleLike(targetId) {
    await api.like(match.params.id, targetId);
    setUsers(users.filter(user => user._id !== targetId));
  }

  async function handleDislike(targetId) {
    await api.dislike(match.params.id, targetId);
    setUsers(users.filter(user => user._id !== targetId));
  }

  useEffect(() => {
    api.listDevs(match.params.id).then(response => {
      setUsers(response.data);
    });
  }, [match.params.id]);

  useEffect(() => {
    const socket = io('http://localhost:5050', {
      query: {
        user: match.params.id
      }
    });

    socket.on('match', user => {
      setMatchDev(user);
    });
  }, [match.params.id]);

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <Card
              user={user}
              key={user._id}
              handleLike={() => handleLike(user._id)}
              handleDislike={() => handleDislike(user._id)}
            />
          ))}
        </ul>
      ) : (
        <div className="empty">Acabou :(</div>
      )}
      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match" />
          <img className="avatar" src={matchDev.avatar} alt="Profile logo" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(false)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
