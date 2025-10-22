import React, { useEffect, useState } from "react";
import { supabase, BUCKET } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function SCPList() {
  const [scps, setScps] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchScps() {
    setLoading(true);
    const { data, error } = await supabase.from("scps").select("*").order("id", { ascending: true });
    if (error) console.error("Fetch error:", error);
    else setScps(data);
    setLoading(false);
  }

  useEffect(() => { fetchScps(); }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this SCP?")) return;
    const { error } = await supabase.from("scps").delete().eq("id", id);
    if (error) return alert("Delete failed: " + error.message);
    // optionally delete image from storage? (not done automatically)
    fetchScps();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>SCP Subjects</h1>
      <div>
        {scps.length === 0 && <p>No SCPs yet.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 12 }}>
          {scps.map(s => (
            <div key={s.id} className="scp-card" style={{ border: "1px solid #223", padding: 12, borderRadius: 8 }}>
              <h3 style={{ margin: 0 }}>{s.item} <small style={{ color: "#9aa" }}>({s.class})</small></h3>
              {s.image_url ? <img src={s.image_url} alt={s.item} /> : <div style={{height:120, background:"#071021", borderRadius:6, display:"flex",alignItems:"center",justifyContent:"center", color:"#445"}}>No image</div>}
              <p><strong>Description:</strong> {s.description}</p>
              <p><strong>Containment:</strong> {s.containment}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link to={`/view/${s.id}`}><button>View</button></Link>
                <Link to={`/edit/${s.id}`}><button>Edit</button></Link>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
