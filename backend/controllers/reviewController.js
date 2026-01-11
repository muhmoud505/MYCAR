const Review = require('../models/Review')
const Listing = require('../models/Listing')
const User = require('../models/User')

// Create a review
async function createReview(req, res) {
  try {
    const {
      target,
      targetId,
      type = 'general',
      ratings,
      title,
      content,
      pros,
      cons,
      images,
      videos,
      verifiedPurchase = false,
      transactionId,
      purchaseDate,
      isExpertReview = false,
      expertCredentials,
      isComparison = false,
      comparedItems,
      tags,
      category
    } = req.body

    const reviewer = req.user.id

    if (!target || !targetId || !ratings?.overall || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify target exists
    let targetDoc
    if (target === 'listing') {
      targetDoc = await Listing.findById(targetId)
    } else if (target === 'user') {
      targetDoc = await User.findById(targetId)
    }
    
    if (!targetDoc) {
      return res.status(404).json({ error: 'Target not found' })
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({
      target,
      targetId,
      reviewer,
      status: { $ne: 'rejected' }
    })

    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this item' })
    }

    // Create review
    const review = await Review.create({
      target,
      targetId,
      reviewer,
      type,
      ratings,
      title,
      content,
      pros,
      cons,
      images,
      videos,
      verifiedPurchase,
      transactionId,
      purchaseDate,
      isExpertReview,
      expertCredentials,
      isComparison,
      comparedItems,
      tags,
      category,
      status: isExpertReview ? 'approved' : 'pending' // Auto-approve expert reviews
    })

    // Populate review details
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name email avatar isVerified verificationBadge')
      .populate('targetId', 'title make model year name')

    res.status(201).json(populatedReview)
  } catch (err) {
    console.error('Create review error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get reviews for a target
async function getReviews(req, res) {
  try {
    const { target, targetId } = req.params
    const { 
      type, 
      page = 1, 
      limit = 20, 
      sort = 'createdAt', 
      order = 'desc',
      rating,
      isExpertReview 
    } = req.query

    if (!target || !targetId) {
      return res.status(400).json({ error: 'Target and targetId required' })
    }

    // Build query
    const query = { target, targetId, status: 'approved' }
    
    if (type) query.type = type
    if (rating) query['ratings.overall'] = parseInt(rating)
    if (isExpertReview === 'true') query.isExpertReview = true

    // Sort options
    const sortOptions = {}
    sortOptions[sort] = order === 'desc' ? -1 : 1

    const reviews = await Review.find(query)
      .populate('reviewer', 'name email avatar isVerified verificationBadge')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(query)

    // Calculate rating summary
    const ratingSummary = await calculateRatingSummary(target, targetId)

    res.json({
      reviews,
      ratingSummary,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    })
  } catch (err) {
    console.error('Get reviews error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get expert reviews
async function getExpertReviews(req, res) {
  try {
    const { page = 1, limit = 10, category, tags } = req.query

    const query = { 
      isExpertReview: true, 
      status: 'approved' 
    }

    if (category) query.category = category
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags]
      query.tags = { $in: tagArray }
    }

    const reviews = await Review.find(query)
      .populate('reviewer', 'name email avatar')
      .populate('targetId', 'title make model year name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(query)

    res.json({
      reviews,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    })
  } catch (err) {
    console.error('Get expert reviews error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get comparison reviews
async function getComparisonReviews(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ 
      isComparison: true, 
      status: 'approved' 
    })
      .populate('reviewer', 'name email avatar')
      .populate('targetId', 'title make model year name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments({ 
      isComparison: true, 
      status: 'approved' 
    })

    res.json({
      reviews,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    })
  } catch (err) {
    console.error('Get comparison reviews error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update review (helpful/not helpful)
async function updateReviewInteraction(req, res) {
  try {
    const { reviewId } = req.params
    const { action } = req.body // 'helpful' or 'notHelpful'
    const userId = req.user.id

    if (!reviewId || !action) {
      return res.status(400).json({ error: 'Review ID and action required' })
    }

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }

    // Update helpful/not helpful count
    if (action === 'helpful') {
      review.helpful += 1
    } else if (action === 'notHelpful') {
      review.notHelpful += 1
    }

    await review.save()

    res.json({ helpful: review.helpful, notHelpful: review.notHelpful })
  } catch (err) {
    console.error('Update review interaction error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Report a review
async function reportReview(req, res) {
  try {
    const { reviewId } = req.params
    const { reason } = req.body
    const userId = req.user.id

    if (!reviewId || !reason) {
      return res.status(400).json({ error: 'Review ID and reason required' })
    }

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }

    // Check if already reported
    const existingReport = review.reports.find(
      report => report.reportedBy.toString() === userId
    )

    if (existingReport) {
      return res.status(409).json({ error: 'You have already reported this review' })
    }

    // Add report
    review.reports.push({
      reportedBy: userId,
      reason,
      reportedAt: new Date()
    })

    // Auto-hide if too many reports
    if (review.reports.length >= 5) {
      review.status = 'hidden'
    }

    await review.save()

    res.json({ success: true, reportsCount: review.reports.length })
  } catch (err) {
    console.error('Report review error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Respond to a review (for target owners)
async function respondToReview(req, res) {
  try {
    const { reviewId } = req.params
    const { content } = req.body
    const userId = req.user.id

    if (!reviewId || !content) {
      return res.status(400).json({ error: 'Review ID and response content required' })
    }

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }

    // Verify user is target owner
    let isOwner = false
    if (review.target === 'user' && review.targetId.toString() === userId) {
      isOwner = true
    } else if (review.target === 'listing') {
      const listing = await Listing.findById(review.targetId)
      if (listing && listing.seller.toString() === userId) {
        isOwner = true
      }
    }

    if (!isOwner) {
      return res.status(403).json({ error: 'Only target owners can respond to reviews' })
    }

    // Add response
    review.response = {
      content,
      respondedBy: userId,
      respondedAt: new Date(),
      helpful: 0
    }

    await review.save()

    const populatedReview = await Review.findById(reviewId)
      .populate('reviewer', 'name email avatar')
      .populate('response.respondedBy', 'name email avatar')

    res.json(populatedReview.response)
  } catch (err) {
    console.error('Respond to review error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user's reviews
async function getUserReviews(req, res) {
  try {
    const userId = req.user.id
    const { status, page = 1, limit = 20 } = req.query

    const query = { reviewer: userId }
    if (status) query.status = status

    const reviews = await Review.find(query)
      .populate('targetId', 'title make model year name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(query)

    res.json({
      reviews,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    })
  } catch (err) {
    console.error('Get user reviews error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Helper function to calculate rating summary
async function calculateRatingSummary(target, targetId) {
  const pipeline = [
    { $match: { target, targetId, status: 'approved' } },
    {
      $group: {
        _id: null,
        averageOverall: { $avg: '$ratings.overall' },
        averageCommunication: { $avg: '$ratings.communication' },
        averageDescriptionAccuracy: { $avg: '$ratings.descriptionAccuracy' },
        averageCleanliness: { $avg: '$ratings.cleanliness' },
        averageMechanicalCondition: { $avg: '$ratings.mechanicalCondition' },
        averageCustomerService: { $avg: '$ratings.customerService' },
        averageValueForMoney: { $avg: '$ratings.valueForMoney' },
        averageLocationConvenience: { $avg: '$ratings.locationConvenience' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$ratings.overall'
        }
      }
    }
  ]

  const result = await Review.aggregate(pipeline)
  
  if (result.length === 0) {
    return {
      averageOverall: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }

  const summary = result[0]
  
  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  summary.ratingDistribution.forEach(rating => {
    distribution[Math.round(rating)]++
  })

  return {
    averageOverall: Math.round(summary.averageOverall * 10) / 10,
    averageCommunication: Math.round(summary.averageCommunication * 10) / 10,
    averageDescriptionAccuracy: Math.round(summary.averageDescriptionAccuracy * 10) / 10,
    averageCleanliness: Math.round(summary.averageCleanliness * 10) / 10,
    averageMechanicalCondition: Math.round(summary.averageMechanicalCondition * 10) / 10,
    averageCustomerService: Math.round(summary.averageCustomerService * 10) / 10,
    averageValueForMoney: Math.round(summary.averageValueForMoney * 10) / 10,
    averageLocationConvenience: Math.round(summary.averageLocationConvenience * 10) / 10,
    totalReviews: summary.totalReviews,
    ratingDistribution: distribution
  }
}

module.exports = {
  createReview,
  getReviews,
  getExpertReviews,
  getComparisonReviews,
  updateReviewInteraction,
  reportReview,
  respondToReview,
  getUserReviews
}
