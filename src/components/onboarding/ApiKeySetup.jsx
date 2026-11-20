import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApiKeySetup() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/onboard-pet', { replace: true });
  }, [navigate]);
  
  return null;
}
