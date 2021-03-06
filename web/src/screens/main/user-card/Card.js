import React from 'react';

import './Card.css';
import like from '../../../assets/like.svg';
import dislike from '../../../assets/dislike.svg';

export default function Card({ user, handleLike, handleDislike }) {
  return (
    <div className="card-container">
      <img src={user.avatar} alt="Profile" />
      <footer>
        <strong>{user.name}</strong>
        <p>{user.bio}</p>
      </footer>
      <div className="buttons">
        <button type="button" onClick={handleLike}>
          <img src={like} alt="Like" />
        </button>
        <button type="button" onClick={handleDislike}>
          <img src={dislike} alt="Like" />
        </button>
      </div>
    </div>
  );
}
