import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function SearchPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSource = useDebounce(source, 300);
  const debouncedDestination = useDebounce(destination, 300);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!debouncedSource && !debouncedDestination) {
      setResults([]);
      return;
    }
    hasFetched.current = true;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/routes/search', { params: { source: debouncedSource, destination: debouncedDestination } });
        if (!cancelled) setResults(res.data.data || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedSource, debouncedDestination]);

  return (
    <div>
      <h1>Search Routes</h1>
      <div>
        <input placeholder="From" value={source} onChange={e => setSource(e.target.value)} aria-label="Source" />
        <input placeholder="To" value={destination} onChange={e => setDestination(e.target.value)} aria-label="Destination" />
      </div>
      {loading && <div>Searching...</div>}
      {!loading && !hasFetched.current && results.length === 0 && <p>Start typing to search routes.</p>}
      {results.map(r => (
        <div key={r.id} className="result-card">
          <h3>{r.source} → {r.destination}</h3>
          <p>Fare: ₹{r.fare} | Vehicle: {r.vehicleType}</p>
          <p>Driver: {r.driverName} | Agency: {r.agencyName}</p>
          <button onClick={() => navigate(`/bookings/new?routeId=${r.id}&driverId=${r.driverId}`)}>Book</button>
        </div>
      ))}
    </div>
  );
}

export default SearchPage;
