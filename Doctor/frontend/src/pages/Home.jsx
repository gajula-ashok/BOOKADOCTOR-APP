import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <style>{`
        body{
          margin:0;
          padding:0;
          background:#f5f7fa;
          font-family:Arial,sans-serif;
        }

        .hero{
          min-height:90vh;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          text-align:center;
          padding:20px;
        }

        .hero h1{
          font-size:50px;
          color:#0d6efd;
          margin-bottom:20px;
          font-weight:bold;
        }

        .hero p{
          font-size:22px;
          color:#555;
          margin-bottom:30px;
        }

        .btn-custom{
          padding:12px 35px;
          font-size:20px;
          border-radius:10px;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero">

        <h1>Welcome to Book Doctor</h1>

        <p>
          Book appointments with trusted doctors quickly and easily.
        </p>

        <Link to="/login">
          <button className="btn btn-primary btn-custom">
            Get Started
          </button>
        </Link>

      </div>
    </>
  );
}

export default Home;