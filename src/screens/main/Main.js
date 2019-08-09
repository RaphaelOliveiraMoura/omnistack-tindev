import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import './Main.css';
import logo from '../../assets/logo.svg';
import Card from './user-card/Card';
import api from '../../services/api';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);

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
    </div>
  );
}
