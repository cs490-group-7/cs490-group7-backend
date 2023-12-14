const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../index');
const ProgressController = require('../../controllers/progressController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Progress Routes', () => {
  let getProgressDataStub;
  let getGoalInfoStub;
  let getCurrentWeightStub;
  let updateGoalInfoStub;

  beforeEach(() => {
    // Create stubs for the ProgressController functions
    getProgressDataStub = sinon.stub(ProgressController, 'getProgressData');
    getGoalInfoStub = sinon.stub(ProgressController, 'getGoalInfo');
    getCurrentWeightStub = sinon.stub(ProgressController, 'getCurrentWeight');
    updateGoalInfoStub = sinon.stub(ProgressController, 'updateGoalInfo');
  });

  afterEach(() => {
    // Restore the original functions after each test
    getProgressDataStub.restore();
    getGoalInfoStub.restore();
    getCurrentWeightStub.restore();
    updateGoalInfoStub.restore();
  });

  it('should get progress data', (done) => {
    // Stub the function to return mock data
    getProgressDataStub.resolves([{ date: '2023-01-01', weight: 70, calorie_intake: 2000, water_intake: 8 }]);

    chai.request(app)
      .post('/api/progress/progress-data')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get goal info', (done) => {
    // Stub the function to return mock data
    getGoalInfoStub.resolves({ weightGoal: 'Maintain', weightGoalValue: 70 });

    chai.request(app)
      .post('/api/progress/goal-info')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should get current weight', (done) => {
    // Stub the function to return mock data
    getCurrentWeightStub.resolves({ weight: 72 });

    chai.request(app)
      .post('/api/progress/current-weight')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should update goal info', (done) => {
    // Stub the function to return success message
    updateGoalInfoStub.resolves({ message: 'Goal updated successfully' });

    chai.request(app)
      .post('/api/progress/update-goal-info')
      .send({ userId: 1, weightGoal: 'Lose', weightGoalValue: 65 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Goal updated successfully' });
        done();
      });
  });

});
