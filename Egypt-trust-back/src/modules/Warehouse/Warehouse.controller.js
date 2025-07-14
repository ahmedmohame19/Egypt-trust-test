import { Warehouse } from '../../../DB/models/Warehouse/Warehouse.js'
import { Tokens } from '../../../DB/models/Tokens/Tokens.js'
import { User } from '../../../DB/models/User/User.js'

// Create new warehouse Admin only
export const createWarehouse = async (req, res, next) => {
  const { name, location, warehouseAdmin } = req.body

  // Only Admin can create warehouses
  if (req.user.role !== 'Admin') {
    return res.json({ success: false, message: 'Only Admin can create warehouses' })
  }

  // Check if warehouse admin 
  const adminUser = await User.findById(warehouseAdmin)
  if (!adminUser || adminUser.role !== 'WarehouseAdmin') {
    return res.json({ success: false, message: 'Invalid warehouse admin or user is not a warehouse admin' })
  }

  // Check if warehouse name exists
  const existingWarehouse = await Warehouse.findOne({ name })
  if (existingWarehouse) {
    return res.json({ success: false, message: 'Warehouse name already exists' })
  }

  // Check if this warehouse admin is already assigned to another warehouse
  const existingWarehouseForAdmin = await Warehouse.findOne({ warehouseAdmin })
  if (existingWarehouseForAdmin) {
    return res.json({ success: false, message: 'This warehouse admin is already assigned to another warehouse' })
  }

  const warehouse = await Warehouse.create({
    name,
    location,
    warehouseAdmin
  })

  return res.json({ success: true, data: warehouse })
}

// Get all warehouses
export const getAllWarehouses = async (req, res, next) => {
  const warehouses = await Warehouse.find({ isActive: true })
    .populate('warehouseAdmin', 'name email')

  return res.json({ success: true, data: warehouses })
}
export const getWarehouseAdmins = async (req, res, next) => {
  const { page = 1, limit = 10, search = '' } = req.query
  
  const pageNumber = parseInt(page) || 1
  const limitNumber = parseInt(limit) || 10
  const skip = (pageNumber - 1) * limitNumber

  const searchQuery = search ?
    {
    role: 'WarehouseAdmin',
    isActive: true,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }
    : { role: 'WarehouseAdmin', isActive: true }

  const totalCount = await User.countDocuments(searchQuery)
  
  const warehouseAdmins = await User.find(searchQuery)
    .select('name email phoneNumber role createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)


  const totalPages = Math.ceil(totalCount / limitNumber)
  const hasNextPage = pageNumber < totalPages
  const hasPrevPage = pageNumber > 1

  return res.json({ 
    success: true, 
    data: warehouseAdmins,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalCount,
      limit: limitNumber,
      hasNextPage,
      hasPrevPage
    }
  })
}

// Get warehouse by ID
export const getWarehouseById = async (req, res, next) => {
  const { id } = req.params

  const warehouse = await Warehouse.findById(id)
    .populate('warehouseAdmin', 'name email')

  if (!warehouse) {
    return res.json({ success: false, message: 'Warehouse not found' })
  }

  return res.json({ success: true, data: warehouse })
}

// Update warehouse Admin only
export const updateWarehouse = async (req, res, next) => {
  const { id } = req.params
  const updateData = req.body

  const existingWarehouse = await Warehouse.findById(id)
  if (!existingWarehouse) {
    return res.json({ success: false, message: 'Warehouse not found' })
  }

  // Validate warehouse name uniqueness if name is being updated
  if (updateData.name && updateData.name !== existingWarehouse.name) {
    const warehouseWithSameName = await Warehouse.findOne({ 
      name: updateData.name, 
      _id: { $ne: id } 
    })
    if (warehouseWithSameName) {
      return res.json({ success: false, message: 'Warehouse name already exists' })
    }
  }

  if (updateData.warehouseAdmin) {
    const adminUser = await User.findById(updateData.warehouseAdmin)
    if (!adminUser || adminUser.role !== 'WarehouseAdmin') {
      return res.json({ success: false, message: 'Invalid warehouse admin or user is not a warehouse admin' })
    }

    const existingWarehouseForAdmin = await Warehouse.findOne({ 
      warehouseAdmin: updateData.warehouseAdmin,
      _id: { $ne: id }
    })
    if (existingWarehouseForAdmin) {
      return res.json({ success: false, message: 'This warehouse admin is already assigned to another warehouse' })
    }
  }

  const filteredUpdateData = Object.keys(updateData).reduce((acc, key) => 
    updateData[key] !== undefined ? { ...acc, [key]: updateData[key] } : acc, {})

  const warehouse = await Warehouse.findByIdAndUpdate(
    id,
    filteredUpdateData,
    { new: true }
  ).populate('warehouseAdmin', 'name email')

  return res.json({ success: true, data: warehouse })
}

// Delete warehouse Admin only
export const deleteWarehouse = async (req, res, next) => {
  const { id } = req.params

  if (req.user.role !== 'Admin') {
    return res.json({ success: false, message: 'Only Admin can delete warehouses' })
  }

  const warehouse = await Warehouse.findByIdAndDelete(id)
console.log(warehouse)
  if (!warehouse) {
    return res.json({ success: false, message: 'Warehouse not found' })
  }

  return res.json({ success: true, message: 'Warehouse deleted successfully' })
}



