const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Raj27',  // Use your MySQL password
    database: 'dbmsproject'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Fetch OOP questions route
app.get('/oop/questions', (req, res) => {
    const sql = 'SELECT question_id, question, opt1, opt2, opt3, opt4 FROM OOP_Questions';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching OOP questions:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No questions found' });
        }

        console.log('Questions fetched:', result);
        res.json(result);  // Return only questions and options (without correct answers)
    });
});
 

// Submit OOP question answers and update marks
app.post('/oop/submit', (req, res) => {
    const { student_id, question_id, student_answer } = req.body;

    // Fetch the correct answer from the database
    const sqlFetchAnswer = 'SELECT ans FROM OOP_Questions WHERE question_id = ?';
    
    db.query(sqlFetchAnswer, [question_id], (err, result) => {
        if (err) {
            console.error('Error fetching correct answer:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctAnswer = result[0].ans;

        // Insert student's answer into the student_answers table
        const sqlSubmitAnswer = 'INSERT INTO student_answers (student_id, question_id, student_answer) VALUES (?, ?, ?)';
        
        db.query(sqlSubmitAnswer, [student_id, question_id, student_answer], (err, submitResult) => {
            if (err) {
                console.error('Error saving answer:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if the answer is correct
            const isCorrect = parseInt(student_answer) === correctAnswer;

            // Update student's marks
            const sqlUpdateMarks = `UPDATE marks SET marks1 = marks1 + 1 WHERE student_id = ? AND ? = 1`;
            
            if (isCorrect) {
                db.query(sqlUpdateMarks, [student_id, 1], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating marks:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.json({
                        message: 'Answer submitted successfully',
                        isCorrect: isCorrect,
                        correctAnswer: correctAnswer
                    });
                });
            } else {
                res.json({
                    message: 'Answer submitted successfully',
                    isCorrect: isCorrect,
                    correctAnswer: correctAnswer
                });
            }
        });
    });
});


// Sign up route for students
app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO student (`student_id`, `student_name`, `email_id`, `password`) VALUES (?)';
    const values = [
        req.body.rollNo,
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Student registered successfully', data });
    });
});

// Login route for students
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM student WHERE email_id = ? AND password = ?';

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (data.length > 0) {
            res.json({ message: 'succesfully' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});


// Fetch Java questions route
app.get('/java/questions', (req, res) => {
    const sql = 'SELECT question_id, question, opt1, opt2, opt3, opt4 FROM JAVA_Questions';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching Java questions:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No questions found' });
        }

        console.log('Java Questions fetched:', result);
        res.json(result);  // Return only questions and options (without correct answers)
    });
});

// Submit Java question answers and update marks
app.post('/java/submit', (req, res) => {
    const { student_id, question_id, student_answer } = req.body;

    // Fetch the correct answer
    const sqlFetchAnswer = 'SELECT ans FROM JAVA_Questions WHERE question_id = ?';

    db.query(sqlFetchAnswer, [question_id], (err, result) => {
        if (err) {
            console.error('Error fetching correct answer:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctAnswer = result[0].ans;

        // Insert student's answer
        const sqlSubmitAnswer = 'INSERT INTO student_answers (student_id, question_id, student_answer) VALUES (?, ?, ?)';

        db.query(sqlSubmitAnswer, [student_id, question_id, student_answer], (err, submitResult) => {
            if (err) {
                console.error('Error saving answer:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const isCorrect = parseInt(student_answer) === correctAnswer;

            // Update marks if the answer is correct
            if (isCorrect) {
                const sqlUpdateMarks = `UPDATE marks SET marks2 = marks2 + 1 WHERE student_id = ? AND ? = 1`;

                db.query(sqlUpdateMarks, [student_id, 1], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating marks:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.json({
                        message: 'Answer submitted successfully',
                        isCorrect: isCorrect,
                        correctAnswer: correctAnswer
                    });
                });
            } else {
                res.json({
                    message: 'Answer submitted successfully',
                    isCorrect: isCorrect,
                    correctAnswer: correctAnswer
                });
            }
        });
    });
});

// Fetch DSA questions route
app.get('/dsa/questions', (req, res) => {
    const sql = 'SELECT question_id, question, opt1, opt2, opt3, opt4 FROM DSA_Questions';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching DSA questions:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No questions found' });
        }

        console.log('DSA Questions fetched:', result);
        res.json(result);  // Return only questions and options (without correct answers)
    });
});

// Submit DSA question answers and update marks
app.post('/dsa/submit', (req, res) => {
    const { student_id, question_id, student_answer } = req.body;

    const sqlFetchAnswer = 'SELECT ans FROM DSA_Questions WHERE question_id = ?';

    db.query(sqlFetchAnswer, [question_id], (err, result) => {
        if (err) {
            console.error('Error fetching correct answer:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctAnswer = result[0].ans;

        const sqlSubmitAnswer = 'INSERT INTO student_answers (student_id, question_id, student_answer) VALUES (?, ?, ?)';

        db.query(sqlSubmitAnswer, [student_id, question_id, student_answer], (err, submitResult) => {
            if (err) {
                console.error('Error saving answer:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const isCorrect = parseInt(student_answer) === correctAnswer;

            if (isCorrect) {
                const sqlUpdateMarks = `UPDATE marks SET marks3 = marks3 + 1 WHERE student_id = ? AND ? = 1`;

                db.query(sqlUpdateMarks, [student_id, 1], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating marks:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.json({
                        message: 'Answer submitted successfully',
                        isCorrect: isCorrect,
                        correctAnswer: correctAnswer
                    });
                });
            } else {
                res.json({
                    message: 'Answer submitted successfully',
                    isCorrect: isCorrect,
                    correctAnswer: correctAnswer
                });
            }
        });
    });
});

// Fetch DBMS questions route
app.get('/dbms/questions', (req, res) => {
    const sql = 'SELECT question_id, question, opt1, opt2, opt3, opt4 FROM DBMS_Questions';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching DBMS questions:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No questions found' });
        }

        console.log('DBMS Questions fetched:', result);
        res.json(result);  // Return only questions and options (without correct answers)
    });
});

// Submit DBMS question answers and update marks
app.post('/dbms/submit', (req, res) => {
    const { student_id, question_id, student_answer } = req.body;

    const sqlFetchAnswer = 'SELECT ans FROM DBMS_Questions WHERE question_id = ?';

    db.query(sqlFetchAnswer, [question_id], (err, result) => {
        if (err) {
            console.error('Error fetching correct answer:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const correctAnswer = result[0].ans;

        const sqlSubmitAnswer = 'INSERT INTO student_answers (student_id, question_id, student_answer) VALUES (?, ?, ?)';

        db.query(sqlSubmitAnswer, [student_id, question_id, student_answer], (err, submitResult) => {
            if (err) {
                console.error('Error saving answer:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const isCorrect = parseInt(student_answer) === correctAnswer;

            if (isCorrect) {
                const sqlUpdateMarks = `UPDATE marks SET marks4 = marks4 + 1 WHERE student_id = ? AND ? = 1`;

                db.query(sqlUpdateMarks, [student_id, 1], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating marks:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.json({
                        message: 'Answer submitted successfully',
                        isCorrect: isCorrect,
                        correctAnswer: correctAnswer
                    });
                });
            } else {
                res.json({
                    message: 'Answer submitted successfully',
                    isCorrect: isCorrect,
                    correctAnswer: correctAnswer
                });
            }
        });
    });
});


// Start the server
app.listen(5000, () => {
    console.log('Server is listening on port 5000...');
});
