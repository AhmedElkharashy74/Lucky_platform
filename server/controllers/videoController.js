const mongoose = require('mongoose');
const Video = require('../models/Courses').Video;

class VideoController {
  // Get all videos
  static async getAllVideos(req, res) {
    try {
        const videos = await Video.find();

        // Format the creation date for each video
        const formattedVideos = videos.map(video => ({
            ...video._doc,
            createdAtFormatted: format(new Date(video.createdAt), 'yyyy-MM-dd'), // Format as desired
        }));

        res.json(formattedVideos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


  static async getVideoById(req, res) {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Cannot find video' });

        // Format the creation date using date-fns
        const formattedVideo = {
            ...video._doc,
            createdAtFormatted: format(new Date(video.createdAt), 'yyyy-MM-dd'), // Format as desired
        };

        res.json(formattedVideo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

  // Create one video
  async createVideo(req, res) {
    const { title, description, url, duration, publishDate } = req.body;
    
    const video = new Video({
      title,
      description,
      url,
      duration,
      publishDate
    });

    try {
      const newVideo = await video.save();
      res.status(201).json(newVideo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Update one video
  async updateVideo(req, res) {
    const { title, description, url, duration, publishDate } = req.body;
    
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ message: 'Cannot find video' });

      if (title != null) video.title = title;
      if (description != null) video.description = description;
      if (url != null) video.url = url;
      if (duration != null) video.duration = duration;
      if (publishDate != null) video.publishDate = publishDate;

      const updatedVideo = await video.save();
      res.json(updatedVideo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete one video
  async deleteVideo(req, res) {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ message: 'Cannot find video' });

      await video.remove();
      res.json({ message: 'Deleted Video' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

module.exports = VideoController;
