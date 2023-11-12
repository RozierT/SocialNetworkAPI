const { Thoughts, User } = require('../models');

module.exports = {
  // Function to get all of the applications by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets a single thought using the findOneAndUpdate method. We pass in the ID of the thoughts and then respond with it, or an error if not found
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thoughts.findOne({ _id: req.params.applicationId });

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with that ID' });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new thoughts. Accepts a request body with the entire Thoughts object.
  // Because applications are associated with Users, we then update the User who created the app and add the ID of the thoughts to the applications array
  async createThought(req, res) {
    try {
      const thoughts = await Thoughts.create(req.body);
      const user = await User.findOneAndUpdate(
        { id: req.body.userId },
        { $addToSet: { thoughts: thoughts.id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thoughts created, but found no user with that ID',
        })
      }

      res.json('Created the thought 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Updates and thoughts using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  async updateThought(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndUpdate(
        { id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }

      res.json(thoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Deletes an thoughts from the database. Looks for an app by ID.
  // Then if the app exists, we look for any users associated with the app based on he app ID and update the applications array for the User.
  async deleteThought(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndRemove({ id: req.params.thoughtId });

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thought: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thoughts created but no user with this id!',
        });
      }

      res.json({ message: 'Thoughts successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Adds a reaction to an thought. This method is unique in that we add the entire body of the tag rather than the ID with the mongodb $addToSet operator.
  async addReaction(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndUpdate(
        { id: req.params.thoughtId },
        { $addToSet: { reaction: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove thoughts reaction. This method finds the thoughts based on ID. It then updates the tags array associated with the app in question by removing it's tagId from the tags array.
  async removeReaction(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndUpdate(
        { id: req.params.thoughtId },
        { $pull: { reaction: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
