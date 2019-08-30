const bcrypt = require('bcrypt');

module.exports = {
  inputs: {
    values: {
      type: 'json',
      custom: value =>
        _.isPlainObject(value) &&
        _.isString(value.email) &&
        _.isString(value.password),
      required: true
    },
    request: {
      type: 'ref'
    }
  },

  exits: {
    conflict: {}
  },

  fn: async function(inputs, exits) {
    const user = await User.create({
      ...inputs.values,
      email: inputs.values.email.toLowerCase(),
      password: bcrypt.hashSync(inputs.values.password, 10)
    })
      .intercept(undefined, 'conflict')
      .fetch();

    const userIds = await sails.helpers.getAdminUserIds();

    userIds.forEach(userId => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'userCreate',
        {
          item: user
        },
        inputs.request
      );
    });

    return exits.success(user);
  }
};
