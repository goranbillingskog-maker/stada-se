import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1>Sidan hittades inte</h1>
        <p>Sidan du letar efter finns inte eller har flyttats.</p>
        <p>
          <Link className="btn btn-primary" href="/" style={{ display: "inline-block" }}>
            Till startsidan
          </Link>
        </p>
      </div>
    </section>
  );
}
