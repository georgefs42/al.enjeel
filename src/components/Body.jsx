import "../styles/body.css";

const Body = () => {
  return (
    <section className="body-section">
      <h2>Features</h2>
      <div className="features">
        <div className="feature-box">
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div className="feature-box">
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
        <div className="feature-box">
          <h3>Feature 3</h3>
          <p>Description of feature 3.</p>
        </div>
      </div>
    </section>
  );
};

export default Body;
