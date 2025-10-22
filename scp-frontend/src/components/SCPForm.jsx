import React, { useEffect, useState } from "react";
import { supabase, BUCKET } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function SCPForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    item: "",
    class: "",
    description: "",
    containment: "",
    image_url: ""
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const { data, error } = await supabase.from("scps").select("*").eq("id", id).single();
        if (error) console.error(error);
        else setForm(data);
      })();
    }
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (f) setFile(f);
  }

  async function uploadImageAndGetUrl(file) {
    // create unique path
    const path = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (uploadError) throw uploadError;
    const { publicURL, error } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (error) throw error;
    return publicURL;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url || "";

      if (file) {
        // upload to storage and get public url
        imageUrl = await uploadImageAndGetUrl(file);
      }

      if (isEdit) {
        const { error } = await supabase.from("scps").update({ ...form, image_url: imageUrl }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("scps").insert([{ ...form, image_url: imageUrl }]);
        if (error) throw error;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <h2>{isEdit ? "Edit SCP" : "Create SCP"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Item<br />
          <input name="item" value={form.item} onChange={handleChange} required />
        </label><br />
        <label>Class<br />
          <input name="class" value={form.class} onChange={handleChange} required />
        </label><br />
        <label>Description<br />
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} />
        </label><br />
        <label>Containment<br />
          <textarea name="containment" value={form.containment} onChange={handleChange} required rows={3} />
        </label><br />
        <label>Image (optional)<br />
          <input type="file" accept="image/*" onChange={handleFile} />
          {form.image_url && !file && <div style={{marginTop:8}}><img src={form.image_url} alt="existing" style={{maxWidth:200}} /></div>}
        </label><br />
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
      <br />
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}
