'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '../../../supabaseClient';
import { client } from '../../../libs/DB';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      if (!user) {
        alert('User is null');
        return;
      }
      const userId = user.id;
      const username = email.split('@')[0];
      const insertQuery = `
        INSERT INTO users (id, email, username) 
        VALUES (?, ?, ?)
      `;

      try {
        await client.execute({
          sql: insertQuery,
          args: [userId, email, username],
        });
        router.push('/profile');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
