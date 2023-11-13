USE fitness_app; -- not sure what the name of the database is

CREATE TABLE Users (
    id int NOT NULL AUTO_INCREMENT,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL,
    password varchar(128) NOT NULL, -- need to figure out how to properly store password
    user_type ENUM('Client', 'Coach') NOT NULL, -- consider using: is_coach boolean,
    phone varchar(20),

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
); 

-- Table for client initial survey
CREATE TABLE ClientInitialSurvey (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    fitness_goal VARCHAR(100) NOT NULL,  -- User can have many goals, use User_Goal and Goal tables

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users (id)
);

-- Table for coach initial survey
CREATE TABLE CoachInitialSurvey (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    certifications TEXT,
    experience TEXT,
    specializations TEXT,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE TABLE ExerciseBank(
    exercise_id int NOT NULL AUTO_INCREMENT,
    exercise_name varchar(100) NOT NULL,
    url varchar(100),
    muscle_group varchar(50),

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (exercise_id)
);

CREATE TABLE Workout(
    workout_id int NOT NULL AUTO_INCREMENT,
    workout_name varchar(100) NOT NULL,
    set_count int,
    description text,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (workout_id)
);

CREATE TABLE Workout_Exercise(
    workout_id int NOT NULL,
    exercise_id int NOT NULL,
    reps int,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES Workout (workout_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES ExerciseBank (exercise_id)
);

CREATE TABLE WorkoutCalendar(
    workout_id int NOT NULL,
    user_id int NOT NULL,

    sunday boolean DEFAULT FALSE,
    monday boolean DEFAULT FALSE,
    tuesday boolean DEFAULT FALSE,
    wednesday boolean DEFAULT FALSE,
    thursday boolean DEFAULT FALSE,
    friday boolean DEFAULT FALSE,
    saturday boolean DEFAULT FALSE,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (workout_id, user_id),
    FOREIGN KEY (workout_id) REFERENCES Workout (workout_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE Chat(
    chat_id int NOT NULL AUTO_INCREMENT,
    coach_id int NOT NULL,
    client_id int NOT NULL,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (chat_id),
    FOREIGN KEY (coach_id) REFERENCES Users (id), -- maybe ON DELETE CASCADE
    FOREIGN KEY (client_id) REFERENCES Users (id) -- maybe ON DELETE CASCADE

);

CREATE TABLE Message(
    message_id int NOT NULL AUTO_INCREMENT,
    chat_id int NOT NULL,
    from_coach boolean NOT NULL,
    message text,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (message_id),
    FOREIGN KEY (chat_id) REFERENCES Chat (chat_id) ON DELETE CASCADE
);

CREATE TABLE Coach_Client(
    coach_id int NOT NULL,
    client_id int NOT NULL,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (coach_id, client_id),
    FOREIGN KEY (coach_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES Users (id) ON DELETE CASCADE
);


CREATE TABLE Goal(
    goal_id int NOT NULL AUTO_INCREMENT,
    goal text,
    goal_helper text, -- To specify what the numeric value means (reps, weight, Personal Record weight lifted, etc)
    base_line int, -- numeric value like base line, progress, end goal 
    progress int,
    end_goal int,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (goal_id)
); 

CREATE TABLE User_Goal(
    user_id int NOT NULL,
    goal_id int NOT NULL,
    completed boolean DEFAULT FALSE,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, goal_id),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES Goal (goal_id) ON DELETE CASCADE
);

CREATE TABLE ProgressPicture(
    picture_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    date date DEFAULT (CURRENT_DATE),
    image LONGBLOB,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (picture_id),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE WorkoutConsistency(
    user_id int NOT NULL,
    date date DEFAULT (CURRENT_DATE),
    workouts_planned int,
    workouts_completed int,

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE DailySurvey(
    user_id int NOT NULL,
    date date DEFAULT (CURRENT_DATE),
    calorie_intake int,
    water_intake int,
    weight int,
    mood varchar(50),

    last_update TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);