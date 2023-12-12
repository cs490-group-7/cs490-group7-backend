const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../index');
const CoachController = require('../controllers/coachController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Coach Routes', () => {
  let checkApprovalStatusStub;
  let coachLookupStub;

  beforeEach(() => {
    // Create stubs for the CoachController functions
    checkApprovalStatusStub = sinon.stub(CoachController, 'checkApprovalStatus');
    coachLookupStub = sinon.stub(CoachController, 'coachLookup');
  });

  afterEach(() => {
    // Restore the original functions after each test
    checkApprovalStatusStub.restore();
    coachLookupStub.restore();
  });

  it('should check approval status for a coach', (done) => {
    // Stub the function to return mock data
    checkApprovalStatusStub.withArgs(1).resolves({ isPendingApproval: true });

    chai.request(app)
      .post('/api/coach/check-approval-status')
      .send({
        userId: 1,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPendingApproval').equal(true);
        done();
      });
  });

  it('should lookup approved coaches', (done) => {
    // Stub the function to simulate successful lookup
    const mockResults = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
    coachLookupStub.resolves(mockResults);

    chai.request(app)
      .post('/api/coach/coach-lookup')
      .send({
        experience: 2,
        specializations: 'Losing Weight',
        city: 'Newark',
        state: 'New Jersey',
        maxPrice: 50,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.deep.equal(mockResults);
        done();
      });
  });

});
