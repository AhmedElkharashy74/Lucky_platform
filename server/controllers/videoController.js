const mongoose = require('mongoose');
const Video = require('../models/Courses').Video;
const {Course} = require('../models/Courses');
const Teacher = require('../models/Teacher');
const { ObjectId } = require('mongodb');

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
  static async addVideo(req, res) {
    try {
      const { title, description } = req.body;
      const videoFile = req.file;

      if (!videoFile) {
        return res.status(400).send('No video file uploaded');
      }

      // Check if the course exists and belongs to the logged-in teacher
      const course = await Course.findOne({ _id: req.params.courseId, instructor: req.session.userId });

      if (!course) {
        return res.status(403).send('You don\'t have permission to add a video to this course.');
      }

      // Create a new video object
      const newVideo = new Video({
        title,
        description,
        url: `/uploads/vids/${videoFile.filename}`,
        course: course._id
      });

      // Save the new video
      await newVideo.save();

      // Add the new video to the course's videos array
      course.videos.push(newVideo._id);
      await course.save();

      res.status(201).redirect(`/courses/${course._id}`);
    } catch (err) {
      console.error(err)
      // res.status(201).redirect(`/courses/${course._id}`);
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


  
  static async viewVideo(req, res) {
    try {
      const videoId = req.params.id;
      // console.log(videoId)
      const video = await Video.findById(videoId).populate('course');
      // console.log('meow'+video)
      if (!video) {
        return res.status(404).send('Video not found');
      }

      const teacherId = req.session.userId;
      console.log(teacherId);
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).send('Teacher not found');
      }

      res.render('teacher/xtreme-html/ltr/video', {
        video: video,
        teacher: teacher
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = VideoController;
