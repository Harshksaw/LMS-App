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
                en:{
                    type:String,
    
                  },
                  hin:{
                    type:String,
    
                  }
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

    this.score = correctAnswers;
    // Store the count of correct answers as the score
    this.highestPercentage = correctAnswers;

    next();
});


module.exports = mongoose.model("QuizAttempt", attemptSchema);
