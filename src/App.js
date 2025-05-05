import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API}/teams`)
      .then(res => {
        setTeams(res.data);
        if (res.data.length >= 2) {
          setHome(res.data[0]);
          setAway(res.data[1]);
        }
      })
      .catch(() => setError('Cannot load teams'));
  }, [API]);

  const handleSubmit = e => {
    e.preventDefault();
    if (home === away) {
      setError('Teams must differ');
      return;
    }
    setLoading(true);
    axios.post(`${API}/predict`, { home_team: home, away_team: away })
      .then(res => setPrediction(res.data))
      .catch(() => setError('Prediction failed'))
      .finally(() => setLoading(false));
  };

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
                          <option key={t} value={t}>
                            {t}
                          </option>
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
                          <option key={t} value={t}>
                            {t}
                          </option>
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
                    <div className={`probability-circle bg-${prediction.home_win_probability >= 0.6 ? 'success' : prediction.home_win_probability >= 0.3 ? 'warning' : 'danger'}`}>
                      {(prediction.home_win_probability * 100).toFixed(1)}%
                    </div>
                    <h5>Home Win</h5>
                  </Col>
                  <Col className="text-center">
                    <div className={`probability-circle bg-${prediction.draw_probability >= 0.6 ? 'success' : prediction.draw_probability >= 0.3 ? 'warning' : 'danger'}`}>
                      {(prediction.draw_probability * 100).toFixed(1)}%
                    </div>
                    <h5>Draw</h5>
                  </Col>
                  <Col className="text-center">
                    <div className={`probability-circle bg-${prediction.away_win_probability >= 0.6 ? 'success' : prediction.away_win_probability >= 0.3 ? 'warning' : 'danger'}`}>
                      {(prediction.away_win_probability * 100).toFixed(1)}%
                    </div>
                    <h5>Away Win</h5>
                  </Col>
                </Row>
                <div className="mt-4 text-center">
                  <h5>Outcome: <span className="prediction-result">{prediction.prediction === 'H' ? prediction.home_team : prediction.prediction === 'A' ? prediction.away_team : 'Draw'}</span></h5>
                </div>
                <ul className="key-factors mt-4">
                  {Object.entries(prediction.key_factors).map(([k, v]) => (
                    <li key={k}>
                      <strong>{k.replace(/_/g, ' ')}</strong>: {v}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
