import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not authenticated!');
        return;
      }
      try {
        const res = await apiClient.get('/users/67a0786880defe17d75aea92');
        setUser(res.data);
      } catch (error) {
        alert('Error fetching user data');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-5 bg-white shadow rounded">
      <h2 className="mb-3 text-lg font-bold">Profile</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
