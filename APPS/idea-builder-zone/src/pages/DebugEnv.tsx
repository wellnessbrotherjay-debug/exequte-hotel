const DebugEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const maskKey = (key: string | undefined) => {
    if (!key) {
      return "Not set or empty";
    }
    if (key.length < 8) {
      return "Key is too short to mask";
    }
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: 'white', backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px' }}>
      <h2>Vercel Environment Variables</h2>
      <p>This page shows the environment variables available to the application on the Vercel server.</p>
      <hr style={{ borderColor: '#333' }} />
      <div>
        <h3>VITE_SUPABASE_URL:</h3>
        <p style={{ color: '#7ec699' }}>{supabaseUrl || "Not set or empty"}</p>
      </div>
      <div>
        <h3>VITE_SUPABASE_ANON_KEY (Masked):</h3>
        <p style={{ color: '#7ec699' }}>{maskKey(supabaseAnonKey)}</p>
      </div>
      <hr style={{ borderColor: '#333' }} />
      <p>
        Compare these values with the ones in your Supabase project settings. The masked key should match the first 4 and last 4 characters of your actual anon key.
      </p>
    </div>
  );
};

export default DebugEnv;
