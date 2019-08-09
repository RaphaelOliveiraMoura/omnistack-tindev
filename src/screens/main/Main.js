import React, { useState, useEffect } from 'react';

import './Main.css';
import logo from '../../assets/logo.svg';
import Card from './user-card/Card';
import api from '../../services/api';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.listDevs(match.params.id).then(response => {
      setUsers(response.data);
    });
  }, [match.params.id]);

  return (
    <div className="main-container">
      <img src={logo} alt="Tindev" />
      <ul>
        {users.map(user => (
          <Card user={user} index={user._id} />
        ))}
      </ul>
    </div>
  );
}
