'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Profile() {
  const { data: session, update } = useSession();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-profile', { method: 'POST', body: formData });
    if (res.ok) update();
    setUploading(false);
  };

  if (!session?.user) return <p>Please log in</p>;

  const user = session.user as { profilePic?: string };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>Profile</h1>
      <img
        src={user.profilePic || '/default-avatar.png'}
        alt="Profile"
        style={{ width: '128px', height: '128px', borderRadius: '50%' }}
      />
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      <a href="/dashboard">Back</a>
    </div>
  );
}