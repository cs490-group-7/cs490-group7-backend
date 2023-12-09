const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
  it('should register a new user', (done) => {
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

  // Add more test cases for other endpoints in userRoutes
});
