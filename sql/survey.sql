USE databaseName;

-- Table for client initial survey
CREATE TABLE ClientInitialSurvey (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    fitness_goal VARCHAR(100) NOT NULL,

    CONSTRAINT fk_client_survey_user
        FOREIGN KEY (user_id)
        REFERENCES Users (id)
);

-- Table for coach initial survey
CREATE TABLE CoachInitialSurvey (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    certifications TEXT,
    experience TEXT,
    specializations TEXT,

    CONSTRAINT fk_coach_survey_user
        FOREIGN KEY (user_id)
        REFERENCES Users (id)
);
