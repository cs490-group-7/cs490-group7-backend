DROP SCHEMA IF EXISTS fitness_app;
CREATE SCHEMA fitness_app;
USE fitness_app;

CREATE TABLE Users (
    id int NOT NULL AUTO_INCREMENT,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL,
    password varchar(128) NOT NULL, -- need to figure out how to properly store password
    user_type ENUM('Client', 'Coach') NOT NULL, -- consider using: is_coach boolean,
    phone varchar(20),

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
); 

-- Table for client initial survey
CREATE TABLE ClientInitialSurvey (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    height VARCHAR(6) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    fitness_goal VARCHAR(100) NOT NULL,  -- User can have many goals, use User_Goal and Goal tables

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users (id)
);

-- Table for coach initial survey
CREATE TABLE CoachInitialSurvey (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    certifications TEXT,
    experience TEXT,
    specializations TEXT,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE TABLE ExerciseBank(
    exercise_id int NOT NULL AUTO_INCREMENT,
    exercise_name varchar(100) NOT NULL,
    url varchar(100),
    exercise_type varchar(50),

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (exercise_id)
);

INSERT INTO ExerciseBank (exercise_name, exercise_type) VALUES
    ('Bar Dip', 'Chest'),
    ('Bench Press', 'Chest'),
    ('Cable Chest Press', 'Chest'),
    ('Close-Grip Bench Press', 'Chest'),
    ('Close-Grip Feet-Up Bench Press', 'Chest'),
    ('Decline Bench Press', 'Chest'),
    ('Dumbbell Chest Fly', 'Chest'),
    ('Dumbbell Chest Press', 'Chest'),
    ('Dumbbell Decline Chest Press', 'Chest'),
    ('Dumbbell Floor Press', 'Chest'),
    ('Dumbbell Pullover', 'Chest'),
    ('Feet-Up Bench Press', 'Chest'),
    ('Floor Press', 'Chest'),
    ('Incline Bench Press', 'Chest'),
    ('Incline Dumbbell Press', 'Chest'),
    ('Incline Push-Up', 'Chest'),
    ('Kneeling Incline Push-Up', 'Chest'),
    ('Kneeling Push-Up', 'Chest'),
    ('Machine Chest Fly', 'Chest'),
    ('Machine Chest Press', 'Chest'),
    ('Pec Deck', 'Chest'),
    ('Push-Up', 'Chest'),
    ('Push-Up Against Wall', 'Chest'),
    ('Push-Ups With Feet in Rings', 'Chest'),
    ('Resistance Band Chest Fly', 'Chest'),
    ('Smith Machine Bench Press', 'Chest'),
    ('Smith Machine Incline Bench Press', 'Chest'),
    ('Standing Cable Chest Fly', 'Chest'),
    ('Standing Resistance Band Chest Fly', 'Chest'),
    ('Band External Shoulder Rotation', 'Shoulder'),
    ('Band Internal Shoulder Rotation', 'Shoulder'),
    ('Band Pull-Apart', 'Shoulder'),
    ('Barbell Front Raise', 'Shoulder'),
    ('Barbell Rear Delt Row', 'Shoulder'),
    ('Barbell Upright Row', 'Shoulder'),
    ('Behind the Neck Press', 'Shoulder'),
    ('Cable Lateral Raise', 'Shoulder'),
    ('Cable Rear Delt Row', 'Shoulder'),
    ('Dumbbell Front Raise', 'Shoulder'),
    ('Dumbbell Horizontal Internal Shoulder Rotation', 'Shoulder'),
    ('Dumbbell Horizontal External Shoulder Rotation', 'Shoulder'),
    ('Dumbbell Lateral Raise', 'Shoulder'),
    ('Dumbbell Rear Delt Row', 'Shoulder'),
    ('Dumbbell Shoulder Press', 'Shoulder'),
    ('Face Pull', 'Shoulder'),
    ('Front Hold', 'Shoulder'),
    ('Lying Dumbbell External Shoulder Rotation', 'Shoulder'),
    ('Lying Dumbbell Internal Shoulder Rotation', 'Shoulder'),
    ('Machine Lateral Raise', 'Shoulder'),
    ('Machine Shoulder Press', 'Shoulder'),
    ('Monkey Row', 'Shoulder'),
    ('Overhead Press', 'Shoulder'),
    ('Plate Front Raise', 'Shoulder'),
    ('Power Jerk', 'Shoulder'),
    ('Push Press', 'Shoulder'),
    ('Reverse Cable Flyes', 'Shoulder'),
    ('Reverse Dumbbell Flyes', 'Shoulder'),
    ('Reverse Machine Fly', 'Shoulder'),
    ('Seated Dumbbell Shoulder Press', 'Shoulder'),
    ('Seated Barbell Overhead Press', 'Shoulder'),
    ('Seated Smith Machine Shoulder Press', 'Shoulder'),
    ('Snatch Grip Behind the Neck Press', 'Shoulder'),
    ('Squat Jerk', 'Shoulder'),
    ('Split Jerk', 'Shoulder'),
    ('Barbell Curl', 'Bicep'),
    ('Barbell Preacher Curl', 'Bicep'),
    ('Bodyweight Curl', 'Bicep'),
    ('Cable Curl With Bar', 'Bicep'),
    ('Cable Curl With Rope', 'Bicep'),
    ('Concentration Curl', 'Bicep'),
    ('Dumbbell Curl', 'Bicep'),
    ('Dumbbell Preacher Curl', 'Bicep'),
    ('Hammer Curl', 'Bicep'),
    ('Incline Dumbbell Curl', 'Bicep'),
    ('Machine Bicep Curl', 'Bicep'),
    ('Spider Curl', 'Bicep'),
    ('Barbell Standing Triceps Extension', 'Tricep'),
    ('Barbell Lying Triceps Extension', 'Tricep'),
    ('Bench Dip', 'Tricep'),
    ('Close-Grip Push-Up', 'Tricep'),
    ('Dumbbell Lying Triceps Extension', 'Tricep'),
    ('Dumbbell Standing Triceps Extension', 'Tricep'),
    ('Overhead Cable Triceps Extension', 'Tricep'),
    ('Tricep Bodyweight Extension', 'Tricep'),
    ('Tricep Pushdown With Bar', 'Tricep'),
    ('Tricep Pushdown With Rope', 'Tricep'),
    ('Air Squat', 'Leg'),
    ('Barbell Hack Squat', 'Leg'),
    ('Barbell Lunge', 'Leg'),
    ('Barbell Walking Lunge', 'Leg'),
    ('Belt Squat', 'Leg'),
    ('Body Weight Lunge', 'Leg'),
    ('Box Squat', 'Leg'),
    ('Bulgarian Split Squat', 'Leg'),
    ('Chair Squat', 'Leg'),
    ('Dumbbell Lunge', 'Leg'),
    ('Dumbbell Squat', 'Leg'),
    ('Front Squat', 'Leg'),
    ('Goblet Squat', 'Leg'),
    ('Hack Squat Machine', 'Leg'),
    ('Half Air Squat', 'Leg'),
    ('Hip Adduction Machine', 'Leg'),
    ('Landmine Hack Squat', 'Leg'),
    ('Landmine Squat', 'Leg'),
    ('Leg Extension', 'Leg'),
    ('Leg Press', 'Leg'),
    ('Lying Leg Curl', 'Leg'),
    ('Pause Squat', 'Leg'),
    ('Romanian Deadlift', 'Leg'),
    ('Safety Bar Squat', 'Leg'),
    ('Seated Leg Curl', 'Leg'),
    ('Shallow Body Weight Lunge', 'Leg'),
    ('Side Lunges (Bodyweight)', 'Leg'),
    ('Smith Machine Squat', 'Leg'),
    ('Squat', 'Leg'),
    ('Step Up', 'Leg'),
    ('Back Extension', 'Back'),
    ('Barbell Row', 'Back'),
    ('Barbell Shrug', 'Back'),
    ('Block Snatch', 'Back'),
    ('Cable Close Grip Seated Row', 'Back'),
    ('Cable Wide Grip Seated Row', 'Back'),
    ('Chin-Up', 'Back'),
    ('Clean', 'Back'),
    ('Clean and Jerk', 'Back'),
    ('Deadlift', 'Back'),
    ('Deficit Deadlift', 'Back'),
    ('Dumbbell Deadlift', 'Back'),
    ('Dumbbell Row', 'Back'),
    ('Dumbbell Shrug', 'Back'),
    ('Floor Back Extension', 'Back'),
    ('Good Morning', 'Back'),
    ('Hang Clean', 'Back'),
    ('Hang Power Clean', 'Back'),
    ('Hang Power Snatch', 'Back'),
    ('Hang Snatch', 'Back'),
    ('Inverted Row', 'Back'),
    ('Inverted Row with Underhand Grip', 'Back'),
    ('Jefferson Curl', 'Back'),
    ('Kettlebell Swing', 'Back'),
    ('Lat Pulldown With Pronated Grip', 'Back'),
    ('Lat Pulldown With Supinated Grip', 'Back'),
    ('One-Handed Cable Row', 'Back'),
    ('One-Handed Lat Pulldown', 'Back'),
    ('Pause Deadlift', 'Back'),
    ('Pendlay Row', 'Back'),
    ('Power Clean', 'Back'),
    ('Power Snatch', 'Back'),
    ('Pull-Up', 'Back'),
    ('Rack Pull', 'Back'),
    ('Seal Row', 'Back'),
    ('Seated Machine Row', 'Back'),
    ('Snatch', 'Back'),
    ('Snatch Grip Deadlift', 'Back'),
    ('Stiff-Legged Deadlift', 'Back'),
    ('Straight Arm Lat Pulldown', 'Back'),
    ('Sumo Deadlift', 'Back'),
    ('T-Bar Row', 'Back'),
    ('Trap Bar Deadlift With High Handles', 'Back'),
    ('Trap Bar Deadlift With Low Handles', 'Back'),
    ('Banded Side Kicks', 'Glute'),
    ('Cable Pull Through', 'Glute'),
    ('Clamshells', 'Glute'),
    ('Dumbbell Romanian Deadlift', 'Glute'),
    ('Dumbbell Frog Pumps', 'Glute'),
    ('Fire Hydrants', 'Glute'),
    ('Frog Pumps', 'Glute'),
    ('Glute Bridge', 'Glute'),
    ('Hip Abduction Against Band', 'Glute'),
    ('Hip Abduction Machine', 'Glute'),
    ('Hip Thrust', 'Glute'),
    ('Hip Thrust Machine', 'Glute'),
    ('Hip Thrust With Band Around Knees', 'Glute'),
    ('Lateral Walk With Band', 'Glute'),
    ('Machine Glute Kickbacks', 'Glute'),
    ('One-Legged Glute Bridge', 'Glute'),
    ('One-Legged Hip Thrust', 'Glute'),
    ('Single Leg Romanian Deadlift', 'Glute'),
    ('Standing Glute Kickback in Machine', 'Glute'),
    ('Cable Crunch', 'Ab'),
    ('Crunch', 'Ab'),
    ('Dead Bug', 'Ab'),
    ('Hanging Leg Raise', 'Ab'),
    ('Hanging Knee Raise', 'Ab'),
    ('Hanging Sit-Up', 'Ab'),
    ('High to Low Wood Chop with Band', 'Ab'),
    ('Horizontal Wood Chop with Band', 'Ab'),
    ('Kneeling Ab Wheel Roll-Out', 'Ab'),
    ('Kneeling Plank', 'Ab'),
    ('Kneeling Side Plank', 'Ab'),
    ('Lying Leg Raise', 'Ab'),
    ('Lying Windshield Wiper', 'Ab'),
    ('Lying Windshield Wiper with Bent Knees', 'Ab'),
    ('Machine Crunch', 'Ab'),
    ('Mountain Climbers', 'Ab'),
    ('Oblique Crunch', 'Ab'),
    ('Oblique Sit-Up', 'Ab'),
    ('Plank', 'Ab'),
    ('Side Plank', 'Ab'),
    ('Sit-Up', 'Ab'),
    ('Eccentric Heel Drop', 'Calf'),
    ('Heel Raise', 'Calf'),
    ('Seated Calf Raise', 'Calf'),
    ('Standing Calf Raise', 'Calf'),
    ('Barbell Wrist Curl', 'Forearm Flexors & Grip'),
    ('Barbell Wrist Curl Behind the Back', 'Forearm Flexors & Grip'),
    ('Bar Hang', 'Forearm Flexors & Grip'),
    ('Dumbbell Wrist Curl', 'Forearm Flexors & Grip'),
    ('Farmers Walk', 'Forearm Flexors & Grip'),
    ('Fat Bar Deadlift', 'Forearm Flexors & Grip'),
    ('Gripper', 'Forearm Flexors & Grip'),
    ('One-Handed Bar Hang', 'Forearm Flexors & Grip'),
    ('Plate Pinch', 'Forearm Flexors & Grip'),
    ('Plate Wrist Curl', 'Forearm Flexors & Grip'),
    ('Towel Pull-Up', 'Forearm Flexors & Grip'),
    ('Barbell Wrist Extension', 'Forearm Extensor'),
    ('Dumbbell Wrist Extension', 'Forearm Extensor');

CREATE TABLE Workout(
    workout_id int NOT NULL AUTO_INCREMENT,
    workout_name varchar(100) NOT NULL,
    set_count int,
    description text,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (workout_id)
);

CREATE TABLE Workout_Exercise(
    workout_id int NOT NULL,
    exercise_id int NOT NULL,
    exercise_order int NOT NULL,
    reps int,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (workout_id, user_id),
    FOREIGN KEY (workout_id) REFERENCES Workout (workout_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE Chat(
    chat_id int NOT NULL AUTO_INCREMENT,
    coach_id int NOT NULL,
    client_id int NOT NULL,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (chat_id),
    FOREIGN KEY (coach_id) REFERENCES Users (id), -- maybe ON DELETE CASCADE
    FOREIGN KEY (client_id) REFERENCES Users (id) -- maybe ON DELETE CASCADE

);

CREATE TABLE Message(
    message_id int NOT NULL AUTO_INCREMENT,
    chat_id int NOT NULL,
    from_coach boolean NOT NULL,
    message text,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (message_id),
    FOREIGN KEY (chat_id) REFERENCES Chat (chat_id) ON DELETE CASCADE
);

CREATE TABLE Coach_Client(
    coach_id int NOT NULL,
    client_id int NOT NULL,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

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

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (goal_id)
); 

CREATE TABLE User_Goal(
    user_id int NOT NULL,
    goal_id int NOT NULL,
    completed boolean DEFAULT FALSE,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, goal_id),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES Goal (goal_id) ON DELETE CASCADE
);

CREATE TABLE ProgressPicture(
    picture_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    date date DEFAULT (CURRENT_DATE),
    image LONGBLOB,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (picture_id),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE WorkoutConsistency(
    user_id int NOT NULL,
    date date DEFAULT (CURRENT_DATE),
    workouts_planned int,
    workouts_completed int,

    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE DailySurvey (
    user_id INT NOT NULL,
    date DATE DEFAULT (CURRENT_DATE),
    calorie_intake INT,
    water_intake INT,
    weight INT,
    mood VARCHAR(50),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);
