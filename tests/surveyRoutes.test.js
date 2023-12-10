const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const connection = require('../db_connection'); 
const { expect } = chai;

chai.use(chaiHttp);

describe('Survey Routes', () => {
  let testUserId;

  before((done) => {
    // Create a test user before running the tests
    const userQuery = 'INSERT INTO Users (first_name, last_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)';
    const userValues = ['Test', 'User', 'testuser@example.com', '#Pass123', 'Coach'];

    connection.query(userQuery, userValues, (error, result) => {
      if (error) {
        console.error('Error creating test user:', error);
        done(error);
      } else {
        testUserId = result.insertId;
        done();
      }
    });
  });

  after((done) => {
    // Clean up: Delete the test user after running the tests
    const deleteQuery = 'DELETE FROM Users WHERE id = ?';
    connection.query(deleteQuery, [testUserId], (error, result) => {
      if (error) {
        console.error('Error deleting test user:', error);
        done(error);
      } else {
        done();
      }
    });
  });

  describe('POST /api/surveys/initial-survey', () => {
    it('should add an initial survey successfully', (done) => {
      const surveyData = {
        user_id: testUserId,
        date_of_birth: '1990-01-01',
        gender: 'male',
        height: '180',
        weight: '75',
        weightGoal: 'Lose',
        weightGoalValue: '15',
      };

      chai.request(app)
        .post('/api/surveys/initial-survey')
        .send(surveyData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Initial survey added successfully');
          done();
        });
    });
  });

  describe('POST /api/surveys/coach-survey', () => {
    it('should add a coach survey successfully', (done) => {
      const surveyData = {
        user_id: testUserId,
        experience: 5,
        specializations: 'Losing Weight',
        city: 'Test City',
        state: 'New Jersey',
        price: 50.0,
      };

      chai.request(app)
        .post('/api/surveys/coach-survey')
        .send(surveyData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Coach survey added successfully');
          done();
        });
    });
  });

  describe('POST /api/surveys/daily-survey', () => {
    it('should add a daily survey successfully', (done) => {
      const surveyData = {
        user_id: testUserId,
        calories: 2000,
        waterIntake: 8,
        weight: 70,
        mood: 'Happy',
      };

      chai.request(app)
        .post('/api/surveys/daily-survey')
        .send(surveyData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Daily survey added successfully');
          done();
        });
    });

    it('should handle duplicate daily surveys', (done) => {
      // Adding the same survey again to trigger a duplicate entry error
      const surveyData = {
        user_id: testUserId,
        calories: 2000,
        waterIntake: 8,
        weight: 70,
        mood: 'Happy',
      };

      chai.request(app)
        .post('/api/surveys/daily-survey')
        .send(surveyData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').equal("You've already submitted a survey for today");
          done();
        });
    });
  });
});
