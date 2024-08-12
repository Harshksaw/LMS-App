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
}, { timestamps: true });

attemptSchema.pre('save', function(next) {
    this.questions.forEach(question => {
        if (!question.userAnswer) {
            question.unanswered = true;
            question.isCorrect = false;
        } else {
            question.unanswered = false;
            question.isCorrect = question.userAnswer === question.correctAnswer;
        }
    });
    next();
});

module.exports = mongoose.model("QuizAttempt", attemptSchema);
