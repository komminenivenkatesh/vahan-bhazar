import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Simple search component with fake autocomplete suggestions.
 *  We'll wire it to backend search later.
 */
export default function SearchBar() {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return setSuggestions([]);
    // Fake suggestions - replace with API call later
    const all = ['Hero Splendor', 'TVS iQube', 'Royal Enfield Classic', 'Ather 450X', 'Bajaj Pulsar'];
    setSuggestions(all.filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0,5));
  }, [q]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    // navigate to browse with search param
    navigate(`/browse?search=${encodeURIComponent(q)}`);
  }

  return (
    <div style={{ position: 'relative' }}>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search bikes, scooters, EVs..."
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>Search</button>
      </form>

      {suggestions.length > 0 && (
        <div style={suggestionBox}>
          {suggestions.map(s => (
            <div key={s} style={suggestionItem} onClick={() => { setQ(s); navigate(`/browse?search=${encodeURIComponent(s)}`); }}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  minWidth: 260,
  borderRadius: 6,
  border: '1px solid #ddd'
};
const btnStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer'
};
const suggestionBox: React.CSSProperties = {
  position: 'absolute',
  top: 44,
  left: 0,
  background: '#fff',
  border: '1px solid #eee',
  width: 320,
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  borderRadius: 6,
  overflow: 'hidden'
};
const suggestionItem: React.CSSProperties = {
  padding: '8px 10px',
  cursor: 'pointer',
  borderBottom: '1px solid #f3f3f3'
};
 