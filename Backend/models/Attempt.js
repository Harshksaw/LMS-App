const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    attemptDate: {
        type: Date,
        default: Date.now,
    },


    questions: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Questions",

            },
            userAnswer: {
                type: String, // Assuming answers are strings, adjust if necessary
                required:false,
            },
            correctAnswer: {
                type: String, // Assuming correct answers are strings, adjust if necessary
                required: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
            unanswered: {
                type: Boolean,
                default: false,
            },
        }
    ],
    highestPercentage: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
attemptSchema.pre('save', function(next) {
    let correctAnswers = 0;
    this.questions.forEach(question => {
        if (!question.userAnswer) {
            question.unanswered = true;
            question.isCorrect = false;
        } else {
            question.unanswered = false;
            question.isCorrect = question.userAnswer === question.correctAnswer;
        }
        if (question.isCorrect) {
            correctAnswers++;
        }
    });

    const totalQuestions = this.questions.length;
    const currentPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    if (currentPercentage > this.highestPercentage) {
        this.highestPercentage = currentPercentage;
    }

    next();
});

module.exports = mongoose.model("QuizAttempt", attemptSchema);
