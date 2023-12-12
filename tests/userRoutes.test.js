const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../index');
const db_conn = require('../db_connection');
const UserController = require('../controllers/userController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
  let registerUserStub;
  let loginStub;
  let coachDetailsStub;
  let getPendingCoachesStub;
  let updateCoachApprovalStatusStub;

  beforeEach(() => {
    // Create stubs for the UserController functions
    registerUserStub = sinon.stub(UserController, 'registerUser');
    loginStub = sinon.stub(UserController, 'login');
    coachDetailsStub = sinon.stub(UserController, 'coachDetails');
    getPendingCoachesStub = sinon.stub(UserController, 'getPendingCoaches');
    updateCoachApprovalStatusStub = sinon.stub(UserController, 'updateCoachApprovalStatus');
  });

  afterEach(() => {
    // Restore the original functions after each test
    registerUserStub.restore();
    loginStub.restore();
    coachDetailsStub.restore();
    getPendingCoachesStub.restore();
    updateCoachApprovalStatusStub.restore();
  });

  after((done) => {
    // Delete the user from the database after the test
    const deleteUserQuery = 'DELETE FROM Users WHERE email = ?';
    const values = ['joe.doe@example.com'];

    db_conn.query(deleteUserQuery, values, (error, results) => {
      if (error) {
        console.error('Error tearing down test user:', error);
        done(error);
      } else {
        done();
      }
    });
  });

  it('should register a new user', (done) => {
    // Stub the function to return mock data
    registerUserStub.resolves({ message: 'User registered successfully', ident: 1 });

    chai.request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@example.com',
        password: '#Password123',
        phone: '1234567890',
        isCoach: false
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').equal('User registered successfully');
        done();
      });
  });

  it('should login a user', (done) => {
    // Stub the function to return mock data
    loginStub.withArgs('joe.doe@example.com', '#Password123').resolves({
      message: 'Logged in successfully',
      ident: 1,
      userType: 'Client'
    });

    chai.request(app)
      .post('/api/users/login')
      .send({
        email: 'joe.doe@example.com',
        password: '#Password123'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Logged in successfully');
        done();
      });
  });


});
