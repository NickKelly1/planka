const Errors = {
  BOARD_NOT_FOUND: {
    notFound: 'Board is not found'
  }
};

module.exports = {
  inputs: {
    id: {
      type: 'number',
      required: true
    },
    position: {
      type: 'number'
    },
    name: {
      type: 'string',
      isNotEmptyString: true
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function(inputs, exits) {
    let board = await Board.findOne(inputs.id);

    if (!board) {
      throw Errors.BOARD_NOT_FOUND;
    }

    const values = _.pick(inputs, ['position', 'name']);

    board = await sails.helpers.updateBoard(board, values, this.req);

    if (!board) {
      throw Errors.BOARD_NOT_FOUND;
    }

    return exits.success({
      item: board
    });
  }
};
