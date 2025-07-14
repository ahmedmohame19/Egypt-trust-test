import { Branches } from '../../../DB/models/Branches/Branches.js'
import { Tokens } from '../../../DB/models/Tokens/Tokens.js'
import { Requests } from '../../../DB/models/Requests/Requests.js'
import { User } from '../../../DB/models/User/User.js'

// Create new branch Admin only
export const createBranch = async (req, res, next) => {
  const { name, location, phoneNumber, email, branchAdmin } = req.body
  if (req.user.role !== 'Admin') {
    return res.json({ success: false, message: 'Only Admin can create branches' })
  }

  const adminUser = await User.findById(branchAdmin)
  if (!adminUser || adminUser.role !== 'BranchAdmin') {
    return res.json({ success: false, message: 'Invalid branch admin or user is not a branch admin' })
  }

  const existingBranch = await Branches.findOne({ 
    $or: [{ name }, { email }] 
  })
  if (existingBranch) {
    return res.json({ success: false, message: 'Branch name or email already exists' })
  }

  const existingBranchForAdmin = await Branches.findOne({ branchAdmin })
  if (existingBranchForAdmin) {
    return res.json({ success: false, message: 'This branch admin is already assigned to another branch' })
  }

  const branch = await Branches.create({
    name,
    location,
    phoneNumber,
    email,
    branchAdmin
  })

  return res.json({ success: true, data: branch })
}
export const getBranchAdmins = async (req, res, next) => {
  const branchAdmins = await User.find({ role: 'BranchAdmin',isActive:true })

  return res.json({ success: true, data: branchAdmins })
}

// Get all branches
export const getAllBranches = async (req, res, next) => {
  const branches = await Branches.find({ isActive: true })
    .populate('branchAdmin', 'name email')

  return res.json({ success: true, data: branches })
}

// Get branch by id
export const getBranchById = async (req, res, next) => {
  const { id } = req.params

  const branch = await Branches.findById(id)
    .populate('branchAdmin', 'name email')

  if (!branch) {
    return res.json({ success: false, message: 'Branch not found' })
  }

  return res.json({ success: true, data: branch })
}

// Update branch
export const updateBranch = async (req, res, next) => {
  const { id } = req.params
  const updateData = req.body

  // update branches
  if (req.user.role !== 'Admin') {
    return res.json({ success: false, message: 'Only Admin can update branches' })
  }

  if (updateData.branchAdmin) {
    const adminUser = await User.findById(updateData.branchAdmin)
    if (!adminUser || adminUser.role !== 'BranchAdmin') {
      return res.json({ success: false, message: 'Invalid branch admin or user is not a branch admin' })
    }

    const existingBranchForAdmin = await Branches.findOne({ 
      branchAdmin: updateData.branchAdmin,
      _id: { $ne: id }
    })
    if (existingBranchForAdmin) {
      return res.json({ success: false, message: 'This branch admin is already assigned to another branch' })
    }
  }

  const branch = await Branches.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate('branchAdmin', 'name email')

  if (!branch) {
    return res.json({ success: false, message: 'Branch not found' })
  }

  return res.json({ success: true, data: branch })
}

// Delete branch
export const deleteBranch = async (req, res, next) => {
  const { id } = req.params

  const branch = await Branches.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  )

  if (!branch) {
    return res.json({ success: false, message: 'Branch not found' })
  }

  return res.json({ success: true, message: 'Branch deleted successfully' })
}


export const getBranchInventory = async (req, res, next) => {
  const { id } = req.params

  const branch = await Branches.findById(id)
  if (!branch) {
    return res.json({ success: false, message: 'Branch not found' })
  }

  if (req.user.role === 'BranchAdmin') {
    if (branch.branchAdmin.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: 'You can only view your own branch inventory' })
    }
  }

  const tokens = await Tokens.find({ assignedToBranch: id })

  const inventory = {
    totalTokens: tokens.length,
    availableTokens: tokens.filter(token => token.status === 'Available').length,
    assignedTokens: tokens.filter(token => token.status === 'Assigned').length,
    usedTokens: tokens.filter(token => token.status === 'Used').length,
    expiredTokens: tokens.filter(token => token.status === 'Expired').length,
    damagedTokens: tokens.filter(token => token.status === 'Damaged').length,
    byType: {
      Personal: tokens.filter(token => token.tokenType === 'Personal').length,
      Business: tokens.filter(token => token.tokenType === 'Business').length
    }
  }

  return res.json({ success: true, data: { branch, inventory } })
}


// Get branch requests history
export const getBranchRequestsHistory = async (req, res, next) => {
  const { id } = req.params

  const branch = await Branches.findById(id)
  if (!branch) {
    return res.json({ success: false, message: 'Branch not found' })
  }

  if (req.user.role === 'BranchAdmin') {
    if (branch.branchAdmin.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: 'You can only view your own branch requests history' })
    }
  }

  const requests = await Requests.find({ requestingBranch: id })
    .populate('requestedBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('warehouse', 'name')
    .sort({ createdAt: -1 })

  return res.json({ success: true, data: { branch, requests } })
} 