const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../index');
const AccountController = require('../controllers/accountController');

chai.use(chaiHttp);
const expect = chai.expect;

// Mock user data for testing
const testUser = {
  userId: 1,
  email: 'test@example.com',
  password: '#Pass123',
  first_name: 'Test',
  last_name: 'User',
  phone: '1234567890',
};

describe('Account Settings Routes', () => {
  let queryStub;

  // Before each test, stub the database query function
  beforeEach(() => {
    queryStub = sinon.stub(AccountController, 'getAccountInfo');
  });

  // After each test, restore the stub
  afterEach(() => {
    queryStub.restore();
  });

  it('should get account information', (done) => {
    // Stub the database function to return mock data
    const mockAccountInfo = {
      email: testUser.email,
      first_name: testUser.first_name,
      last_name: testUser.last_name,
    };
    queryStub.withArgs(testUser.userId).resolves(mockAccountInfo);

    chai.request(app)
      .post('/api/account/get-account-info')
      .send({ userId: testUser.userId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('email').equal(testUser.email);
        done();
      });
  });

  it('should update account information', (done) => {
    // Stub the database function to return a success message
    const updateStub = sinon.stub(AccountController, 'updateAccountInfo').resolves({ message: 'Account information updated successfully' });

    const updatedUserData = {
      first_name: 'UpdatedFirstName',
      last_name: 'UpdatedLastName',
      email: 'updated@example.com',
      phone: '1234567890',
      userId: testUser.userId,
    };

    chai.request(app)
      .post('/api/account/update-account-info')
      .send(updatedUserData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').equal('Account information updated successfully');
        expect(updateStub.calledWith(updatedUserData)).to.be.true;

        // Restore the stub
        updateStub.restore();
        done();
      });
  });

 
});
