import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// This is a standalone solution that combines both pages
// and doesn't depend on React Router
function App() {
  // State to determine which view to show
  const [currentView, setCurrentView] = useState('home');
  
  // States for the prediction feature
  const [teams, setTeams] = useState([]);
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fixed API URL with /api prefix
  const API = 'http://localhost:8000/api';

  // Default teams in case API fails
  const DEFAULT_TEAMS = [
    "Manchester City", "Liverpool", "Arsenal", "Manchester United", 
    "Chelsea", "Tottenham", "Newcastle United", "Aston Villa", 
    "Brighton & Hove Albion", "West Ham United", "Crystal Palace", 
    "Wolverhampton", "Everton", "Leicester City", "Brentford", 
    "Fulham", "Bournemouth", "Nottingham Forest", "Leeds United", 
    "Southampton"
  ];

  // Load teams when we switch to prediction view
  useEffect(() => {
    if (currentView === 'predict') {
      loadTeams();
    }
  }, [currentView]);

  // Function to load teams
  const loadTeams = () => {
    axios.get(`${API}/teams`)
      .then(res => {
        setTeams(res.data);
        if (res.data.length >= 2) {
          setHome(res.data[0]);
          setAway(res.data[1]);
        }
      })
      .catch(err => {
        console.log("Teams loading error:", err);
        setError('Cannot load teams from API. Using default list.');
        setTeams(DEFAULT_TEAMS);
        setHome(DEFAULT_TEAMS[0]);
        setAway(DEFAULT_TEAMS[1]);
      });
  };

  // Handle prediction submission
  const handleSubmit = e => {
    e.preventDefault();
    if (home === away) {
      setError('Teams must differ');
      return;
    }
    
    setLoading(true);
    setError('');
    
    axios.post(`${API}/predict`, { home_team: home, away_team: away })
      .then(res => {
        setPrediction(res.data);
        setError('');
      })
      .catch(err => {
        console.log("Prediction error:", err);
        setError('Prediction failed');
        
        // Optional fallback prediction
        if (home === "Liverpool" && away === "Southampton") {
          setPrediction({
            home_team: home,
            away_team: away,
            home_win_probability: 0.75,
            draw_probability: 0.15,
            away_win_probability: 0.10,
            prediction: "H",
            model_used: "Fallback Model",
            key_factors: {
              "note": "Using fallback Liverpool vs Southampton prediction (API unavailable)"
            }
          });
        }
      })
      .finally(() => setLoading(false));
  };

  // Render the Home Page
  if (currentView === 'home') {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Roboto", sans-serif'
      }}>
        {/* Barcelona-themed background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #004D98 0%, #A50044 100%)',
          zIndex: -1
        }}></div>
        
        {/* Content container */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          color: 'white'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'white',
              borderRadius: '50%',
              marginRight: '15px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                background: '#232323',
                borderRadius: '50%',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}></div>
            </div>
            <h1 style={{
              color: 'white',
              fontSize: '3.5rem',
              margin: 0,
              fontWeight: 700
            }}>
              TikiData
            </h1>
          </div>
          
          {/* Tagline */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{
              fontSize: '1.5rem',
              opacity: 0.9
            }}>
              Intelligent football predictions powered by data science
            </p>
          </div>
          
          {/* Features */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '50px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              padding: '20px',
              borderRadius: '10px',
              width: '180px'
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏆</span>
              <span>Premier League Focus</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              padding: '20px',
              borderRadius: '10px',
              width: '180px'
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📊</span>
              <span>Advanced Analytics</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              padding: '20px',
              borderRadius: '10px',
              width: '180px'
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎯</span>
              <span>Accurate Predictions</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div>
            <button 
              style={{
                padding: '12px 30px',
                fontSize: '1.2rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: '#ff9500',
                color: 'white'
              }}
              onClick={() => setCurrentView('predict')}
            >
              Make Prediction
            </button>
          </div>
        </div>
        
        {/* Navigation buttons in top right */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            padding: '8px 16px',
            fontSize: '1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }} onClick={() => setCurrentView('home')}>
            Home
          </button>
          <button style={{
            background: '#ff9500',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }} onClick={() => setCurrentView('predict')}>
            Prediction
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render the Prediction Page
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Football Match Prediction</h1>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Home Team</Form.Label>
                      <Form.Control
                        as="select"
                        value={home}
                        onChange={e => setHome(e.target.value)}
                        required
                      >
                        {teams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex justify-content-center align-items-center">
                    <span className="versus">VS</span>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Away Team</Form.Label>
                      <Form.Control
                        as="select"
                        value={away}
                        onChange={e => setAway(e.target.value)}
                        required
                      >
                        {teams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center mt-4">
                  <Button type="submit" size="lg" disabled={loading || home === away}>
                    {loading ? 'Predicting...' : 'Predict Match'}
                  </Button>
                </div>
                {error && <div className="text-danger text-center mt-3">{error}</div>}
              </Form>
            </Card.Body>
          </Card>

          {prediction && (
            <Card className="mt-4 prediction-card">
              <Card.Header className="text-center">
                <h3>Prediction Result</h3>
                <h4>{prediction.home_team} vs {prediction.away_team}</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col className="text-center">
                    <h5>Home Win</h5>
                    <div className="probability-circle bg-success">
                      {(prediction.home_win_probability * 100).toFixed(1)}%
                    </div>
                  </Col>
                  <Col className="text-center">
                    <h5>Draw</h5>
                    <div className="probability-circle bg-warning">
                      {(prediction.draw_probability * 100).toFixed(1)}%
                    </div>
                  </Col>
                  <Col className="text-center">
                    <h5>Away Win</h5>
                    <div className="probability-circle bg-danger">
                      {(prediction.away_win_probability * 100).toFixed(1)}%
                    </div>
                  </Col>
                </Row>
                <div className="mt-4 text-center">
                  <h5>Outcome: <span className="prediction-result">{
                    prediction.prediction === 'H' ? prediction.home_team :
                    prediction.prediction === 'A' ? prediction.away_team : 'Draw'
                  }</span></h5>
                </div>
                
                {/* Key factors section */}
                {prediction.key_factors && (
                  <div className="mt-4">
                    <h5>Key Factors:</h5>
                    <ul className="key-factors">
                      {Object.entries(prediction.key_factors).map(([key, value]) => (
                        <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
          
          {/* Back button */}
          <div className="text-center mt-4 mb-5">
            <button 
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentView('home')}
            >
              Back to Home
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
