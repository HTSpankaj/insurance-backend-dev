var { supabaseInstance } = require("../../../supabase-db/index.js");

const RolesService = require("../../../application/services/roles/roles.service.js");

const rolesservice = new RolesService(supabaseInstance);

exports.createRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']

    #swagger.description = 'Get user profile details'

  */

    try {
        const { title, access } = req.body;
        const result = await rolesservice.createRole(title, access);
        return res.status(200).json({
            success: true,
            message: "create role successfully",
            data: result,
        });
    } catch (error) {
        // console.error("Error in createRoleController:", error);
        return res.status(500).json({ success: false, error: {message: error?.message || "Something went wrong!"} });
    }
};

exports.getRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']

    #swagger.description = 'Get user profile details'

  */

    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await rolesservice.getRoles(pageNumber, limit);
        return res.status(200).json({
            success: true,
            message: "get role fetch successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error || "Something went wrong!" });
    }
};

exports.updateRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update roles'
  
    #swagger.parameters['body'] = {
  in: 'body',
  schema: {
    "title": "Super Admin",
    "access": {
      "level": 3,
      "modules": ["datas", "analytics", "dashboards"],
      "permissions": ["ready", "analyzing", "reporting"]
    }
  }
}
  */
    try {
        const { role_id } = req.params;
        const { title, access } = req.body;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!role_id || !uuidRegex.test(role_id)) {
            throw new Error("Role ID must be a valid UUID");
        }
        if (title && typeof title !== "string") throw new Error("Title must be a string");
        if (access && (typeof access !== "object" || access === null)) {
            throw new Error("Access must be a valid JSON object");
        }

        const result = await rolesservice.updateRole(role_id, title, access);

        if (!result.success) {
            const status = result.error.message === "Role not found" ? 404 : 400;
            return res.status(status).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: result.data,
        });
    } catch (error) {
        console.error("Error in updateRoleController:", error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.deleteRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete role'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "role_id": "",
        }
    }
  */

    try {
        const { role_id } = req.params;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!role_id || !uuidRegex.test(role_id)) {
            throw new Error("Role ID must be a valid UUID");
        }

        const result = await rolesservice.deleteRole(role_id);

        if (!result.success) {
            const status = result.error.message === "Role not found" ? 404 : 400;
            return res.status(status).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
            data: result.data,
        });
    } catch (error) {
        console.error("Error in deleteRoleController:", error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
