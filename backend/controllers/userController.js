const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, email, role } = req.body;

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      role: role || user.role,
    });

    const updatedUser = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await user.destroy();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
