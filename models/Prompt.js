const { Schema, models, model } = require("mongoose");

const PromptSchma = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required']
  },
  tag: {
    type: String,
    required: [true, 'Tag is required']
  }
})

const Prompt = models.Prompt || model('Prompt', PromptSchma);

export default Prompt