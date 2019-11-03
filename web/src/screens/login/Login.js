import React, { useState } from 'react';

import './Login.css';
import logo from '../../assets/logo.svg';

import { signIn } from '../../services/api';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    signIn(username)
      .then(({ data }) => {
        const { _id } = data;
        history.push(`/dev/${_id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input
          type="text"
          placeholder="Digite o seu usuário do GitHub"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
