const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db_conn = require('../db_connection'); 

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
  // Insert a test user into the database before each test
  beforeEach((done) => {
    const query = 'INSERT INTO Users (id, first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?, ?)';
    db_conn.query(query, [testUser.userId, testUser.first_name, testUser.last_name, testUser.email, testUser.password, testUser.phone], (error) => {
      if (error) {
        console.error('Error inserting test user:', error);
        done(error);
      } else {
        done();
      }
    });
  });

  it('should get account information', (done) => {
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

        // Confirm the updated email in the database
        const query = 'SELECT email FROM Users WHERE id = ?';
        db_conn.query(query, [testUser.userId], (error, result) => {
          if (error) {
            console.error('Error retrieving updated email:', error);
            done(error);
          } else {
            expect(result[0].email).to.equal(updatedUserData.email);
            done();
          }
        });
      });
  });

  // Add more tests as needed

  // Cleanup: Remove the test user from the database after each test
  afterEach((done) => {
    const deleteQuery = 'DELETE FROM Users WHERE id = ?';
    db_conn.query(deleteQuery, [testUser.userId], (error) => {
      if (error) {
        console.error('Error deleting test user:', error);
      }
      done();
    });
  });
});
