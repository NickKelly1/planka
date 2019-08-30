const Errors = {
  PROJECT_NOT_FOUND: {
    notFound: 'Project is not found'
  }
};

module.exports = {
  inputs: {
    id: {
      type: 'number',
      required: true
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
    let project = await Project.findOne(inputs.id);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    const values = _.pick(inputs, ['name']);

    project = await sails.helpers.updateProject(project, values, this.req);

    if (!project) {
      throw Errors.PROJECT_NOT_FOUND;
    }

    return exits.success({
      item: project
    });
  }
};
