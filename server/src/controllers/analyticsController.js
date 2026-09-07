const Project = require("../models/project");
const Issue = require("../models/issue");

const getProjectAnalytics = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const project =
      await Project.findOne({
        _id: projectId,
        "members.user":
          req.user.userId,
      });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or access denied",
      });
    }

    const [
      totalResult,
      statusResult,
      priorityResult,
      assigneeResult,
    ] = await Promise.all([
      // Total + completed issues
      Issue.aggregate([
        {
          $match: {
            project: project._id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: 1,
            },
            completed: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "DONE",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Issues by status
      Issue.aggregate([
        {
          $match: {
            project: project._id,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Issues by priority
      Issue.aggregate([
        {
          $match: {
            project: project._id,
          },
        },
        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Issues by assignee
      Issue.aggregate([
        {
          $match: {
            project: project._id,
          },
        },
        {
          $group: {
            _id: "$assignee",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            name: "$user.name",
            email: "$user.email",
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),
    ]);

    const total =
      totalResult[0]?.total || 0;

    const completed =
      totalResult[0]?.completed || 0;

    const completionPercentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    return res.json({
      summary: {
        total,
        completed,
        completionPercentage,
      },

      byStatus: statusResult,

      byPriority: priorityResult,

      byAssignee: assigneeResult,
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load analytics",
    });
  }
};

module.exports = {
  getProjectAnalytics,
};