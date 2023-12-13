const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../index');
const UserController = require('../../controllers/userController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
  let registerUserStub;
  let loginStub;

  beforeEach(() => {
    // Create stubs for the UserController functions
    registerUserStub = sinon.stub(UserController, 'registerUser');
    loginStub = sinon.stub(UserController, 'login');
  });

  afterEach(() => {
    // Restore the original functions after each test
    registerUserStub.restore();
    loginStub.restore();
  });

  it('should register a new user', (done) => {
    // Stub the function to return mock data
    registerUserStub.resolves({ message: 'User registered successfully', ident: 1 });
  
    chai.request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Joe',
        lastName: 'Doe',
        email: 'unique-email@example.com', 
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
