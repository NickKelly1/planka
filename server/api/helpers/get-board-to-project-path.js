module.exports = {
  inputs: {
    criteria: {
      type: 'json',
      required: true,
    },
  },

  exits: {
    pathNotFound: {},
  },

  async fn(inputs, exits) {
    const board = await Board.findOne(inputs.criteria);

    if (!board) {
      throw 'pathNotFound';
    }

    const project = await Project.findOne(board.projectId);

    if (!project) {
      throw {
        pathNotFound: {
          board,
        },
      };
    }

    return exits.success({
      board,
      project,
    });
  },
};
