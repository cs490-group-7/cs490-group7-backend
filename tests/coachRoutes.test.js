const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Coach Routes', () => {
  it('should check approval status for a coach', (done) => {
    chai.request(app)
      .post('/api/coach/check-approval-status')
      .send({
        userId: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPendingApproval');
        done();
      });
  });

  it('should lookup approved coaches', (done) => {
    chai.request(app)
      .post('/api/coach/coach-lookup')
      .send({
        experience: 2,
        specializations: 'Losing Weight',
        city: 'Newark',
        state: 'New Jersey',
        maxPrice: 50
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // Add more test cases for other endpoints in coachRoutes
});
