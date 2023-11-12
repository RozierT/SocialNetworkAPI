const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    thoughtId: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema]
    });

const reactionSchema = new mongoose.Schema({
    reactionId: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    body: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = mongoose.model('Thoughts', thoughtSchema);

module.exports = Thoughts;