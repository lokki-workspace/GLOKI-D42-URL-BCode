import mongoose from "mongoose";
import shortId from "shortid";

const shortUrlSchema = mongoose.Schema({
  shortId: {
    type: String,
    required: true,
  },
  FullUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model.shortUrl ||
  mongoose.model("shortUrl", shortUrlSchema);
