import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Layout from './components/Layout';
import Home from './pages/Home';
import VoterID from './pages/VoterID';
import Feed from './pages/Feed';
import Directory from './pages/Directory';
import SubmitReport from './pages/SubmitReport';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 text-neutral-500 font-mono">
        LOADING_CIVIC_PULSE_...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/voter-id" element={<VoterID />} />
          <Route path="/feed" element={<Feed user={user} />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/submit" element={user ? <SubmitReport user={user} /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
