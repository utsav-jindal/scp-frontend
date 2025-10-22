import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SCPView() {
  const { id } = useParams();
  const [scp, setScp] = useState(null);
  useEffect(() => {
    async function get() {
      const { data, error } = await supabase.from("scps").select("*").eq("id", id).single();
      if (error) console.error(error);
      else setScp(data);
    }
    get();
  }, [id]);

  if (!scp) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{scp.item} <small style={{color:"#9aa"}}>({scp.class})</small></h2>
      {scp.image_url && <img src={scp.image_url} alt={scp.item} />}
      <p><strong>Description:</strong> {scp.description}</p>
      <p><strong>Containment:</strong> {scp.containment}</p>
      <Link to="/">Back</Link>
    </div>
  );
}
