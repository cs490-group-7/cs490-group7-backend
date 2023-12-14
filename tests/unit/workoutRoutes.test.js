const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../../index');
const WorkoutController = require('../../controllers/workoutController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Workout Routes', () => {
  let getExerciseBankStub;
  let getWorkoutListStub;
  let deleteWorkoutStub;
  let getWorkoutDetailsStub;
  let createWorkoutStub;
  let editWorkoutStub;
  let assignWorkoutStub;
  let getAssignmentsStub;
  let getTodaysLogsStub;
  let unassignWorkoutStub;
  let logSessionStub;

  beforeEach(() => {
    // Create stubs for the WorkoutController functions
    getExerciseBankStub = sinon.stub(WorkoutController, 'getExerciseBank');
    getWorkoutListStub = sinon.stub(WorkoutController, 'getWorkoutList');
    deleteWorkoutStub = sinon.stub(WorkoutController, 'deleteWorkout');
    getWorkoutDetailsStub = sinon.stub(WorkoutController, 'getWorkoutDetails');
    createWorkoutStub = sinon.stub(WorkoutController, 'createWorkout');
    editWorkoutStub = sinon.stub(WorkoutController, 'editWorkout');
    assignWorkoutStub = sinon.stub(WorkoutController, 'assignWorkout');
    getAssignmentsStub = sinon.stub(WorkoutController, 'getAssignments');
    getTodaysLogsStub = sinon.stub(WorkoutController, 'getTodaysLogs');
    unassignWorkoutStub = sinon.stub(WorkoutController, 'unassignWorkout');
    logSessionStub = sinon.stub(WorkoutController, 'logSession');
  });

  afterEach(() => {
    // Restore the original functions after each test
    getExerciseBankStub.restore();
    getWorkoutListStub.restore();
    deleteWorkoutStub.restore();
    getWorkoutDetailsStub.restore();
    createWorkoutStub.restore();
    editWorkoutStub.restore();
    assignWorkoutStub.restore();
    getAssignmentsStub.restore();
    getTodaysLogsStub.restore();
    unassignWorkoutStub.restore();
    logSessionStub.restore();
  });

  it('should get exercise bank', (done) => {
    // Stub the function to return mock data
    getExerciseBankStub.resolves([{ exercise_id: 1, exercise_name: 'Push-up' }]);

    chai.request(app)
      .get('/api/workout/exercise-bank')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get workout list', (done) => {
    // Stub the function to return mock data
    getWorkoutListStub.resolves([{ workout_id: 1, workout_name: 'Morning Workout' }]);

    chai.request(app)
      .post('/api/workout/workout-list')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should delete a workout', (done) => {
    // Stub the function to return a success message
    deleteWorkoutStub.resolves({ message: 'Workout deleted successfully' });

    chai.request(app)
      .post('/api/workout/delete-workout')
      .send({ workoutId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Workout deleted successfully');
        done();
      });
  });

  it('should get workout details', (done) => {
    // Stub the function to return mock data
    getWorkoutDetailsStub.resolves({
      workout: { workout_name: 'Morning Workout', set_count: 3, description: 'A great workout' },
      exercises: [{ exercise_id: 1, exercise_name: 'Push-up', reps: 10 }],
    });

    chai.request(app)
      .post('/api/workout/workout-details')
      .send({ workoutId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object').that.has.all.keys('workout', 'exercises');
        done();
      });
  });

  it('should create a workout', (done) => {
    // Stub the function to return a success message
    createWorkoutStub.resolves({ message: 'Workout created successfully' });

    chai.request(app)
      .post('/api/workout/create-workout')
      .send({
        creatorId: 1,
        workoutName: 'New Workout',
        setCount: 3,
        description: 'A new workout',
        exercises: [{ exercise_id: 1, rep_count: 10 }],
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').equal('Workout created successfully');
        done();
      });
  });

  it('should edit a workout', (done) => {
    // Stub the function to return a success message
    editWorkoutStub.resolves({ message: 'Workout edited successfully' });

    chai.request(app)
      .post('/api/workout/edit-workout')
      .send({
        workoutId: 1,
        creatorId: 1,
        workoutName: 'Updated Workout',
        setCount: 4,
        description: 'An updated workout',
        exercises: [{ exercise_id: 2, rep_count: 12 }],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Workout edited successfully');
        done();
      });
  });

  it('should assign a workout', (done) => {
    // Stub the function to return a success message
    assignWorkoutStub.resolves({ message: 'Assignment created successfully' });

    chai.request(app)
      .post('/api/workout/assign-workout')
      .send({ userId: 1, workoutId: 1, dayOfWeek: 'Monday' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').equal('Assignment created successfully');
        done();
      });
  });

  it('should get assignments', (done) => {
    // Stub the function to return mock data
    getAssignmentsStub.resolves([{ workout_id: 1, workout_name: 'Morning Workout', day_of_week: 'Monday' }]);

    chai.request(app)
      .post('/api/workout/get-assignments')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get today\'s logs', (done) => {
    // Stub the function to return mock data
    getTodaysLogsStub.resolves([{ workout_id: 1 }]);

    chai.request(app)
      .post('/api/workout/get-todays-logs')
      .send({ userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should unassign a workout', (done) => {
    // Stub the function to return a success message
    unassignWorkoutStub.resolves({ message: 'Workout unassigned successfully' });

    chai.request(app)
      .post('/api/workout/unassign-workout')
      .send({ workoutId: 1, userId: 1, dayOfWeek: 'Monday' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Workout unassigned successfully');
        done();
      });
  });

  it('should log a session', (done) => {
    // Stub the function to return a success message
    logSessionStub.resolves({ message: 'Session logged successfully' });

    chai.request(app)
      .post('/api/workout/log-session')
      .send({ userId: 1, workoutId: 1, sessionDate: '2023-01-01', dayOfWeek: 'Monday' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').equal('Session logged successfully');
        done();
      });
  });
});
