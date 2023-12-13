const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../index');
const SurveyController = require('../../controllers/surveyController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Survey Routes', () => {
  let addInitialSurveyStub;
  let addCoachSurveyStub;
  let addDailySurveyStub;

  beforeEach(() => {
    // Create stubs for the SurveyController functions
    addInitialSurveyStub = sinon.stub(SurveyController, 'addInitialSurvey');
    addCoachSurveyStub = sinon.stub(SurveyController, 'addCoachSurvey');
    addDailySurveyStub = sinon.stub(SurveyController, 'addDailySurvey');
  });

  afterEach(() => {
    // Restore the original functions after each test
    addInitialSurveyStub.restore();
    addCoachSurveyStub.restore();
    addDailySurveyStub.restore();
  });

  describe('POST /api/surveys/initial-survey', () => {
    it('should add an initial survey successfully', (done) => {
      // Stub the function to return mock data
      addInitialSurveyStub.resolves();

      const surveyData = {
        user_id: 1, // provide a user_id value
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
      // Stub the function to return mock data
      addCoachSurveyStub.resolves();

      const surveyData = {
        user_id: 1, // provide a user_id value
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
      // Stub the function to return mock data
      addDailySurveyStub.resolves();

      const surveyData = {
        user_id: 1, // provide a user_id value
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

  });
});
