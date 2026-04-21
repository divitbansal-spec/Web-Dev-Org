"use client";

import { FormEvent, useState } from "react";

type Field = { name: string; label: string; type?: string; placeholder?: string; required?: boolean };

export function ApiForm({
  title,
  endpoint,
  fields,
  method = "POST",
  tokenLabel = "JWT Token (optional)",
  defaultBody = "{}"
}: {
  title: string;
  endpoint: string;
  fields?: Field[];
  method?: "POST" | "PATCH";
  tokenLabel?: string;
  defaultBody?: string;
}) {
  const [token, setToken] = useState("");
  const [rawBody, setRawBody] = useState(defaultBody);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      let payload: unknown;

      if (fields && fields.length > 0) {
        payload = Object.fromEntries(formData.entries());
      } else {
        payload = JSON.parse(rawBody);
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <label>{tokenLabel}</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste token if endpoint is protected" />

        {fields && fields.length > 0 ? (
          fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input name={field.name} type={field.type ?? "text"} placeholder={field.placeholder} required={field.required} />
            </div>
          ))
        ) : (
          <>
            <label>JSON Body</label>
            <textarea rows={7} value={rawBody} onChange={(e) => setRawBody(e.target.value)} />
          </>
        )}

        <button className="btn" type="submit" disabled={loading}>{loading ? "Sending..." : "Submit"}</button>
      </form>

      {result ? <pre className="output">{result}</pre> : null}
    </div>
  );
}
