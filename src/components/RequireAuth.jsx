import { UrlState } from '@/context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

function RequireAuth({ children }) {
  const navigate = useNavigate();

  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate('/auth');
  }, [isAuthenticated, loading]);

  if (loading) return <PulseLoader size={10} color="#e9ebf0" />;

  if (isAuthenticated) return children;
}

export default RequireAuth;
