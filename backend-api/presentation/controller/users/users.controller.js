var { supabaseInstance } = require("../../../supabase-db/index.js");
const { UserService } = require("../../../application/services/users/users.service");

const userService = new UserService(supabaseInstance);

// Existing getUserProfile
exports.getUserProfile = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get user profile details'
  */
    try {
        const serviceResponse = await userService.getUserByUserId(res?.locals?.tokenData?.user_id);
        return res.status(200).json({
            success: true,
            message: "user profile fetch successfully",
            data: serviceResponse,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error || "Something went wrong!" });
    }
};

// Add createUserController
exports.createUserController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Create a new user'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add User data',
      required: true,
      schema: {
        
          email: 'user@example.com',
          password: 'Password123!',
          first_name: 'John',
          middle_name: 'John',
          last_name: 'Doe',
          contact_number: 1234567890,
          role_id: '550e8400-e29b-41d4-a716-446655440000',
      }
    }
    #swagger.responses[200] = {
      description: 'User created successfully',
      schema: { success: true, data: { user_id: 'uuid', email: 'string', first_name: 'string', last_name: 'string', contact_number: 'string', role_id: 'uuid' } }
    }
    #swagger.responses[400] = {
      description: 'Invalid input',
      schema: { success: false, error: { message: 'string' } }
    }
  */
    try {
        const { email, password, first_name, middle_name, last_name, contact_number, role_id } =
            req.body;
        const result = await userService.createUser(
            email,
            password,
            first_name,
            middle_name,
            last_name,
            contact_number,
            role_id,
        );
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

// Add getUsersController
exports.getUsersController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get list of users with pagination'
    #swagger.parameters['page_number'] = { in: 'query', description: 'Page number', type: 'integer', default: 1 }
    #swagger.parameters['limit'] = { in: 'query', description: 'Number of users per page', type: 'integer', default: 10 }
    #swagger.responses[200] = {
      description: 'Users fetched successfully',
      schema: { success: true, data: { users: [{ user_id: 'uuid', email: 'string', first_name: 'string', last_name: 'string', contact_number: 'string', role_id: 'uuid' }], total: 'integer', page: 'integer', limit: 'integer' } }
    }
    #swagger.responses[400] = {
      description: 'Invalid query parameters',
      schema: { success: false, error: { message: 'string' } }
    }
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await userService.getUsers(pageNumber, limit);
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.updateUserController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update Users'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
         
           "first_name": "Johs",
           "middle_name": "Jony",
           "last_name": "patel",
           "contact_number": 1234567894,
 
        }
    }
  */
    try {
        const { user_id } = req.params;
        const { first_name, middle_name, last_name, contact_number } = req.body;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!user_id || !uuidRegex.test(user_id)) {
            throw new Error("User ID must be a valid UUID");
        }
        if (first_name && typeof first_name !== "string")
            throw new Error("First name must be a string");
        if (middle_name && typeof middle_name !== "string")
            throw new Error("Middle name must be a string");
        if (last_name && typeof last_name !== "string")
            throw new Error("Last name must be a string");
        if (
            contact_number &&
            (typeof contact_number !== "number" || !Number.isInteger(contact_number))
        ) {
            throw new Error("Contact number must be an integer");
        }

        const result = await userService.updateUser(
            user_id,
            first_name,
            middle_name,
            last_name,
            contact_number,
        );

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in updateUserController:", error);
        const status = error.message === "User not found" ? 404 : 400;
        return res.status(status).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.deleteUserController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete User'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "user_id": "",
        }
    }
  */

    try {
        const { user_id } = req.params;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!user_id || !uuidRegex.test(user_id)) {
            throw new Error("User ID must be a valid UUID");
        }

        const result = await userService.deleteUser(user_id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error in deleteUserController:", error);
        const status = error.message === "User not found" ? 404 : 400;
        return res.status(status).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
